

var canvas;
var gl;

var numVertices  = 36;

var texSize = 64;

var program;

var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];
var texCoordsArray2 = [];

var texture;

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0), 


    vec2(0, 0),
    vec2(0, 2),
    vec2(16, 2),
    vec2(16, 0)

];

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 ),
];

var vertexColors = [
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 0.1, 0.1, 0.1, 1.0 ),  // front
    vec4( 0.7, 0.7, 0.7, 1.0 ),  // left
    vec4( 0.7, 0.7, 0.7, 1.0 ),  //   bottom
    vec4( 0.7, 0.7, 0.7, 1.0 ),  //   back
    vec4( 0.7, 0.7, 0.7, 1.0 ),  // right
    vec4( 0.8, 0.8, 0.8, 1.0 ),  // top
    vec4( 0.0, 1.0, 1.0, 1.0 ),   //   cyan
    
    vec4( 1.0, 1.0, 1.0, 1.0), //white
    vec4( 1.0, 1.0, 1.0, 1.0), //white
    vec4( 1.0, 1.0, 1.0, 1.0), //white
    vec4( 1.0, 1.0, 1.0, 1.0), //white
    vec4( 1.0, 1.0, 1.0, 1.0), //white
    vec4( 1.0, 1.0, 1.0, 1.0), //white
    vec4( 1.0, 1.0, 1.0, 1.0), //white
    vec4( 1.0, 1.0, 1.0, 1.0), //white
];    

var projectionMatrixLoc;
var modelTransformLoc;
var cameraMatrixLoc;

var vTexCoord;

// Perspective Setup
var near = 0.1; //0.2 , 40
var far = 100.0;
var fovy_init = 45.0;
var fovy = fovy_init;  // Field-of-view in Y direction angle (in degrees)
var aspect;

var c_zInit = -21;  // Initial position
var c_z=c_zInit;    // dx, dy, dz of the camera
var c_yInit = -11;
var c_y=c_yInit;
var c_x=0;
var c_angle = 0;    // turn of the camera


function configureTexture(image) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // flipped cause html and webgl uses different Y coords.
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, 
         gl.RGB, gl.UNSIGNED_BYTE, image );

    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
      
    
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}


function quad(a, b, c, d) {

     pointsArray.push(vertices[a]); 
     colorsArray.push(vertexColors[a]); 
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]); 
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[1]); 

     pointsArray.push(vertices[c]); 
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[2]); 
   
     pointsArray.push(vertices[a]); 
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[0]); 

     pointsArray.push(vertices[c]); 
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[2]); 

     pointsArray.push(vertices[d]); 
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[3]);  

    texCoordsArray2.push(texCoord[0+4]);
    texCoordsArray2.push(texCoord[1+4]);   
    texCoordsArray2.push(texCoord[2+4]); 
    texCoordsArray2.push(texCoord[0+4]); 
    texCoordsArray2.push(texCoord[2+4]); 
    texCoordsArray2.push(texCoord[3+4]);  

}


function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 ); //black background
    aspect =  canvas.width/canvas.height; //for view 


    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    cameraMatrixLoc = gl.getUniformLocation(program, "cameraMatrix");
    modelTransformLoc = gl.getUniformLocation(program, "modelTransform");



    document.addEventListener('keydown', function(event){
        if(event.keyCode ==38){
            //Up cursor key   shift camer up/shift world down
            c_y -=0.25;
        }
        else if(event.keyCode ==40){
            //Down cursor key
            c_y +=0.25;
        }
        else if (event.keyCode ==37){
            // left, turn left
            c_angle -= 1;
        }
        else if (event.keyCode ==39){
            // right, turn right
            c_angle += 1;
        }
        else if (event.keyCode == 73){
            //i key go forward

            c_z += 0.25 * Math.cos(radians(c_angle));   // cosine and sine for proper motion

            c_x -= 0.25 * Math.sin(radians(c_angle));
        }
        else if (event.keyCode == 79) {
            //o key go backward   or m 
            c_z -= 0.25 * Math.cos(radians(c_angle));
            c_x += 0.25 * Math.sin(radians(c_angle));
        }
        else if (event.keyCode == 77) {
            //m key to go backward also
            c_z -= 0.25 * Math.cos(radians(c_angle));
            c_x += 0.25 * Math.sin(radians(c_angle));
        }
        else if (event.keyCode == 74){
            //j key go left
            c_x += 0.25;
        }
        else if (event.keyCode == 75){
            //k key go right
            c_x -= 0.25;
        }

        else if (event.keyCode == 82) {
          // s to pause animation
          if (animating)
          {
              animating = false;
          }
          else
          {
            animating = true;
          }
        }

        else if (event.keyCode == 78) {
            // n, narrow field of view
            fovy += 2.5;
        }
        else if (event.keyCode == 87) {
            // w, narrow field of view
            fovy -= 2.5;
        }

        else if (event.keyCode == 81)
          // q to reset
        {
          c_x = 0;
          c_y = c_yInit;
          c_z = c_zInit;
          c_angle = 0;
          fovy = fovy_init;
        }

        else if (event.keyCode == 66)
          // q to reset
        {
          for (var i = 0; i < 19; i++)
          {
            if (board1[i][5] == 0)
              board1[i][5] = 1;
            else
              board1[i][5] = 0;
          }
        }

        else if (event.keyCode == 49)
        {
          curLevel=1;
          resetBoard = true;
        }

        else if (event.keyCode == 50)
        {
          curLevel=2;
          resetBoard = true;
        }
           
    });


    render();
 
}


// Animation for cube

var animating = false; // true for orbiting, false to pause
var lastUpdateTime = 0;

function rotateCube()
{
    var currentTime = (new Date).getTime();
    if (animating)
    {
         // use time to calculate real-time displacement
        delta = currentTime - lastUpdateTime;

        cube1.angle += 1*cube1.rotationSpeed*(delta/100.0);  
        cube2.angle += 1*cube2.rotationSpeed*(delta/100.0);  

        lastUpdateTime = currentTime; // update time
    }
    else
        lastUpdateTime = currentTime;
}


var wall1 = {'name': "cube1", 'pos': [-10,0,-5], 'angle':0, 'scale':[1,2,26], 'rotationSpeed':10, 'rotateAxis': [0,1,0]};
var wall2 = {'name': "cube1", 'pos': [10,0,-5], 'angle':0, 'scale':[1,2,26], 'rotationSpeed':10, 'rotateAxis': [0,1,0]};
var wall3 = {'name': "cube1", 'pos': [0,0,-17.5], 'angle':180, 'scale':[21,2,1], 'rotationSpeed':10, 'rotateAxis': [0,1,0]};


/////////////////////////
/////Cube Attributes/////
/////////////////////////

// There are 4 configurable types of cubes that can be configured. 
// The position is reset when reading the board. 
// Scale is the same

var cube1 = {'name': "cube1", 'pos': [8,0,-15], 'scale':[1.9,0.95,0.95], 'texImage':"texImage1", 'angle':180, 'rotationSpeed':10, 'rotateAxis': [0,1,0]};
var cube2 = {'name': "cube2", 'pos': [1,0,8], 'scale':[1.9,0.95,0.95], 'texImage':"texImage2",  'angle':180, 'rotationSpeed':5, 'rotateAxis': [1,0,0]};
var cube3 = {'name': "cube3", 'pos': [1.5,0,-5], 'scale':[1.9,0.95,0.95], 'texImage':"texImage2",  'angle':180, 'rotationSpeed':5, 'rotateAxis': [1,0,0]};
var cube4 = {'name': "cube4", 'pos': [1.5,0,-5], 'scale':[1.9,0.95,0.95], 'texImage':"texImage2",  'angle':180, 'rotationSpeed':5, 'rotateAxis': [1,0,0]};


// Level 1 board 
var board1 = 
    //0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
                                //cut off, 
  [ [1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1 ], // 0
    [1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1 ], // 1
    [1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1 ], // 2
    [1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1 ], // 3
    [1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1 ], // 4
    [1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1 ], // 5
    [1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1 ], // 6
    [1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1 ], // 7
    [1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1 ], // 8
    [1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1 ], // 9
    [1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1 ], // 10
    [1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1 ], // 11
    [1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1 ], // 12
    [1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1 ], // 13
    [1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1 ], // 14
    [1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1 ], // 15
    [1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1 ], // 16
    [1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1 ], // 17
    [1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1 ] // 18
  ];

var board2 =
  [ [1, 0, 0, 0, 0, 0, 0, 0, 1,  1, 1 ], // 0
    [0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0 ], // 1
    [0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0 ], // 2
    [0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0 ], // 3
    [0, 0, 0, 0, 1, 0, 0, 0, 0,  0, 0 ], // 4
    [0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0 ], // 5
    [0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0 ], // 6
    [0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0 ], // 7
    [0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0 ], // 8
    [0, 0, 0, 1, 0, 0, 1, 0, 0,  0, 0 ], // 9
    [0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0 ], // 10
    [0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0 ], // 11
    [0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0 ], // 12
    [0, 1, 0, 0, 0, 0, 0, 0, 0,  0, 0 ], // 13
    [0, 1, 0, 0, 0, 1, 0, 0, 0,  0, 0 ], // 14
    [0, 1, 0, 0, 0, 1, 0, 0, 0,  0, 0 ], // 15
    [0, 1, 0, 0, 0, 1, 0, 0, 0,  0, 0 ], // 16
    [0, 1, 0, 0, 0, 1, 0, 0, 0,  0, 0 ], // 17
    [1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1 ] // 18
  ];

// Get cube position based on its location in the matrix. 
// The topleft translation is hardcoded. 
function getCubePos(i, j)
{
  var topleft = [-8, 0, -15];

  var x = topleft[0]+j*2;
  var y = 0;
  var z = topleft[2]+i;

  return [x,y,z];
}


// Initializes level, 
function initLevel(i)
{
  switch(i)
  {
    case 1:
      curBoard = board1;
      //numBlocks = 17*15;
      break;
    case 2:
      curBoard = board2;
      break;
    default:
      curBoard = board1;
  }
}

// Returns Cube
function getCube(i){
    if (i==0) return cube1;
    if (i==1) return cube2;
    if (i==2) return cube3;
    if (i==3) return cube4;
}

// Returns Wall
function getWall(i){
    if (i==0) return wall1;
    if (i==1) return wall2;
    if (i==2) return wall3;
}


// level attributes
var curLevel = 1;
var curBoard; 
var resetBoard = true;
var dyingCubes = [];

var render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Configure Projection Matrix
    var projectionMatrix = perspective(fovy, aspect, near, far);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );


    // Configure Camera Matrix
    var cameraMatrix = mat4();
    cameraMatrix = mult(cameraMatrix, rotate(c_angle, [0,1,0]));
    cameraMatrix = mult(cameraMatrix, rotate(30, [1,0,0]));
    cameraMatrix = mult(cameraMatrix, translate(c_x,c_y,c_z));

    gl.uniformMatrix4fv(cameraMatrixLoc, false, flatten(cameraMatrix) );

    if (resetBoard)
    {
      initLevel(curLevel);
      resetBoard = false; // make reset board = true when all blocks are destroyed. 
    }


    var image;
    // initialize Wall
    image = document.getElementById("texImage1");  //texImage1 and texImage2 loaded by html.
    configureTexture(image);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray2), gl.STATIC_DRAW );

    for (var i = 0; i < 3; i++)
    {
      var cur = getWall(i);

      // Transform model, translate and rotate
      var modelTransform = mat4();
      modelTransform = mult(modelTransform, translate(cur.pos));
      modelTransform = mult(modelTransform, rotate(cur.angle, cur.rotateAxis));
      modelTransform = mult(modelTransform, scale(cur.scale));
      gl.uniformMatrix4fv(modelTransformLoc, false, flatten(modelTransform) );

      gl.drawArrays( gl.TRIANGLES, 0, numVertices );
    }
    

    /////////////////////
    // Configure Cubes///

    // TODO: move this into the cubes building code for variable textures. 
    // Currently this sets all cubes as the same texture. 
    image = document.getElementById("texImage2");  //texImage1 and texImage2 loaded by html.
    configureTexture( image);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    // Loop inside board to configure
    for (var i = 0; i < 19; i++)
    {
      var cur;
        for (var j = 0; j < 9; j++)
        {
          //console.log(i + ' ' + j);
            switch(curBoard[i][j])
            {
              case 1:
                cur = cube1;
                cur.pos = getCubePos(i,j);
                break;
              default: // skip block and don't draw.
                continue;
            }

            var modelTransform = mat4();
            modelTransform = mult(modelTransform, translate(cur.pos));
            modelTransform = mult(modelTransform, rotate(cur.angle, cur.rotateAxis));
            modelTransform = mult(modelTransform, scale(cur.scale));
            gl.uniformMatrix4fv(modelTransformLoc, false, flatten(modelTransform) );

            // Put code here to Configure texture for current cube


            gl.drawArrays( gl.TRIANGLES, 0, numVertices );


        }
    }    
    

    //rotate cube
    //rotateCube();

    requestAnimFrame(render);
}
