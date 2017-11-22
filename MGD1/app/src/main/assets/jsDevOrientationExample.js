class aSprite {
    constructor(x, y, imageSRC, velx, vely, spType) {
        this.zindex = 0;
        this.x = x;
        this.y = y;
        this.vx = velx;
        this.vy = vely;
        this.sType = spType;
        this.sImage = new Image();
        this.sImage.src = imageSRC;
    }
    // Getter
    get xPos() {
        return this.x;
    }

    get yPos() {
        return this.y;
    }

    // Setter
    set xPos(newX) {
        this.x = newX;
    }

    set yPos(newY) {
        this.y = newY;
    }

    // Method
    render() {
        canvasContext.drawImage(this.sImage, this.x, this.y);
    }
    scrollBK(delta) {
        canvasContext.save();
        canvasContext.translate(-delta, 0);
        canvasContext.drawImage(this.sImage, 0, 0);
        canvasContext.drawImage(this.sImage, this.sImage.width, 0);
        canvasContext.restore();
    }
    // Method
    sPos(newX, newY) {
        this.x = newX;
        this.y = newY;
    }

    // Static Method
    static distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        return Math.hypot(dx, dy);
    }

    // Method
    spriteType() {
        console.log('I am an instance of aSprite!!!');
    }

}

class Enemy extends aSprite {
    // Method
    spriteType() {
        super.spriteType();
        console.log('I am a ' + this.sType + ' instance of aSprite!!!');
    }
}

var canvas;
var canvasContext;
var travel = 0;

var theBall = { position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, radius: 0 };

function renderBall(centerX, centerY, radius, drawColour) {
    canvasContext.beginPath();
    canvasContext.fillStyle = drawColour;
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
    canvasContext.closePath();
}
var theSplat = { position: { x: 0, y: 0 }, size: { width: 0, height: 0 } };

function renderSplat(leftX, topY, width, height, drawColour) {
    canvasContext.beginPath();
    canvasContext.fillStyle = drawColour;
    canvasContext.fillRect(leftX, topY, width, height);
    canvasContext.closePath();
}


var devOrientation = { devXValue: 0, devYValue: 0, devRotationValue: 0 };
Mobile

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function load() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    init();
}

function init() {

    if (canvas.getContext) {
        //Set Event Listeners for window, mouse and touch

        window.addEventListener('resize', resizeCanvas, false);
        window.addEventListener('orientationchange', resizeCanvas, false);

        canvas.addEventListener("touchstart", touchDown, false);
        canvas.addEventListener("touchmove", touchXY, true);
        canvas.addEventListener("touchend", touchUp, false);

        document.body.addEventListener("touchcancel", touchUp, false);

        if (window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientation", getDevOrientation, false);
        }
        else {
            console.log("This browser doesn't support Device Orientation");
        }

        resizeCanvas();

        theBall.radius = 15;
        theBall.position.x = Math.round(Math.random() * (canvas.width / 2 - theBall.radius));
        theBall.position.y = Math.round(Math.random() * (canvas.height / 2 - theBall.radius));

        theSplat.size.width = 20;
        theSplat.size.height = 20;
        theSplat.position.x = Math.round(Math.random() * (canvas.width / 2 - theSplat.size.width));
        theSplat.position.y = Math.round(Math.random() * (canvas.height / 2 - theSplat.size.height));

        startTimeMS = Date.now();
        gameLoop();
    }
}

function gameLoop() {
    console.log("gameLoop");
    var elapsed = (Date.now() - startTimeMS) / 1000;
    update(elapsed);
    render(elapsed);
    startTimeMS = Date.now();
    requestAnimationFrame(gameLoop);
}

function render(delta) {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    renderBall(theBall.position.x / 2, theBall.position.y / 2, theBall.radius, 'green');
    renderSplat(theSplat.position.x, theSplat.position.y, theSplat.size.width, theSplat.size.height, 'red')
}

function update(delta) {
    theBall.velocity.x = devOrientation.devXValue;
    theBall.velocity.y = devOrientation.devYValue;

    theBall.position.x += theBall.velocity.x;
    theBall.position.y += theBall.velocity.y;

    if (theBall.position.x < 0 || theBall.position.x > (canvas.width - theBall.radius)) theBall.velocity.x *= -1;
    if (theBall.position.y < 0 || theBall.position.y > (canvas.height - theBall.radius)) theBall.velocity.y *= -1;

}

function collisionDetection() {

}

function styleText(txtColour, txtFont, txtAlign, txtBaseline) {
    canvasContext.fillStyle = txtColour;
    canvasContext.font = txtFont;
    canvasContext.textAlign = txtAlign;
    canvasContext.textBaseline = txtBaseline;
}

function touchUp(evt) {
    evt.preventDefault();
    // Terminate touch path
    lastPt = null;
}

function touchDown(evt) {
    evt.preventDefault();
    if (gameOverScreenScreen) {
        return;
    }
    touchXY(evt);
}

function touchXY(evt) {
    evt.preventDefault();
    if (lastPt != null) {
        var touchX = evt.touches[0].pageX - canvas.offsetLeft;
        var touchY = evt.touches[0].pageY - canvas.offsetTop;
    }
    lastPt = { x: evt.touches[0].pageX, y: evt.touches[0].pageY };
}

function getDevOrientation(evt) {
    devOrientation.devXValue = Math.round(evt.gamma);
    devOrientation.devYValue = Math.round(evt.beta);
    devOrientation.devRotationValue = Math.round(evt.alpha);
}