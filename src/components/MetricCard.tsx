import React from 'react';

interface MetricCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon?: React.ReactNode;
    color?: string;
}

export default function MetricCard({ 
    title, 
    value, 
    description, 
    icon,
    color = '#14b8a6'
}: MetricCardProps) {
    return (
        <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
            <div className="flex-1 p-4 flex items-center">
                {icon && (
                    <div 
                        className="flex items-center justify-center w-12 h-12 rounded-full mr-4"
                        style={{ 
                            backgroundColor: `${color}20`,
                            color: color
                        }}
                    >
                        {icon}
                    </div>
                )}
                <div>
                    <h3 className="text-sm uppercase tracking-wider font-semibold text-slate-600">{title}</h3>
                    <p className="text-2xl font-bold text-slate-600 mt-1">{value}</p>
                </div>
            </div>
            {description && (
                <div className="p-3 text-xs text-slate-500 rounded-b-lg border-t border-slate-100">
                    {description}
                </div>
            )}
        </div>
    );
}