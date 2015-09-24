/*******************************************************************************
****************************** CLASS DEFINITIONS *******************************
*******************************************************************************/

// STROKE
// class for storing individual stroke data

function stroke(input){
  this.direction = parseInt(input[1]);
  if(input[2] == 'P') this.pause = 1;
  else this.pause = 0;
  this.data = [];
  pairs = input.slice(5,input.length).split(";");
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

var durationScale = 0.005;
var pause = 1
var runningDuration = 0;

function animation(stroke, index){
  rotate = 0;
  switch(stroke.direction){
    case 1: { // Left to Right
      translateX = (2*stroke.minX()-stroke.maxX());
      translateY = stroke.minY();
      duration = (stroke.maxX()-stroke.minX())*durationScale;
    }
    break;
    
    case 3: { // Top to Bottom
      translateX = stroke.minX();
      translateY = (2*stroke.minY()-stroke.maxY());
      duration = (stroke.maxY()-stroke.minY())*durationScale;
    }
    break;
    
    case 5: { // Right to Left
      translateX = stroke.maxX();
      translateY = stroke.minY();
      duration = (stroke.maxX()-stroke.minX())*durationScale;
    }
    break;
    
    case 7: { // Bottom to Top
      translateX = stroke.minX();
      translateY = stroke.maxY();
      duration = (stroke.maxY()-stroke.minY())*durationScale;
    }
    break;
  }
  
  runningDuration += duration;
  runningDuration += pause*stroke.pause;
  
  return "#wipe-" + index + "{-webkit-transform: translate(" + translateX + "px," + translateY +"px) rotate(" + rotate + "deg);"
            +"-ms-transform: translate(" + translateX + "px," + translateY +"px) rotate(" + rotate + "deg);"
            +"transform: translate(" + translateX + "px," + translateY +"px) rotate(" + rotate + "deg);"
            + "-webkit-animation: moving-panel-" + index + " " + duration + "s forwards;" 
            + "animation: moving-panel-" + index + " " + duration + "s forwards;"
            + "-webkit-animation-delay: " + ((runningDuration-duration-pause*stroke.pause)*0.75) + "s;"
            + "animation-delay: " + ((runningDuration-duration-pause*stroke.pause)*0.75) + "s;"
            + "transition-timing-function: linear;"
            + "-webkit-transition-timing-function: linear;}";
}

function movingPanel(stroke, index, version){
  switch(stroke.direction){
    case 1: 
    case 3:
    case 5:
    case 7:{
      translateX = stroke.minX();
      translateY = stroke.minY();
    }
    break;
  }
  switch(version){
    case 1:
      return "@-webkit-keyframes moving-panel-" + index + " {100% { -webkit-transform:translate(" + translateX + "px," + translateY + "px);" + "transform:translate(" + translateX + "px," + translateY + "px);}} ";
    break;
    case 2:
      return "@keyframes moving-panel-" + index + " {100% {" + "transform:translate(" + translateX + "px," + translateY + "px);}}";
    break;
  }

}
    

// Temporary hardcoded strokes
var strokes = [];
strokes.push(new stroke("#3PO:144,65;138,107;136,120;131,140;124,159;115,178;106,196;91,214;74,230;54,245;41,253;29,258;24,260;21,258;22,255;37,243;54,230;65,219;79,204;92,185;104,164;112,141;117,125;121,107;124,84;124,67;123,45;121,39;118,34;117,30;117,27;119,25;124,24;130,24;134,25;148,32;151,36;151,41;148,47;145,56"));

strokes.push(new stroke("#1NR:62,125;81,122;100,117;122,111;147,104;170,96;183,88;188,85;192,84;196,84;206,89;180,107;170,108;148,114;137,118;114,126;84,137;72,141;66,142;60,142;53,140;47,137;43,133;43,129;46,127;52,125;56,125"));

strokes.push(new stroke("#3NR:209,112;203,121;198,134;190,154;186,169;183,183;182,198;182,207;182,217;185,226;188,232;172,237;168,222;167,206;167,188;169,174;172,154;176,135;181,119;182,113;182,110;182,107;177,107;203,88;214,93;217,96;218,100;217,104;214,107"));

strokes.push(new stroke("#1NR:200,241;212,245;225,247;241,246;256,242;266,236;271,232;297,247;293,253;281,260;260,266;246,268;220,268;205,265;194,261;185,256;179,249;174,241;170,232;186,228;189,234;193,238"));

strokes.push(new stroke("#7PR:277,215;284,191;287,188;289,188;290,192;291,206;293,226;296,241;296,245;295,249;269,233;273,225"));

//Make SVG Canvas
var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
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
  box.setAttribute("width", strokes[j].maxX()-strokes[j].minX()+"px");
  box.setAttribute("height", strokes[j].maxY()-strokes[j].minY()+"px");
  box.setAttribute("style", "fill: black;");
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

