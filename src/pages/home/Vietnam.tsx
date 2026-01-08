import { useTheme } from "../../contexts/ThemeContext";

export default function Vietnam() {
    const { theme } = useTheme();

    return (
        <section id="vietnam" className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="py-3 text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Mục Lục Tóm tắt Giai Cấp - Dân Tộc - Nhân Loại
                </h2>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <img src="/ShPb8BD9Fw7G.jpg" alt="Vietnam Industry" className="rounded-lg shadow-2xl hover:shadow-blue-500/50 transition-shadow duration-300" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-blue-400 mb-6">Tóm tắt Giai Cấp - Dân Tộc - Nhân Loại</h3>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-1 bg-gradient-to-b from-blue-400 to-cyan-400 flex-shrink-0"></div>
                                <div>
                                    <h4 className="font-semibold text-blue-400 mb-1">Giai cấp và đấu tranh giai cấp</h4>
                                    <p className={theme === "dark" ? "text-slate-300" : "text-slate-700"}>
                                        Đây là nội dung nền tảng để hiểu về cấu trúc xã hội trong lịch sử
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1 bg-gradient-to-b from-cyan-400 to-blue-400 flex-shrink-0"></div>
                                <div>
                                    <h4 className="font-semibold text-cyan-400 mb-1">Bốn Hình Thức Cộng Đồng Người</h4>
                                    <p className={theme === "dark" ? "text-slate-300" : "text-slate-700"}>
                                        Nội dung này trình bày sự tiến hóa của cách con người tổ chức cộng đồng từ thấp đến cao
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1 bg-gradient-to-b from-blue-400 to-cyan-400 flex-shrink-0"></div>
                                <div>
                                    <h4 className="font-semibold text-blue-400 mb-1">Mối Quan Hệ Giữa Giai Cấp, Dân Tộc Và Nhân Loại</h4>
                                    <p className={theme === "dark" ? "text-slate-300" : "text-slate-700"}>
                                        Đây là phần tổng kết về sự tác động qua lại giữa các thực thể
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1 bg-gradient-to-b from-cyan-400 to-blue-400 flex-shrink-0"></div>
                                <div>
                                    <h4 className="font-semibold text-cyan-400 mb-1">Thông Điệp Bài Học</h4>
                                    <p className={theme === "dark" ? "text-slate-300" : "text-slate-700"}>
                                        Trọng tâm và thực hiện
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`p-12 rounded-xl border transition-all duration-300 ${theme === "dark" ? "bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600" : "bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300"}`}>
                    <h3 className="text-3xl font-bold text-cyan-400 mb-8">Thông Điệp Bài Học Giai Cấp - Dân Tộc - Nhân Loại</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-xl font-semibold text-blue-400 mb-4">1.Trọng Tâm</h4>
                            <p className={`leading-relaxed transition-colors duration-300 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                                Bài học nhấn mạnh rằng sự phát triển của xã hội loài người là một quá trình khách quan.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-xl font-semibold text-cyan-400 mb-4">2.Thực Hiện</h4>
                            <p className={`leading-relaxed transition-colors duration-300 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                                Việc giải quyết đúng đắn vấn đề giai cấp và dân tộc là yếu tố then chốt để xây dựng một xã hội công bằng, văn minh.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
