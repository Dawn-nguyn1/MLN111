import { useState, useCallback } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { AlertCircle, Brain, RefreshCw, ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import MindMapDisplay from '../components/MindMapDisplay';
import { useGeminiMindmap } from '../hooks/useGeminiMindmap';

// Lấy nội dung liên quan từ NoiDung.md
const getRelevantContent = (topic: string): string => {
  const content: Record<string, string> = {
    'giai cấp': `Giai cấp là những tập đoàn người có địa vị kinh tế – xã hội khác nhau trong một hệ thống sản xuất xã hội nhất định.
    
Đặc điểm:
- Về địa vị trong hệ thống sản xuất xã hội
- Về quan hệ với tư liệu sản xuất  
- Về vai trò trong tổ chức lao động xã hội
- Về quan hệ phân phối sản phẩm xã hội

Nguồn gốc: Chế độ chiếm hữu tư nhân về tư liệu sản xuất.`,
    
    'đấu tranh giai cấp': `Đấu tranh giai cấp là cuộc đấu tranh của các tập đoàn người có lợi ích căn bản đối lập nhau.
    
Hình thức:
1. Đấu tranh kinh tế: bảo vệ lợi ích thiết thân
2. Đấu tranh chính trị: lật đổ ách thống trị
3. Đấu tranh tư tưởng: phủ định hệ tư tưởng giai cấp thống trị`,
    
    'dân tộc': `Dân tộc là cộng đồng người ổn định hình thành trên cơ sở:
- Lãnh thổ thống nhất
- Ngôn ngữ thống nhất  
- Đời sống kinh tế thống nhất
- Văn hóa và tâm lý bền vững
- Nhà nước và pháp luật thống nhất`,
    
    'thị tộc': `Thị tộc là hình thức cộng đồng người đầu tiên trong lịch sử.
- Dựa trên quan hệ huyết thống
- Tư liệu sản xuất chung sở hữu
- Lao động chung, phân phối bình quân
- Chưa có giai cấp và bóc lột`,
    
    'bộ lạc': `Bộ lạc là liên minh của nhiều thị tộc có quan hệ huyết thống.
- Cùng sinh sống trên lãnh thổ ổn định
- Ngôn ngữ và phong tục chung
- Tổ chức quản lý sơ khai
- Thuộc xã hội chưa có giai cấp`,
    
    'bộ tộc': `Bộ tộc là hình thức cộng đồng phát triển cao hơn bộ lạc.
- Liên kết nhiều bộ lạc
- Lãnh thổ, kinh tế, văn hóa ổn định
- Xuất hiện phân hóa giàu nghèo
- Mầm mống chế độ tư hữu và giai cấp`
  };
  
  return content[topic] || 'Nội dung về chủ đề này trong Triết học Mác-Lênin.';
};

export default function FinalMindMap() {
  const [prompt, setPrompt] = useState('');
  const { loading, error, mindmapData, generateMindmap, clearMindmap } = useGeminiMindmap();

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    
    const relevantContent = getRelevantContent(prompt.toLowerCase());
    const enhancedPrompt = `Tạo JSON mindmap về: "${prompt}"

Nội dung: ${relevantContent}

Format BẮT BUỘC:
{"topic":"chủ đề","nodes":[{"id":"root","name":"chủ đề","children":[{"id":"n1","name":"khái niệm 1","children":[]},{"id":"n2","name":"khái niệm 2","children":[]}]}]}

Yêu cầu:
- JSON ngắn gọn, hợp lệ
- Tối đa 2 children chính
- KHÔNG có markdown
- KHÔNG có text ngoài JSON
- Đảm bảo đóng ngoặc đúng`;
    
    console.log('=== FinalMindMap Prompt ===');
    console.log('Topic:', prompt);
    console.log('Prompt length:', enhancedPrompt.length);
    console.log('==========================');

    try {
      await generateMindmap(enhancedPrompt);
    } catch {
      // Error state is handled inside useGeminiMindmap
    }
  }, [prompt, generateMindmap]);

  const handleClear = useCallback(() => {
    clearMindmap();
    setPrompt('');
  }, [clearMindmap]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                MindMap Giai Cấp và Dân Tộc
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Trang chủ
                </Button>
              </Link>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Tạo sơ đồ tư duy trực quan cho các khái niệm về Giai cấp và Dân tộc dựa trên nội dung bài học
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Tạo MindMap
                </CardTitle>
                <CardDescription>
                  Nhập chủ đề bạn muốn tạo mindmap
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Chủ đề cần tạo mindmap
                  </label>
                  <Textarea
                    placeholder="Ví dụ: giai cấp, đấu tranh giai cấp, dân tộc, Mối quan hệ giữa giai cấp – dân tộc – nhân loại..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Gợi ý chủ đề:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "giai cấp",
                      "đấu tranh giai cấp", 
                      "dân tộc",
                      "thị tộc",
                      "bộ lạc",
                      "bộ tộc",
                      "mối quan hệ giai cấp - dân tộc"
                    ].map((topic) => (
                      <Button
                        key={topic}
                        variant="outline"
                        size="sm"
                        onClick={() => setPrompt(topic)}
                        className="text-xs"
                      >
                        {topic}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Tạo MindMap
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClear}
                    disabled={loading}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {error}
                    </p>
                  </div>
                )}

                {/* API Key Warning */}
                {!import.meta.env.VITE_GEMINI_API_KEY && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      ⚠️ Cần cấu hình VITE_GEMINI_API_KEY trong file .env
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">ℹ️ Hướng dẫn sử dụng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">1. Nhập chủ đề:</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Gõ chủ đề bạn muốn tạo mindmap
                  </p>
                </div>
                <div>
                  <p className="font-medium">2. Tạo MindMap:</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    AI sẽ phân tích và tạo sơ đồ tư duy
                  </p>
                </div>
                <div>
                  <p className="font-medium">3. Tương tác:</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Kéo thả, zoom, điều hướng trong sơ đồ
                  </p>
                </div>
                <div className="pt-2 border-t">
                  <p className="font-medium text-blue-600 dark:text-blue-400">
                    💡 Dựa trên nội dung Triết học Mác-Lênin
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* MindMap Display */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle>Sơ đồ tư duy</CardTitle>
                <CardDescription>
                  {mindmapData ? `Mindmap về: ${mindmapData.topic}` : 'Chờ tạo mindmap...'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 h-[520px]">
                <MindMapDisplay data={mindmapData} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
