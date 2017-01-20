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
  div_name = div_name.substr(1)
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





function graph2clusters(nodes,edges){
  clusters = []
  node_ids = {}
  for (j in edges){
    e = edges[j]
    node_ids[e.source.id] = 1
    node_ids[e.target.id] = 1
    test = 0
    for (i in clusters){
      if (isInArray(e.source.id,clusters[i]) || isInArray(e.target.id,clusters[i])){
        if (!isInArray(e.source.id,clusters[i])){
          clusters[i].push(e.source.id)
        }
        if (!isInArray(e.source.id,clusters[i])){
          clusters[i].push(e.target.id)
        }
        test=1
        break
      }
    }
    if (test==0){

      clusters.push([e.source.id,e.target.id])
    }
  }
  node_ids = uniq(Object.keys(node_ids))
  nodes.forEach(function(d){
    if (!isInArray(d.id,node_ids)){
      clusters.push([d.id])
    }
  })
  return clusters
}


function counter(arr){
  obj = {}
  set = []
  arr.forEach(function(d){
    if (!isInArray(d,set)){
      obj[d] = 1
      set.push(d)
    } else{
      obj[d]+=1
    }
  })
  return obj
}


function clusterCount2hist(clusters,div,height,width){

  d3.select(div).selectAll("*").remove()

  max_cluster_size = +d3.max(Object.keys(clusters))
  min_cluster_size = +d3.min(Object.keys(clusters))
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = width - margin.left - margin.right,
      height = height - margin.top - margin.bottom;
    // set the ranges
    console.log(width , height)
  var x = d3.scaleLinear().range([0, width]).domain([min_cluster_size,max_cluster_size+1])
  var y = d3.scaleLinear().range([height, 0]).domain([0,d3.max(Object.values(clusters))]);

  var svg = d3.select(div).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");



  bars = []
  for (i in clusters){
    bars.push({"x":i,"y":clusters[i]})
  }

  svg.selectAll(".bar")
        .data(bars)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.x); })
        .attr("width", max_cluster_size==min_cluster_size ? width/2 : width*(1/(max_cluster_size+1-min_cluster_size)))
        .attr("y", function(d) { return y(d.y); })
        .attr("height", function(d) { return height - y(d.y); });

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  svg.append("g")
    .call(d3.axisLeft(y));
}


function subsetData(data,selectedDate,clusterCutoff,snpCutoff){
  temp_nodes = data.nodes.filter(function(d){return d.date<=selectedDate})
  temp_node_ids = temp_nodes.map(function(d){return d.id})
  temp_edges = data.edges[snpCutoff].filter(function(d){return isInArray(d.source.id,temp_node_ids) && isInArray(d.target.id,temp_node_ids)})

  if (clusterCutoff>1){
    temp_nodes=[]
    temp_node_ids=[]

    clusters = graph2clusters({"nodes":temp_nodes,"edges":temp_edges})
    clusters = clusters.filter(function(d){return d.length>=clusterCutoff})
      temp_node_ids = []
      temp_nodes = []
    for (i in clusters){
      for (j in clusters[i]){
        temp_node_ids.push(clusters[i][j])
        temp_nodes.push(data.nodes[all_node_idx[clusters[i][j]]])
      }
    }
    temp_edges = temp_edges.filter(function(d){
      return isInArray(d.source.id,temp_node_ids) && isInArray(d.target.id,temp_node_ids)
    })
  }
  newData = {"nodes":temp_nodes,"edges":temp_edges}
  return newData

}
