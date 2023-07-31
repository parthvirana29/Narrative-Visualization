async function init(){

    d3.select("svg")
        .append("text")
        .attr("transform","translate(100,0)")
        .attr("x", 50)
        .attr("y",50)
        .attr("font-size", "24 px")
        .text("Log(Average City MPG) vs. Log(Average Highway MPG)");
    data = await d3.csv("https://flunky.github.io/cars2017.csv");
    var x = d3.scaleLog().domain([10,150]).range([0,800]);
    var y = d3.scaleLog().domain([10,150]).range([350,0]);


    var crange = ["blue", "orange"];
    var cdomain = [10,150];
    var cs = d3.scaleLog().domain(cdomain).range(crange);
    d3.select("svg")
    .append("g")
    .attr("transform","translate("+60+","+50+")")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .on('mouseover', onMouseOver)
    .on('mouseout',onMouseOut)
    .attr("cx", function(d){return x(d.AverageCityMPG);})
    .transition()
    .ease(d3.easeCircleOut)
    .duration(700)
    .delay(function(d,i){ return i * 50})
    .attr("cy", function(d){return y(d.AverageHighwayMPG);})
    .attr("r", function(d){return 5 + parseInt(d.EngineCylinders);})
    .style("fill",function(d,i){return cs(d.AverageCityMPG); })
    .attr("stroke-width",2)
    .style("opacity",function(s,i){ return function(d,i) { return d.AverageHighwayMPG}});



    d3.select("svg").append("g")
    .attr("transform","translate("+50+","+50+")")
    .call(d3.axisLeft(y).tickValues([10,20,50,100]).tickFormat(function(d){return d;}));
    
    d3.select("svg").append("g")
    .attr("transform","translate("+50+","+400+")")
    .call(d3.axisBottom(x).tickValues([10,20,50,100]).tickFormat(function(d){return d;}));

    d3.selectAll("circle")
        .on("mouseover", onMouseOver);

    function onMouseOver(d,i){
    // d3.select(this).attr('class','highlight')

        d3.select(this)
        .transition()
        .duration(500)
        .attr('opacity','1')
        // .attr('width', x.bandwidth() + 5 )
        .attr('r', function(d) {return 1.5* (5 + parseInt(d.EngineCylinders)); })
        .style("fill","red")
        // .attr('height', function(d) {return height - y(d.AverageHighwayMPG)} )
        .raise;

        var xPos = parseFloat(d3.select(this).attr('cx'));
        var yPos = parseFloat(d3.select(this).attr('cy'));

    
        
        d3.select("#tooltip")
            .style('left', xPos + 'px')
            .style('top', yPos+ 'px')
            .select('#value').text(d.AverageCityMPG)
            .select('#valye2').text(d.AverageHighwayMPG)
            // console.log(d.AverageCityMPG)
            // console.log(d.AverageHighwayMPG)
         
        d3.select('#tooltip').classed('hidden', false)
    }
    d3.selection.prototype.moveToFront = function() {
        return this.each(function(){
        this.parentNode.appendChild(this);
        });
    };
    function onMouseOut(d,i){
    // d3.select(this).attr('class','highlight')
        d3.select(this)
        .transition()
        .duration(500)
        // .attr('width', x.bandwidth() + 5 )
        .attr("cy", function(d){return y(d.AverageHighwayMPG);})
        .attr("r", function(d){return 5 + parseInt(d.EngineCylinders);})
        .style("fill",function(d,i){return cs(d.AverageCityMPG); })
        .attr("stroke-width",2)
        .style("opacity",function(s,i){ return function(d,i) { return d.AverageHighwayMPG}});
        d3.select('#tooltip').classed('hidden', true);
    }

}




