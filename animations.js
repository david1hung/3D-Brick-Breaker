var animateIntro = true;
var curFovy = 90;
var startTime = (new Date).getTime();

function introAnimate()
{
    var delta;
    var currentTime = (new Date).getTime();
    
    if (curFovy > fovy_init)
    {
        var delta = currentTime - startTime;
        curFovy -= 1*(delta/5000);
    }
    else
        animateIntro = false;

    fovy = curFovy; 
}


var spinStartTime;
var wallUpdateTime; 
var animateWall = false;
var spinInit = true;

function spinWall(){
    var currentTime = (new Date).getTime();
    
    if (animateWall){
        if (spinInit)
        {
            wallUpdateTime = currentTime;
            spinInit = false;
        }

        if (wall1.angle < 360)
        {
             // use time to calculate real-time displacement
            delta = currentTime - wallUpdateTime;

            wall1.angle += 180*(delta/2000.0);  
            wall2.angle += 180*(delta/2000.0);  
            wall3.angle += 180*(delta/2000.0); 

            wallUpdateTime = currentTime; // update time
        }
        else
        {
            animateWall = false;
            wall1.angle = 0;
            wall2.angle = 0;
            wall3.angle = 0;
            spinInit = true;
        }
    }
}