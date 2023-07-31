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

            console.log(i)
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

            



}