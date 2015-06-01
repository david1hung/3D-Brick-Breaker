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