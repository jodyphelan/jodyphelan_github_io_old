
d3.select("#nValue").on("input", function() {
  SNPs = this.value;
  initData(SNPs,Clusters);
  initForce();
  initHist();
  drawMap();
  drawGraph();
  if(bins.map(function(d){return d.num}).reduce(function(a,b){return a+b})<=10 && bins.map(function(d){return d.num}).reduce(function(a,b){return a+b})>0){$("#colourNodeBtn").prop("disabled",false)} else {$("#colourNodeBtn").prop("disabled",true)}

});

d3.select("#cValue").on("input", function(){
  Clusters = this.value;
  initData(SNPs,Clusters);
  initForce();
  initHist();
  drawMap();
  drawGraph();
  console.log(bins.map(function(d){return d.num}).reduce(function(a,b){return a+b}))
 if(bins.map(function(d){return d.num}).reduce(function(a,b){return a+b})<=10 && bins.map(function(d){return d.num}).reduce(function(a,b){return a+b})>0){$("#colourNodeBtn").prop("disabled",false)} else {$("#colourNodeBtn").prop("disabled",true)}
})

d3.select("#colourNodeBtn").on("click", function(){
  colourClusters(raw.nodes,raw.links)
});

d3.select("#nodeSearch").on("click", function(){
  var nodeName =$("#nodeName").val()
  console.log(nodeName)
  searchForNode(nodeName)
})


  svg = d3.select("#graph").append("svg").attr("id","graphSvg");
// Change the style of the cursor when over svg elements
  svg.style("cursor", "crosshair");
  g = svg.append("g");
  svg.call(zoom);





  initData(0,0);
  initForce();
  initMap();
  initHist();

  drawMap();
  drawGraph();
