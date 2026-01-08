import { PersonStanding , TrendingUp, Globe } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

export default function Models() {
    const { theme } = useTheme();

    const card = (Icon: any, title: string, desc: string, meta1: string, meta2: string) => (
        <div className={`p-8 rounded-xl transition-all duration-300 border flex flex-col h-full ${theme === "dark" ? "bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600 hover:border-blue-400" : "bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300 hover:border-blue-400"}`}>
            <Icon className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold text-blue-400 mb-4">{title}</h3>
            <p className={`mb-4 leading-relaxed ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                {desc}
            </p>
            <div className={`mt-auto p-4 rounded-lg ${theme === "dark" ? "bg-slate-900/50" : "bg-slate-100/50"}`}>
                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}><strong></strong> {meta1}</p>
                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}><strong></strong> {meta2}</p>
            </div>
        </div>
    );

    return (
        <section id="models" className={`py-20 px-4 transition-colors duration-300 ${theme === "dark" ? "bg-slate-800/50" : "bg-white"}`}>
            <div className="max-w-6xl mx-auto">
                <h2 className="py-3 text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Mối Quan Hệ Giữa Giai Cấp, Dân Tộc Và Nhân Loại
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {card(Globe, "Nhân Loại", "Nhân loại là cộng đồng toàn diện, các yếu tố này có mối quan hệ biện chứng, ảnh hưởng lẫn nhau trong quá trình phát triển xã hội.", "", "")}
                    {card(TrendingUp, "Dân Tộc", "Đấu tranh giải phóng dân tộc là tiền đề cho đấu tranh giai cấp.", "", "")}
                    {card(PersonStanding, "Giai Cấp", "Giai cấp quyết định tính chất và hướng phát triển của dân tộc.", "", "")}
                </div>
            </div>
        </section>
    );
}
