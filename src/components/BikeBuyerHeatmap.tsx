'use client';

import React, { useMemo, useState } from "react";

import { useCustomers } from "@/context/CustomerContext";
import { MARITAL_STATUS } from "@/context/FilterContext";
import { HeatmapCell } from "@/app/types";
import { getTextColor } from "@/functions/utils";

import { HeatmapTooltip } from "@/components/HeatmapTooltip";


const COLOR_SCALE = (rate: number) => {
  const base = [13, 148, 136];
  const white = [255, 255, 255];
  const blend = base.map((c, i) => Math.round(white[i] + (c - white[i]) * (rate / 100)));
  return `rgb(${blend[0]}, ${blend[1]}, ${blend[2]})`;
};

const COLUMN_GROUPS = [
  {
    title: "Home Ownership",
    columns: [
      { id: 0, label: "Non-owner" },
      { id: 1, label: "Owner" },
    ],
  },
  {
    title: "Marital Status",
    columns: [
      { id: "S", label: "Single" },
      { id: "M", label: "Married" },
    ],
  },
];

export default function BikeBuyerHeatmap() {

  const { filteredCustomers } = useCustomers();

  const [hoveredCell, setHoveredCell] = useState<{
    cell: HeatmapCell; 
    position: { 
      top: number;
      left: number;
    };
  } | null>(null);

  const heatmapData: HeatmapCell[] = useMemo(() => {
    const groups: Record<string, { 
      total: number; 
      buyers: number;
      clusters: Record<string, number>;
    }> = {};

    filteredCustomers.forEach((customer) => {
      const keyHome = `home-${customer.HomeOwnerFlag}-${customer.NumberChildrenAtHome}`;
      if (!groups[keyHome]) {
        groups[keyHome] = { total: 0, buyers: 0, clusters: {} };
      }
      groups[keyHome].total += 1;
      if (customer.BikeBuyer === 1) groups[keyHome].buyers += 1;
      groups[keyHome].clusters[customer.clustering] = (groups[keyHome].clusters[customer.clustering] || 0) + 1;

      const keyMarital = `marital-${customer.MaritalStatus}-${customer.NumberChildrenAtHome}`;
      if (!groups[keyMarital]) {
        groups[keyMarital] = { total: 0, buyers: 0, clusters: {} };
      }
      groups[keyMarital].total += 1;
      if (customer.BikeBuyer === 1) groups[keyMarital].buyers += 1;
      groups[keyMarital].clusters[customer.clustering] = (groups[keyMarital].clusters[customer.clustering] || 0) + 1;
    });

    return Object.entries(groups).map(([key, value]) => {
      const [type, status, numChildren] = key.split("-");
      const buyerRate = value.total > 0 ? (value.buyers / value.total) * 100 : 0;
      const clusterDistribution = Object.entries(value.clusters).reduce((acc, [cluster, count]) => {
        acc[cluster] = {
          count,
          percentage: (count / value.total) * 100
        };
        return acc;
      }, {} as Record<string, { count: number; percentage: number }>);

      if (type === 'home') {
        return {
          homeOwnerFlag: Number(status),
          numChildren: Number(numChildren),
          buyerRate,
          total: value.total,
          buyers: value.buyers,
          id: key,
          clusterDistribution
        };
      } else {
        return {
          maritalStatus: status,
          numChildren: Number(numChildren),
          buyerRate,
          total: value.total,
          buyers: value.buyers,
          id: key,
          clusterDistribution
        };
      }
    });
  }, [filteredCustomers]);

  const minChildrenShowed = [0, 1, 2];
  const childrenNum = Array.from(new Set(heatmapData.map((d) => d.numChildren)));
  // Show a min num of children for cases when there is only 0
  const possibleChildrenNum = Array.from(new Set([...minChildrenShowed, ...childrenNum])).sort((a, b) => a - b);

  const handleCellHover = (cell: HeatmapCell | null, event: React.MouseEvent | null) => {
    if (!cell || !event) {
      setHoveredCell(null);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = event.currentTarget.closest('.heatmap-container')?.getBoundingClientRect();
    
    if (!containerRect) return;

    const tooltipWidth = 260;
    const tooltipHeight = 200;
    const offset = 10;

    // Handle tooltip cut buy screen limits
    const spaceRight = window.innerWidth - rect.right;
    const spaceBottom = window.innerHeight - rect.bottom;
    
    let left = rect.right - containerRect.left;
    if (spaceRight < tooltipWidth + offset) {
      left = rect.left - containerRect.left - tooltipWidth - offset;
    } else {
      left += offset;
    }

    let top = rect.top - containerRect.top;
    if (spaceBottom < tooltipHeight) {
      top = rect.top - containerRect.top - tooltipHeight + rect.height;
    }

    setHoveredCell({
      cell,
      position: { top, left }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col relative heatmap-container">
      <div className="flex justify-between items-center mb-4">
        <h2 className="uppercase tracking-wide font-semibold text-slate-700 text-base">
          Bike Buyers by Household Characteristics
        </h2>
      </div>

      <div className="grid grid-cols-[60px_repeat(4,1fr)] auto-rows-fr gap-2 text-sm flex-1 min-h-0 pl-2">
        <div className="absolute -left-4 top-[70%] -translate-y-1/2 -rotate-90 
          text-slate-600 border-b-2 pb-1 border-slate-200 font-medium"
        >
          Children at home
        </div>
        <div />
      
        {COLUMN_GROUPS.map((group) => (
          <div key={group.title} className="col-span-2 text-center font-medium text-slate-600 pb-1">
            <span className="border-b-2 border-slate-200 pb-1 px-2">{group.title}</span>
          </div>
        ))}

        <div />
        {COLUMN_GROUPS.flatMap((group) =>
          group.columns.map((col) => (
            <div key={col.id} className="text-center font-medium text-slate-700 pb-1">
              {col.label}
            </div>
          ))
        )}

        {possibleChildrenNum.map((numChildren) => (
          // Frangment for key differentiation
          <React.Fragment key={`row-${numChildren}`}>
            <div
              className="font-medium text-slate-700 text-right pr-3 self-center"
            >
              {numChildren}
            </div>

            {[0, 1].map((flag) => {
              const cell = heatmapData.find(
                (d) => d.homeOwnerFlag === flag && d.numChildren === numChildren
              );
              const color = cell ? COLOR_SCALE(cell.buyerRate) : "#f1f5f9";
              const textColor = getTextColor(color);
              return (
                <div
                  key={`home-${flag}-${numChildren}`}
                  className={`w-full h-7 rounded-md shadow text-center flex items-center justify-center text-xs font-semibold ${textColor} cursor-pointer hover:ring-2 hover:ring-slate-300 transition-all`}
                  style={{ backgroundColor: color }}
                  onMouseEnter={(e) => cell && handleCellHover(cell, e)}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  {cell ? `${cell.buyerRate.toFixed(0)}%` : "-"}
                </div>
              );
            })}

            {MARITAL_STATUS.map((status) => {
              const cell = heatmapData.find(
                (d) => d.maritalStatus === status && d.numChildren === numChildren
              );
              const color = cell ? COLOR_SCALE(cell.buyerRate) : "#f1f5f9";
              const textColor = getTextColor(color);
              return (
                <div
                  key={`marital-${status}-${numChildren}`}
                  className={`w-full h-7 rounded-md shadow text-center flex items-center justify-center text-xs font-semibold ${textColor} cursor-pointer hover:ring-2 hover:ring-slate-300 transition-all`}
                  style={{ backgroundColor: color }}
                  onMouseEnter={(e) => cell && handleCellHover(cell, e)}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  {cell ? `${cell.buyerRate.toFixed(0)}%` : "-"}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {hoveredCell && (
        <HeatmapTooltip
          cell={hoveredCell.cell}
          position={hoveredCell.position}
        />
      )}
    </div>
  );
}
