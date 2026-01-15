import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useQA, type Question } from "../contexts/QAContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { Send, HelpCircle, MessageSquare, Clock } from "lucide-react";

export default function Support() {
  const { user } = useAuth();
  const { questions, sendQuestion, replyQuestion } = useQA();

  // State cho User form
  const [questionContent, setQuestionContent] = useState("");

  if (!user) {
    return <div className="p-8 text-center">Vui lòng đăng nhập để sử dụng tính năng này.</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">Q&A - Hỏi đáp</h1>
      
      {/* KHU VỰC CỦA ADMIN */}
      {user.role === "admin" ? (
        <AdminView questions={questions} replyQuestion={replyQuestion} adminName={user.name} />
      ) : (
        /* KHU VỰC CỦA USER */
        <UserView 
          user={user} 
          questions={questions} 
          sendQuestion={sendQuestion}
          questionContent={questionContent}
          setQuestionContent={setQuestionContent}
        />
      )}
    </div>
  );
}

// --- Component con cho giao diện User ---
interface UserViewProps {
  user: { username: string; name: string };
  questions: Question[];
  sendQuestion: (userId: string, username: string, content: string) => void;
  questionContent: string;
  setQuestionContent: (content: string) => void;
}

function UserView({ user, questions, sendQuestion, questionContent, setQuestionContent }: UserViewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxLength = 500;
  const remainingChars = maxLength - questionContent.length;

  const handleSend = async () => {
    if (!questionContent.trim()) {
      toast.error("Vui lòng nhập câu hỏi!");
      return;
    }
    if (questionContent.length > maxLength) {
      toast.error(`Câu hỏi không được vượt quá ${maxLength} ký tự!`);
      return;
    }
    
    setIsSubmitting(true);
    try {
      sendQuestion(user.username, user.name, questionContent);
      setQuestionContent("");
      toast.success("✓ Đã gửi câu hỏi thành công! Admin sẽ phản hồi sớm.");
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  // Lọc câu hỏi của chính user này
  const myQuestions = questions.filter((q: Question) => q.userId === user.username);
  const pendingCount = myQuestions.filter(q => q.status === "pending").length;

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            <CardTitle>Gửi câu hỏi mới</CardTitle>
          </div>
          <CardDescription className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            Bạn có thắc mắc? Hãy gửi cho Admin. Chúng tôi sẽ phản hồi sớm nhất.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="relative">
            <Textarea 
              placeholder="Ví dụ: Làm thế nào để sử dụng tính năng Mind Map? Tôi cần hỗ trợ về..." 
              value={questionContent}
              onChange={(e) => setQuestionContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[120px] resize-none focus-visible:ring-primary"
              maxLength={maxLength}
              disabled={isSubmitting}
            />
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              {remainingChars >= 0 ? (
                <span className={remainingChars < 50 ? "text-orange-500" : ""}>
                  {remainingChars}/{maxLength}
                </span>
              ) : (
                <span className="text-destructive font-semibold">
                  Vượt quá {Math.abs(remainingChars)} ký tự!
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              💡 Nhấn <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> để gửi nhanh
            </p>
            <Button 
              onClick={handleSend} 
              disabled={!questionContent.trim() || isSubmitting || remainingChars < 0}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Gửi câu hỏi
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Lịch sử câu hỏi
          </h2>
          {myQuestions.length > 0 && (
            <div className="flex gap-2">
              {pendingCount > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <Clock className="w-3 h-3" />
                  {pendingCount} chờ
                </Badge>
              )}
              <Badge variant="secondary" className="gap-1">
                <MessageSquare className="w-3 h-3" />
                Tổng: {myQuestions.length}
              </Badge>
            </div>
          )}
        </div>
        
        {myQuestions.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground text-lg font-medium">Bạn chưa gửi câu hỏi nào</p>
              <p className="text-sm text-muted-foreground mt-2">Hãy bắt đầu bằng cách gửi câu hỏi đầu tiên của bạn!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {myQuestions.map((q: Question) => (
              <QuestionItem key={q.id} question={q} isAdmin={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Component con cho giao diện Admin ---
interface AdminViewProps {
  questions: Question[];
  replyQuestion: (questionId: string, adminName: string, answerContent: string) => void;
  adminName: string;
}

function AdminView({ questions, replyQuestion, adminName }: AdminViewProps) {
  // Sắp xếp: Câu chưa trả lời lên đầu
  const sortedQuestions = [...questions].sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (a.status !== "pending" && b.status === "pending") return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div className="space-y-4">
      <CardHeader className="px-0">
        <CardTitle>Danh sách câu hỏi từ người dùng</CardTitle>
        <CardDescription>
            {questions.filter((q) => q.status === "pending").length} câu hỏi đang chờ xử lý.
        </CardDescription>
      </CardHeader>
      
      {sortedQuestions.length === 0 ? (
        <p className="text-muted-foreground">Chưa có câu hỏi nào trong hệ thống.</p>
      ) : (
        sortedQuestions.map((q: Question) => (
          <QuestionItem 
            key={q.id} 
            question={q} 
            isAdmin={true} 
            onReply={(id, content) => replyQuestion(id, adminName, content)} 
          />
        ))
      )}
    </div>
  );
}

// --- Component hiển thị từng câu hỏi ---
function QuestionItem({ question, isAdmin, onReply }: { question: Question, isAdmin: boolean, onReply?: (id: string, c: string) => void }) {
  const [replyText, setReplyText] = useState("");
  const isPending = question.status === "pending";

  const handleSubmitReply = () => {
    if(onReply && replyText.trim()) {
        onReply(question.id, replyText);
        setReplyText("");
        toast.success("Đã trả lời!");
    }
  };

  return (
    <Card className={`border ${isPending ? 'border-orange-200 bg-orange-50/10' : 'border-gray-200'}`}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col">
                <span className="font-semibold text-primary">{question.username}</span>
                <span className="text-xs text-muted-foreground">{new Date(question.timestamp).toLocaleString()}</span>
            </div>
            <Badge variant={isPending ? "destructive" : "default"}>
                {isPending ? "Chờ trả lời" : "Đã trả lời"}
            </Badge>
        </div>
        
        <p className="mb-4 text-base">{question.content}</p>

        {/* Phần hiển thị câu trả lời hoặc form trả lời */}
        {question.status === "replied" && (
            <div className="bg-muted/50 p-4 rounded-md mt-4 border-l-4 border-green-500">
                <p className="text-sm font-semibold text-green-600 mb-1">
                    {question.adminName || "Admin"} trả lời:
                </p>
                <p>{question.answer}</p>
                <span className="text-xs text-muted-foreground block mt-2">
                    {question.replyTimestamp && new Date(question.replyTimestamp).toLocaleString()}
                </span>
            </div>
        )}

        {/* Form trả lời dành riêng cho Admin khi chưa trả lời */}
        {isAdmin && isPending && (
            <div className="mt-4 pt-4 border-t gap-2 flex flex-col">
                <label className="text-sm font-medium">Phản hồi của bạn:</label>
                <Textarea 
                    value={replyText} 
                    onChange={(e) => setReplyText(e.target.value)} 
                    placeholder="Nhập câu trả lời..."
                />
                <div className="flex justify-end mt-2">
                    <Button onClick={handleSubmitReply} size="sm">Gửi trả lời</Button>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
