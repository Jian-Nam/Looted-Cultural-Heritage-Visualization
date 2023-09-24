//var css = document.getElementById("css");
(function() {
var width = window.innerWidth,
    height = window.innerHeight * 0.90;
    //padding = 1.5, // separation between same-color nodes
    //clusterPadding = 6, // separation between different-color nodes
    //maxRadius = 15;

//var n = 67, // total number of nodes
   // m = 3; // number of distinct clusters


   
var forceStrength = 0.03;

var svg = d3.select("#chart")
  .append("svg")
  .attr("height", height)
  .attr("width", width)
  .append("g")
  .attr("transform", "translate(0,0)")

var radiusScale = d3.scaleSqrt().domain([0.5, 400000]).range([1, 50])

var A = "AF"
var B = "AM"
var C = "AS"
var D = "OC"
var E = "EU"
var F = "BR"

function xPosition(K, a){
  return d3.forceX(function(d){
    if(d.Continent === K) {return (width * a)} 
    else{return (width * .50)}
  }).strength(forceStrength)
}

function yPosition(K, a, b){
  return d3.forceY(function(d){
    if(d.Continent === K) {return (height * a)} 
    else{return (height * .50)}
  }).strength(forceStrength)
}

function timeXcombine(Y){
  return(d3.forceX(function(d){
    if(d.Continent === A && d.acq_date > Y) {return (width * .40)}
    else if (d.Continent === B && d.acq_date > Y){return (width * .30)}
    else if (d.Continent === C && d.acq_date > Y){return (width * .70)}
    else if (d.Continent === D && d.acq_date > Y){return (width * .60)}
    else if (d.Continent === E && d.acq_date > Y){return (width * .50)}
    else{return (width * .50)}
  }).strength(forceStrength))
}

function timeYcombine(Y){
  return(d3.forceY(function(d){
    if(d.Continent === A && d.acq_date > Y) {return (width * .70)}
    else if (d.Continent === B && d.acq_date > Y){return (width * .50)}
    else if (d.Continent === C && d.acq_date > Y){return (width * .50)}
    else if (d.Continent === D && d.acq_date > Y){return (width * .70)}
    else if (d.Continent === E && d.acq_date > Y){return (width * .30)}
    else{return (width * .50)}
  }).strength(forceStrength))
}

//forceXsplit
var forceXSplit = d3.forceX(function(d){
    if(d.Continent === A) {return (width * .30)} 
    else if(d.Continent === B) {return (width * .30)}
    else if(d.Continent === C) {return (width * .70)}
    else if(d.Continent === D) {return (width * .60)}
    else if(d.Continent === E) {return (width * .50)}
  }).strength(forceStrength)

var EUforceXSplit = d3.forceX(function(d){
    if(d.Continent === E ||d.Continent === F) {return (width * .70)} 
    else{return (width * .50)}
  }).strength(forceStrength)

//forceYsplit
var forceYSplit = d3.forceY(function(d){
    if(d.Continent === A) {return (width * .30)} 
    else if(d.Continent === B) {return (width * .70)} 
    else if(d.Continent === C) {return (width * .30)} 
    else if(d.Continent === D) {return (width * .70)} 
    else if(d.Continent === E) {return (width * .50)} 
  }).strength(forceStrength)


var EUforceYSplit = d3.forceY(function(d){
    if(d.Continent === E||d.Continent === F) {return (width * .70)} 
    else{return (width * .50)}
  }).strength(forceStrength)


var BubbleTimeline = d3.forceX(function(d){
    if(d.acq_date > 0 && d.acq_date <= 1800) {return (width * .45)}
    else if (d.acq_date > 1800 && d.acq_date <= 1850){return (width * .50)}
    else if (d.acq_date > 1850 && d.acq_date <= 1900){return (width * .55)}
    else if (d.acq_date > 1900 && d.acq_date <= 1950){return (width* .60)}
    else if (d.acq_date > 1950 && d.acq_date <= 2000){return (width* .65)}
    else if (d.acq_date > 2000 && d.acq_date <= 2500){return (width* .70)}
    else{return (width * .90)}
  }).strength(forceStrength)




var forceXCombine = d3.forceX(width * .50).strength(forceStrength)
var forceYCombine = d3.forceY(height * .50).strength(forceStrength)



var forceCollide = d3.forceCollide(function(d){
    return 6
  })

var manyBody = d3.forceManyBody()
  .theta(1.4)
  .strength(-1.5)

var forceRadial = d3.forceRadial(function(d){ 
  return d.Continent=== F ? 0 : 1400; })
  .x(width*0.5)
  .y(height*0.5)
  .strength(0.03)



var simulation = d3.forceSimulation()
  .force("center", d3.forceCenter(width/2, height/2))
  .force("x", forceXCombine)
  .force("y", forceYCombine)
  .force('charge', manyBody)
  .force("collide", forceCollide)
  .alphaTarget(1.0)



var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "20")
    .style("visibility", "hidden")
    .style("color", "black")
    .style("padding", "8px")
    .style("background-color", "rgba(255, 255, 255, 0.75)")
    .style("border-radius", "6px")
    .style("font", "12px sans-serif")
    .text("click");  





d3.queue()
  .defer(d3.csv, "Final data.csv")
  .await(ready)

function ready (error, datapoints) {

  var node = svg.selectAll(".acq_date")
  .data(datapoints)
  .enter().append("circle")
  .attr("class", "acq_date")
  .attr("r", function(d){
    return radiusScale(d.Collections)
  })
  .style("fill", function(d) { 
    var returnColor;
    if (d.Continent === A) { returnColor = "#909090";
    } else if (d.Continent === B) {returnColor = "#FA8072";
    } else if (d.Continent === C) {returnColor = "#FFD700";
    } else if (d.Continent === D) {returnColor = "#3CB371";
    } else if (d.Continent === E || d.Continent === F) {returnColor = "#87CEFA";
    }return returnColor;
  })
  

  .on("mouseover", function(d) {
    tooltip.html(d.Continent + d.acq_date + "<br><br> Collections: " + d.Collections);
    tooltip.style("visibility", "visible");
    })
  .on("mousemove", function() {
    return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
    })
  .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

  
var AFdsd = svg.append('text')
    .attr('class','continentstitle')
    .attr('x',width * 0.01+15)
    .attr('y', height * 0.35-25
    )
    .attr('text-anchor', 'center')
    .text("Category")
    .attr('fill','#505050');


function createContinentButton(text, color, w, h, a, b, xp, yp){
  svg.append("rect")
      .attr("x", width * a)
      .attr("y", height * b)
      .attr("rx", 5)
      .attr("ry", 5)
      .style("fill", color)
      .attr("width", w)
      .attr("height", h)
    
  svg.append('text')
      .attr('class','button')
      .attr('x',width * a + 50)
      .attr('y', height * b + 14)
      .attr('text-anchor', 'middle')
      .text(text)
      .attr('fill','#000000');
    
  svg.append("rect")
      .attr("x", width * a)
      .attr("y", height * b)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("width", w)
      .attr("height", h)
      .attr("opacity",0)
      .on("click", function(){
        simulation.restart()
          .force("x", xp)
          .force("y", yp)
          .alphaTarget(1.0)             
          });
    }



//ContinentButton
var AFB = createContinentButton("AFRICA", "#909090", 100, 20, 0.01, 0.35, xPosition(A, .30), yPosition(A, .70))
createContinentButton("AMERICA", "#FA8072", 100, 20, 0.01, 0.40, xPosition(B, .70), yPosition(B, .30))
createContinentButton("ASIA", "#FFD700", 100, 20, 0.01, 0.45, xPosition(C, .30), yPosition(C, .30))
createContinentButton("OCEANIA", "#3CB371", 100, 20, 0.01, 0.50, xPosition(D, .70), yPosition(D, .70))
createContinentButton("EUROPE", "#87CEFA", 100, 20, 0.01, 0.55, EUforceXSplit, EUforceYSplit)
createContinentButton("ALL", "lightgray", 100, 20, 0.01, 0.60, forceXCombine, forceYCombine)


var ENb = svg.append("rect")
            .attr("x", width * 0.01)
            .attr("y", height * 0.65)
            .attr("rx", 5)
            .attr("ry", 5)
            .style("fill", "#ffffff")
            .attr("width", 100)
            .attr("height", 20)


var ENt = svg.append('text')
    .attr('class','button')
    .attr('x',width * 0.01+14)
    .attr('y', height * 0.65 + 14)
    .attr('text-anchor', 'center')
    .text("ENGLAND")
    .attr('fill','#000000');


var ENn = svg.append("rect")
            .attr("x", width * 0.01)
            .attr("y", height * 0.65)
            .attr("rx", 5)
            .attr("ry", 5)
            .style("fill", "#ffffff")
            .attr("width", 100)
            .attr("height", 20)
            .attr("opacity",0)
            .on("click", function(){
              simulation.restart()
                .force("r", forceRadial)
                .alphaTarget(1.0)
                .velocityDecay(0.7)
      });
 



//timeline
//타임라인 선
  var linetime = svg.append("rect")
            .attr("x", width*0.11)
            .attr("y", height*0.91)
            .attr("rx", 0)
            .attr("ry", 0).style("display","none")
            .style("fill", "#808080")
            .attr("width", width*0.78)
            .attr("height", 2)


 var button1720 = svg.append("rect")
            .attr("x", width*0.11)
            .attr("y", height*0.90)
            .attr("rx", 10)
            .attr("ry", 10)
            .style("fill", "#FFFFFF")
            .attr("width", 20)
            .attr("height", 20).style("display","none")
            .on("click", function(){
              simulation.restart()
                .force("x", timeXcombine(1720))
                .force("y", timeYcombine(1720))
                .alphaTarget(0.5)
      });  


 var button1800 = svg.append("rect")
            .attr("x",  width*0.24)
            .attr("y", height*0.90)
            .attr("rx", 10)
            .attr("ry", 10)
            .style("fill", "#FFFFFF")
            .attr("width", 20)
            .attr("height", 20).style("display","none")
            .on("click", function(){
              simulation.restart()
                .force("x", timeXcombine(1800))
                .force("y", timeYcombine(1800))
                .alphaTarget(0.5)
      });  

var button1850 = svg.append("rect")
            .attr("x",  width*0.37)
            .attr("y", height*0.90)
            .attr("rx", 10)
            .attr("ry", 10)
            .style("fill", "#FFFFFF")
            .attr("width", 20)
            .attr("height", 20).style("display","none")
            .on("click", function(){
              simulation.restart()
                .force("x", timeXcombine(1850))
                .force("y", timeYcombine(1850))
                .alphaTarget(0.5)
      });  

var button1900 = svg.append("rect")
            .attr("x", width*0.50)
            .attr("y", height*0.90)
            .attr("rx", 10)
            .attr("ry", 10)
            .style("fill", "#FFFFFF")
            .attr("width", 20)
            .attr("height", 20).style("display","none")
            .on("click", function(){
              simulation.restart()
                .force("x", timeXcombine(1900))
                .force("y", timeYcombine(1900))
                .alphaTarget(0.5)
      });               

var button1950 = svg.append("rect")
            .attr("x", width*0.63)
            .attr("y", height*0.90)
            .attr("rx", 10)
            .attr("ry", 10)
            .style("fill", "#FFFFFF")
            .attr("width", 20)
            .attr("height", 20).style("display","none")
            .on("click", function(){
              simulation.restart()
                .force("x", timeXcombine(1950))
                .force("y", timeYcombine(1950))
                .alphaTarget(0.5)
      });          

var button2000 = svg.append("rect")
            .attr("x", width*0.76)
            .attr("y", height*0.90)
            .attr("rx", 10)
            .attr("ry", 10)
            .style("fill", "#FFFFFF")
            .attr("width", 20)
            .attr("height", 20).style("display","none")
            .on("click", function(){
              simulation.restart()
                .force("x", timeXcombine(2000))
                .force("y", timeYcombine(2000))
                .alphaTarget(0.5)
      });

 var button2100 = svg.append("rect")
            .attr("x", width*0.89)
            .attr("y", height*0.90)
            .attr("rx", 10)
            .attr("ry", 10)
            .style("fill", "#FFFFFF")
            .attr("width", 20)
            .attr("height", 20).style("display","none")
            .on("click", function(){
              simulation.restart()
                .force("x", forceXCombine)
                .force("y", forceYCombine)
                .alphaTarget(0.5)
      });                   
   
  var timesplit = svg.append("rect")
            .attr("x", width*0.4 )
            .attr("y", height*0.1+7)
            .attr("rx", 10)
            .attr("ry", 10)
            .style("fill", "#FFFFFF")
            .attr("width", 20)
            .attr("height", 20).style("display","none")
            .on("click", function(){
              simulation.restart()
                .force("x", BubbleTimeline)
                .force("y", forceYCombine)
                .alphaTarget(0.7)
      });  

//타임라인 텍스트
var text1720 = svg.append('text')
    .attr('class','total')
    .attr('x',width*0.15)
    .attr('y', height*0.95)
    .attr('text-anchor', 'center')
    .text("~1800s")
    .attr('fill','#f0f0f0').style("display","none");

var text1800 =svg.append('text')
    .attr('class','total')
    .attr('x',width*0.265)
    .attr('y', height*0.95)
    .attr('text-anchor', 'center')
    .text("1800~1850")
    .attr('fill','#f0f0f0').style("display","none");


var text1850 =svg.append('text')
    .attr('class','total')
    .attr('x',width*0.395)
    .attr('y', height*0.95)
    .attr('text-anchor', 'center')
    .text("1850~1900")
    .attr('fill','#f0f0f0').style("display","none");


var text1900 =svg.append('text')
    .attr('class','total')
    .attr('x',width*0.525)
    .attr('y', height*0.95)
    .attr('text-anchor', 'center')
    .text("1900~1950")
    .attr('fill','#f0f0f0').style("display","none");


var text1950 = svg.append('text')   
    .attr('class','total')
    .attr('x',width*0.655)
    .attr('y', height*0.95)
    .attr('text-anchor', 'center')
    .text("1950~2000")
    .attr('fill','#f0f0f0').style("display","none");

var text2000 =svg.append('text')
    .attr('class','total')
    .attr('x',width*0.8)
    .attr('y', height*0.95)
    .attr('text-anchor', 'center')
    .text("2000s~")
    .attr('fill','#f0f0f0')
    .style("display","none");


var timeline = false



var toggleb = svg.append("rect")
            .attr("x", width*0.01)
            .attr("y", height*0.1)
            .attr("rx", 10)
            .attr("ry", 10)
            .style("fill", "white")
            .attr("width", 120)
            .attr("height", 30)
            ; 

var texttoggleT =svg.append('text')
    .attr('class','texttoggle')
    .attr('x',width*0.2+24)
    .attr('y', height*0.1+22)
    .attr('text-anchor', 'center')
    .text("Timeline")
    .attr('fill','#707070');

var texttoggleC =svg.append('text')
    .attr('class','texttoggle')
    .attr('x',width*0.01+12)
    .attr('y', height*0.1+22)
    .attr('text-anchor', 'center')
    .text("Continents")
    .attr('fill','black');

var toggle = svg.append("rect")
            .attr("x", width*0.2)
            .attr("y", height*0.1)
            .attr("rx", 0)
            .attr("ry", 0)
            .style("fill", "white")
            .attr("width", 120)
            .attr("height", 30)
            .attr("opacity", 0)
            .on("click", function(d){
            if(timeline ===true){
              toggle.transition().style("fill", "white")
              .attr("x", width*0.2)
              toggleb.transition().style("fill", "white")
              .attr("x", width*0.01)
              button1720.style("display","none")
              button1800.style("display","none")
              button1850.style("display","none")
              button1900.style("display","none")
              button1950.style("display","none")
              button2000.style("display","none")
              button2100.style("display","none")
              text1720.style("display","none")
              text1800.style("display","none")
              text1850.style("display","none")
              text1900.style("display","none")
              text1950.style("display","none")
              text2000.style("display","none")
              linetime.style("display","none")
              timesplit.style("display","none")
              AFB.style("display","block")
              AMb.style("display","block")
              ASb.style("display","block")
              OCb.style("display","block")
              EUb.style("display","block")
              ALb.style("display","block")
              ENb.style("display","block")
              AFt.style("display","block")
              AMt.style("display","block")
              ASt.style("display","block")
              OCt.style("display","block")
              EUt.style("display","block")
              ALt.style("display","block")
              ENt.style("display","block")
              AFn.style("display","block")
              AMn.style("display","block")
              ASn.style("display","block")
              OCn.style("display","block")
              EUn.style("display","block")
              ALn.style("display","block")
              ENn.style("display","block")
              texttoggleC.transition().attr("fill", "black")
              texttoggleT.transition().attr("fill", '#707070')
              timeline=false
            }else{
              toggle.transition().style("fill", "white")
              .attr("x", width*0.01)
              toggleb.transition().style("fill", "white")
              .attr("x", width*0.2)
              button1720.style("display","block")
              button1800.style("display","block")
              button1850.style("display","block")
              button1900.style("display","block")
              button1950.style("display","block")
              button2000.style("display","block")
              button2100.style("display","block")
              text1720.style("display","block")
              text1800.style("display","block")
              text1850.style("display","block")
              text1900.style("display","block")
              text1950.style("display","block")
              text2000.style("display","block")
              linetime.style("display","block")
              timesplit.style("display","block")
              AFB.style("display","none")
              AMb.style("display","none")
              ASb.style("display","none")
              OCb.style("display","none")
              EUb.style("display","none")
              ALb.style("display","none")
              ENb.style("display","none")
              AFt.style("display","none")
              AMt.style("display","none")
              ASt.style("display","none")
              OCt.style("display","none")
              EUt.style("display","none")
              ALt.style("display","none")
              ENt.style("display","none")
              AFn.style("display","none")
              AMn.style("display","none")
              ASn.style("display","none")
              OCn.style("display","none")
              EUn.style("display","none")
              ALn.style("display","none")
              ENn.style("display","none")
              texttoggleC.transition().attr("fill", '#707070')
              texttoggleT.transition().attr("fill", "black")
              timeline=true
            }
              /*if(atRight === true)*/
              
                /*setAtRight(atRight)*/
              
      }); 


var HoverT = svg.append('text')
    .attr('class','hover')
    .attr('x',width*0.28)
    .attr('y', height*0.85)
    .attr('text-anchor', 'center')
    .text("*Hover your mouse over the dots to view the number of collections from each year")
    .attr('fill','#f0f0f0')
    .style("display","block");

   
  simulation.nodes(datapoints)
    .on('tick', ticked)


  function ticked() {
    node
      .attr("cx", function(d) {
        return d.x
      })
      .attr("cy", function(d) {
        return d.y
      })
  } 
}   


})();
