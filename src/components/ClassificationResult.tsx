import { Close } from "@mui/icons-material";
import { getClusterColorClass } from "@/functions/utils";

interface InfoContentProps {
    customerName: string;
    cluster: number;
    confidence: number;
    onClose: () => void;
}

export default function InfoContent({ customerName, cluster, confidence, onClose }: InfoContentProps) {
    const getConfidenceLevel = (confidence: number) => {
        if (confidence > 0.7) return { text: "High", color: "text-green-500" };
        if (confidence > 0.4) return { text: "Medium", color: "text-yellow-500" };
        return { text: "Low", color: "text-red-500" };
    };

    const confidenceLevel = getConfidenceLevel(confidence);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md relative transform transition-all duration-300 ease-in-out">
                <div className="absolute top-5 right-5">
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                        <Close />
                    </button>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-800">Classification Result</h2>
                </div>

                <div className="space-y-8">
                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 ${getClusterColorClass(cluster.toString())} rounded-full flex items-center justify-center`}>
                                <span className="text-white text-sm font-bold">{cluster}</span>
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs">Cluster Assignment</p>
                                <p className="text-slate-800 font-medium">Group {cluster}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-b border-slate-100 py-6">
                        <p className="text-slate-500 text-sm mb-1">Customer</p>
                        <p className="text-xl font-semibold text-slate-800">{customerName}</p>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-slate-500 text-sm">Confidence Score</p>
                            <div className="flex items-center gap-2">
                                <p className="text-slate-800 font-medium">{(confidence * 100).toFixed(1)}%</p>
                                <span className={`text-xs font-medium ${confidenceLevel.color}`}>
                                    ({confidenceLevel.text})
                                </span>
                            </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                            <div 
                                className={`h-2 rounded-full ${confidence > 0.7 ? 'bg-green-500' : confidence > 0.4 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                style={{ width: `${confidence * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-slate-800 text-white rounded-lg cursor-pointer
                            hover:bg-slate-700 transition-colors focus:outline-none 
                            focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
