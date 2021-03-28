function setColor(r, g, b)
{
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
}

function start()
{
    ctx.beginPath();
}

function stop()
{
    ctx.closePath();
}

function drawRect(x, y, width, height)
{
    start();
    ctx.rect(x, y, width, height);
    ctx.stroke();
    stop();
}

function fillRect(x, y, width, height)
{
    start();
    ctx.rect(x, y, width, height);
    ctx.fill();
    stop();
}

function drawCenteredRect(x, y, width, height)
{
    start();
    ctx.rect(x-width/2, y-height/2, width, height);
    ctx.stroke();
    stop();
}

function fillCenteredRect(x, y, width, height)
{
    start();
    ctx.rect(x-width/2, y-height/2, width, height);
    ctx.fill();
    stop();
}

function drawOval(x, y, width, height=-1)
{
    start();
    if (height==-1) ctx.arc(x, y, width, 0, 2*Math.PI);
    else ctx.ellipse(x+width, y+height, width, height, 0, 0, 2*Math.PI);
    ctx.stroke();
    stop();
}

function fillOval(x, y, width, height=-1)
{
    start();
    if (height==-1) ctx.arc(x, y, width, 0, 2*Math.PI);
    else ctx.ellipse(x+width, y+height, width, height, 0, 0, 2*Math.PI);
    ctx.fill();
    stop();
}

function setBackground(r, g, b)
{
    setColor(r, g, b);
    fillRect(0, 0, W, H);
}