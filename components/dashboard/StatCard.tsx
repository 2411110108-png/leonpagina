export default function StatCard({
    title,
    value,
    change,
    trend,
    icon,
    color = "teal"
}: {
    title: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
    icon: React.ReactNode;
    color?: string;
}) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 border border-gray-50 group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 group-hover:text-teal-500 transition-colors">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-500 group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
            </div>

            {change && (
                <div className="flex items-center gap-1.5">
                    <span className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded-md
            ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' :
                            trend === 'down' ? 'bg-rose-50 text-rose-600' : 'bg-gray-50 text-gray-500'}`
                    }>
                        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {change}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">vs last month</span>
                </div>
            )}
        </div>
    );
}
