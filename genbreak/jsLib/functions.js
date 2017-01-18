function uniq(arr){
  var obj = {}
  arr.forEach(function(d){
    obj[d] = 1
  })
  return Object.keys(obj)
}

function str2obj(str){
  str = str.replace(/translate\(/, "");
  str = str.replace(/\) scale\(/,",");
  str = str.replace(/\)/,"");
  var tempArr = str.split(",");
  return {"k":parseFloat(tempArr[2]),"x":parseFloat(tempArr[0]),"y":parseFloat(tempArr[1])}
}

function obj2str(obj){
  var tempStr = "translate(" + obj.x + "," + obj.y + ") scale(" + obj.k + ")"
  return tempStr
}

function generate_legend(colour_obj,attr){
  htmlString = "<hr><strong>Legend:</strong><br>"
  Object.keys(colour_obj[attr]).sort().forEach(function(d){
    htmlString += "<svg width=\"10\" height=\"10\"><rect width=\"10\" height=\"10\" style=\"fill:"+colour_obj[attr][d]+"\"/></svg> "+d+"<br>"
  })
  return htmlString
}

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

function findEdges(node,edges){

  var results = edges.filter(function(d){
    if((d.source.id==node) || (d.target.id==node)){
      return d;
    }
  })
  return results;
}

function edges2full(tempEdges){
    var tempArr = []
    var tempNewData = {nodes: [], edges: tempEdges};
    tempEdges.forEach(function(d){
      if (!isInArray(d.source.id,tempArr)){tempArr.push(d.source.id);tempNewData.nodes.push(d.source);}
      if (!isInArray(d.target.id,tempArr)){tempArr.push(d.target.id);tempNewData.nodes.push(d.target);}

    })
    return tempNewData;
}

function tableCreate(div_name,node_name,tempData) {
  edges = findEdges(node_name,tempData.edges)
  document.getElementById(div_name).innerHTML = "";
  var sampleTable = document.getElementById(div_name);

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

  if (edges){
    for (i in edges) {
        var tr = document.createElement('tr');
        for (var j = 0; j < 3; j++) {
            var td = document.createElement('td');
            if (j==0){
              td.appendChild(document.createTextNode(edges[i].source.id))
            } else if (j==1) {
              td.appendChild(document.createTextNode(edges[i].target.id))
            } else if (j==2) {
              td.appendChild(document.createTextNode(edges[i].dist))
            }
            tr.appendChild(td)
        }

        tbdy.appendChild(tr);
    }
  }
  tbl.appendChild(tbdy);
  sampleTable.appendChild(tbl);
}
