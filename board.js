

var canvas;
var gl;

var numVertices  = 36;

var texSize = 64;

var program;

var pointsArray = [];
var colorsArray = [];
var normalsArray = [];
var texCoordsArray = [];
var texCoordsArray2 = [];

var sphereBV = [0.0,0.0,5.0,0.5];
var BV = [];
var triIndex = 0;
var dx = 0.0;
var dy = 0.0;
var dz = 0.0;
var subtract_z = false;

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


// These are vertices for the tetrahedron.
var va = vec4(0.0,0.0,-1.0,1);
var vb = vec4(0.0,0.942809,0.333333,1);
var vc = vec4(-0.816497,-0.471405,0.333333,1);
var vd = vec4(0.816497,-0.471405,0.333333,1);


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
    vec4( 0.7, 0.7, 0.7, 1.0 ),  // front
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
var drawingSphere;

var vTexCoord;
var vColor;

// Perspective Setup
var near = 0.1; //0.2 , 40
var far = 100.0;
var fovy_init = 40.0;
var fovy = fovy_init;  // Field-of-view in Y direction angle (in degrees)
var aspect;

var c_zInit = -21;  // Initial position
var c_z=c_zInit;    // dx, dy, dz of the camera
var c_yInit = -13;
var c_y=c_yInit;
var c_x=0;
var c_angle_yaw= 0;    // turn of the camera
var c_angle_pitch = 35;


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




function tetrahedron(a,b,c,d,n,normals)
{
	divideTriangle(a,b,c,n,normals);
	divideTriangle(d,c,b,n,normals);
	divideTriangle(a,d,b,n,normals);
	divideTriangle(a,c,d,n,normals);
}


function divideTriangle(a,b,c,count,normals)
{
	if (count > 0){
		var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);
                
        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);
		
		
		divideTriangle(a,ab,ac,count - 1,normals);
		divideTriangle(ab,b,bc,count - 1,normals);
		divideTriangle(bc,c,ac,count - 1,normals);
		divideTriangle(ab,bc,ac,count - 1,normals);
	}
	else{
		triangle(a,b,c,normals);
	}
}


function triangle(a,b,c, normals){

	if (normals == "flat") {
		var t1 = subtract(b, a);
		var t2 = subtract(c, a);
		var normal = normalize(cross(t2, t1));
		normal = vec4(normal);
		normal[3] = 0.0;

		normalsArray.push(normal[0], normal[1], normal[2], normal[3]);
		normalsArray.push(normal[0], normal[1], normal[2], normal[3]);
		normalsArray.push(normal[0], normal[1], normal[2], normal[3]);
		
	} else if (normals == "smooth"){
		normalsArray.push(a[0],a[1], a[2], 0.0);
		normalsArray.push(b[0],b[1], b[2], 0.0);
		normalsArray.push(c[0],c[1], c[2], 0.0);
	}
	
	pointsArray.push(a);
	pointsArray.push(b);
	pointsArray.push(c);
	
	triIndex += 3;
}





// This function tests the collision of a sphere and an Axis-Aligned-Bounding-Box (AABB)
function testSphere( AABB, sphere) {
	var dist_squared = sphere[3]*sphere[3];
	
	if (sphere[0] < AABB[0])
		dist_squared -= (sphere[0] - AABB[0])*(sphere[0] - AABB[0]);
	else if (sphere[0] > AABB[3])
		dist_squared -= (sphere[0] - AABB[3])*(sphere[0] - AABB[3]);
	
	if (sphere[1] < AABB[1])
		dist_squared -= (sphere[1] - AABB[1])*(sphere[1] - AABB[1]);
	else if (sphere[1] > AABB[4])
		dist_squared -= (sphere[1] - AABB[4])*(sphere[1] - AABB[4]);
	
	if (sphere[2] < AABB[2])
		dist_squared -= (sphere[2] - AABB[2])*(sphere[2] - AABB[2]);
	else if (sphere[2] > AABB[5])
		dist_squared -= (sphere[2] - AABB[5])*(sphere[2] - AABB[5]);
	

	return dist_squared > 0;
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
	tetrahedron(va,vb,vc,vd,4,"smooth");

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    
    vColor = gl.getAttribLocation( program, "vColor" );
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
	drawingSphere = gl.getUniformLocation(program, "drawingSphere");



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
            //c_angle_yaw -= 1;
            pad.pos[0] -=0.5;
        }
        else if (event.keyCode ==39){
            // right, turn right
            //c_angle_yaw += 1;
            pad.pos[0] +=0.5;
        }
        else if (event.keyCode == 73){
            //i key go forward

            c_z += 0.25 * Math.cos(radians(c_angle_yaw));   // cosine and sine for proper motion

            c_x -= 0.25 * Math.sin(radians(c_angle_yaw));
        }
        else if (event.keyCode == 79) {
            //o key go backward   or m 
            c_z -= 0.25 * Math.cos(radians(c_angle_yaw));
            c_x += 0.25 * Math.sin(radians(c_angle_yaw));
        }
        else if (event.keyCode == 77) {
            //m key to go backward also
            c_z -= 0.25 * Math.cos(radians(c_angle_yaw));
            c_x += 0.25 * Math.sin(radians(c_angle_yaw));
        }
        else if (event.keyCode == 74){
            //j key go left
            c_x += 0.25*Math.cos(radians(c_angle_yaw));
			c_z += 0.25*Math.sin(radians(c_angle_yaw));
        }
        else if (event.keyCode == 75){
            //k key go right
            c_x -= 0.25*Math.cos(radians(c_angle_yaw));
			c_z -= 0.25*Math.sin(radians(c_angle_yaw));
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
          c_angle_yaw = 0;
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

        // key '1' intialized level 1
        else if (event.keyCode == 49)
        {
          curLevel=1;
          resetBoard = true;
        }

        // key '2' intialized level 2
        else if (event.keyCode == 50)
        {
          curLevel=2;
          resetBoard = true;
        }

        // Key '9' fills board
        else if (event.keyCode == 57)
        {
          curLevel=-1;
          resetBoard = true;
        }

        // Key '0' Empties Board
        else if (event.keyCode == 48)
        {
          curLevel=0;
          resetBoard = true;
        }

        console.log("Event");
           
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
var wall2 = {'name': "cube1", 'pos': [10,0,-5], 'angle':0, 'scale':[1,2,26], 'rotationSpeed':10, 'rotateAxis': [0,1,0]};  // Back wall
var wall3 = {'name': "cube1", 'pos': [0,0,-17.5], 'angle':180, 'scale':[21,2,1], 'rotationSpeed':10, 'rotateAxis': [0,1,0]}; // Back Wall

/////////////////////////
/////Cube Attributes/////
/////////////////////////

// There are 4 configurable types of cubes that can be configured. 
// The position is reset when reading the board. 
// Scale is the same

var cube1 = {'name': "cube1", 'pos': [8,0,-15], 'scale':[1.9,0.95,1.9], 'texImage':"texImage1", 'angle':180, 'rotationSpeed':10, 'rotateAxis': [0,1,0]};
var cube2 = {'name': "cube2", 'pos': [1,0,8], 'scale':[1.9,0.95,1.9], 'texImage':"texImage2",  'angle':180, 'rotationSpeed':5, 'rotateAxis': [1,0,0]};
var cube3 = {'name': "cube3", 'pos': [1.5,0,-5], 'scale':[1.9,0.95,1.9], 'texImage':"texImage2",  'angle':180, 'rotationSpeed':5, 'rotateAxis': [1,0,0]};
var cube4 = {'name': "cube4", 'pos': [1.5,0,-5], 'scale':[1.9,0.95,1.9], 'texImage':"texImage2",  'angle':180, 'rotationSpeed':5, 'rotateAxis': [1,0,0]};

var pad = {'name': "pad", 'pos': [0,0,8.5], 'scale':[4,0.7,0.5], 'texImage':"texImage1", 'angle':180, 'rotationSpeed':10, 'rotateAxis': [0,1,0]};
function getPad(){
  return pad;
}

// Get cube position based on its location in the matrix. 
// The topleft translation is hardcoded. 
function getCubePos(i, j)
{
  var topleft = [-8, 0, -15];

  var x = topleft[0]+j*2;
  var y = 0;
  var z = topleft[2]+i*2;

  return [x,y,z];
}


// Initializes level, 
function initLevel(i)
{
  // Board defintions is in levelDef.js
  console.log("Init Level:" + i);
  switch(i)
  {
    // Full board
    case -1:
      curBoard = board11;
      break;

      // Empty board
    case 0:
      curBoard = board00;
      break;

      // Level 1
    case 1:
      curBoard = board1;
      break;

      // Level 2
    case 2:
      curBoard = board2;
      break;
    default:
      curBoard = board00;
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
	
	var index = 0;

    // Configure Projection Matrix
    var projectionMatrix = perspective(fovy, aspect, near, far);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );


    // Configure Camera Matrix
    var cameraMatrix = mat4();
    cameraMatrix = mult(cameraMatrix, rotate(c_angle_yaw, [0,1,0]));
    cameraMatrix = mult(cameraMatrix, rotate(c_angle_pitch, [1,0,0]));
    cameraMatrix = mult(cameraMatrix, translate(c_x,c_y,c_z));

    gl.uniformMatrix4fv(cameraMatrixLoc, false, flatten(cameraMatrix) );

    if (resetBoard)
    {
      initLevel(curLevel);
      resetBoard = false; // make reset board = true when all blocks are destroyed. 
    }

	
	// These turn on the attributes in the shaders to draw the cubes with textures.
	gl.uniform1i(drawingSphere, false);
	gl.enableVertexAttribArray( vColor );
	gl.enableVertexAttribArray( vTexCoord );
	
	
	
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
    for (var i = 0; i < 10; i++)
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
				
				// We add a bounding volume for every brick that we draw.
				// These bounding volumes are contained in a list of lists.
				BV[index] = [cur.pos[0] - cube1.scale[0]/2, cur.pos[1] - cube1.scale[1]/2, cur.pos[2] - cube1.scale[2]/2,
								cur.pos[0] + cube1.scale[0]/2, cur.pos[1] + cube1.scale[1]/2, cur.pos[2] + cube1.scale[2]/2];
				index += 1;
				
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

///////////////////////////////////
///////////Drawing Pad/////////////
///////////////////////////////////

  var modelTransform = mat4();
  modelTransform = mult(modelTransform, translate(pad.pos));
  modelTransform = mult(modelTransform, rotate(pad.angle, pad.rotateAxis));
  modelTransform = mult(modelTransform, scale(pad.scale));
  gl.uniformMatrix4fv(modelTransformLoc, false, flatten(modelTransform) );

  gl.drawArrays( gl.TRIANGLES, 0, numVertices );

  // Collision detection for the pad is added here.
	BV[index] = [pad.pos[0] - pad.scale[0]/2, pad.pos[1] - pad.scale[1]/2, pad.pos[2] - pad.scale[2]/2,
				pad.pos[0] + pad.scale[0]/2, pad.pos[1] + pad.scale[1]/2, pad.pos[2] + pad.scale[2]/2];

	index += 1;
	// Here we test the sphere against every bounding volume we have
	// (ie, for every brick we are currently drawing). This happens at
	// at every render call, so it might be a bit inefficient. We could
	// make it better by using bounding volume hierarchies.
	for (var t = 0; t < index; t++) {
		if (testSphere(BV[t], sphereBV)) {
			subtract_z = !subtract_z; // We change the state of the balls movement to bounce back.
		}
	}
	if (subtract_z == true) {
		dz += 0.05;
      dx += 0.01;
	} else {
		dz -= 0.05;
      dx -= 0.01;
	}

	sphereBV[0] = 0.0 + dx; // We have to update the BV every time we translate the sphere.
	sphereBV[1] = 0.0 + dy; // So we have these statements that add d_ to the initial position of the sphere.
	sphereBV[2] = 5.0 + dz; // This one is 5.0 because the initial z value of the sphere is 5.0
	
	
	modelTransform = mult(mat4(), translate(0,0,5));
	modelTransform = mult(modelTransform, translate(dx,dy,dz));
	modelTransform = mult(modelTransform, scale(0.51,0.51,0.51));
	gl.uniformMatrix4fv(modelTransformLoc, false, flatten(modelTransform) );
	
	// We disable the texturing and color attributes to draw the sphere.
	// We also tell the shaders that we're about to draw the sphere.
	gl.disableVertexAttribArray( vTexCoord );
	gl.disableVertexAttribArray( vColor );
	gl.uniform1i(drawingSphere, true);
    gl.drawArrays( gl.TRIANGLES, numVertices, triIndex );
	






    //rotate cube
    rotateCube();

    requestAnimFrame(render);
}






