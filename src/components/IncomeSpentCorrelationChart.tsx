'use client'

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useCustomers } from '@/context/CustomerContext';

// Colores para cada cluster
const CLUSTER_COLORS = {
  1: '#008080',
  2: '#003366',
  3: '#ff7f0e',
};

export default function ScatterPlot() {

  const { customers } = useCustomers();
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!customers || !svgRef.current) return;

    // Establecer las dimensiones del gráfico con márgenes
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Crear el SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('border', '1px solid #ccc')
      .style('margin-top', '20px');

    // Crear un grupo para los elementos gráficos
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Establecer escalas para el gráfico
    const xScale = d3.scaleLinear()
      .domain([
        0,
        (d3.max(customers, (d) => d.YearlyIncome) || 0) * 1.1
      ])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([
        0,
        (d3.max(customers, (d) => d.AvgMonthSpend) || 0) * 1.1
      ])
      .range([height, 0]);


    // Añadir los puntos de dispersión
    g.selectAll('circle')
      .data(customers)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.YearlyIncome))
      .attr('cy', (d) => yScale(d.AvgMonthSpend))
      .attr('r', 6)
      .attr('fill', (d) => CLUSTER_COLORS[d.clustering] || '#ccc') // Asignar color según el cluster
      .attr('opacity', 0.7);

    // Ejes X y Y con estilo
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '12px')
      .style('font-weight', 'bold');

    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '12px')
      .style('font-weight', 'bold');

    // Etiquetas de ejes
    svg.append('text')
    .attr('transform', `translate(${width / 2 + margin.left}, ${height + margin.top + 50})`)
    .style('text-anchor', 'middle')
    .style('font-size', '16px')
    .style('font-weight', 'bold')
    .text('Yearly Income');

  // Eje Y - a la izquierda del eje Y
  svg.append('text')
    .attr('transform', `rotate(-90)`)
    .attr('x', -(height / 2 + margin.top))
    .attr('y', margin.left - 60)
    .style('text-anchor', 'middle')
    .style('font-size', '16px')
    .style('font-weight', 'bold')
    .text('Avg. Monthly Spend');

  }, [customers]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  )
}
