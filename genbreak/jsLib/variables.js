var selected_attrib = "nothing"
var mapDrawSelected=false;
var jitterCoordsSwitch = false;
var snpCutoff = 0;
var clusterCutoff = 1;
var defaultNodeCol = "white"
var highlightCol = "yellow";
var temp_col
var selectedDate;
var height = window.innerHeight;
var graphWidth =  $("#graphDiv").width();
var graphSvg = d3.select("#graphDiv").append("svg").attr("height",height).attr("width",graphWidth).attr("class","graphSvg");
