function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function resize() {
	var width = $("#graph").width(), height = $("#graph").height();
	svg.attr("width", width).attr("height", height);
  //Changes the force layout too
	force.size([force.size()[0]+(width-w)/zoom.scale(),force.size()[1]+(height-h)/zoom.scale()]).resume();
	w = width;
 	h = height;
 }

 function highlightNode(d){

   circle.style("fill",function(o){
    if (d.id==o.id) {
      return "yellow";
    } else {
      return colorscale(o.value)
   }
  });
}

 function exitHighlight(d){
   circle.style("fill",function(o){
    return colorscale(o.value)
   });
 }



function reindexEdges(oldEdges,oldNodes,newNodes){
  var newNodeIDs = newNodes.map(function(d){return d.id});
  var oldNodeIDs = oldNodes.map(function(d){return d.id});
  var newEdges = [];

  oldEdges.forEach(function(d){
    var newEdge = JSON.parse(JSON.stringify(d))
    var sourceID = nodeByIdx(d.source,oldNodes);
    var targetID = nodeByIdx(d.target,oldNodes);

    var newSourceIdx = newNodeIDs.indexOf(sourceID)
    var newTargetIdx = newNodeIDs.indexOf(targetID)
    if (newSourceIdx + newTargetIdx === -2){
      return;
    } else if ((newSourceIdx === -1) && (newTargetIdx != -1)){
      newNodeIDs.push(sourceID)
      newSourceIdx = newNodeIDs.indexOf(sourceID)
      newEdge.target = newTargetIdx
      newEdge.source = newSourceIdx
    } else if ((newSourceIdx != -1) && (newTargetIdx === -1)){
      newNodeIDs.push(targetID)
      newTargetIdx = newNodeIDs.indexOf(targetID)
      newEdge.target = newTargetIdx
      newEdge.source = newSourceIdx
    } else {
      newEdge.target = newTargetIdx
      newEdge.source = newSourceIdx
    }
    newEdges.push(newEdge);

  })


  var newNodes = [];
  newNodeIDs.forEach(function(d){
    var idx = oldNodes.map(function(o){return o.id}).indexOf(d)
    newNodes.push(oldNodes[idx])
  })

  return {"nodes":newNodes,"links":newEdges};

}
