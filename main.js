/*******************************************************************************
******************************* GLOBAL CONSTANTS *******************************
*******************************************************************************/

const durationScale = 0.005;
const pause = 1;
const RColor = "red";
const OColor = "black";
const canvasHeight = "355px";
const canvasWidth = "320px";

/*******************************************************************************
****************************** CLASS DEFINITIONS *******************************
*******************************************************************************/

// STROKE
// class for storing individual stroke data

function stroke(input){
  this.direction = parseInt(input[0]);
  
  if(input[1] == 'P') this.pause = 1;
  else this.pause = 0;
  
  if(input[2] == 'R') this.color = RColor;
  else this.color = OColor;
  
  this.data = [];
  pairs = input.slice(4,input.length-1).split(";");
  for (i = 0; i < pairs.length; i++){
    this.data.push(pairs[i].split(","));
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

/*******************************************************************************
**************************** FUNCTION DEFINITIONS ******************************
*******************************************************************************/

///////////////////////////////// ANIMATION ////////////////////////////////////

var runningDuration = 0;

function animation(stroke, index){
  skew = 0;
  switch(stroke.direction){
    case 1: { // Left to Right
      translateX = (2*stroke.minX()-stroke.maxX());
      translateY = stroke.minY();
      duration = (stroke.maxX()-stroke.minX())*durationScale;
    }
    break;
    
    case 2: { // Upper Left to Bottom Right
      translateX = (2*stroke.minX()-stroke.maxX())-2*Math.sin(Math.PI/2)*(stroke.maxY()-stroke.minY());
      translateY = stroke.minY();
      duration = (stroke.maxX()-stroke.minX())*durationScale*3;
      skew = 135;
    }
    break;
    
    case 3: { // Top to Bottom
      translateX = stroke.minX();
      translateY = (2*stroke.minY()-stroke.maxY());
      duration = (stroke.maxY()-stroke.minY())*durationScale;
    }
    break;
    
    case 4: { // Upper Right to Bottom Left
      translateX = stroke.maxX()+Math.sin(Math.PI/2)*(stroke.maxY()-stroke.minY());
      translateY = stroke.minY();
      duration = (stroke.maxX()-stroke.minX())*durationScale*3;
      skew = 45;
    }
    break;
    
    case 5: { // Right to Left
      translateX = stroke.maxX();
      translateY = stroke.minY();
      duration = (stroke.maxX()-stroke.minX())*durationScale;
    }
    break;
    
    case 6: { // Bottom Right to Upper Left
      translateX = stroke.maxX()+Math.sin(Math.PI/2)*(stroke.maxY()-stroke.minY());
      translateY = stroke.minY();
      duration = (stroke.maxX()-stroke.minX())*durationScale*3;
      skew = 135;
    }
    break;
    
    case 7: { // Bottom to Top
      translateX = stroke.minX();
      translateY = stroke.maxY();
      duration = (stroke.maxY()-stroke.minY())*durationScale;
    }
    break;
    
    case 8: { // Bottom Left to Upper Right
      translateX = (2*stroke.minX()-stroke.maxX())-2*Math.sin(Math.PI/2)*(stroke.maxY()-stroke.minY());
      translateY = stroke.minY();
      duration = (stroke.maxX()-stroke.minX())*durationScale*3;
      skew = 45;
    }
    break;
  }
  
  runningDuration += duration;
  runningDuration += pause*stroke.pause;
  
  return "#wipe-" + index + "{-webkit-transform: translate(" + translateX + "px," + translateY +"px) skew(" + skew + "deg);"
            +"-ms-transform: translate(" + translateX + "px," + translateY +"px) skew(" + skew + "deg);"
            +"transform: translate(" + translateX + "px," + translateY +"px) skew(" + skew + "deg);"
            + "-webkit-animation: moving-panel-" + index + " " + duration + "s forwards;" 
            + "animation: moving-panel-" + index + " " + duration + "s forwards;"
            + "-webkit-animation-delay: " + ((runningDuration-duration-pause*stroke.pause)*0.75) + "s;"
            + "animation-delay: " + ((runningDuration-duration-pause*stroke.pause)*0.75) + "s;"
            + "transition-timing-function: linear;"
            + "-webkit-transition-timing-function: linear;"
            + "fill:" + stroke.color + "}";
}

/////////////////////////////// MOVING PANEL ///////////////////////////////////

function movingPanel(stroke, index, version){
  skew = 0;
  switch(stroke.direction){
    case 1:
    case 3:
    case 5:
    case 7:{
      translateX = stroke.minX();
      translateY = stroke.minY();
    }
    break;
    
    case 2:{
      translateX = stroke.minX()-Math.sin(Math.PI/2)*(stroke.maxY()-stroke.minY());
      translateY = stroke.minY();
      skew = 135;
    }
    break;
    
    case 4:{
      translateX = stroke.minX()-Math.sin(Math.PI/2)*(stroke.maxY()-stroke.minY());
      translateY = stroke.minY();
      skew = 45;
    }
    break;
    
    case 6:{
      translateX = stroke.minX()-Math.sin(Math.PI/2)*(stroke.maxY()-stroke.minY());
      translateY = stroke.minY();
      skew = 135;
    }
    break;
    
    case 8:{
      translateX = stroke.minX()-Math.sin(Math.PI/2)*(stroke.maxY()-stroke.minY());
      translateY = stroke.minY();
      skew = 45;
    }
    break;
    
  }
  switch(version){
    case 1:
      return "@-webkit-keyframes moving-panel-" + index + " {100% { -webkit-transform:translate(" + translateX + "px," + translateY + "px) skew(" + skew + "deg);" + "transform:translate(" + translateX + "px," + translateY + "px) skew(" + skew + "deg);}} ";
    break;
    case 2:
      return "@keyframes moving-panel-" + index + " {100% {" + "transform:translate(" + translateX + "px," + translateY + "px);}}";
    break;
  }

}

////////////////////////////////// BOX SIZE ////////////////////////////////////


function boxSize(direction, stroke){
  if (direction = "X"){
    switch(stroke.direction){
      case 1:
      case 3:
      case 5:
      case 7:
      {
        return stroke.maxX()-stroke.minX();
      }
      break;
      
      case 2:
      case 4:
      case 6:
      case 8:
      {
        return stroke.maxX()-stroke.minX() + 2*Math.sin(Math.PI/2)*(stroke.maxY()-stroke.minY());
      }
      break;
    }
  }
}

////////////////////////////// INGEST STROKE DATA //////////////////////////////

function ingestStrokeData(input){
  strokes = [];
  tempStrokes = input.slice(1,input.length).split('#');
  for (var i = 0; i < tempStrokes.length; i++){
    strokes.push(new stroke(tempStrokes[i]));
  }
  
  return strokes;
}



/*******************************************************************************
********************************* DRAW ROUTINE *********************************
*******************************************************************************/

// Ingest Stroke Data
var strokes = [];
strokes = ingestStrokeData("#1PR:42,69;45,67;57,67;68,66;128,59;203,50;213,50;247,42;256,44;278,59;277,64;273,67;259,67;233,64;202,65;168,69;142,71;100,77;76,83;65,87;56,84;48,80;44,77;41,73;#3NO:162,68;170,73;174,77;175,81;174,89;173,95;172,113;172,184;174,203;173,227;171,238;169,244;145,228;148,224;150,219;151,93;149,82;146,75;143,70;#6PO:146,228;170,239;166,250;161,260;154,266;145,258;133,245;121,233;116,224;122,224;135,227;");

// Make SVG Canvas
var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute('height', canvasHeight);
svg.setAttribute('width', canvasWidth);
var svgNS = svg.namespaceURI;

// Grab the Syle Sheet for Later Additions
var sheet = document.styleSheets[0]


// Make the animation for each stroke
for (j = 0; j < strokes.length; j++){
  
  // Create Polygon
  poly = document.createElementNS(svgNS,'polygon');
  poly.setAttribute('points',strokes[j].polygonPoints());
  poly.setAttribute('style', 'fill: grey;');
  svg.appendChild(poly);
  
  // Create ClipPath
  polyforclip = document.createElementNS(svgNS,'polygon');
  polyforclip.setAttribute('points',strokes[j].polygonPoints());
  clippath = document.createElementNS(svgNS, "clipPath");
  clippath.id = "stroke-"+j;
  clippath.appendChild(polyforclip);
  svg.appendChild(clippath);
  
  // Create Wipe
  box = document.createElementNS(svgNS, 'rect');
  box.setAttribute("width", boxSize("X", strokes[j]) +"px");
  box.setAttribute("height", strokes[j].maxY()-strokes[j].minY()+"px");
  box.id = "wipe-" + j; 
  wipe = document.createElementNS(svgNS, 'g');
  wipe.setAttribute('clip-path', "url(#stroke-"+j+")");
  wipe.appendChild(box);
  svg.appendChild(wipe);
  
  //Create CSS Animation
  rule = animation(strokes[j], j);
  sheet.insertRule(rule, sheet.cssRules.length);
  rule = movingPanel(strokes[j], j, 1);
  sheet.insertRule(rule, sheet.cssRules.length);
  
}

// Add the SVG to the page
document.body.appendChild(svg);

