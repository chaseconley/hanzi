# Hanzi Character Animation

Demo: https://www.eecs.tufts.edu/~cconle01/hanzi/

##About
The goal of this project was modernize the web-based animation of Hanzi strokes, used by Tufts Chinese Department in their intro level classes. The existing animation was Java based, requiring the installation of a plugin. This became a barrier for many students, preventing widespread use.

The new version is implemented entirely in HTML5, CSS, & Javascript, making it compatible with all modern browsers. Strokes are loaded from the database and the animations are created dynamically, allowing for any stroke to be represented. Each stroke is animated using CSS keyframe animations, which produce fast loading animations that appear smooth and fluid.

##Installation
Grab the source and you're good to go!

##Use
Feed the character string into the ingestStrokeData() function and store the result as strokes. Everything else takes care of itself

##Data Format
Each stroke data string contains individual strokes marked by a # followed by
  - a number: the direction of the stroke
    -  1: Left to Right,
    -  2: Upper Left to Lower Right
    -  3: Top to Bottom
    -  4: Upper Right to Lower Left
    -  5: Right to Left
    -  6: Lower Right to Upper Left
    -  7: Bottom to Top
    -  8: Lower Left to Upper Right
  - P/N: pause or no pause after this stroke
    - P: pause
    - N: no pause
  - R/O: color
    - R: red
    - O: black
  - List of polygon points in the form x1,y1;x2,y2; etc

