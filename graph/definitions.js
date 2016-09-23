var SNPs = 0;
var Clusters = 0;

var graph = {};
var raw = {};

var w = window.innerWidth;
var h = window.innerHeight;

var default_node_color = "#ccc";
//var default_node_color = "rgb(3,190,100)";
var default_link_color = "#888";


var nominal_base_node_size = 8;
var nominal_text_size = 10;
var max_text_size = 24;
var nominal_stroke = 1.5;
var max_stroke = 4.5;
var max_base_node_size = 36;
var min_zoom = 0.1;
var max_zoom = 7;
var zoom = d3.behavior.zoom().scaleExtent([min_zoom,max_zoom])

var text_center = false;
var outline = false;

var focus_node = null, highlight_node = null;

var color = d3.scale.category10();

var linkScale = d3.scale.linear()
  .domain([Math.min.apply(Math,data.links.map(function(d){return Number(d.value)})),Math.max.apply(Math,data.links.map(function(d){return Number(d.value)}))])
  .range([0.1,100])

var size = d3.scale.pow().exponent(1)
  .domain([1,100])
  .range([8,24]);

zoom.on("zoom", function() {
  var stroke = nominal_stroke;
  if (nominal_stroke*zoom.scale()>max_stroke) stroke = max_stroke/zoom.scale();
  links.style("stroke-width",stroke);
  circle.style("stroke-width",stroke);

  var base_radius = nominal_base_node_size;
  if (nominal_base_node_size*zoom.scale()>max_base_node_size) base_radius = max_base_node_size/zoom.scale();
  circle.attr("d", d3.svg.symbol()
    .size(function(d) { return Math.PI*Math.pow(size(d.size)*base_radius/nominal_base_node_size||base_radius,2); })
    .type(function(d) { return d.type; }))

  //circle.attr("r", function(d) { return (size(d.size)*base_radius/nominal_base_node_size||base_radius); })
//  	if (!text_center) text.attr("dx", function(d) { return (size(d.size)*base_radius/nominal_base_node_size||base_radius); });

  var text_size = nominal_text_size;
  if (nominal_text_size*zoom.scale()>max_text_size) text_size = max_text_size/zoom.scale();
//    text.style("font-size",text_size + "px");

  g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
});


var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
