"use strict";

// Type conversion
function type(d){
    return{
        donor_id: d.donor_id,
        CA: +d.CA,
        CG: +d.CG,
        CT: +d.CT,
        TA: +d.TA,
        TC: +d.TC,
        TG: +d.TG,
        gender: d.gender,
        country: d.country,
        age: +d.age,
        alc: +d.alc,
        cig: +d.cig
    };
};

function ready(d){
    // Margin convention
    const margin = {top: 80, right: 40, bottom: 40, left: 40};
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const heatmapWidth = 400;
    const heatmapCat = 6;
    const catVarWidth = 200;
    const interPadding = 50;


    // Draw base
    const svg = d3.select('.heatmap-chart-container')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const yScale = d3.scaleBand()
        .domain(d.map(d => d.donor_id))
        .range([0, height])
    
    const xScaleHeatmap = d3.scaleBand()
        .domain(d.columns.slice(0,5))
        .rangeRound([0, heatmapWidth])
    
    
    const xScaleGenderCountry = d3.scaleBand()
        .domain(d.columns.slice(7, 9))
        .rangeRound([heatmapWidth + interPadding, heatmapWidth + catVarWidth])

    // build colour range
    let myColor = d3.scaleLinear()
        .range(["lightgreen", "blue"])
        .domain([1,5000]);
    
    // Draw heatmap
    const heatmapCatWidth = Math.round(heatmapWidth / heatmapCat);
    function drawHeatData(d, index){
        const mutCategory = d.columns.slice(index[0], index[1]);
        mutCategory.forEach(item => 
            svg.selectAll('.'.concat(item))
                .data(d)
                .enter()
                .append('rect')
                .attr('class', item)
                .attr('x', d => xScaleHeatmap(item))
                .attr('y', d => yScale(d.donor_id))
                .attr('width', heatmapCatWidth)
                .attr('height', yScale.bandwidth())
                .attr('fill', d => myColor(d[item]))
        );
    };

    drawHeatData(d, [1, 7]);

    // Draw gender
    const genderPlot = svg.selectAll('.gender')
        .data(d)
        .enter()
        .append('circle')
        .attr('class', 'gender')
        .attr('cx', d => xScaleGenderCountry('gender'))
        .attr('cy', d =>  yScale(d.donor_id) + yScale.bandwidth()/2)
        .attr('r', 15)
        .attr('fill', 'orange')

    // Draw country
    const countryPlot = svg.selectAll('.country')
        .data(d)
        .enter()
        .append('circle')
        .attr('class', 'country')
        .attr('cx', d => xScaleGenderCountry('country'))
        .attr('cy', d => yScale(d.donor_id) + yScale.bandwidth() / 2 )
        .attr('r', 15)
        .attr('fill', 'purple')
    // debugger;
    // Draw age


    // Draw cig


    // Draw alc


}; //end of main function



// load data
const data = d3.csv('data/demo_snv_data.csv', type).then(res => {
    ready(res);
    // console.log(res)
});