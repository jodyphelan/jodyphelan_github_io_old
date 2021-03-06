function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function resize() {
	var width = $("#graph").width(), height = window.innerHeight;
	svg.attr("width", width).attr("height", height);
  //Changes the force layout too
	force.size([force.size()[0]+(width-w)/zoom.scale(),force.size()[1]+(height-h)/zoom.scale()]).resume();
	w = width;
 	h = height;
 }

 function highlightNode(d){

   circle.style("fill",function(o){
     if (d.id==o.id) return "yellow"
     else return o.col;
   });
 }

 function exitHighlight(d){
   circle.style("fill",function(o){
     return o.col;
   });
 }
