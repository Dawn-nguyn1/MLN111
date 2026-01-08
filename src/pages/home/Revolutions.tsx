import { useTheme } from "../../contexts/ThemeContext";

export default function Revolutions() {
    const { theme } = useTheme();

    const card = (idx: string | number, title: string, desc: string, img: string, colorClass: string) => (
        <div
            className={`group p-8 rounded-xl transition-all duration-300 border flex flex-col h-full ${theme === "dark"
                ? "bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600 hover:from-blue-600/20 hover:to-cyan-600/20 hover:border-blue-400"
                : "bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300 hover:from-blue-50/50 hover:to-cyan-50/50 hover:border-blue-400"
                }`}
            key={idx}
        >
            <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center font-bold text-lg shrink-0 text-white`}>
                    {idx}
                </div>
                <h3 className="text-2xl font-bold text-blue-400">{title}</h3>
            </div>
            <p className={`mb-3 leading-relaxed transition-colors duration-300 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                {desc}
            </p>
            <img src={img} alt={title} className="rounded-lg w-full h-40 object-cover mt-auto" />
        </div>
    );

    return (
        <section id="revolutions" className={`py-20 px-4 transition-colors duration-300 ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
            <div className="max-w-6xl mx-auto">
                <h2 className="py-3 text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    4 Hình Thức Cộng Đồng Người
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                    {card(
                        "1",
                        "Thị Tộc",
"Đây là hình thức tổ chức xã hội đầu tiên trong lịch sử, nơi các thành viên cùng chung sống, lao động dựa trên những thói quen, tín ngưỡng chung và có mối quan hệ huyết thống mật thiết",
                        "/thitoc2.jpg",
                        "bg-gradient-to-br from-blue-500 to-cyan-500"
                    )}

                    {card(
                        "2",
                        "Bộ Lạc",
                        "Hình thành từ sự liên kết của nhiều thị tộc, bộ lạc là cộng đồng người mà các thành viên vẫn duy trì phương thức lao động chung nhưng có tổ chức xã hội chặt chẽ và quy mô lớn hơn thị tộc",
                        "/bo-lac.jpg",
                        "bg-gradient-to-br from-cyan-500 to-blue-500"
                    )}

                    {card(
                        "3",
                        "Bộ Tộc",
                        "Xuất hiện sau bộ lạc, bộ tộc là một hình thức cộng đồng người có sự phát triển cao hơn về tổ chức xã hội và bắt đầu có sự đan xen giữa các mối quan hệ huyết thống với các quan hệ xã hội khác.",
                        "/bo-toc.jpg",
                        "bg-gradient-to-br from-blue-500 to-cyan-500"
                    )}

                    {card(
                        "4",
                        "Dân Tộc",
                        "Là hình thức cộng đồng người cao nhất và ổn định nhất, được đặc trưng bởi sự thống nhất về lãnh thổ, ngôn ngữ, kinh tế, văn hóa, tâm lý và có một hệ thống nhà nước cùng pháp luật chung.",
                        "/dantoc2.jpg",
                        "bg-gradient-to-br from-cyan-500 to-blue-500"
                    )}
                </div>
            </div>
        </section>
    );
}
