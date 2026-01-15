import { useState, useCallback } from 'react';

/**
 * Simple Gemini Q&A hook for answering questions about Marxism-Leninism Political Economy.
 * Returns plain text answers. Exposes ask(), clearAnswer(), loading, error, answer.
 */
export const useGeminiQA = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [answer, setAnswer] = useState<string | null>(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
    const model = 'gemini-2.5-flash-lite'; // Same as working functions

    const systemPrompt = `You are an AI assistant for the subject "Triết học Mác-Lênin" with specific focus on "Giai cấp và Dân tộc" (Social Classes and Nations).

BASE YOUR ANSWERS ON THE FOLLOWING CONTENT:
# TRIẾT HỌC MÁC – LÊNIN

**PhD. S. Ngô Khánh Duy**

---

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

Quan hệ giai cấp là quan hệ giữa bóc lột và bị bóc lột, là sự chiếm đoạt lao động của tập đoàn người này đối với tập đoàn người khác.

#### Nguồn gốc của sự phân hóa giai cấp
* **Nguồn gốc trực tiếp** của sự phân hóa giai cấp trong xã hội là sự ra đời và tồn tại của chế độ chiếm hữu tư nhân về tư liệu sản xuất.
* **Nguồn gốc sâu xa** là do trình độ phát triển của lực lượng sản xuất chưa đạt tới mức xã hội hóa cao.

#### Đấu tranh giai cấp
Đấu tranh giai cấp là tất yếu do sự đối lập về lợi ích căn bản không thể điều hòa được giữa các giai cấp.

Đấu tranh giai cấp là cuộc đấu tranh của các tập đoàn người có lợi ích căn bản đối lập nhau trong một phương thức sản xuất xã hội nhất định. Thực chất, đó là cuộc đấu tranh của quần chúng lao động bị áp bức, bóc lột chống lại giai cấp áp bức, bóc lột nhằm lật đổ ách thống trị của chúng.

#### Các hình thức đấu tranh giai cấp
1. **Đấu tranh kinh tế**: nhằm bảo vệ lợi ích thiết thân của công nhân như tăng lương, giảm giờ làm, cải thiện điều kiện sống…
2. **Đấu tranh chính trị**: nhằm lật đổ ách thống trị của giai cấp tư sản, phản động, giành chính quyền về tay giai cấp vô sản.
3. **Đấu tranh tư tưởng**: phủ định biện chứng hệ tư tưởng của giai cấp thống trị, đấu tranh chống lại tư tưởng, tâm lý, tập quán lạc hậu.

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
**Thị tộc** là hình thức cộng đồng người đầu tiên trong lịch sử xã hội loài người. Thị tộc được hình thành trên cơ sở quan hệ huyết thống, những người trong thị tộc có chung tổ tiên. Trong thị tộc, tư liệu sản xuất thuộc sở hữu chung, mọi người cùng lao động và hưởng thụ sản phẩm theo nguyên tắc bình quân. Chưa có sự phân chia giai cấp, chưa có bóc lột.

**Bộ lạc** là sự liên minh của nhiều thị tộc có quan hệ huyết thống gần gũi, cùng sinh sống trên một vùng lãnh thổ tương đối ổn định. Bộ lạc có ngôn ngữ chung, phong tục tập quán chung và có tổ chức quản lý sơ khai (tù trưởng, hội đồng già làng). Bộ lạc đánh dấu bước phát triển cao hơn so với thị tộc nhưng vẫn thuộc xã hội chưa có giai cấp.

**Bộ tộc** là hình thức cộng đồng người phát triển cao hơn bộ lạc, hình thành khi các bộ lạc khác nhau liên kết lại với nhau trên cơ sở lãnh thổ, kinh tế và văn hóa tương đối ổn định. Trong bộ tộc đã xuất hiện sự phân hóa giàu nghèo, mầm mống của chế độ tư hữu và giai cấp, là tiền đề cho sự ra đời của dân tộc.

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
* Sự phát triển của nhân loại tạo điều kiện thuận lợi cho đấu tranh giai cấp và đấu tranh dân tộc.

ANSWERING RULES:
1. Answer based ONLY on the content provided above
2. If the question is about these topics, provide detailed, accurate answers
3. If the question is outside these topics, respond exactly with: "Xin lỗi, tôi không có thông tin về chủ đề này trong cơ sở dữ liệu hiện có."
4. Be helpful, educational, and clear in your responses
5. Use Vietnamese language
6. Provide examples when helpful for understanding`;

    const ask = useCallback(async (question: string) => {
        if (!apiKey) {
            setError('VITE_GEMINI_API_KEY không được cấu hình trong .env');
            return null;
        }

        setLoading(true);
        setError(null);
        setAnswer(null);

        try {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

            const prompt = `${systemPrompt}\n\nUser: ${question}`;

            console.log('=== Gemini QA Request ===');
            console.log('Model:', model);
            console.log('Question:', question);
            console.log('Endpoint:', endpoint);

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        { role: 'user', parts: [{ text: prompt }] }
                    ],
                    generationConfig: {
                        temperature: 0.2,
                        topP: 0.95,
                        maxOutputTokens: 10000
                    }
                })
            });

            console.log('Response status:', res.status);

            if (!res.ok) {
                const text = await res.text();
                console.error('Error response:', text);
                throw new Error(`Gemini API error ${res.status}: ${text}`);
            }

            const data = await res.json();
            const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

            console.log('Raw response:', text);

            if (!text) {
                throw new Error('Không nhận được phản hồi từ Gemini');
            }

            // Only check for apology if it's exact response (not just contains phrase)
            const apology = 'Xin lỗi, tôi không có thông tin về chủ đề này trong cơ sở dữ liệu hiện có';
            if (text.trim() === apology) {
                console.log('Detected apology response');
                setAnswer(null);
                setError(apology);
                return null;
            }

            console.log('Final answer:', text.trim());
            setAnswer(text.trim());
            return text.trim();
        } catch (err) {
            let msg = 'Có lỗi xảy ra khi kết nối với Gemini';
            if (err instanceof Error) msg = err.message;
            setError(msg);
            setAnswer(null);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiKey]);

    const clearAnswer = useCallback(() => {
        setAnswer(null);
        setError(null);
    }, []);

    return { loading, error, answer, ask, clearAnswer, hasApiConfig: !!apiKey };
};
