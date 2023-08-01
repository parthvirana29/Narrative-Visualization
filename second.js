async function init(){
    var data = await d3.csv("https://flunky.github.io/cars2017.csv");

    var gas_MPG = 0;
    var gas_cylinder = 0;
    var gas_count = 0;

    var electric_MPG = 0;
    var electric_cylinder = 0;
    var electric_count = 0;

    var diesel_MPG = 0;
    var diesel_cylinder = 0;
    var diesel_count = 0;


    for (let i = 0; i < data.length; i++){
        if (data[i].Fuel == "Gasoline"){
            gas_MPG += parseInt(data[i].AverageHighwayMPG);
            gas_cylinder += parseInt(data[i].EngineCylinders)
            gas_count += 1;
            // console.log(data[i].AverageHighwayMPG);
        }

        else if (data[i].Fuel == "Electricity"){
            electric_MPG += parseInt(data[i].AverageHighwayMPG);
            electric_cylinder += parseInt(data[i].EngineCylinders);
            electric_count += 1;
        }

        else {
            diesel_MPG += parseInt(data[i].AverageHighwayMPG);
            diesel_cylinder += parseInt(data[i].EngineCylinders);
            diesel_count += 1;
        }
    }
    // console.log(gas_MPG);
    // console.log(gas_count);

    var average_cylinder_electric = electric_cylinder / electric_count;
    var average_cylinder_diesel = diesel_cylinder / diesel_count;
    var average_cylinder_gas = gas_cylinder / gas_count;

  
    var average_mpg_diesel = diesel_MPG / diesel_count;
    var average_mpg_electric = electric_MPG / electric_count;
    var average_mpg_gas = gas_MPG / gas_count;


    var cylinder= [average_cylinder_diesel, average_cylinder_electric, average_cylinder_gas];
    // console.log(cylinder)

    var mpg = [average_mpg_diesel, average_mpg_electric, average_mpg_gas];
    // console.log(mpg)

    document.getElementById("ele2").innerHTML= average_mpg_electric; 
    document.getElementById("dis2").innerHTML= average_mpg_diesel;
    document.getElementById("gas2").innerHTML= average_mpg_gas; 
 


    var color = ["lightskyblue", "navy", "darkorange"];

    var pie = d3.pie();
    var arc = d3.arc().innerRadius(0).outerRadius(200);
    d3.select("svg")
   .append("g")
   .attr("transform", "translate(" + 260 + "," + 260 + ")")
   .selectAll("path")
   .data(pie(mpg))
   .enter()
   .append("path")
   .attr("d", arc)
   .style("fill", function(d,i){return color[i];})
    .on('mouseover', onMouseOver)
    .on('mouseout',onMouseOut)

    //  arc.append('text')
    //             .attr('transform', function(d){return 'translate(' + label.centroid(d) + ')';})
    //             .text(function(d){return d.data.shape})

    function onMouseOver(d, i) {
        d3.select(this).transition()
    

            .duration('10')
            .attr('opacity', '.5')
            
            // console.log("x: " + d.screenX)
            // console.log("y: " +  d.screenY)
            // console.log("xPOs: " + xPos)
            var xPos = d.screenX;
            var yPos = d.screenY;
            var txt = ""

            // console.log(i)
            if (i.index == 0){
                txt = "Electric Car: "+ average_mpg_electric
            }
            else if (i.index == 1){
                txt = "Diesel Car: "+ average_mpg_diesel
            } else {
                txt = "Gasoline Car: " + average_cylinder_gas
            }

            d3.select("#tooltip")
            .style('left', xPos + 'px')
            .style('top', yPos+ 'px')
            .select('#value4').text(txt)
            // console.log(average_cylinder_diesel)
            d3.select('#tooltip').classed('hidden', false)

    }
    function onMouseOut(d, i) {
        d3.select(this).transition()

            .duration('10')
            .attr('opacity', '1')
            d3.select('#tooltip').classed('hidden', true)
    }



    //bar chart 
    //load another functions
    var averageData = {}
    data.forEach(function(d) {
    var key = d.EngineCylinders.toString(); // Convert the x value to a string to use it as a key
    if (!averageData[key]) {
        averageData[key] = { xValue: parseInt(d.EngineCylinders), sumY: parseInt(d.AverageHighwayMPG), count: 1 };
    } else {
        averageData[key].sumY += parseInt(d.AverageHighwayMPG);
        averageData[key].count++;
    }
    });

    Object.keys(averageData).forEach(function(key) {
    averageData[key].averageY = averageData[key].sumY / averageData[key].count;
    });

    var averagedData = Object.values(averageData);
    // console.log(averageData)

    var x2 = d3.scaleBand().domain(averagedData.map(d => d.xValue)).range([0, 400]).padding(0.1);
    // var x2 = d3.scaleBand().domain([0,12]).range([0, 400]).padding(0.1);

    var y2 = d3.scaleLinear().domain([0, 150]).range([400, 0]);

    var svg = d3.select("#svg2");

    svg.append("text")
    .attr("transform","translate(100,0)")
    .attr("x", 25)
    .attr("y",50)
    .attr("font-size", "24 px")
    .text("Average Highway MPG vs. Number of Engines in Vehicle");

    svg.append("text")
    .attr ("transform","translate(100,0)")
    .attr("x", 140)
    .attr("y", 500)
    .attr("font-size", "24 px")
    .text("Number of Engines")

    svg.append("text")
    .attr("transform", "translate(100,0)")
    .attr("x", 0) // Adjust the x position to move the text closer to the y-axis
    .attr("y", 200)
    .attr("font-size", "24 px") // Removed the space between "24" and "px"
    .attr("text-anchor", "end") // Set the text-anchor to 'end'
    .text("Avg MPG Highway");



    svg.append("g")
    .attr("transform", "translate(" + 110 + "," + 50 + ")")
    .selectAll("rect")
    .data(averagedData)
    .enter()
    .append("rect")
    .on('mouseover', onMouseOver2)
    .on('mouseout',onMouseOut2)
    .attr("x", function(d) { return x2(d.xValue); })
    .attr("y", function(d) { return y2(d.averageY); })
    .attr("width", x2.bandwidth())
    .attr("height", function(d) { return 400 - y2(d.averageY); })
    .style("fill", "steelblue");

    d3.select("#svg2").append("g")
    .attr("transform","translate("+110+","+50+")")
    .call(d3.axisLeft(y2));

    d3.select("#svg2").append("g")
    .attr("transform","translate("+110+","+(450)+")")
    .call(d3.axisBottom(x2));

    function onMouseOver2(d,i){
        d3.select(this).transition()
        .duration(10)
        .attr("opacity", 1)
        .style("fill", "navy")
        .attr("x", function(d) {return  x2(d.xValue); })
        .attr("y", function(d) { return y2(d.averageY); })

        var xPos2 = parseFloat(d3.select(this).attr('x'));
        var yPos2 = parseFloat(d3.select(this).attr('y'));
        d3.select("#tooltip")
        .style('left', xPos2+500 + 'px')
        .style('top', yPos2+ 'px')
        .select('#value4').text(i.averageY)
        d3.select('#tooltip').classed('hidden', false)

        // console.log(i)

    }

    function onMouseOut2(d,i){
         d3.select(this).transition()
        .duration(10)
        .attr("opacity", 1)
        .style("fill", "steelblue")
        .attr("x", function(d) {return x2(d.xValue); })
        .attr("y", function(d) { return y2(d.averageY); })
        d3.select('#tooltip').classed('hidden', true);


    }

}
    