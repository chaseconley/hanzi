/*******************************************************************************
******************************* GLOBAL CONSTANTS *******************************
*******************************************************************************/

const durationScale = 0.005;
const pause = 1

/*******************************************************************************
****************************** CLASS DEFINITIONS *******************************
*******************************************************************************/

// STROKE
// class for storing individual stroke data

function stroke(input){
  this.direction = parseInt(input[0]);
  if(input[1] == 'P') this.pause = 1;
  else this.pause = 0;
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
            + "-webkit-transition-timing-function: linear;}";
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
strokes = ingestStrokeData("#3PR:70,53;76,62;75,73;73,107;72,118;70,139;68,155;66,166;54,201;42,227;29,245;22,253;19,254;17,251;25,235;35,213;44,192;49,176;53,156;56,130;58,84;58,69;55,59;52,54;51,51;52,49;55,47;59,47;#1NR:68,53;74,53;86,50;96,45;101,43;106,42;111,44;117,48;100,56;94,57;81,62;76,61;#3NR:123,66;121,75;121,130;121,158;121,196;122,220;122,233;121,238;118,244;113,253;110,256;107,257;103,256;101,227;104,215;106,176;106,162;106,64;104,59;101,57;97,56;112,45;123,51;125,54;125,57;124,62;#6PR:93,246;77,226;80,224;92,227;98,227;101,226;107,257;102,256;97,251;#1PR:72,108;77,106;83,104;89,104;94,107;95,110;93,113;72,119;#1PR:69,157;77,154;86,153;91,154;96,156;96,159;93,162;73,166;65,166;66,156;#1NO:160,48;169,48;190,43;205,39;213,35;217,32;222,32;226,33;232,36;214,48;204,49;189,52;165,60;#3NO:235,61;233,75;227,91;220,108;216,115;209,121;205,121;200,120;202,95;209,91;213,86;216,72;217,59;216,53;215,49;212,48;230,35;239,39;242,42;243,45;241,49;237,54;#6PO:193,108;183,94;184,93;192,94;199,96;203,96;206,94;204,121;200,120;197,114;#3PO:161,49;166,58;162,139;158,229;156,244;154,254;151,258;147,258;142,254;138,247;137,239;137,231;139,221;141,210;144,195;147,171;149,124;149,79;145,58;142,48;142,45;144,42;148,41;153,42;#1NO:161,146;169,144;191,138;204,134;212,130;217,128;223,128;229,129;213,141;171,152;159,152;#4PO:236,152;232,168;227,181;220,194;215,203;205,213;194,219;177,225;164,227;157,227;157,223;174,216;186,209;195,203;203,192;211,177;216,165;217,157;217,150;217,145;216,142;212,142;226,128;237,133;241,136;242,140;241,144;239,148;#2PO:159,163;167,163;172,165;178,169;200,191;215,203;227,210;246,220;268,227;289,234;291,237;289,239;263,242;239,243;233,241;228,237;189,196;170,175;164,171;159,168;");

console.log(strokes)

// Make SVG Canvas
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
  box.setAttribute("width", boxSize("X", strokes[j]) +"px");
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

