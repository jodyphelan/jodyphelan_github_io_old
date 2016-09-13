function findEdges(node,nodes,links){
  var idx;
  for (i in nodes){
    if (nodes[i].id==node){
      idx = i;
      break;
    }
  }
  yyy = links
  var results = links.filter(function(d){
    if((d.source==idx) || (d.target==idx)){
      return d;
    }
  })
//  console.log(results)
  return results;
}


function nodeByIdx(i,nodes){
    return nodes[i].id;
}


function searchForNode(node){
  if(isInArray(node,graph.nodes.map(function(d){return d.id}))===false){alert("ID not found");return;}
  var htmltext = "Sample: " + node;
  document.getElementById("node").innerHTML = htmltext;

  var cx;
  var cy;
  graph.nodes.forEach(function(d){
    if (d.id===node){
      cx = d.x;
      cy = d.y;
    }
  });
  var svgXmid = ($("#graphSvg").width())/2;
  var svgYmid = ($("#graphSvg").height())/2;
  var tx = svgXmid-cx;
  var ty = svgYmid-cy;

  force.stop();

  graph.nodes.forEach(function(d){
    var dtx = d.x+tx,
        dty = d.y+ty
    d.x = dtx;
    d.px = dtx;
    d.y = dty;
    d.py = dty;
  })

  nodes
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  links
    .attr("x1",function(d){return d.source.x})
    .attr("x2",function(d){return d.target.x})
    .attr("y1",function(d){return d.source.y})
    .attr("y2",function(d){return d.target.y});

  var xxx = graph.nodes.filter(function(d){return d.id===node})[0]
  highlightNode(xxx)

}


function mapCoords(){
  maxLat = d3.max(raw.nodes.map(function(d){return d.coordinates[0]}));
  minLat = d3.min(raw.nodes.map(function(d){return d.coordinates[0]}));
  maxLng = d3.max(raw.nodes.map(function(d){return d.coordinates[1]}));
  minLng = d3.min(raw.nodes.map(function(d){return d.coordinates[1]}));
  avgLat = (maxLat+minLat)/2;
  avgLng = (maxLng+minLng)/2;
  return [avgLat,avgLng];
}

function mapZoom(){
  maxLat = d3.max(raw.nodes.map(function(d){return d.coordinates[0]}));
  minLat = d3.min(raw.nodes.map(function(d){return d.coordinates[0]}));
  maxLng = d3.max(raw.nodes.map(function(d){return d.coordinates[1]}));
  minLng = d3.min(raw.nodes.map(function(d){return d.coordinates[1]}));
  diffLat = Math.abs(maxLat-minLat);
  diffLng = Math.abs(maxLng-minLng);
  maxDiff = d3.max([diffLat,diffLng]);
  console.log("MaxDiff: " + maxDiff)
  mapScale = d3.scale.linear().range([5,1]).domain([2,150]);
  return Math.ceil(mapScale(maxDiff));
}


function tableCreate(edges) {
    document.getElementById("spar").innerHTML = "";
    var spar = document.getElementById('spar');
    var tbl = document.createElement('table');
    tbl.style.width = '100%';
    tbl.style["margin-left"] = '0px';
    tbl.setAttribute('border', '1');
    var tbdy = document.createElement('tbody');
    var tr = document.createElement('tr');
    var th = document.createElement('th');
    th.appendChild(document.createTextNode("Source"));
    tr.appendChild(th);
    th = document.createElement('th');
    th.appendChild(document.createTextNode("Target"));
    tr.appendChild(th);
    th = document.createElement('th');
    th.appendChild(document.createTextNode("SNPs"));
    tr.appendChild(th);

    tbdy.appendChild(tr);
    for (i in edges) {
        var tr = document.createElement('tr');
        for (var j = 0; j < 3; j++) {
            var td = document.createElement('td');
            if (j==0){
              td.appendChild(document.createTextNode(nodeByIdx(edges[i].source,raw.nodes)))
            } else if (j==1) {
              td.appendChild(document.createTextNode(nodeByIdx(edges[i].target,raw.nodes)))
            } else if (j==2) {
              td.appendChild(document.createTextNode(edges[i].value))
            }
            tr.appendChild(td)
        }

        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    spar.appendChild(tbl)
}
