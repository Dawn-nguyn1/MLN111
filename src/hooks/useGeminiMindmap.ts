import { useState, useCallback } from 'react';

export interface MindmapNode {
    id: string;
    name: string;
    children: MindmapNode[];
}

export interface MindmapResponse {
    topic: string;
    nodes: MindmapNode[];
}

/**
 * Direct Google Gemini integration for generating Social Classes and Clans mindmaps.
 * Requires VITE_GEMINI_API_KEY in your environment (e.g., .env.local).
 * Note: Calling Gemini from the browser exposes the API key; prefer a backend proxy for production.
 */
export const useGeminiMindmap = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mindmapData, setMindmapData] = useState<MindmapResponse | null>(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
    const model = 'gemini-2.5-flash-lite'; // Same as working CaseGenerator

    const systemPrompt = `You are a JSON generator. Generate ONLY valid JSON mindmap about social classes/clans. No explanations, no markdown, no extra text.

If unrelated topic, respond with EXACTLY: {"error": "Xin lỗi, tôi không thể trả lời các câu hỏi ngoài phạm vi Giai cấp và Giai tộc."}

Response format (EXACTLY):
{"topic": "main topic", "nodes": [{"id": "root", "name": "main topic", "children": [{"id": "id1", "name": "subtopic1", "children": []}, {"id": "id2", "name": "subtopic2", "children": []}]}]}

Max 3 levels, concise names.`;

    const generateMindmap = useCallback(async (userTopicOrText: string) => {
        if (!apiKey) {
            setError('VITE_GEMINI_API_KEY không được cấu hình trong .env');
            return;
        }

        const extractFirstBalancedJsonObject = (input: string): string | null => {
            const start = input.indexOf('{');
            if (start < 0) return null;

            let depth = 0;
            let inString = false;
            let escaped = false;

            for (let i = start; i < input.length; i++) {
                const ch = input[i];

                if (inString) {
                    if (escaped) {
                        escaped = false;
                        continue;
                    }
                    if (ch === '\\') {
                        escaped = true;
                        continue;
                    }
                    if (ch === '"') {
                        inString = false;
                    }
                    continue;
                }

                if (ch === '"') {
                    inString = true;
                    continue;
                }
                if (ch === '{') depth++;
                if (ch === '}') depth--;

                if (depth === 0) {
                    return input.slice(start, i + 1);
                }
            }

            return null;
        };

        setLoading(true);
        setError(null);
        // Clear previous mindmap immediately to avoid showing stale data while generating
        setMindmapData(null);

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

            const prompt = `${systemPrompt}\n\n### Main Topic or Input\n${userTopicOrText}`;

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.2,
                        maxOutputTokens: 900
                    }
                })
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Gemini API error ${res.status}: ${text}`);
            }

            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
            if (!text) {
                console.error('No text in response:', data);
                throw new Error('API không trả về kết quả. Vui lòng thử lại');
            }

            // Debug: Log raw response
            console.log('=== Gemini Raw Response ===');
            console.log('Length:', text.length);
            console.log('Content:', text);
            console.log('==========================');
  
            // Try strict JSON parse first; fall back to extracting the first JSON block
            let parsed: MindmapResponse | null = null;
            try {
                const cleaned = text.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
                const balanced = extractFirstBalancedJsonObject(cleaned);
                parsed = JSON.parse(balanced ?? cleaned);
            } catch (error) {
                console.log('JSON parse failed, trying to extract JSON block...');
                const cleaned = text.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
                const balanced = extractFirstBalancedJsonObject(cleaned);
                const match = balanced ? [balanced] : cleaned.match(/\{[\s\S]*\}/);
                if (match) {
                    console.log('Found JSON block:', match[0]);
                    parsed = JSON.parse(match[0]);
                }
            }

            if (!parsed) {
                throw new Error('Không thể phân tích phản hồi từ Gemini - JSON không hợp lệ. Hãy kiểm tra prompt của bạn.');
            }

            setMindmapData(parsed);
            return parsed;
        } catch (err) {
            let message = 'Có lỗi xảy ra khi kết nối với Gemini';
            if (err instanceof Error) message = err.message;
            setError(message);
            // Ensure stale mindmap is not displayed when any error occurs
            setMindmapData(null);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiKey]);

    const clearMindmap = useCallback(() => {
        setMindmapData(null);
        setError(null);
    }, []);

    return {
        loading,
        error,
        mindmapData,
        generateMindmap,
        clearMindmap,
        hasApiConfig: !!apiKey
    };
};
