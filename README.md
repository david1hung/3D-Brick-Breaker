# team13-term-project

## Castle Breaker!

### Team Members
- David Hung 
- Caleb Mayerski
- Enyu Hsu 
- Timothy Portfolio

##Intro
Revolutionizing the brick breaker genre. With innovative techniques meant to spur a new kind of gameplay in the 3D realm, check out our new amazing features such as collision detection, Phong shading and multi-geometry instantiation. 

##Actual Intro
Our group make a a brick breaker like game in 3D. Levels include normal bricks, metal bricks, ice bricks, tree bricks, and fire bricks. Left/right keys are the main keyboard control and everything else should be easy to understand. Levels can be manually changed to 1-5 by pressing the corresponding keys on the keyboard. 


##Key Commands
- S - toggle music
- Spacebar - launch ball from paddle
- Left/Right - move the paddle
- 1/2/3/4/5 - view main level layouts
- N/W - narrow/widen FOV
- I/K/M/J - move view north/east/south/west
- R - resets the board at the cost of a life


##Advanced Topics
- Physics
	- The ball bounced off bricks and walls at the proper angle
	- The ball bounces off pad at correct angles
	- The ball changes it angle and velocity if the pad is in motion when collision happens. 

- Collision Detection
	- Collision Detection is tested between ball, bricks, wall and pad. 
	- There is spherical detection for the ball and cube detection for all other objects
	
## Topics Implementation
- Lighting
	- We used phong shading on the ball with the pad as a point-light source. At the start of the level, you can move the pad to see the changes on the shading of the ball
- Texture mapping
	- Bricks, pad, and wall are all texture mapped. 
	- Repeating texture is used on the wall while other textures are applied 0 to 1. 
- Camera motion
	- Camera motion is kept from the previous assignments except left/right are now for moving the pad. 
- Transformations
	- Spheres, walls and pad are transformed throughout the level. 


## Programming Detections
- Multiple texture of bricks can exist in the same level but only one is applied for bricks at a time for better aesthetics. 
- LevelDef.js defines the board definitions and initLevel processes the initialization of levels. 
- When colliding with two cubes, the ball can exhibit strange behavior. The fix for this is to pause collision detection for a small time and also default to having the ball move down upon complex collisions.
