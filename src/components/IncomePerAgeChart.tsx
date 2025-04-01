'use client';

import {
    ResponsiveContainer,
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import { useCustomers } from '@/context/CustomerContext';


const COLORS = ['#008080', '#003366', '#ff7f0e'];

interface AgeGroupData {
    ageRange: string;
    avgIncome: number;
    cluster: string;
    fill: string;
    xLabel: string;
}

interface CustomDotProps {
    cx?: number;
    cy?: number;
    payload: AgeGroupData;
}

interface ScatterShapeProps {
    cx?: number;
    cy?: number;
    r?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    payload?: AgeGroupData;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        payload: AgeGroupData;
        color: string;
    }>;
    clusterDataMap: Record<string, AgeGroupData[]>;
    clusterColorMap: Record<string, string>;
}

const AGE_INTERVALS = [
    { min: 0, max: 25, label: '<25' },
    { min: 26, max: 30, label: '26-30' },
    { min: 31, max: 35, label: '31-35' },
    { min: 36, max: 40, label: '36-40' },
    { min: 41, max: 45, label: '41-45' },
    { min: 46, max: 50, label: '46-50' },
    { min: 51, max: 55, label: '51-55' },
    { min: 56, max: 60, label: '56-60' },
    { min: 61, max: 65, label: '61-65' },
    { min: 66, max: 70, label: '66-70' },
    { min: 71, max: 75, label: '71-75' },
    { min: 76, max: 150, label: '>75' },
];

export default function IncomePerAgeChart() {

    const { filteredCustomers } = useCustomers();

    const clusterDataMap: Record<string, AgeGroupData[]> = {};
    const clusterColorMap: Record<string, string> = {};
    
    const allClusters = Array.from(new Set(filteredCustomers.map((c) => c.clustering)));
    allClusters.forEach((clusterId) => {
        clusterColorMap[clusterId] = COLORS[Number(clusterId) - 1];
    });

    AGE_INTERVALS.forEach((interval) => {
        const customersInInterval = filteredCustomers.filter(
            (c) => c.Age >= interval.min && c.Age <= interval.max
        );

        if (customersInInterval.length === 0) return;
        const clusters = Array.from(new Set(customersInInterval.map((c) => c.clustering)));

        clusters.forEach((clusterId) => {
            const clusterCustomers = customersInInterval.filter((c) => c.clustering === clusterId);
            const avgIncome =
                clusterCustomers.reduce((sum, c) => sum + Number(c.YearlyIncome || 0), 0) /
                clusterCustomers.length;

            const fillColor = clusterColorMap[clusterId];

            if (!clusterDataMap[clusterId]) {
                clusterDataMap[clusterId] = [];
            }
            clusterDataMap[clusterId].push({
                ageRange: interval.label,
                avgIncome: Math.round(avgIncome),
                cluster: clusterId,
                fill: fillColor,
                xLabel: interval.label,
            });
        });
    });

    const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
        if (active && payload && payload.length) {
            const currentAgeRange = payload[0].payload.ageRange;
            const allClusterData = Object.entries(clusterDataMap).reduce((acc, [clusterId, data]) => {
                const ageData = data.find(d => d.ageRange === currentAgeRange);
                if (ageData) {
                    acc[clusterId] = {
                        ...ageData,
                        color: clusterColorMap[clusterId]
                    };
                }
                return acc;
            }, {} as Record<string, { avgIncome: number; color: string }>);

            return (
                <div className="bg-white p-4 shadow-lg rounded-lg border border-slate-200">
                    <div className="text-sm font-semibold text-slate-800 border-b pb-2">
                        Age: {currentAgeRange}
                    </div>
                    {Object.entries(allClusterData).map(([clusterId, data]) => (
                        <div key={`${clusterId}-${currentAgeRange}`} className="mt-2">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: data.color }}></div>
                                <span className="text-sm text-slate-600">Cluster {clusterId}</span>
                            </div>
                            <div className="text-sm text-slate-600 ml-5">
                                Avg Income: <span className="font-semibold text-sm">€{data.avgIncome.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    const CustomDot = (props: CustomDotProps) => {
        const { cx, cy, payload } = props;
        return (
            <circle
                cx={cx}
                cy={cy}
                r={6}
                fill={payload.fill}
                stroke="#fff"
                strokeWidth={1.5}
            />
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 h-full">
            <h2 className="uppercase tracking-wider font-semibold mb-4 text-slate-600">
                Average yearly income per age group
            </h2>
            <div className="w-full h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            type="category"
                            dataKey="xLabel"
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            domain={AGE_INTERVALS.map((b) => b.label)}
                            allowDuplicatedCategory={false}
                            interval={1}
                        />

                        <YAxis
                            dataKey="avgIncome"
                            name="AvgIncome"
                            scale="log"
                            domain={[ //auto domain with margins
                                (dataMin: number) => Math.max(1000, dataMin * 0.9),
                                (dataMax: number) => dataMax * 1.1,
                            ]}
                            tick={{ fontSize: 12 }}
                            label={{ 
                                value: 'Avg yearly income (€)', 
                                angle: -90, 
                                position: 'insideLeft',
                                offset: 10,
                                dy: 90
                            }}
                            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip clusterDataMap={clusterDataMap} clusterColorMap={clusterColorMap} />} />
                        {Object.entries(clusterDataMap).map(([clusterId, clusterData]) => (
                            <Scatter
                                key={clusterId}
                                name={`Cluster ${clusterId}`}
                                data={clusterData}
                                shape={(props: ScatterShapeProps) => 
                                    <CustomDot {...props} payload={props.payload as AgeGroupData} />
                                }
                                fill={clusterColorMap[clusterId]}
                            />
                        ))}
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
