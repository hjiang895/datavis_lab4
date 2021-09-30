async function loadData() {
	let data = await d3.csv('wealth-health-2014.csv', d3.autoType);
    return data;
}

loadData();

async function renderScatterPlot() {
    
    const margin = ({top: 50, right: 50, bottom: 50, left: 90})
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    let data = await loadData();

    const income_extent = d3.extent(data, d => d.Income);
    const life_extent =  d3.extent(data, d => d.LifeExpectancy);
    const income_min = income_extent[0];
    const income_max = income_extent[1];
    const life_min = life_extent[0];
    const life_max = life_extent[1];

    const xScale = d3
    .scaleLinear()
    .domain([income_min, income_max])
    .range([0, width]);

    const yScale = d3
    .scaleLinear()
    .domain([life_min, life_max])
    .range([height, 0]); 

    const svg = d3.select(".chart").append("svg")
                .attr('viewBox', [0, 0, 
                    width + margin.left + margin.right, 
                    height + margin.top + margin.bottom])
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xAxis = d3.axisBottom()
                .scale(xScale)
                .ticks(5, "s");
    const yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(5, "s");
    

    svg.append("g")
            .attr("class", "axis x-axis")
            .call(xAxis)
            .attr("transform", `translate(0, ${height})`);

    svg.append("g")
            .attr("class", "axis y-axis")
            .call(yAxis)

    svg.append("text")
        .attr('x', width / 2)
        .attr('y', height + 50)
		.text("Income");

    svg.append('text')
        .attr('x', -1 * height / 2 - 40)
        .attr('y', -40)
        .attr('transform', 'rotate(-90)')
        .text('Average Life Expectancy');
    

    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);
    
    const sizeScale = d3.scaleSqrt()
                    .domain(d3.extent(data, d => d.Population))
                    .range([1, 50]);
    
    var circles = svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("fill", function(d) {
                    return colorScale(d.Region);
                })
                .attr("opacity", "70%")
                .attr("cx", function(d) {
                    return xScale(d.Income);
                })
                .attr("cy", function(d) {
                    return yScale(d.LifeExpectancy);
                })
                .attr("r", function(d) {
                    return sizeScale(d.Population);
                })
                .on('mouseover, mouseenter', (event, d) => {
                    var position = d3.pointer(event, window)
                    d3.select('.tooltip')
                        .style('position', 'absolute')
                        .style('left', position[0] + 10 + 'px')
                        .style('top', position[1] + 'px')
                        .style('border', '1px solid gray')
                        .style('padding', '5px')
                        .style('opacity', 0.8)
                        .html(
                            '<p id="tooltip">Country: ' +d.Country +
                            '<br>Region: ' + d.Region +
                            '<br>Population: ' + d3.format(',.3r')(d.Population) +
                            '<br>Income: $' + d3.format(',.1r')(d.Income) +
                            '<br>Average Life Expectancy: ' + d.LifeExpectancy + ' years</p>'
                        )
                })
                .on('mousemove', (event, d) => {
                    var position = d3.pointer(event, window)
                    d3.select('.tooltip')
                        .style('top', positionn[1] + 10 + 'px')
                        .style('left', position[0] + 10 + 'px')
                        .style('opacity', 0.8)
                })
                .on('mouseout, mouseleave', (event, d) => { 
                    d3.select('.tooltip')
                    .style('opacity', 0)
                })

    // legend boxes
    console.log(colorScale.domain());
    console.log(data, d=>d.Population);
    svg.append('g').selectAll('rect')
        .data(colorScale.domain())
        .enter()
        .append('rect')
        .attr('class', 'box')
        .attr('height', 10) 
        .attr('width', 10) 
        .attr('x', width - 130)
        .attr('y', (d, i) => height + i * 20 - 140)
        .attr('fill', d => colorScale(d));
    
    // legend text
    svg.append('g').selectAll('text')
        .data(colorScale.domain())
        .enter()
        .append('text')
        .text(d => d)
        .attr('x', width - 110)
        .attr('y', (d, i) => height + i * 20 - 130)
}

renderScatterPlot();



