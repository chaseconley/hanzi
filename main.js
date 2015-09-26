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
      translateX = stroke.maxX()+2*Math.sin(Math.PI/2)*(stroke.maxY()-stroke.minY());
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
      translateX = stroke.maxX()+2*Math.sin(Math.PI/2)*(stroke.maxY()-stroke.minY());
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
      translateX = stroke.minX();
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
      translateX = stroke.minX();
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
        return stroke.maxX()-stroke.minX() + Math.sin(Math.PI/2)*(stroke.maxY()-stroke.minY());
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
strokes = ingestStrokeData("#2PR:76,30;84,31;107,38;114,43;118,49;120,56;120,62;117,67;111,67;105,65;76,39;74,35;74,32;#1NR:11,134;18,133;29,130;48,124;66,116;84,107;88,107;96,111;79,127;74,126;70,127;52,135;32,142;26,145;21,145;16,142;12,140;9,138;9,135;#3NR:104,116;106,118;106,124;99,130;96,138;91,167;88,198;88,212;90,215;82,249;76,249;70,241;67,235;66,228;69,217;72,203;77,171;79,145;80,128;77,126;94,110;100,113;#8PR:97,212;125,194;127,194;127,196;124,200;94,231;88,239;85,244;82,249;77,250;88,212;89,214;93,214;#1PO:150,66;181,62;199,57;215,50;224,49;233,49;241,52;243,55;241,58;198,69;181,73;171,75;156,75;149,73;147,72;143,70;143,68;#1PO:152,101;180,95;198,90;210,86;216,85;223,85;228,87;231,90;229,93;196,102;181,106;172,107;158,108;152,107;148,104;148,102;#3PO:182,105;182,73;181,43;180,38;178,33;175,29;174,26;174,22;176,19;180,19;186,21;195,24;202,29;202,35;199,45;198,58;196,81;195,109;195,124;181,126;#1PO:118,136;182,124;195,122;251,110;260,108;267,109;277,114;281,118;284,122;283,125;279,126;240,127;207,130;184,134;158,139;137,145;130,147;123,147;117,145;111,140;111,138;114,137;#3PO:152,165;149,158;149,155;151,153;155,153;160,155;165,158;169,165;167,181;165,203;165,220;164,236;162,247;159,259;155,270;152,275;147,275;144,269;142,264;141,257;142,248;145,241;150,226;154,208;155,192;155,181;154,172;#1NO:165,158;199,150;215,142;218,142;234,148;217,159;212,158;204,158;187,162;175,165;167,166;#3NO:236,169;236,179;240,219;243,243;243,255;240,268;234,280;229,286;219,261;222,254;223,236;222,206;220,178;219,164;217,159;213,158;229,146;236,149;240,152;241,155;241,159;239,164;#6PO:217,281;195,261;195,259;196,258;200,258;218,261;221,258;230,286;223,287;220,285;#1PO:166,190;182,183;193,181;200,181;208,182;211,185;212,188;209,190;182,195;173,196;166,197;#1PO:164,219;177,215;192,211;201,210;209,212;215,216;215,218;209,221;185,224;171,227;164,227;");

// Make SVG Canvas
var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute('height', canvasHeight);
svg.setAttribute('width', canvasWidth);
var svgNS = svg.namespaceURI;

// Grab the Syle Sheet for Later Additions
var sheet = document.styleSheets[0]


// Lay down the stroke shadows so animations are always on top
for (var j = 0; j < strokes.length; j++){
  
  // Create Polygon
  poly = document.createElementNS(svgNS,'polygon');
  poly.setAttribute('points',strokes[j].polygonPoints());
  poly.setAttribute('style', 'fill: grey;');
  svg.appendChild(poly);
  
}
  
// Create Animations
for (var j = 0; j < strokes.length; j++){
  
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

