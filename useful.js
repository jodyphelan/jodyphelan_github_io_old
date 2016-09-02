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










function tableCreate(edges) {
    document.getElementById("spar").innerHTML = "";
    var spar = document.getElementById('spar');
    var tbl = document.createElement('table');
    tbl.style.width = '100%';
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
