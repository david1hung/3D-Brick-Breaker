
var canvas;
var gl;

var textCanvas, ctx;


var numVertices  = 36;

var texSize = 64;

var program;

var play_song = true;
var myAudio = new Audio('sounds/musicbg.wav');

var pointsArray = [];
var colorsArray = [];
var normalsArray = [];
var textures = [];
var texCoordsArray = [];
var texCoordsArray2 = [];
var metal_index = 0;


var cube1Pos = [];
var cube2Pos = [];
var cube3Pos = [];
var cube4Pos = [];
var cube5Pos = [];
var dyingCubes1 = [];
var dyingCubes2 = [];
var dyingCubes3 = [];
var dyingCubes4 = [];
var dyingCubes5 = [];

var sphereBV = [0.0,0.0,7.0,0.5];
var BV = [];
var updateBV = true;
var triIndex = 0;
var dx = 0.0;
var dy = 0.0;
var dz = 0.0;
var moveD = false;
var moveR = true;
var CDPause = 0;
var px = 0.0;
var angleInit = 0.1;
var angle = angleInit;
var isLit;
var isFire = false;
var ballLight = false;
var padLight = true;
var staticLight = false;
var lightEverything = false;

var angleL = 0.0;
var padR = false;
var padL = false;
var popBV = false;
var start = false;
var firstStart = false;
var gameOver = false;
var highScore = 0;

var texture;
var image;

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0), 
/*
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0),
*/
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


var lightPosition = vec4(0 ,5, 7, 1 );
var lightAmbient = vec4(0.96, 0.35, 0.05, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 20.0;

var ambientProduct, diffuseProduct, specularProduct;
var ambientLoc, diffuseLoc, specularLoc, shininessLoc, lightPosLoc;


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
var vNormal;

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


// Configures Texture! and pushes into textures[] array for easy access
function configureTexture(image) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // flipped cause html and webgl uses different Y coords.
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, 
         gl.RGB, gl.UNSIGNED_BYTE, image );

    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
      
    
    //gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
	textures.push(texture);
	gl.bindTexture(gl.TEXTURE_2D, null);
}


// Set elements for lighting
function setElements(object, lit){
	if(object == "pad") {
		materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
		materialDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
		materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
		materialShininess = 10.0;
		//gl.uniform4fv(lightPosLoc, flatten(vec4(pad.pos[0],pad.pos[1],pad.pos[2], 1.0)));
	} else if(object == "ball"){
		/*materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
		materialDiffuse = vec4( 0.0, 0.5, 1.0, 1.0 );
		materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
		materialShininess = 30.0;*/
    materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
    materialDiffuse = vec4( 1.0, 0.5, 1.0, 1.0 );
    materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
    materialShininess = 30.0;
    //gl.uniform4fv(lightPosLoc, flatten(vec4(sphereBV[0],sphereBV[1],sphereBV[2], 1.0)));
	}
  if (padLight)
    gl.uniform4fv(lightPosLoc, flatten(vec4(pad.pos[0],pad.pos[1],pad.pos[2], 1.0)));
  else if (ballLight)
    gl.uniform4fv(lightPosLoc, flatten(vec4(sphereBV[0],sphereBV[1],sphereBV[2], 1.0)));
  else if (staticLight)
    gl.uniform4fv(lightPosLoc, flatten(lightPosition));


	
	ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	
	gl.uniform4fv(ambientLoc, ambientProduct);
	gl.uniform4fv(diffuseLoc, diffuseProduct);
	gl.uniform4fv(specularLoc, specularProduct);
	gl.uniform1f(shininessLoc, materialShininess);
	gl.uniform1i(isLit, lit);
}


// For sphere initialization
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

	var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    var normal = vec4(normal);
	normal[3] = 0.0;


	normalsArray.push(normal[0], normal[1], normal[2], normal[3]);
	normalsArray.push(normal[0], normal[1], normal[2], normal[3]);
	normalsArray.push(normal[0], normal[1], normal[2], normal[3]);
	normalsArray.push(normal[0], normal[1], normal[2], normal[3]);
	normalsArray.push(normal[0], normal[1], normal[2], normal[3]);
	normalsArray.push(normal[0], normal[1], normal[2], normal[3]);
	 
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




function testSide( AABB, sphere) {
	if ((AABB[0] > sphere[0]) && (AABB[0] - sphere[0]) < 0.48) return 1;
	if ((sphere[0] > AABB[3]) && (sphere[0] - AABB[3]) < 0.48) return 2;
	//if (Math.abs(sphere[1] - AABB[1]) < sphere[3]) return 3;
	//if (Math.abs(sphere[1] - AABB[4]) < sphere[3]) return 4;
	if ((AABB[2] > sphere[2]) && (AABB[2] - sphere[2]) < 0.48) return 6;
	if ((sphere[2] > AABB[5]) && (sphere[2] - AABB[5]) < 0.48) return 5;
	
	return 0;
}


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    textCanvas = document.getElementById("text");
    ctx = textCanvas.getContext("2d");
    
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
	//colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    
    vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
	
	//Buffer to hold the normals that our triangle function produced.
	nBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);
	
	
	//Sets the normals for our shader.
	vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

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
	isLit = gl.getUniformLocation( program, "isLit");
	ambientLoc = gl.getUniformLocation( program, "ambientProduct");
	diffuseLoc = gl.getUniformLocation( program, "diffuseProduct");
	specularLoc = gl.getUniformLocation( program, "specularProduct");
	shininessLoc = gl.getUniformLocation( program, "shininess");
	lightPosLoc = gl.getUniformLocation( program, "lightPosition");

  gl.uniform4fv(lightPosLoc, flatten(lightPosition));



    document.addEventListener('keydown', function(event){
        if(event.keyCode ==38 && !gameOver){
            //Up cursor key   shift camer up/shift world down
            c_y -=0.25;
        }
        else if(event.keyCode ==40 && !gameOver){
            //Down cursor key
            c_y +=0.25;
        }
        else if (event.keyCode ==37 && !gameOver){
            // left, turn left
            //c_angle_yaw -= 1;
			padL = true;
            //pad.pos[0] -=px;
			//px += 0.01 + px;
        }
        else if (event.keyCode ==39 && !gameOver){
            // right, turn right
            //c_angle_yaw += 1;
			padR = true;
            //pad.pos[0] +=px;
			//px += 0.01 + px;
        }
        else if (event.keyCode == 73 && !gameOver){
            //i key go forward

            c_z += 0.25 * Math.cos(radians(c_angle_yaw));   // cosine and sine for proper motion

            c_x -= 0.25 * Math.sin(radians(c_angle_yaw));
        }
        else if (event.keyCode == 79 && !gameOver) {
            //o key go backward   or m 
            c_z -= 0.25 * Math.cos(radians(c_angle_yaw));
            c_x += 0.25 * Math.sin(radians(c_angle_yaw));
        }
        else if (event.keyCode == 77 && !gameOver) {
            //m key to go backward also
            c_z -= 0.25 * Math.cos(radians(c_angle_yaw));
            c_x += 0.25 * Math.sin(radians(c_angle_yaw));
        }
        else if (event.keyCode == 74 && !gameOver){
            //j key go left
            c_x += 0.25*Math.cos(radians(c_angle_yaw));
			c_z += 0.25*Math.sin(radians(c_angle_yaw));
        }
        else if (event.keyCode == 75 && !gameOver){
            //k key go right
            c_x -= 0.25*Math.cos(radians(c_angle_yaw));
			c_z -= 0.25*Math.sin(radians(c_angle_yaw));
        }

        else if (event.keyCode == 82 && !gameOver) {
          // r kill cube

          isAlive = false;
        }

        else if (event.keyCode == 78 && !gameOver) {
            // n, narrow field of view
            fovy += 2.5;
        }
        else if (event.keyCode == 87 && !gameOver) {
            // w, narrow field of view
            fovy -= 2.5;
        }

        else if (event.keyCode == 81 && !gameOver)
          // q to reset
        {
          c_x = 0;
          c_y = c_yInit;
          c_z = c_zInit;
          c_angle_yaw = 0;
          fovy = fovy_init;
        }

        else if (event.keyCode == 66 && !gameOver)
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
        else if (event.keyCode == 49 && !gameOver)
        {
          curLevel=1;
          resetBoard = true;
        }

        // key '2' intialized level 2
        else if (event.keyCode == 50 && !gameOver)
        {
          curLevel=2;
          resetBoard = true;
        }

        // key 3 for level 3
        else if (event.keyCode == 51 && !gameOver)
        {
          curLevel=3;
          resetBoard = true;
        }
		
		    //key 4 for level 4
		    else if (event.keyCode == 52 && !gameOver)
        {
          curLevel=4;
          resetBoard = true;
        }
				//key 5 for level 5
		    else if (event.keyCode == 53 && !gameOver)
        {
          curLevel=5;
          resetBoard = true;
        }

        // key 6 for level win!
        else if (event.keyCode == 54 && !gameOver)
        {
          curLevel=6;
          resetBoard = true;
        }

        // Key '9' fills board
        else if (event.keyCode == 57 && !gameOver)
        {
          curLevel=-1;
          resetBoard = true;
        }

        // Key '0' Empties Board
        else if (event.keyCode == 48 && !gameOver)
        {
          curLevel=0;
          resetBoard = true;
        }
		else if (event.keyCode == 32)
		{
			start = true;
      firstStart = true;

      // Ball is dead, move back to start position
		}
    else if (event.keyCode == 90)
    {
      ballLight = true;
      padLight = false;
      staticLight = false;
    }
    else if (event.keyCode == 88)
    {
      ballLight = false;
      padLight = true;
      staticLight = false;
    }
    else if (event.keyCode == 67)
    {
      ballLight = false;
      padLight = false;
      staticLight = true;
    }
    else if (event.keyCode == 86)
    {
      lightEverything = !lightEverything;
    }
    else if (event.keyCode == 70)
    {
      isFire = !isFire;
    }

    // Press Enter to reset
    else if (event.keyCode == 13 && gameOver)
    {
      resetBoard = true;
      curLevel = 1;
      curLife = 10;
      curScore = 0;
      gameOver = false;
      isAlive = true;
    }

			else if (event.keyCode == 83 && !gameOver) //s to toggle music
		{
			play_song = !play_song;

		}
           
    });
	
	
	document.addEventListener('keyup', function(event) {
		if(event.keyCode == 37) {
			padL = false;
			//px = 0.0;
		} else if (event.keyCode == 39){
			padR = false;
			//px = 0.0;
		}
	});

	

	// Bounding volume for Wall
	BV[0] = [wall1.pos[0] - wall1.scale[0]/2, wall1.pos[1] - wall1.scale[1]/2, wall1.pos[2] - wall1.scale[2]/2,
				wall1.pos[0] + wall1.scale[0]/2, wall1.pos[1] + wall1.scale[1]/2, wall1.pos[2] + wall1.scale[2]/2];
	BV[1] = [wall2.pos[0] - wall2.scale[0]/2, wall2.pos[1] - wall2.scale[1]/2, wall2.pos[2] - wall2.scale[2]/2,
				wall2.pos[0] + wall2.scale[0]/2, wall2.pos[1] + wall2.scale[1]/2, wall2.pos[2] + wall2.scale[2]/2];
	BV[2] = [wall3.pos[0] - wall3.scale[0]/2, wall3.pos[1] - wall3.scale[1]/2, wall3.pos[2] - wall3.scale[2]/2,
				wall3.pos[0] + wall3.scale[0]/2, wall3.pos[1] + wall3.scale[1]/2, wall3.pos[2] + wall3.scale[2]/2];
	
  // texture[0]
	image = document.getElementById("arenaWall");
	configureTexture(image);
  // texture[1]
	image = document.getElementById("metal");
	configureTexture(image);
  // texture[2]
	image = document.getElementById("brick");
	configureTexture(image);
  // texture[3]
	image = document.getElementById(pad.texImage);
	configureTexture(image);
	
  // texture [4]
  image = document.getElementById("ice");
  configureTexture(image);
  // texture [5] // wall
  image = document.getElementById("arenaWall");
  configureTexture(image);
  // texture [6] 
   image = document.getElementById("forest");
  configureTexture(image);
    // texture [7] 
  image = document.getElementById("fire2");
  configureTexture(image);

    requestAnimFrame(render);
 
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

var cube1 = {'name': "cube1", 'pos': [8,0,-15], 'scale':[1.9,0.95,1.9], 'texImage':"texImage1", 'angle':0, 'rotationSpeed':10, 'rotateAxis': [0,1,0]};
var cube2 = {'name': "cube2", 'pos': [1,0,8], 'scale':[1.9,0.95,1.9], 'texImage':"texImage2",  'angle':90, 'rotationSpeed':5, 'rotateAxis': [0,1,0]};
var cube3 = {'name': "cube3", 'pos': [1.5,0,-5], 'scale':[1.9,0.95,1.9], 'texImage':"texImage2",  'angle':180, 'rotationSpeed':5, 'rotateAxis': [1,0,0]};
var cube4 = {'name': "cube4", 'pos': [1.5,0,-5], 'scale':[1.9,0.95,1.9], 'texImage':"texImage2",  'angle':180, 'rotationSpeed':5, 'rotateAxis': [1,0,0]};
var cube5 = {'name': "cube5", 'pos': [1.5,0,-5], 'scale':[1.9,0.95,1.9], 'texImage':"texImage2",  'angle':180, 'rotationSpeed':5, 'rotateAxis': [1,0,0]};
var cube6 = {'name': "cube6", 'pos': [1.5,0,-5], 'scale':[1.9,0.95,1.9], 'texImage':"texImage2",  'angle':180, 'rotationSpeed':5, 'rotateAxis': [1,0,0]};

var cube10 = {'name':"dyingCubes", 'pos': [1.5,0,-5], 'scale':[1.9*0.9,0.95*0.9,1.9*0.9], 'texImage':"texImage2",  'angle':180, 'rotationSpeed':5, 'rotateAxis': [1,0,0]};
var cube11 = {'name':"dyingCubes", 'pos': [1.5,0,-5], 'scale':[1.9*0.8,0.95*0.8,1.9*0.8], 'texImage':"texImage2",  'angle':180, 'rotationSpeed':5, 'rotateAxis': [1,0,0]};
var cube12 = {'name':"dyingCubes", 'pos': [1.5,0,-5], 'scale':[1.9*0.6,0.95*0.6,1.9*0.6], 'texImage':"texImage2",  'angle':180, 'rotationSpeed':5, 'rotateAxis': [1,0,0]};
var cube13 = {'name':"dyingCubes", 'pos': [1.5,0,-5], 'scale':[1.9*0.3,0.95*0.3,1.9*0.3], 'texImage':"texImage2",  'angle':180, 'rotationSpeed':5, 'rotateAxis': [1,0,0]};
var cube14 = {'name':"dyingCubes", 'pos': [1.5,0,-5], 'scale':[1.9*0.1,0.95*0.1,1.9*0.1], 'texImage':"texImage2",  'angle':180, 'rotationSpeed':5, 'rotateAxis': [1,0,0]};
var cube15 = {'name':"dyingCubes", 'pos': [1.5,0,-5], 'scale':[0,0,0], 'texImage':"texImage2",  'angle':180, 'rotationSpeed':5, 'rotateAxis': [1,0,0]};

var pad = {'name': "pad", 'pos': [0,0,8.5], 'scale':[4,0.7,0.5], 'texImage':"arenaWall", 'angle':180, 'rotationSpeed':10, 'rotateAxis': [0,1,0]};
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

// Generates Random level
function setRandomBoard()
{
    for (var i = 0; i < 10; i++)
    {
      for (var j = 0; j < 9; j++)
      {
          if (Math.floor(Math.random()*10)<7)
                boardRandom[i][j] = Math.floor(Math.random()*6);
          else
                boardRandom[i][j] = 0;
      }
    }
}



// Initializes level, 
function initLevel(i)
{
  // Board defintions is in levelDef.js
  console.log("Init Level: " + i);
  numBricks = 0;
  //console.log(numBricks);

  var board;
  switch(i)
  {
    // Full board
    case -1:
      setRandomBoard();
      board = boardRandom;
      break;

      // Empty board
    case 0:
      board = board00;
      break;

      // Level 1
    case 1:
      board = board1;
      break;

      // Level 2
    case 2:
      board = board2;
      break;

    case 3:
      board = board3;
      break;
	  
	 case 4:
	   board = board4;
	 break;
	 
	 case 5:
	   board = board5;
	 break;

   case 6: 
    board = boardWin;
    break;
	 
    default:
      setRandomBoard();
      board = boardRandom;
  }

    for (var i = 0; i < 10; i++)
    {
      for (var j = 0; j < 9; j++)
      {
          curBoard[i][j] = board[i][j];

          // Count the number of active bricks
          if (board[i][j] > 0)
            numBricks++;
      }
    }

  console.log("NumBricks: " + numBricks);
}

// Returns Cube
function getCube(i){
  switch (i)
  {
    case 1: return cube1; 
    case 2: return cube2; 
    case 3: return cube3; 
    case 4: return cube4; 
    case 5: return cube5; 
    case 6: return cube6; 


    case 10: case 20: case 30: case 40: case 50: return cube10; 
    case 11: case 21: case 31: case 41: case 51: return cube11; 
    case 12: case 22: case 32: case 42: case 52: return cube12; 
    case 13: case 23: case 33: case 43: case 53: return cube13; 
    case 14: case 24: case 34: case 44: case 54: return cube14;
    case 15: case 25: case 35: case 45: case 55: return cube15; 
  }

}

// Returns Wall
function getWall(i){
    if (i==0) return wall1;
    if (i==1) return wall2;
    if (i==2) return wall3;
}

var offset = 0.4;
var posOffset = [{'x':offset, 'z':offset}, {'x':offset, 'z':-offset}, {'x':-offset, 'z':offset}, {'x':-offset, 'z':-offset}];

// level attributes
var curLevel = 1;
var curBoard = boardTemp;
var resetBoard = true;
var curLife = 10;
var curScore = 0;
var isAlive = true;
var numBricks = 0;



// Draw cubes given array of positions
var drawCubes = function (brickPos)
{
  var i, j;
  var type;
  for (var k = 0; k < brickPos.length; k++)
    {
      i = brickPos[k][0];
      j = brickPos[k][1];
      var cur;

      // Get actual type if it's dying
      type = curBoard[i][j];
      cur = getCube(type);
      cur.pos = getCubePos(i, j);


      //console.log(pos[0] + ' ' + pos[1] + ' ' + pos[2]);
      var modelTransform = mat4();
      modelTransform = mult(modelTransform, translate(cur.pos));
      modelTransform = mult(modelTransform, rotate(cur.angle, cur.rotateAxis));
      modelTransform = mult(modelTransform, scale(cur.scale));
      gl.uniformMatrix4fv(modelTransformLoc, false, flatten(modelTransform) );

            // Put code here to Configure texture for current cube
      gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    }
}

var setTexture = function(imageName)
{
    //image = document.getElementById(imageName);  //texImage1 and texImage2 loaded by html.
    //configureTexture(image);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

}

// Sound Definitions
var sHitPad = new Audio("sounds/ballhitsPaddle.wav"); // buffers automatically when created
var sHitBrick = new Audio("sounds/metalbreak.wav");
var sHitMetal = new Audio("sounds/metalbreak.wav");
var sHitWall = new Audio("sounds/ballhitswall.wav");
var sLoseLife = new Audio("sounds/loselife.wav");



var render = function(time){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	gl.uniform1i(isLit, lightEverything);
	var index = 3;

    // Configure Projection Matrix
    var projectionMatrix = perspective(fovy, aspect, near, far);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );


    // Configure Camera Matrix
    var cameraMatrix = mat4();
    cameraMatrix = mult(cameraMatrix, rotate(c_angle_yaw, [0,1,0]));
    cameraMatrix = mult(cameraMatrix, rotate(c_angle_pitch, [1,0,0]));
    cameraMatrix = mult(cameraMatrix, translate(c_x,c_y,c_z));

    gl.uniformMatrix4fv(cameraMatrixLoc, false, flatten(cameraMatrix) );

    // Resets level
    if (resetBoard)
    {
      initLevel(curLevel);
      resetBoard = false; // make reset board = true when all blocks are destroyed. 
    }

    // Do intro animation
    if (animateIntro)
    {
      introAnimate();
    }

    // Spin wall on level complete
    if (animateWall)
    {
      spinWall();  
    }

	
	// These turn on the attributes in the shaders to draw the cubes with textures.
	gl.uniform1i(drawingSphere, false);
	gl.enableVertexAttribArray( vColor );
	gl.enableVertexAttribArray( vTexCoord );
	
	
	
    // initialize Wall
	gl.bindTexture(gl.TEXTURE_2D, textures[5]);
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

    // Clean up arrays
	  cube1Pos.splice(0,cube1Pos.length);
    cube2Pos.splice(0,cube2Pos.length);
    cube3Pos.splice(0,cube3Pos.length);
    cube4Pos.splice(0,cube4Pos.length);
    cube5Pos.splice(0,cube5Pos.length);
    dyingCubes1.splice(0,dyingCubes1.length);
    dyingCubes2.splice(0,dyingCubes2.length);
    dyingCubes3.splice(0,dyingCubes3.length);
    dyingCubes4.splice(0,dyingCubes4.length);
    dyingCubes5.splice(0,dyingCubes5.length);

    // Loop inside board to configure
    for (var i = 0; i < 10; i++)
    {
      var cur;
        for (var j = 0; j < 9; j++)
        {
          //console.log(i + ' ' + j);

          // Read the current board and draw each cube properly
            switch(curBoard[i][j])
            {
              case 1:
                cur = cube1;
                cur.pos = getCubePos(i,j);
                cube1Pos.push([i,j]);
				
				// We add a bounding volume for every brick that we draw.
				// These bounding volumes are contained in a list of lists.
				if (updateBV == true) {
					BV[index] = [cur.pos[0] - cube1.scale[0]/2, cur.pos[1] - cube1.scale[1]/2, cur.pos[2] - cube1.scale[2]/2,
								cur.pos[0] + cube1.scale[0]/2, cur.pos[1] + cube1.scale[1]/2, cur.pos[2] + cube1.scale[2]/2,
								i, j];
				}
				index += 1;

            case 2:
              cur = cube2;
              cur.pos = getCubePos(i,j);
              cube2Pos.push([i,j]);

              if (updateBV == true) {
				BV[index] = [cur.pos[0] - cube1.scale[0]/2, cur.pos[1] - cube1.scale[1]/2, cur.pos[2] - cube1.scale[2]/2,
                cur.pos[0] + cube1.scale[0]/2, cur.pos[1] + cube1.scale[1]/2, cur.pos[2] + cube1.scale[2]/2,
                i, j];
				}
				index += 1;
        
                break;


            case 3:
              cur = cube2;
              cur.pos = getCubePos(i,j);
              cube3Pos.push([i,j]);

              if (updateBV == true) {
                BV[index] = [cur.pos[0] - cube1.scale[0]/2, cur.pos[1] - cube1.scale[1]/2, cur.pos[2] - cube1.scale[2]/2,
                cur.pos[0] + cube1.scale[0]/2, cur.pos[1] + cube1.scale[1]/2, cur.pos[2] + cube1.scale[2]/2,
                i, j];
              }
              index += 1;
              break;
       
            case 4:
              cur = cube1;
              cur.pos = getCubePos(i,j);
              cube4Pos.push([i,j]);

              if (updateBV == true) {
                BV[index] = [cur.pos[0] - cube1.scale[0]/2, cur.pos[1] - cube1.scale[1]/2, cur.pos[2] - cube1.scale[2]/2,
                cur.pos[0] + cube1.scale[0]/2, cur.pos[1] + cube1.scale[1]/2, cur.pos[2] + cube1.scale[2]/2,
                i, j];
              }
              index += 1;
              break;
                 
            case 5:
              cur = cube2;
              cur.pos = getCubePos(i,j);
              cube5Pos.push([i,j]);

              if (updateBV == true) {
                BV[index] = [cur.pos[0] - cube1.scale[0]/2, cur.pos[1] - cube1.scale[1]/2, cur.pos[2] - cube1.scale[2]/2,
                cur.pos[0] + cube1.scale[0]/2, cur.pos[1] + cube1.scale[1]/2, cur.pos[2] + cube1.scale[2]/2,
                i, j];
              }
              index += 1;
              break;

              case 10:
              case 11:
              case 12:
              case 13:
              case 14:
                 dyingCubes1.push([i,j]);
                 curBoard[i][j]++;
                 break;
              case 15:
                curBoard[i][j]=0;
                curScore += 100;
                numBricks--;
                //console.log(numBricks);
                break;


              case 20:
              case 21:
              case 22:
              case 23:
              case 24:
                 dyingCubes2.push([i,j]);
                 curBoard[i][j]++;
                 break;
              case 25:
                 curBoard[i][j]=0;
                 curScore += 100;
                 numBricks--;
                 //console.log(numBricks);
                 break;

              case 30:
              case 31:
              case 32:
              case 33:
              case 34:
                 dyingCubes3.push([i,j]);
                 curBoard[i][j]++;
                 break;
              case 35:
                 curBoard[i][j]=0;
                 curScore += 100;
                 numBricks--;
                 //console.log(numBricks);
                 break;

              case 40:
              case 41:
              case 42:
              case 43:
              case 44:
                 dyingCubes4.push([i,j]);
                 curBoard[i][j]++;
                 break;
              case 45:
                 curBoard[i][j]=0;
                 curScore += 100;
                 numBricks--;
                 //console.log(numBricks);
                 break;

              case 50:
              case 51:
              case 52:
              case 53:
              case 54:
                 dyingCubes5.push([i,j]);
                 curBoard[i][j]++;
                 break;
              case 55:
                 curBoard[i][j]=0;
                 curScore += 100;
                 numBricks--;
                 //console.log(numBricks);
                 break;

              default: // skip block and don't draw.
                continue;
            }
        }
    }
	//updateBV = false;
    

    // 1. setTexture for the cubes 
    // 2. Draw the cubes
	gl.bindTexture(gl.TEXTURE_2D, textures[1]);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    drawCubes(cube1Pos);
    //drawCubes(dyingCubes1);

    //setTexture(cube2Texture);
	gl.bindTexture(gl.TEXTURE_2D, textures[2]);
    drawCubes(cube2Pos);
    drawCubes(dyingCubes2);


  gl.bindTexture(gl.TEXTURE_2D, textures[4]);
    drawCubes(cube3Pos);
    drawCubes(dyingCubes3);

  gl.bindTexture(gl.TEXTURE_2D, textures[6]);
    drawCubes(cube4Pos);
    drawCubes(dyingCubes4);
  
  gl.bindTexture(gl.TEXTURE_2D, textures[7]);
    drawCubes(cube5Pos);
    drawCubes(dyingCubes5);


///////////////////////////////////
///////////Drawing Pad/////////////
///////////////////////////////////

	gl.bindTexture(gl.TEXTURE_2D, textures[3]);
	
	//gl.enableVertexAttribArray( vNormal );
  
  var modelTransform = mat4();
  if (padR == true && pad.pos[0] < 11.2)
	  pad.pos[0] += 0.25;
  if (padL == true && pad.pos[0] > -11.2)
	  pad.pos[0] -= 0.25;
  modelTransform = mult(modelTransform, translate(pad.pos));
  modelTransform = mult(modelTransform, rotate(pad.angle, pad.rotateAxis));
  modelTransform = mult(modelTransform, scale(pad.scale));
  gl.uniformMatrix4fv(modelTransformLoc, false, flatten(modelTransform) );
  gl.uniform1i(drawingSphere, false);
  setElements("pad", true);
	
  gl.drawArrays( gl.TRIANGLES, 0, numVertices );




  // Collision detection for the pad is added here.
	BV[index] = [pad.pos[0] - pad.scale[0]/2, pad.pos[1] - pad.scale[1]/2, pad.pos[2] - pad.scale[2]/2,
				pad.pos[0] + pad.scale[0]/2, pad.pos[1] + pad.scale[1]/2, pad.pos[2] + pad.scale[2]/2];

	index += 1;
	// Here we test the sphere against every bounding volume we have
	// (ie, for every brick we are currently drawing). This happens at
	// at every render call, so it might be a bit inefficient. We could
	// make it better by using bounding volume hierarchies.
	if (dx < -9 && dz < 7)//(testSphere(BV[0], sphereBV))
	{
		moveR = true;
		var sHitWall1 = new Audio("sounds/ballhitswall.wav");
		sHitWall1.play();
		CDPause = 1;
	}
	if (dx > 9 && dz < 7)//(testSphere(BV[1], sphereBV))
	{
		moveR = false;
		var sHitWall2 = new Audio("sounds/ballhitswall.wav");
		sHitWall2.play();
		
	}
	if (dz < -23.5)//(testSphere(BV[2], sphereBV))
	{
		moveD = true;
		var sHitWall3 = new Audio("sounds/ballhitswall.wav");
		sHitWall3.play();
		
	}
	if (dz > 10)
  {
    sLoseLife.play();
		isAlive = false;
  }
	for (var t = 3; t < index-1; t++) {
		if (CDPause == 0 && testSphere(BV[t], sphereBV)) {
      if (!isFire) {
  			switch (testSide(BV[t], sphereBV)) {
  				case 1:
  					moveR = false;
  					break;
  				case 2:
  					moveR = true;
  					break;
  				case 5:
  					moveD = true;
  					break;
  				case 6:
  					moveD = false;
  					break;
  				default:
  					moveD = !moveD;
  					break;
  			}
      }
			//moveD = !moveD; // We change the state of the balls movement to bounce back.
			var brickNum = curBoard[BV[t][6]][BV[t][7]];


			// Check for the brick it hits and process it
		  if (brickNum == 1)
		  {
				curBoard[BV[t][6]][BV[t][7]] = 2;
				if (metal_index == 0)
				{
					var sHitMetal0 = new Audio("sounds/metalbreak.wav");
					sHitMetal0.play();
				}
				else if (metal_index == 1)
				{
					var sHitMetal1 = new Audio("sounds/metalbreak.wav");
					sHitMetal1.play();
				}
				metal_index++;
				if (metal_index == 2)
					metal_index = 0;
			}
		 else if (brickNum == 2)
		  {
				curBoard[BV[t][6]][BV[t][7]] = 20;
				if (metal_index == 0)
				{
					var sHitBrick0 = new Audio("sounds/metalbreak.wav");
					sHitBrick0.play();
				}
				else if (metal_index == 1)
				{
					var sHitBrick1 = new Audio("sounds/metalbreak.wav");
					sHitBrick1.play();
				}
				metal_index++;
				if (metal_index == 2)
					metal_index = 0;
		  }

      else if (brickNum == 3)
      {
          curBoard[BV[t][6]][BV[t][7]] = 30;
				if (metal_index == 0)
				{
					var sHitBrick2 = new Audio("sounds/metalbreak.wav");
					sHitBrick2.play();
				}
				else if (metal_index == 1)
				{
					var sHitBrick3 = new Audio("sounds/metalbreak.wav");
					sHitBrick3.play();
				}
				metal_index++;
				if (metal_index == 2)
					metal_index = 0;
      }
      else if (brickNum == 4)
      {
          curBoard[BV[t][6]][BV[t][7]] = 40;
        if (metal_index == 0)
        {
          var sHitBrick2 = new Audio("sounds/metalbreak.wav");
          sHitBrick2.play();
        }
        else if (metal_index == 1)
        {
          var sHitBrick3 = new Audio("sounds/metalbreak.wav");
          sHitBrick3.play();
        }
        metal_index++;
        if (metal_index == 2)
          metal_index = 0;
      }
      else if (brickNum == 5)
      {
          curBoard[BV[t][6]][BV[t][7]] = 50;
        if (metal_index == 0)
        {
          var sHitBrick2 = new Audio("sounds/metalbreak.wav");
          sHitBrick2.play();
        }
        else if (metal_index == 1)
        {
          var sHitBrick3 = new Audio("sounds/metalbreak.wav");
          sHitBrick3.play();
        }
        metal_index++;
        if (metal_index == 2)
          metal_index = 0;
      }

			popBV = true;
			break;
			//CDPause = 3;
		}
	}
	if (start == true) {
		if (testSphere(BV[index - 1], sphereBV)) {
 			moveD = false;
			sHitPad.play();
			if (padR) {
				if (angle == 0.0)
					moveR = true;
				if (moveR)
					angle += 0.05;
				else {
          if (angle >= 0.05)
					 angle -= 0.05;
        }
			}
			if (padL) {
				if (angle == 0.0)		
					moveR = false;	
				if (moveR) {
          if (angle >= 0.05)
					 angle -= 0.05;	
        }
				else
					angle += 0.05;	
			}
		}
		if (popBV == true)
			BV.pop();
		if (CDPause > 0)
			CDPause -= 1;
		if (moveD == true) {
			dz += 0.5;
		} else {
			dz -= 0.5;
		}
		if (moveR == true) {
			//dx += 0.08;
			dx += angle;
		} else {
			//dx -= 0.08;
			dx -= angle;

		}
		//dx += 0.0235;
		sphereBV[0] = 0.0 + dx; // We have to update the BV every time we translate the sphere.
		sphereBV[1] = 0.0 + dy; // So we have these statements that add d_ to the initial position of the sphere.
		sphereBV[2] = 7.0 + dz; // This one is 7.0 because the initial z value of the sphere is 7.0
	}
	
	
	modelTransform = mult(mat4(), translate(0,0,7));
	modelTransform = mult(modelTransform, translate(dx,dy,dz));
	modelTransform = mult(modelTransform, scale(0.51,0.51,0.51));
	gl.uniformMatrix4fv(modelTransformLoc, false, flatten(modelTransform) );
	
	// We disable the texturing and color attributes to draw the sphere.
	// We also tell the shaders that we're about to draw the sphere.
	gl.disableVertexAttribArray( vTexCoord );
	gl.disableVertexAttribArray( vColor );
	gl.uniform1i(drawingSphere, true);
	setElements("ball", true);
	gl.drawArrays( gl.TRIANGLES, numVertices, triIndex);
	

  // Check if level is complete
  if (numBricks == 0)
  {
      console.log("Level:" + curLevel + "Complete");
      curLevel++;
      animateWall = true;
      numBricks = -10;
      dx = 0;
      dy = 0; 
      dz = 0;
      angle = angleInit;
      isAlive = false;
      curLife++;

	  		  var levelup = new Audio("sounds/levelup2.wav");
		levelup.play();
  }

  // Animate wall on level up
  if (!animateWall && numBricks == -10)
  {
    initLevel(curLevel);
  }

      var seconds = time * 0.0015;


    // If ball is dead, move it back to 0 and reset pad. 
  if (isAlive == false)
  {
     start = false;
     isAlive = true;

        dx = 0;
       dy = 0; 
       dz = 0;
       angle = angleInit;
       pad.pos[0] = 0;
       sphereBV = [0.0,0.0,7.0,0.5];
      if (curLife >= 1)
        curLife--;

     if (curLife == 0)
     {
      gameOver = true;
      isAlive = false;
      
      ctx.font = '20px joystix';


      highScore = highScore > curScore ? highScore : curScore;

      
      ctx.fillText("Game Over", 400, 230); 
      ctx.fillText("Final Score:" + curScore, 370, 260); 
      ctx.fillText("Press enter to restart game.", 250, 290);
      ctx.fillStyle = 'rgba(255,255,255,255)';
      
     }

   
  }

    //////////////////
    //Display Texts//
    //////////////////

    ctx.font = '20px joystix';
    ctx.fillText("LEVEL:"+ curLevel, 15, 30);
    ctx.fillText("LIVES:"+curLife, 15, 60);
    ctx.fillText("SCORE:"+curScore, 15, 90);
    if (highScore > 0)
      ctx.fillText("High score:"+ highScore,700,30);

    if (Math.floor(seconds) % 2 === 0 && !firstStart && (time > 4200))
    {
      ctx.font = '20px joystix';
      ctx.fillText("Press the space bar to start game.", 203, 305); 

    }

    ctx.fillStyle = 'rgba(255,255,255,255)';

    ///////////////////
    // Background music
    ////////////////////
      if (play_song)
      {
        
        myAudio.addEventListener('ended', function() {
          this.currentTime = 0;
          this.play();
        }, false);
        myAudio.play();
      }
      else
      {
        myAudio.pause();
      }


    requestAnimFrame(render);
	
}






