/*******************************************************************************
****************************** CLASS DEFINITIONS *******************************
*******************************************************************************/

// STROKE
// class for storing individual stroke data

function stroke(direction, pause, data){
  this.direction = direction;
  this.pause = pause;
  this.data = [];
  this.pairs = data.split(" ");
  for (i = 0; i < this.pairs.length; i++){
    this.data.push(this.pairs[i].split(","));
  }
  
  this.maxX = function (){
    var max = 0;
    for (i = 0; i < this.data.length; i++){
      if (parseInt(this.data[i][0]) > max) max = parseInt(this.data[i][0]);
    }
    return max;
  }
  
  this.maxY = function (){
    var max = 0;
    for (i = 0; i < this.data.length; i++){
      console.log(i)
      if (parseInt(this.data[i][1]) > max) max = parseInt(this.data[i][1]);
    }
    return max;
  }
  
  this.minX = function (){
    var min = 100000000;
    for (i = 0; i < this.data.length; i++){
      if (parseInt(this.data[i][0]) < min) min = parseInt(this.data[i][0]);
    }
    return min;
  }
  
  this.minY = function (){
    var min = 100000000;
    for (i = 0; i < this.data.length; i++){
      if (parseInt(this.data[i][1]) < min) min = parseInt(this.data[i][1]);
    }
    return min;
  }
  
  this.polygonPoints = function (){
    var string = "";
    for (i = 0; i < this.data.length; i++){
      string = string + this.data[i][0] + "," + this.data[i][1] + " ";
    }
    return string;
  }

}

var NS="http://www.w3.org/2000/svg";

var SVG=function(h,w){
  var NS="http://www.w3.org/2000/svg";
  var svg=document.createElementNS(NS,"svg");
  svg.width=w;
  svg.height=h;
 return svg;
} 

var strokes = [];
strokes.push(new stroke(1, 0, "42,69 45,67 57,67 68,66 128,59 203,50 213,50 247,42 256,44 278,59 277,64 273,67 259,67 233,64 202,65 168,69 142,71 100,77 76,83 65,87 56,84 48,80 44,77 41,73"));
strokes.push(new stroke(1, 0, "162,68 170,73 174,77 175,81 174,89 173,95 172,113 172,184 174,203 173,227 171,238 169,244 145,228 148,224 150,219 151,93 149,82 146,75 143,70"));
strokes.push(new stroke(1, 0, "146,228 170,239 166,250 161,260 154,266 145,258 133,245 121,233 116,224 122,224 135,227"));

//Make SVG Canvas
var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
var svgNS = svg.namespaceURI;
var poly;


// Make Polygons and ClipPaths
for (j = 0; j < strokes.length; j++){
  
  // Create Polygon
  poly = document.createElementNS(svgNS,'polygon');
  poly.setAttribute('points',strokes[j].polygonPoints());
  svg.appendChild(poly);
  
  // Create ClipPath
  polyforclip = document.createElementNS(svgNS,'polygon');
  polyforclip.setAttribute('points',strokes[j].polygonPoints());
  clippath = document.createElementNS(svgNS, "clippath");
  clippath.id = "stroke-"+j;
  clippath.appendChild(polyforclip);
  svg.appendChild(clippath);
  
  // Create Wipe
  
  box = document.createElementNS(svgNS, 'rect');
  box.setAttribute("width", strokes[j].maxX()-strokes[j].minX()+"px");
  box.setAttribute("height", strokes[j].maxY()-strokes[j].minY()+"px");
  box.setAttribute("style", "fill: grey;");
  wipe = document.createElementNS(svgNS, 'g');
  wipe.setAttribute('clip-path', "url(#stroke-"+j+")");
  wipe.appendChild(box);
  svg.appendChild(wipe);
  
}



document.body.appendChild(svg);

