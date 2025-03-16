import { HeatmapCell } from "@/app/types";
import { getClusterColorClass } from "@/functions/utils";


interface InfoTooltipProps {
    cell: HeatmapCell;
    position: {
      top: number;
      left: number;
    };
}

export function InfoTooltip({ cell, position }: InfoTooltipProps) {

    const getCellDescription = (cell: HeatmapCell) => {
        if (cell.homeOwnerFlag !== undefined) {
          return `${cell.homeOwnerFlag === 1 ? 'Homeowner' : 'Non-owner'} with ${cell.numChildren} children`;
        }
        return `${cell.maritalStatus === 'M' ? 'Married' : 'Single'} with ${cell.numChildren} children`;
    };

    return (
        <div 
            className={`absolute z-50 bg-white rounded-lg shadow-xl p-4 w-[260px] border border-slate-200 transition-all duration-150`}
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                opacity: 1,
                pointerEvents: 'none'
            }}
        >
            <div className="flex flex-col gap-2">
                <div className="text-sm font-semibold text-slate-800 border-b pb-2">
                    {getCellDescription(cell)}
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                    <span>Total Customers:</span>
                    <span className="font-medium">{cell.total}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                    <span>Bike Buyers:</span>
                    <span className="font-medium">{cell.buyers} ({cell.buyerRate.toFixed(1)}%)</span>
                </div>
                <div className="mt-1 border-t pt-2">
                    <span className="text-xs text-slate-500 mb-1">Customer Distribution by Cluster:</span>
                    {Object.entries(cell.clusterDistribution || {})
                        .sort((a, b) => Number(a[0]) - Number(b[0]))
                        .map(([cluster, data]) => (
                        <div key={cluster} className="flex justify-between text-sm text-slate-600">
                            <div className="flex gap-2">
                            <div className={`w-2 h-2 mt-1.5 ${getClusterColorClass(cluster)} rounded-full`}></div>
                            <span>Cluster {cluster}:</span>
                            </div>
                            <span className="font-medium">{data.count} ({data.percentage.toFixed(1)}%)</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}