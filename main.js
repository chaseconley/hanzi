/*******************************************************************************
******************************* GLOBAL CONSTANTS *******************************
*******************************************************************************/

const durationScale = 0.005;
const pause = 1;
const RColor = "red";
const OColor = "black";
const canvasHeight = "355px";
const canvasWidth = "320px";
const styleSheetID = "animationStyle";

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
      duration = (stroke.maxX()-stroke.minX())*durationScale*2;
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
      duration = (stroke.maxX()-stroke.minX())*durationScale*2;
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

/////////////////////////////////// ANIMATE ////////////////////////////////////

 function writeCharacter(){
   runningDuration = 0;
   
   // If the the animation has already run, delete the CSS for it
   if (document.getElementById(styleSheetID) != null){
     toDelete = document.getElementById(styleSheetID)
     toDelete.parentNode.removeChild(toDelete);
   }
  
  // Make the Style Sheet
  var style = document.createElement('style');
  style.id = styleSheetID;
  document.head.appendChild(style);
  var sheet = style.sheet;
  
  // Create CSS Animation
  for (var j = 0; j < strokes.length; j++){
    document.getElementById("wipe-"+j).offsetWidth; // Force CSS to reflow
    rule = animation(strokes[j], j);
    sheet.insertRule(rule, sheet.cssRules.length);
    rule = movingPanel(strokes[j], j, 1);
    sheet.insertRule(rule, sheet.cssRules.length);
  }
   
 }

/*******************************************************************************
********************************* DRAW ROUTINE *********************************
*******************************************************************************/

// Ingest Stroke Data
var strokes = [];
strokes = ingestStrokeData("#1NO:107,48;158,39;165,37;171,35;176,33;181,32;194,32;201,34;208,38;211,41;213,43;180,49;179,47;177,46;172,46;165,48;121,60;116,61;105,61;100,59;96,56;94,54;93,52;94,50;96,49;#4PO:203,57;198,65;194,73;190,82;186,90;177,104;168,116;151,134;140,143;134,148;126,152;114,158;100,163;85,168;68,173;61,174;55,175;54,174;54,172;59,169;78,161;100,150;117,140;130,131;138,124;144,118;152,109;159,100;166,87;172,75;178,60;180,52;181,49;179,46;211,41;213,43;214,46;210,50;206,54;#2PO:121,84;136,97;152,109;168,120;183,130;199,138;213,144;222,147;231,148;248,150;274,154;281,155;285,157;287,158;285,160;257,169;236,175;232,176;226,176;220,175;214,172;183,151;157,130;142,117;124,101;110,90;107,87;101,84;93,80;91,77;94,75;104,74;109,75;114,78;#1PR:109,203;143,199;163,195;172,192;183,189;191,188;200,188;207,191;210,193;211,196;210,198;203,201;161,209;143,213;130,214;111,215;104,213;98,210;96,208;96,206;100,204;#3PR:164,188;162,195;161,212;158,249;144,250;142,185;142,182;141,178;137,169;136,166;137,164;139,162;146,162;163,171;165,173;166,176;#1PR:71,256;144,249;157,247;198,242;231,237;236,237;240,237;245,238;252,241;265,250;267,252;266,256;264,258;229,258;182,258;155,259;134,261;113,264;90,268;75,271;72,272;65,271;55,267;50,263;49,260;50,258;");

// Make SVG Canvas
var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute('height', canvasHeight);
svg.setAttribute('width', canvasWidth);
document.body.appendChild(svg);
var svgNS = svg.namespaceURI;

// Lay down the stroke shadows so animations are always on top
for (var j = 0; j < strokes.length; j++){
  
  // Create Polygon
  poly = document.createElementNS(svgNS,'polygon');
  poly.setAttribute('points',strokes[j].polygonPoints());
  poly.setAttribute('style', 'fill: grey;');
  svg.appendChild(poly);
  
}

// Make all of the wipes transparent so they don't show in the stroke shaddows
var styleWipe = document.createElement('style');
styleWipe.id = hideWipes;
document.head.appendChild(styleWipe);
var hideWipes = styleWipe.sheet;
hideWipes.insertRule(".wipe{fill:transparent;}")
  
  
// Create Elements for Animation
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
  box.setAttribute("class", "wipe");
  wipe = document.createElementNS(svgNS, 'g');
  wipe.setAttribute('clip-path', "url(#stroke-"+j+")");
  wipe.appendChild(box);
  svg.appendChild(wipe);
  
}

// Make Button for Animation
var button = document.createElement("button");
button.innerHTML = "Write";
button.setAttribute("onclick", "writeCharacter()");
document.body.appendChild(button)