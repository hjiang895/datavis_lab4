async function loadData() {
	let data = await d3.csv('wealth-health-2014.csv', d3.autoType);
	console.log(data);
    return data;
}

loadData();

// const height = 500;
// const width = 700;

async function renderScatterPlot() {
    const margin = ({top: 20, right: 20, bottom: 20, left: 20})
    const width = 650 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    let data = await loadData();
    const income_extent = d3.extent(data, d => d.Income);
    const life_extent =  d3.extent(data, d => d.LifeExpectancy);
    const income_min = income_extent[0];
    const income_max = income_extent[1];
    const life_min = life_extent[0];
    const life_max = life_extent[1];
    console.log(income_extent);
    console.log(life_extent);

    const xScale = d3
    .scaleLinear()
    .domain([income_min, income_max])
    .range([0, width]);

    const yScale = d3
    .scaleLinear()
    .domain([life_min, life_max])
    .range([height, 0]); 

    console.log(xScale(income_max));
    console.log(yScale(life_max));

    const padding = 10;

    const svg = d3.select(".chart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(5, "s");
    const yAxis = d3.axisLeft()
    .scale(yScale);
    

    svg.append("g")
	.attr("class", "axis x-axis")
	.call(xAxis)
    .attr("transform", `translate(0, ${height})`);

    svg.append("g")
	.attr("class", "axis y-axis")
	.call(yAxis)
    // .attr("transform", "translate(" + padding + ",0)");

    svg.append("text")
		.attr('x', "600")
		.attr('y', "450")
		// add attrs such as alignment-baseline and text-anchor as necessary
		.text("Income")
        .attr("fill", "black")
        .attr("font-size", "11px")
        .attr("text-anchor", "end");

    svg.append("text")
    .attr('x', "500")
    .attr('y', "500")
    // add attrs such as alignment-baseline and text-anchor as necessary
    .text("Average Life Expectancy")
    .attr("fill", "black")
    .attr("font-size", "11px")
    .attr("text-anchor", "end")
    .attr("writing-mode", "vertical-lr");
    
    var circles = svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("fill", "orange")
    .attr("cx", function(d) {
        return xScale(d.Income);
    })
    .attr("cy", function(d) {
        return yScale(d.LifeExpectancy);
    })
    .attr("r", function(d) {
        if (d.Population < 300000000) {
            return 4;
        }
        return 16;
    });

    d3.scaleOrdinal(d3.schemeTableau10)
}

renderScatterPlot();

// function renderAxes() {
//     const xAxis = d3.axisBottom()
// 	.scale(xScale);
//     const yAxis = d3.axisLeft()
//     .scale(yScale);
// }

