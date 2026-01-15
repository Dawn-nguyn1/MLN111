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
            // Add random seed for variety
            const randomSeed = Math.random().toString(36).substring(7);
            const timestamp = new Date().toISOString();

            const noiDungContent = `# TRIẾT HỌC MÁC – LÊNIN
## II. GIAI CẤP VÀ DÂN TỘC

### 1. Giai cấp và đấu tranh giai cấp

Giai cấp là những tập đoàn người có địa vị kinh tế – xã hội khác nhau trong một hệ thống sản xuất xã hội nhất định. Địa vị kinh tế – xã hội của các giai cấp được quy định chủ yếu bởi các mối quan hệ kinh tế – vật chất giữa các tập đoàn người trong quá trình sản xuất xã hội.

Thực chất của quan hệ giai cấp là quan hệ giữa bóc lột và bị bóc lột, là sự chiếm đoạt lao động của tập đoàn người này đối với tập đoàn người khác.

#### Định nghĩa giai cấp
Giai cấp là những tập đoàn người khác nhau:
* Về địa vị của họ trong một hệ thống sản xuất xã hội.
* Về quan hệ của họ đối với tư liệu sản xuất.
* Về vai trò của họ trong tổ chức lao động xã hội.
* Về quan hệ phân phối sản phẩm xã hội.

Quan hệ giai cấp là quan hệ giữa bóc lột và bị bóc lột, là sự chiếm đoạt lao động của tập đoàn người này đối với tập đoàn người khác.

#### Nguồn gốc của sự phân hóa giai cấp
* **Nguồn gốc trực tiếp**: sự ra đời và tồn tại của chế độ chiếm hữu tư nhân về tư liệu sản xuất.
* **Nguồn gốc sâu xa**: do trình độ phát triển của lực lượng sản xuất chưa đạt tới mức xã hội hóa cao.

#### Đấu tranh giai cấp
Đấu tranh giai cấp là tất yếu do sự đối lập về lợi ích căn bản không thể điều hòa được giữa các giai cấp.

#### Các hình thức đấu tranh giai cấp
1. **Đấu tranh kinh tế**: nhằm bảo vệ lợi ích thiết thân của công nhân
2. **Đấu tranh chính trị**: nhằm lật đổ ách thống trị của giai cấp tư sản
3. **Đấu tranh tư tưởng**: phủ định biện chứng hệ tư tưởng của giai cấp thống trị

#### Đấu tranh giai cấp trong thời kỳ quá độ lên chủ nghĩa xã hội
Mặc dù giai cấp tư sản bị đánh đổ về mặt chính quyền, nhưng vẫn còn tiềm lực về kinh tế, chính trị và tư tưởng.

**Điều kiện mới**:
* Cơ cấu và địa vị các giai cấp biến đổi căn bản, tạo so sánh lực lượng có lợi cho giai cấp vô sản.
* Các lực lượng phản cách mạng bị thu hẹp và phân hóa.
* Giai cấp vô sản còn hạn chế về kinh nghiệm quản lý xã hội.
* Các thế lực thù địch tiếp tục chống phá bằng nhiều âm mưu, thủ đoạn.
* Tàn dư tư tưởng, tâm lý, tập quán của xã hội cũ vẫn tồn tại.

**Nội dung mới**:
* Mục tiêu xây dựng thành công chủ nghĩa xã hội trên các lĩnh vực kinh tế, chính trị, tư tưởng, văn hóa.
* Thực hiện hai nhiệm vụ chiến lược: bảo vệ thành quả cách mạng và cải tạo xã hội cũ; xây dựng xã hội mới.

**Hình thức mới**:
* Kết hợp đa dạng các hình thức: bạo lực và hòa bình, quân sự và kinh tế, giáo dục và hành chính… tùy điều kiện lịch sử cụ thể của mỗi quốc gia.

#### Đặc điểm đấu tranh giai cấp ở Việt Nam
Quá độ lên chủ nghĩa xã hội ở Việt Nam là quá độ gián tiếp từ xã hội thuộc địa, nửa phong kiến, bỏ qua chế độ tư bản chủ nghĩa. Trong thời kỳ này:
* Vẫn còn cơ sở kinh tế nảy sinh giai cấp bóc lột.
* Mâu thuẫn giai cấp vẫn tồn tại.
* Các thế lực phản động tiếp tục chống phá.
* Tàn dư tư tưởng phong kiến, tư sản, thực dân cũ và mới còn ảnh hưởng.

Điều kiện thuận lợi gồm:
* Giai cấp công nhân giữ vai trò lãnh đạo.
* Liên minh công – nông – trí thức được củng cố.
* Vai trò lãnh đạo của Đảng Cộng sản Việt Nam được tăng cường.
* Nhà nước pháp quyền xã hội chủ nghĩa được hoàn thiện.
* Thành tựu cách mạng, khoa học – công nghệ, hội nhập quốc tế.

Hình thức đấu tranh đa dạng, linh hoạt: kết hợp cải tạo và xây dựng, hành chính và giáo dục, phát triển kinh tế thị trường định hướng xã hội chủ nghĩa, mở cửa hội nhập gắn với củng cố quốc phòng – an ninh.

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

Ở châu Âu, dân tộc hình thành gắn liền với sự ra đời của chủ nghĩa tư bản.

Ở phương Đông, dân tộc ra đời rất sớm và không gắn trực tiếp với sự ra đời của chủ nghĩa tư bản.

Dân tộc Việt Nam hình thành sớm, gắn liền với quá trình đấu tranh chống ngoại xâm, cải tạo thiên nhiên và bảo vệ bản sắc văn hóa dân tộc, bắt đầu từ khi nước Đại Việt giành độc lập.

### 3. Mối quan hệ giữa giai cấp – dân tộc – nhân loại
Giai cấp có trước dân tộc hàng nghìn năm. Khi giai cấp mất đi, dân tộc vẫn tiếp tục tồn tại lâu dài. Trong một dân tộc có nhiều giai cấp, và một giai cấp có thể tồn tại trong nhiều dân tộc.

Quan hệ giai cấp quyết định khuynh hướng phát triển và tính chất của dân tộc. Sự hình thành dân tộc tạo điều kiện thuận lợi cho đấu tranh giai cấp; đấu tranh giải phóng dân tộc là tiền đề cho đấu tranh giải phóng giai cấp. Trong thời đại ngày nay, đấu tranh giai cấp và đấu tranh dân tộc gắn bó chặt chẽ với nhau.

Nhân loại là toàn thể cộng đồng người sống trên Trái Đất. Bản chất xã hội của con người là cơ sở của tính thống nhất toàn nhân loại.

Giai cấp, dân tộc và nhân loại có mối quan hệ biện chứng:
* Sự tồn tại của nhân loại là tiền đề cho sự tồn tại của giai cấp và dân tộc.
* Trong xã hội có giai cấp, lợi ích nhân loại gắn liền và bị chi phối bởi lợi ích giai cấp và dân tộc.
* Sự phát triển của nhân loại tạo điều kiện thuận lợi cho đấu tranh giai cấp và đấu tranh dân tộc.`;

            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

            const prompt = `${systemPrompt}

Based on this content about "Giai cấp và Dân tộc" (Session ID: ${randomSeed}, Timestamp: ${timestamp}):
${noiDungContent}

Generate 10 UNIQUE and VARIED practice questions in Vietnamese covering all the main concepts mentioned above. Each time generate different questions with different angles, examples, and perspectives. Focus on:
- Different aspects of each concept
- Various question types (definition, comparison, application, analysis)
- Different examples and scenarios
- Varying difficulty levels

IMPORTANT: Create completely new questions that haven't been generated before. Be creative and comprehensive.`;

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
                        temperature: 0.9, // Increased for more variety
                        topP: 0.95,
                        topK: 40,
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
