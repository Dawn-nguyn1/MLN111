import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

// Hàm gọi Gemini API với error handling tốt hơn
async function callGeminiAPI(apiKey: string, prompt: string) {
   // Sử dụng model mới nhất: gemini-1.5-flash (nhanh, miễn phí) hoặc gemini-1.5-pro
   const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;
  
  let response;
  try {
    response = await fetch(url, {
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
          maxOutputTokens: 150,
        }
      })
    });
  } catch (error) {
    console.error('Network error:', error);
    throw new Error('Không thể kết nối đến Gemini API. Vui lòng kiểm tra kết nối mạng của bạn.');
  }

  if (!response.ok) {
    let errorMsg = 'Có lỗi xảy ra khi gọi Gemini API';
    try {
      const error = await response.json();
      console.error('Gemini API Error:', error);
      
      // Xử lý các loại lỗi phổ biến
      if (response.status === 400) {
        errorMsg = 'API key không hợp lệ hoặc request không đúng định dạng';
      } else if (response.status === 403) {
        errorMsg = 'API key không có quyền truy cập. Vui lòng kiểm tra API key của bạn';
      } else if (response.status === 429) {
        errorMsg = 'Đã vượt quá giới hạn request. Vui lòng thử lại sau';
      } else if (response.status === 500) {
        errorMsg = 'Lỗi server của Gemini. Vui lòng thử lại sau';
      } else {
        errorMsg = error.error?.message || errorMsg;
      }
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
    }
    throw new Error(errorMsg);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!text) {
    console.error('No text in response:', data);
    throw new Error('API không trả về kết quả. Vui lòng thử lại');
  }
  
  return text.trim();
}

// Đọc nội dung từ file NoiDung.md
const getConceptContent = (concept: string): string => {
  const content: Record<string, string> = {
    'bộ tộc': `## Bộ lạc

Bộ lạc là sự liên minh của nhiều thị tộc có quan hệ huyết thống gần gũi, cùng sinh sống trên một vùng lãnh thổ tương đối ổn định. Bộ lạc có ngôn ngữ chung, phong tục tập quán chung và có tổ chức quản lý sơ khai (tù trưởng, hội đồng già làng). Bộ lạc đánh dấu bước phát triển cao hơn so với thị tộc nhưng vẫn thuộc xã hội chưa có giai cấp.

Đặc điểm chính:
- Liên minh của nhiều thị tộc
- Cùng sinh sống trên một lãnh thổ
- Ngôn ngữ và phong tục chung
- Tổ chức quản lý sơ khai
- Chưa có sự phân chia giai cấp`,

    'thị tộc': `## Thị tộc

Thị tộc là hình thức tổ chức xã hội đầu tiên trong lịch sử xã hội loài người. Thị tộc được hình thành trên cơ sở quan hệ huyết thống, những người trong thị tộc có chung tổ tiên. Trong thị tộc, tư liệu sản xuất thuộc sở hữu chung, mọi người cùng lao động và hưởng thụ sản phẩm theo nguyên tắc bình quân. Chưa có sự phân chia giai cấp, chưa có bóc lột.

Đặc điểm chính:
- Tổ chức dựa trên huyết thống
- Tư liệu sản xuất chung sở hữu
- Lao động chung
- Phân phối theo nguyên tắc bình quân
- Chưa có giai cấp và bóc lột`,

    'bộ lạc': `## Bộ lạc

Bộ lạc là hình thức cộng đồng người phát triển cao hơn thị tộc, hình thành khi các bộ lạc khác nhau liên kết lại với nhau trên cơ sở lãnh thổ, kinh tế và văn hóa tương đối ổn định. Trong bộ lạc đã xuất hiện sự phân hóa giàu nghèo, mầm mống của chế độ tư hữu và giai cấp, là tiền đề cho sự ra đời của dân tộc.

Đặc điểm chính:
- Liên kết nhiều thị tộc
- Lãnh thổ ổn định
- Kinh tế và văn hóa phát triển
- Xuất hiện giai cấp sơ khai
- Tiền đề của dân tộc`,

    'dân tộc': `## Dân tộc

Dân tộc là một cộng đồng người ổn định, hình thành trên cơ sở lãnh thổ thống nhất, ngôn ngữ thống nhất, đời sống kinh tế thống nhất, nền văn hóa và tâm lý, tính cách bền vững. Dân tộc có nhà nước và pháp luật thống nhất.

Đặc điểm chính:
- Lãnh thổ thống nhất
- Ngôn ngữ thống nhất
- Kinh tế thống nhất
- Văn hóa bền vững
- Nhà nước và pháp luật riêng
- Là hình thức phát triển cao nhất của cộng đồng người`
  };

  return content[concept] || 'Không tìm thấy nội dung cho khái niệm này.';
};

// Hàm tạo ví dụ sử dụng Gemini API
async function generateExample(concept: string, apiKey: string): Promise<string> {
  const content = getConceptContent(concept);
  
  const prompt = `Dựa vào nội dung sau đây, hãy tạo một ví dụ thực tế ngắn gọn (khoảng 2-3 câu) về khái niệm "${concept}".

Nội dung tham khảo:
${content}

Yêu cầu:
- Tạo ví dụ cụ thể, dễ hiểu
- Phản ánh rõ nét đặc điểm của khái niệm
- Có tính ứng dụng thực tế
- Viết bằng tiếng Việt, ngắn gọn, súc tích`;

  return await callGeminiAPI(apiKey, prompt);
}

export default function ConceptExample() {
  const [selectedConcept, setSelectedConcept] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const concepts = [
    { value: 'bộ tộc', label: 'Bộ Tộc' },
    { value: 'thị tộc', label: 'Thị Tộc' },
    { value: 'bộ lạc', label: 'Bộ Lạc' },
    { value: 'dân tộc', label: 'Dân Tộc' }
  ];

  const handleGenerate = async () => {
    // Validate selections
    if (!selectedConcept) {
      setError('Vui lòng chọn khái niệm');
      toast.error('Vui lòng chọn khái niệm');
      return;
    }
    
    // Validate API key
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setError('Lỗi cấu hình: Không tìm thấy Gemini API key. Vui lòng thêm VITE_GEMINI_API_KEY vào file .env');
      toast.error('Thiếu API key');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    setShowResult(false);
    
    try {
      const example = await generateExample(selectedConcept, apiKey);
      setResult(example);
      setShowResult(true);
      toast.success('Đã tạo ví dụ thành công!');
    } catch (err) {
      console.error('Lỗi khi tạo ví dụ:', err);
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định';
      setError(errorMessage);
      toast.error('Không thể tạo ví dụ');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setSelectedConcept('');
    setShowResult(false);
    setResult('');
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Tạo Ví Dụ Khái Niệm</h1>
        <p className="text-muted-foreground text-center mb-8">
          Chọn một khái niệm để tạo ví dụ minh họa thực tế dựa trên nội dung bài học
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tạo ví dụ minh họa</CardTitle>
            <CardDescription>
              Chọn khái niệm để tạo ví dụ thực tế
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Chọn khái niệm
              </label>
              <Select value={selectedConcept} onValueChange={setSelectedConcept}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn khái niệm" />
                </SelectTrigger>
                <SelectContent>
                  {concepts.map((concept) => (
                    <SelectItem key={concept.value} value={concept.value}>
                      {concept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedConcept && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Nội dung tham khảo:</h4>
                  <div className="text-sm text-muted-foreground whitespace-pre-line">
                    {getConceptContent(selectedConcept)}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button 
                onClick={handleGenerate} 
                disabled={!selectedConcept || isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    AI đang tạo ví dụ...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Tạo ví dụ với AI
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={resetForm}
                disabled={isGenerating}
              >
                Đặt lại
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="mb-8 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                    Đã xảy ra lỗi
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {showResult && (
          <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
            <CardHeader>
              <CardTitle className="text-green-700 dark:text-green-300">
                Ví dụ minh họa
              </CardTitle>
              <CardDescription className="text-green-600 dark:text-green-400">
                Ví dụ về {concepts.find(c => c.value === selectedConcept)?.label}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-line text-green-900 dark:text-green-100">{result}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300">
                  💡 <strong>Mẹo:</strong> Bạn có thể thử các khái niệm khác nhau để khám phá thêm nhiều ví dụ thú vị!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
