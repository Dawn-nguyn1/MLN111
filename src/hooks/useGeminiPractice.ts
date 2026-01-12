import { useState, useCallback } from 'react';

export interface PracticeQuestion {
    id: number;
    question: string;
    options: string[];
    answer: string;
    type?: 'math' | 'formula' | 'concept';
}

export interface PracticeResponse {
    questions: PracticeQuestion[];
}

export interface QuestionWithType extends PracticeQuestion {
    type?: 'math' | 'formula' | 'concept';
}

/**
 * Hook for generating practice questions using Google Gemini API
 * Returns 10 similar questions based on NoiDung.md content
 */
export const useGeminiPractice = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [questions, setQuestions] = useState<PracticeQuestion[]>([]);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
    const model = 'gemini-2.5-flash-lite'; // Same as working functions

    const systemPrompt = `You are an expert in creating multiple-choice questions for the subject "Marxism-Leninism Philosophy" specifically about "Giai cấp và Dân tộc" (Social Classes and Nations).

Your task is to generate 10 practice questions based on the provided content about social classes and nations.

QUESTION TYPES:
1. "concept" type - Questions about definitions, characteristics, and theoretical concepts
2. "application" type - Questions asking for examples or practical applications
3. "comparison" type - Questions comparing different concepts or historical periods

CRITICAL REQUIREMENTS FOR JSON OUTPUT:
1. Generate exactly 10 questions total
2. All questions must be in Vietnamese
3. Each question must have exactly 4 multiple-choice options (A, B, C, D)
4. Return ONLY a JSON array, nothing else - no markdown, no code blocks, no explanations
5. JSON must be valid and properly formatted
6. Questions should cover: giai cấp, đấu tranh giai cấp, dân tộc, thị tộc, bộ lạc, và mối quan hệ giữa chúng

JSON STRUCTURE (MUST BE EXACTLY LIKE THIS):
[
  {
    "id": 1,
    "question": "Write the full question in Vietnamese. Do not use line breaks inside strings.",
    "options": ["A. Option text here", "B. Option text here", "C. Option text here", "D. Option text here"],
    "answer": "A",
    "type": "concept"
  }
]

IMPORTANT JSON RULES:
- Return ONLY the JSON array, no other text before or after
- Use double quotes for all strings
- Do not use newlines or special characters inside string values
- Each option MUST start with "A.", "B.", "C.", or "D."
- "answer" must be one of: "A", "B", "C", or "D"
- "type" must be one of: "concept", "application", "comparison"
- All fields are required`;

    const generateQuestions = useCallback(async (_referenceQuestions: QuestionWithType[]) => {
        if (!apiKey) {
            setError('VITE_GEMINI_API_KEY không được cấu hình trong .env');
            return;
        }

        setLoading(true);
        setError(null);
        setQuestions([]);

        try {
            // Content from NoiDung.md about Giai cấp và Dân tộc
            const noiDungContent = `# TRIẾT HỌC MÁC – LÊNIN
## II. GIAI CẤP VÀ DÂN TỘC

### 1. Giai cấp và đấu tranh giai cấp

Giai cấp là những tập đoàn người có địa vị kinh tế – xã hội khác nhau trong một hệ thống sản xuất xã hội nhất định. Địa vị kinh tế – xã hội của các giai cấp được quy định chủ yếu bởi các mối quan hệ kinh tế – vật chất giữa các tập đoàn người trong quá trình sản xuất xã hội.

Thực chất của quan hệ giai cấp là quan hệ giữa bóc lột và bị bóc lột, trong đó tập đoàn người này chiếm đoạt lao động của tập đoàn người khác.

#### Định nghĩa giai cấp
Giai cấp là những tập đoàn người khác nhau:
* Về địa vị của họ trong một hệ thống sản xuất xã hội.
* Về quan hệ của họ đối với tư liệu sản xuất.
* Về vai trò của họ trong tổ chức lao động xã hội.
* Về quan hệ phân phối sản phẩm xã hội.

#### Nguồn gốc của sự phân hóa giai cấp
* **Nguồn gốc trực tiếp**: sự ra đời và tồn tại của chế độ chiếm hữu tư nhân về tư liệu sản xuất.
* **Nguồn gốc sâu xa**: do trình độ phát triển của lực lượng sản xuất chưa đạt tới mức xã hội hóa cao.

#### Đấu tranh giai cấp
Đấu tranh giai cấp là tất yếu do sự đối lập về lợi ích căn bản không thể điều hòa được giữa các giai cấp.

#### Các hình thức đấu tranh giai cấp
1. **Đấu tranh kinh tế**: nhằm bảo vệ lợi ích thiết thân của công nhân
2. **Đấu tranh chính trị**: nhằm lật đổ ách thống trị của giai cấp tư sản
3. **Đấu tranh tư tưởng**: phủ định biện chứng hệ tư tưởng của giai cấp thống trị

### 2. Dân tộc

#### Các hình thức cộng đồng người trong lịch sử
**Thị tộc** là hình thức cộng đồng người đầu tiên trong lịch sử xã hội loài người. Thị tộc được hình thành trên cơ sở quan hệ huyết thống.

**Bộ lạc** là sự liên minh của nhiều thị tộc có quan hệ huyết thống gần gũi, cùng sinh sống trên một vùng lãnh thổ tương đối ổn định.

**Bộ tộc** là hình thức cộng đồng người phát triển cao hơn bộ lạc, hình thành khi các bộ lạc khác nhau liên kết lại với nhau.

#### Khái niệm dân tộc
Dân tộc là một cộng đồng người ổn định, hình thành trên cơ sở:
* Lãnh thổ thống nhất.
* Ngôn ngữ thống nhất.
* Đời sống kinh tế thống nhất.
* Nền văn hóa và tâm lý, tính cách bền vững.
* Có nhà nước và pháp luật thống nhất.

### 3. Mối quan hệ giữa giai cấp – dân tộc – nhân loại
Giai cấp có trước dân tộc hàng nghìn năm. Khi giai cấp mất đi, dân tộc vẫn tiếp tục tồn tại lâu dài. Trong một dân tộc có nhiều giai cấp, và một giai cấp có thể tồn tại trong nhiều dân tộc.`;

            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

            const prompt = `${systemPrompt}

Based on this content about "Giai cấp và Dân tộc":
${noiDungContent}

Generate 10 practice questions in Vietnamese covering all the main concepts mentioned above.`;

            const response = await fetch(endpoint, {
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
                        temperature: 0.7,
                        maxOutputTokens: 4000,
                    }
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Gemini API error ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

            // Parse JSON from response
            const jsonMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
            if (!jsonMatch) {
                throw new Error('Invalid response format from AI. Could not find JSON array.');
            }

            let jsonStr = jsonMatch[0];

            // Clean up common JSON issues
            jsonStr = jsonStr.replace(/[\r\n]+/g, ' ');

            // Try to parse
            let parsedQuestions: PracticeQuestion[];
            try {
                parsedQuestions = JSON.parse(jsonStr);
            } catch (parseErr) {
                // If it still fails, try to fix common issues
                jsonStr = jsonStr.replace(/\\n/g, ' ');
                jsonStr = jsonStr.replace(/\\r/g, ' ');
                parsedQuestions = JSON.parse(jsonStr);
            }

            // Validate and fix questions if needed
            const validatedQuestions = parsedQuestions.map((q, idx) => ({
                ...q,
                id: idx + 1,
                answer: q.answer || 'A',
                type: q.type || 'concept',
            }));

            setQuestions(validatedQuestions);
        } catch (err) {
            let errorMessage = 'Unknown error';

            if (err instanceof Error) {
                errorMessage = err.message;
            } else {
                errorMessage = String(err);
            }

            setError(`Lỗi: ${errorMessage}`);
            console.error('Error generating questions:', err);
        } finally {
            setLoading(false);
        }
    }, [apiKey]);

    return { loading, error, questions, generateQuestions };
};
