
function reduceByCluster(datNodes,datLinks,cutoff){

  //console.log("Cutoff = " + cutoff)
  //console.log(datLinks);
  var hash = [];
  datLinks.forEach(function(d) {
    hash[hash.length] = d.source + "," + d.target;

  });

//console.log(hash);

  while (testHash(hash)==false){
    hash = reduceHash(hash);
  }

  console.log(hash)

  var oldSamples = [];
  var newSamples = [];

  for (i in datNodes){
    oldSamples[i] = datNodes[i].id;
  }

  for (i in hash){
    var ivals = hash[i].split(",");
    cSize = ivals.length;
    //console.log(cSize + " | " + cutoff);
    if (cSize >cutoff){
      for (j in ivals){
        var val = ivals[j];
        newSamples.push(oldSamples[val])
      }
    }
  }

  newlinks = [];
  newnodes = [];

  datLinks.forEach(function(d){
    if (isInArray(oldSamples[d.source],newSamples)==true){
      var x = JSON.parse(JSON.stringify(d));
      x.source = newSamples.indexOf(oldSamples[d.source])
      x.target = newSamples.indexOf(oldSamples[d.target])
      newlinks.push(x);
    }
  })

  newSamples.forEach(function(d){
    for (i in datNodes){
      if (datNodes[i].id == d){
        newnodes.push(datNodes[i]);
        break;
      }
    }
  })

  var newdat = {"nodes": newnodes, "links":newlinks};

  return newdat;

}

function clusterBin(datNodes,datLinks){
  console.log(datLinks)
  if (datLinks.length===0){
    return [{"nodes":1,"num":datNodes.length}]
  } else {
    var hash = [];
    datLinks.forEach(function(d) {
      hash[hash.length] = d.source + "," + d.target;

    });
    while (testHash(hash)==false){
      hash = reduceHash(hash);
    }

    return getNums(hash)
  }
}


function getNums(hash){
  xxx = hash.map(function(d){var str = d.split(",");return str.length})
  var arr = [];
  for (var i in unique(xxx)){
    var val = unique(xxx)[i]
    var num = countInArray(xxx,val)
    arr.push({"nodes": +val, "num":num})
  }
  return arr;
}



function countInArray(array, what) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i] === what) {
            count++;
        }
    }
    return count;
}

function reduceHash(hash){
  var newHash = [];
  var numsAdded = [];

  for (i in hash){
    var ivals = hash[i].split(",");
    var testVal = false
    for (k in ivals){
      var ival = ivals[k]
      if(isInArray(ival, numsAdded)==true){
        testVal = true;
      }
    }
    if (testVal==false){
      for (k in ivals){
        numsAdded[numsAdded.length] = ivals[k];
      }
      newHash[newHash.length] = hash[i];
    } else {
      for (j in newHash){
        if (i==j){continue}
        var jvals = newHash[j].split(",");
        var inter = intersect(ivals,jvals);
        if (inter.length!=0){
          newHash[j] = newHash[j] + "," + hash[i];
        }
      }
    }
  }
  for (i in newHash){
    newHash[i] = unique(newHash[i].split(",")).toString(",");
  }
  return newHash;
}


  function unique(arr){
	var n = {},r=[];
	for(var i = 0; i < arr.length; i++)
	{
		if (!n[arr[i]])
		{
			n[arr[i]] = true;
			r.push(arr[i]);
		}
	}
	return r;
}


function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

function testHash(hash){
  var testVal=0;
  for (i in hash){
    var ivals = hash[i].split(",");
    for (j in hash){
      if (i==j){continue}
      var jvals = hash[j].split(",");
      var inter = intersect(ivals,jvals)
      if (inter.length>0){testVal++}
    }
  }
  if (testVal>0){return false} else {return true}
}


function intersect(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        if (b.indexOf(e) !== -1) return true;
    });
}
