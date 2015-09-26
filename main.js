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
    document.getElementById("wipe-"+j).offsetWidth;
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
strokes = ingestStrokeData("#2PR:79,37;90,41;99,45;104,49;107,53;108,60;108,68;106,71;103,73;99,73;95,70;68,44;66,41;66,39;68,37;74,37;#1NR:28,130;38,128;43,126;59,118;68,112;73,109;76,108;81,109;89,113;93,117;94,119;71,129;69,127;65,126;62,128;46,138;43,140;31,140;26,137;24,134;24,133;#3NR:88,130;87,134;84,162;82,185;80,211;81,216;76,250;72,250;68,246;64,240;62,235;61,231;62,225;65,214;68,200;70,184;71,162;71,127;93,116;94,118;94,121;92,125;#8PR:89,215;109,202;111,201;113,202;113,205;95,223;87,233;83,239;81,241;78,246;76,250;80,215;82,217;86,217;#4PO:239,77;215,90;206,95;185,106;178,108;174,109;172,109;172,107;192,92;205,82;215,72;217,69;219,66;219,62;219,60;221,58;229,58;237,60;248,65;251,67;252,70;251,72;#3PO:212,90;221,96;225,100;227,103;227,108;224,189;211,192;211,118;210,111;209,104;208,99;206,94;#1PO:225,140;234,137;244,134;255,131;261,131;267,133;270,135;270,138;267,141;243,147;233,149;223,149;#3NO:193,155;193,161;191,169;189,177;189,189;191,192;183,209;178,207;175,204;173,201;173,195;175,191;177,180;179,174;179,163;177,158;172,146;172,144;173,142;178,141;182,142;191,151;#1PO:193,193;211,190;223,188;254,182;258,182;263,182;269,185;275,189;277,192;275,195;246,196;232,197;223,198;215,199;205,201;193,204;184,208;180,208;188,188;189,191;#1NO:119,100;127,96;135,91;139,89;143,88;148,89;159,93;141,104;136,103;128,105;123,107;113,106;112,105;113,104;#4NO:158,105;138,145;137,150;126,155;124,152;124,149;127,145;138,118;140,111;140,104;158,92;161,95;162,98;161,101;#1NO:137,147;136,149;137,150;147,150;152,149;157,149;162,152;143,157;138,155;126,155;124,152;#4PO:161,165;151,191;144,208;137,221;134,226;129,233;114,249;107,254;103,257;100,258;99,257;109,243;118,230;126,217;136,198;140,188;143,176;145,166;145,161;144,158;141,156;162,152;164,154;165,156;164,158;#2PO:123,181;130,183;135,186;151,196;162,204;180,216;197,225;214,234;226,239;238,243;251,246;282,251;290,252;294,253;295,253;296,255;292,258;248,267;242,268;237,268;232,267;219,259;194,243;175,229;146,206;135,198;127,193;119,190;110,187;106,185;105,183;107,181;113,179;118,179;");

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