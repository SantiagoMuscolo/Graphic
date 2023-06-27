import { useEffect, useState } from 'react';
import * as d3 from 'd3';

import '../App.css';

export const Graphic: React.FC = () => {
    const [data, setData] = useState<Array<[Date, number]>>([]);

    useEffect(() => {
        
        fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
            .then(response => response.json())
            .then(jsonData => {
                
                const processedData = jsonData.data.map((item: [string, number]) => {
                    return [new Date(item[0]), item[1]];
                });
                setData(processedData);
            });
    }, []);

    useEffect(() => {
        
        if (data.length > 0) {
            createChart();
        }
    }, [data]);

    const createChart = () => {
        
        const margin = { top: 30, right: 30, bottom: 70, left: 70 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        
        const svg = d3
            .select('#chart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        
        const xScale = d3
            .scaleTime()
            .domain([d3.min(data, d => d[0])!, d3.max(data, d => d[0])!])
            .range([0, width]);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => d[1])!])
            .range([height, 0]);

        
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg
            .append('g')
            .attr('id', 'x-axis')
            .attr('transform', `translate(0, ${height})`)
            .call(xAxis);

        svg.append('g').attr('id', 'y-axis').call(yAxis);

        
        svg
            .selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('data-date', d => d[0].toISOString().split('T')[0])
            .attr('data-gdp', d => d[1])
            .attr('x', d => xScale(d[0]))
            .attr('y', d => yScale(d[1]))
            .attr('width', width / data.length)
            .attr('height', d => height - yScale(d[1]))
            .on('mouseover', (event, d) => {
                const tooltip = d3.select('#tooltip');
                tooltip
                    .style('opacity', 0.9)
                    .style('left', event.pageX + 'px')
                    .style('top', event.pageY + 'px')
                    .attr('data-date', d[0].toISOString().split('T')[0])
                    .html(`${d[0].getFullYear()} Q${getQuarter(d[0])}<br/>$${d[1]} Billion`);

                d3.select(event.currentTarget).attr('fill', 'orange');
            })
            .on('mouseout', (event, d) => {
                const tooltip = d3.select('#tooltip');
                tooltip.style('opacity', 0);

                d3.select(event.currentTarget).attr('fill', 'steelblue');
            });
    };

    const getQuarter = (date: Date) => {
        const month = date.getMonth();
        return Math.floor(month / 3) + 1;
    };

    return (
        <div className="App">
            <div className="chart-container">
                <h1 id="title">Graphic</h1>
                <div id="chart"></div>
                <div id="tooltip"></div>
            </div>
        </div>
    );
};

