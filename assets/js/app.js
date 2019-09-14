// @TODO: YOUR CODE HERE!
function makeResponsive() {

  
  var svgArea = d3.select("body").select("svg");

  
  if (!svgArea.empty()) {
    svgArea.remove();
  }

var svgWidth = 900;
var svgHeight = 450;

  var margin = {
    top: 30,
    bottom: 30,
    right: 30,
    left: 100
  };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  d3.csv("./assets/data/data.csv")
    .then(function(health_data) {

      health_data.forEach(function(data) {
                data.poverty = +data.poverty;
                data.healthcare = +data.healthcare;
      });

      var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(health_data, d => d.poverty))
        .range([0, width]);

      var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(health_data, d => d.healthcare)])
        .range([height, 0]);

      var xAxis = d3.axisBottom(xLinearScale);
      var yAxis = d3.axisLeft(yLinearScale);

      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

      chartGroup.append("g")
        .attr("transform", `translate(0, ${width})`)
        .call(yAxis);

      var circlesGroup = chartGroup.selectAll("circle")
        .data(health_data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "20")
        .attr("fill", "gray")
        .attr("stroke", "blue")

        var text = chartGroup.selectAll("scatter")
                        .data(health_data)
                        .enter()
                        .append("text");
        
        var textLabels = text.attr("x", function(d) {return xLinearScale(d.poverty)-10; })
                         .attr("y", function(d) {return yLinearScale(d.healthcare)+5; })
                         .text( function (d) { return d.abbr})
                         .attr("fill", "white");          
 
        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

         chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
        .attr("class", "axisText")
        .text("in Poverty (%)");

      var tool_tip = d3.tip()
        .attr("class", "tool_tip")
        .html(function(d) {
          return (`
          <h6>${(d.state)}</h6>
          Poverty: ${(d.poverty)} <hr>
          Healthcare: ${d.healthcare}`);
        });

      chartGroup.call(tool_tip);
      circlesGroup.on("mouseover", function(d) {
        tool_tip.show(d, this);
      })
        .on("mouseout", function(d) {
          tool_tip.hide(d);
        });
    });
}
makeResponsive();

d3.select(window).on("resize", makeResponsive);

