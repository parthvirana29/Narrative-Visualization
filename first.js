

async function init(){
    console.log("hello only!")
    console.log(d3)

    //put # in front if we are using id instead of the tag name
    //.myclass anything with dot in front indicates its a style variable 
    // d3.selectAll(".myclass").style("color","aquamarine") //allows getting tags from html files
    const data = await d3.csv("https://parthvirana29.io/Heart-Attack.csv")
    d3.select('body')
    .selectAll('p')
    .data(data)
    .enter()
    .append('p')
    .html(function(d,i){ return 'item' + d.item});
       
        // function(d){
        //     for (let index = 0; index < d.length(); index++){
        //         const element = d[index]
        //         console.log(element)
        //         // console.log(element.rank);
    
        //     }
        }
  

    
    

    // var data = 
    // d3.select("div").insert("p")
    //     .text("HERE IS MY NEW PARA!!")
    // console.log("Hello!")
