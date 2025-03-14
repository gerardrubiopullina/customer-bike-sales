

export default function Header() {
    
    return (
        <header className="bg-white border-b border-slate-200 py-3">
            <div className="px-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="flex -space-x-1">
                        <div className="w-5 h-5 rounded-full border-2 border-white cluster-1-bg"></div>
                        <div className="w-5 h-5 rounded-full border-2 border-white cluster-2-bg"></div>
                        <div className="w-5 h-5 rounded-full border-2 border-white cluster-3-bg"></div>
                    </div>
                    <h1 className="ml-2 text-lg font-medium">Bike Sales Analytics Dashboard</h1>
                </div>
            </div>
        </header>
    );
}