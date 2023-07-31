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
    // .on('mouseout', reorderItems)
    // .on('mouseover', function(d,i){
    //     d3.select(this).transition()
    //     .duration('50')
    //     .attr('opacity','.5');

    // })
    .attr("cx", function(d){return x(d.AverageCityMPG);})
    // .attr("cy", function(d){return y(d.AverageHighwayMPG);})
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

        //update the tooltip position and value
        // d3.select("#tooltip")
        //     .style('left', xPos + 'px')
        //     .style('top', yPos + 'px')
        //     .select('value').text(i)
        
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

async function another(){
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
    console.log(cylinder)

    var mpg = [average_mpg_diesel, average_mpg_electric, average_mpg_gas];
    console.log(mpg)

    var color = ["lightskyblue", "navy", "darkorange"];
    // var cs = d3.scaleLog().domain(cdomain).range(crange);



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

    function onMouseOver(d, i) {
        d3.select(this).transition()
    

            .duration('10')
            .attr('opacity', '.5')
            
            console.log("x: " + d.screenX)
            console.log("y: " +  d.screenY)
            console.log("xPOs: " + xPos)
            var xPos = d.screenX;
            var yPos = d.screenY;
            var txt = ""

            // if (xPos <= 268 && xPos >= 64 && yPos >= ){
            //     "Diesel: " + average_mpg_diesel;
            // }
            console.log(i)
            if (i.index == 0){
                txt = "Electric Car: "+ average_mpg_electric
            }
            else if (i.index == 1){
                txt = "Diesel Car: "+ average_mpg_diesel
            } else {
                txt = "Gasoline Car: " + average_cylinder_gas
            }
            // if (yPos)
            // // parseFloat(d3.select(this).attr('x'));
            // var yPos = parseFloat(d3.select(this).attr('d'));


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

    var x2 = d3.scaleBand().domain([0, 1, 2, 3]).range([0,100]);
    var y2 = d3.scaleLinear().domain([0, 150]).range([100,0]);
    var data_2 = [average_cylinder_diesel, average_cylinder_electric, average_cylinder_gas];
    d3.select("#second")
    .append("g")
    .attr("transform", "translate(" + 500 + "," + 500 + ")")
    .selectAll("rect").data(data_).enter().range([0,100])
    .attr("x", function(d,i) {return x(i);})
    .attr("y", function(d,i){return y(d);})
    .attr("width", x.bandwidth())
    .attr("height", function(d,i){return 100-y(d);});



    d3.select("svg").append("g")
    .attr("transform","translate("+50+","+50+")")
    .call(d3.axisLeft(y));

    d3.select("svg").append("g")
    .attr("transform","translate("+50+","+(250)+")")
    .call(d3.axisBottom(x));

//     var myCircle = d3.select("#dataviz_brushing")
//   .append("svg")
//   .append("circle")
//     .attr("cx", 200)
//     .attr("cy", 200)
//     .attr("r", 40)
//     .attr("fill", "#69a3b2")

            const brush = d3.brushX()
            .extent([[0, 0], [width, height]])
            .on("brush", brushed);

        // Append brush group
        const brushGroup = chart.append("g")
            .attr("class", "brush")
            .call(brush);

        // Brush event handler
        function brushed(event) {
            if (event.selection) {
                // Get the brushed extent
                const brushedExtent = event.selection.map(xScale.invert);

                // Update the chart based on the brushed extent
                circles.attr("opacity", d => (d.x >= brushedExtent[0] && d.x <= brushedExtent[1]) ? 1 : 0.2);
            }
        }


// Add brushing
// d3.select("#dataviz_brushing")
//       .call( d3.brush()                     // Add the brush feature using the d3.brush function
//         .extent( [ [0,0], [400,400] ] )       // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
//       )
   



    
//     var x = d3.scaleBand().domain([0,1,2,3,4,5]).range([0,200]);
// var y = d3.scaleLinear().domain([0,42]).range([200,0]);
// d3.select("svg")
// .append("g")
// .attr("transform", "translate("+50+","+50+")")
// .selectAll("rect").data(data).enter().append("rect")
// .attr("x", function(d,i){return x(i);})
// .attr("y", function(d,i){return y(d);})
// .attr("width", x.bandwidth())
// .attr("height", function(d,i){return 200-y(d);});


}


