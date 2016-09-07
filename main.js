

function initData(SNPs,clusters){


  console.log(clusters);
  generateGraphJSON(SNPs);

  function generateGraphJSON(SNPs){
    graph.nodes = data.nodes
    graph.links = JSON.parse(JSON.stringify(data.links.filter(function(dat){
      if(dat.value<SNPs){return dat;}
    })));
  }
  if (clusters!=0){
    console.log(graph.links)
    graph = reduceByCluster(graph.nodes,graph.links,clusters);
  }
  raw.nodes = JSON.parse(JSON.stringify(graph.nodes));
  raw.links = JSON.parse(JSON.stringify(graph.links));
  console.log(graph)
}





function initForce(){

  force = d3.layout.force()
    .size([w,h])
    .linkDistance(60)
    .charge(-300)
    .nodes(graph.nodes)
    .links(graph.links);

  force.linkDistance(function(link) {
    console.log(linkScale(link.value));
    return linkScale(link.value);
  });

  force.start();


  resize();

}



function drawGraph(){

  console.log("SNPs: " + SNPs)

  g.selectAll("*").remove();

  links = g.selectAll(".link")
    .data(graph.links).enter()
    .append("line")
    .attr("class","link")
    .style("stroke-width",nominal_stroke)
    .style("stroke", function(d) {
	    if (isNumber(d.score) && d.score>=0) return color(d.score);
	    else return default_link_color;
    })

  nodes = g.selectAll(".node")
    .data(graph.nodes).enter()
    .append("g")
    .attr("class","node")
    .call(force.drag)



  circle = nodes.append("path")
    .attr("d", d3.svg.symbol()
      .size(function(d) { return Math.PI*Math.pow(size(d.size)||nominal_base_node_size,2); })
      .type(function(d) { return d.type; })
    )
    .style("fill",function (d){
      if (isNumber(d.group) && d.group>=0) return color(d.group);
      else return default_node_color;
    })
    .style("stroke-width", nominal_stroke)
    .style("stroke", function(d){

      if (isNumber(d.hiv) && d.hiv>0) return ("red")
      else return "white"
    })



// Highlights the nodes when the  hovers over

  nodes.on("mouseover", function(d) {

    highlightNode(d);
    div.transition()
      .duration(200)
      .style("opacity", .9);
    div.html("ID: " +d.id)
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px");
  })
  .on("mouseout", function(d) {
    exitHighlight(d);
    div.transition()
      .duration(500)
      .style("opacity", 0);
  })
  // important to make the nodes draggble
  .on("mousedown", function(d) {
    d3.event.stopPropagation()
    var htmltext = "Sample: " + d.id;
    document.getElementById("node").innerHTML = htmltext;
    var x = findEdges(d.id,raw.nodes,raw.links)
//    for (i in x){
//      htmltext = htmltext + "<br>" + nodeByIdx(x[i].source,raw.nodes) + "\t|\t" + nodeByIdx(x[i].target,raw.nodes) + "\t|\t" + x[i].value;
//    }
//     document.getElementById("spar").innerHTML = htmltext;
    tableCreate(x)
//    console.log(x);
  });

  links.on("mouseover",function(d) {
    div.transition()
      .duration(200)
      .style("opacity", .9);
    div.html("value: " +d.value)
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px");
  })
  .on("mouseout", function(d) {
    div.transition()
      .duration(500)
      .style("opacity", 0);
  });


// This makes the viz resize when the window size changes - calls to function resize
  d3.select(window).on("resize", resize);

// This actually starts the force simulation and tracks the coordinate changes
    console.log("Running Simulation")
  force.on("tick",function(){

    nodes
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    links
      .attr("x1",function(d){return d.source.x})
      .attr("x2",function(d){return d.target.x})
      .attr("y1",function(d){return d.source.y})
      .attr("y2",function(d){return d.target.y});

    nodes
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
  });
//  force.start();

}


function initMap(){
map = L.map('map').setView([0, 0], 2);
L.tileLayer("http://{s}.sm.mapstack.stamen.com/(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/{z}/{x}/{y}.png").addTo(map);

  /* Initialize the SVG layer */
map._initPathRoot()

  /* We simply pick up the SVG from the map object */
  mapsvg = d3.select("#map").select("svg"),
  mapg = mapsvg.append("g");

  /* Add a LatLng object to each item in the dataset */
  data.nodes.forEach(function(d) {
    d.LatLng = new L.LatLng(d.coordinates[0],	d.coordinates[1])
  });
}


function drawMap(){


    mapg.selectAll("*").remove();

    var mapcircles = mapg.selectAll("circle")
      .data(graph.nodes)
      .enter().append("circle")
      .style("stroke", "black")
      .style("opacity", .6)
      .style("fill", "red")
      .attr("r", 20);


    var maplinks = mapg.selectAll(".link")
      .data(graph.links)
      .enter().append("line")
      .attr("class","link")
      .style("stroke-width",1)
      .style("stroke","red")
      .style("opacity", .6);


    map.on("viewreset", update);
    update();

    function update() {
      console.log("readed point 1")
      mapcircles.attr("transform",
      function(d) {
        console.log(d)
        return "translate("+
          map.latLngToLayerPoint(d.LatLng).x +","+
          map.latLngToLayerPoint(d.LatLng).y +")";
        }
      )

      maplinks
        .attr("x1",function(d){return map.latLngToLayerPoint(d.source.LatLng).x})
        .attr("x2",function(d){return map.latLngToLayerPoint(d.target.LatLng).x})
        .attr("y1",function(d){return map.latLngToLayerPoint(d.source.LatLng).y})
        .attr("y2",function(d){return map.latLngToLayerPoint(d.target.LatLng).y});

    }




}
