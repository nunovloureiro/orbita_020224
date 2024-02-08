///HYDRA + HYDRA P5JS CANVAS + SPHERIC MESH + 3D OBJECTS
var sketch1 = function(p){

  //CAMERA AND MOVEMENT SETUP
  window.firstPerson = (cam) => {
    let millis = Date.now();
    let mouseX = p.mouseX;
    let mouseY = p.mouseY;
    let abs = Math.abs;
    let cos = Math.cos;
    let sin = Math.sin;


    cam.firstPersonState = cam.firstPersonState || {
      azimuth: -Math.atan2(cam.eyeZ - cam.centerZ, cam.eyeX - cam.centerX),
      zenith: -Math.atan2(cam.eyeY - cam.centerY, p.dist(cam.eyeX, cam.eyeZ, cam.centerX, cam.centerZ)),
      lookAtDist: p.dist(cam.eyeX, cam.eyeY, cam.eyeZ, cam.centerX, cam.centerY, cam.centerZ),
      mousePrevX: mouseX,
      mousePrevY: mouseY,
      directionChangeTime: millis,
      directionChangeInterval: 60000,
      transitionDuration: 2000,
      transitionStartTime: 0,
      transitioning: false,
    };

    // Check if it's time to change direction
    if (millis - cam.firstPersonState.directionChangeTime > cam.firstPersonState.directionChangeInterval) {
      // Start a gradual transition
      cam.firstPersonState.transitioning = true;
      cam.firstPersonState.transitionStartTime = millis;
      cam.firstPersonState.startAzimuth = cam.firstPersonState.azimuth;
      cam.firstPersonState.targetAzimuth = Math.random() * p.vPI * 2;
      cam.firstPersonState.directionChangeTime = millis; // Update the timestamp
    }

    // Gradual transition for azimuth
    if (cam.firstPersonState.transitioning) {
      const elapsedTime = millis - cam.firstPersonState.transitionStartTime;
      const t = Math.min(elapsedTime / cam.firstPersonState.transitionDuration, 1);
      cam.firstPersonState.azimuth = p.lerp(cam.firstPersonState.startAzimuth, cam.firstPersonState.targetAzimuth, t);

      // Check if the transition is complete
      if (t === 1) {
        cam.firstPersonState.transitioning = false;
      }
    }

    // Look around controls
    cam.firstPersonState.azimuth -= (mouseX - cam.firstPersonState.mousePrevX) / 100;
    if (abs(cam.firstPersonState.zenith + (mouseY - cam.firstPersonState.mousePrevY) / 100) < p.vPI / 2) {
      cam.firstPersonState.zenith += (mouseY - cam.firstPersonState.mousePrevY) / 100;
    }

    // Movement controls
    let moveSpeed = 1;
    cam.eyeX -= moveSpeed * cos(cam.firstPersonState.azimuth);
    cam.eyeZ += moveSpeed * sin(cam.firstPersonState.azimuth);

    if (cam.eyeX > p.windowWidth * 2 || cam.eyeX < p.windowWidth * -2 || cam.eyeZ > p.windowWidth * 2 || cam.eyeZ < p.windowWidth * -2) {
      moveSpeed = -1;
    }

    if (p.keyIsPressed && (p.keyCode == 87 || p.keyIsDown(p.UP_ARROW))) {
      cam.eyeX -= 2 * cos(cam.firstPersonState.azimuth);
      cam.eyeZ += 2 * sin(cam.firstPersonState.azimuth);
    }
    if (p.keyIsPressed && (p.keyCode == 83 || p.keyIsDown(p.DOWN_ARROW))) {
      cam.eyeX += 2 * cos(cam.firstPersonState.azimuth);
      cam.eyeZ -= 2 * sin(cam.firstPersonState.azimuth);
    }
    if (p.keyIsPressed && (p.keyCode == 65 || p.keyIsDown(p.LEFT_ARROW))) {
      cam.eyeX -= 2 * cos(cam.firstPersonState.azimuth + p.vPI / 2);
      cam.eyeZ += 2 * sin(cam.firstPersonState.azimuth + p.vPI / 2);
    }
    if (p.keyIsPressed && (p.keyCode == 68 || p.keyIsDown(p.RIGHT_ARROW))) {
      cam.eyeX += 2 * cos(cam.firstPersonState.azimuth + p.vPI / 2);
      cam.eyeZ -= 2 * sin(cam.firstPersonState.azimuth + p.vPI / 2);
    }

    // Update previous mouse position
    cam.firstPersonState.mousePrevX = mouseX;
    cam.firstPersonState.mousePrevY = mouseY;

    // Update the look-at point
    cam.centerX = cam.eyeX - cam.firstPersonState.lookAtDist * cos(cam.firstPersonState.zenith) * cos(cam.firstPersonState.azimuth);
    cam.centerY = cam.eyeY + cam.firstPersonState.lookAtDist * sin(cam.firstPersonState.zenith);
    cam.centerZ = cam.eyeZ + cam.firstPersonState.lookAtDist * cos(cam.firstPersonState.zenith) * sin(cam.firstPersonState.azimuth);

    // Call the built-in p5 function 'camera' to position and orient the camera
    p.camera(cam.eyeX, cam.eyeY, cam.eyeZ,  // position
      cam.centerX, cam.centerY, cam.centerZ,  // look-at
      0, 1, 0);  // up vector
  }

  ///HYDRA BACKGROUND CANVAS
  p.hc = document.createElement('canvas')
  p.hc.width = 300;
  p.hc.height = 300;
  p.pg;

  let hydra = new Hydra({ detectAudio: false, canvas: p.hc });

  fps = 30;
  x = () => (-mouse.x/width)+.5
  y = () => (-mouse.y/height)+.5

  a = function(){return 0.8 * Math.sin(time*0.1)};
  b = function(){return 0.04 * Math.sin(time*0.01)};

  noise(()=> 2 + 1 * x() / y() * (Math.sin(time*0.01)+0.2),0.2).mult(solid(a,b,() => 0.2 + 0.5 * y() / x() * (Math.cos(time*0.015)+0.2))).modulate(noise(()=> 0.1*x()*y()), 0.1).out()


  ////P5JS INIT

  p.targetFrameRate = 40;

  p.move = 2;

  p.vPI = Math.PI;

  p.tex;
  p.angle = 0;

  p.scaler = 1;

  p.globe = [];
  p.prevGlobe = [];
  p.r = 1000;
  p.total = 30;
  p.v;

  p.vhs;
  p.scl =  10;
  p.cols;
  p.rows;

  p.edificio;

  p.names;
  p.order = 4;
  p.ngrams = {};
  p.beginnings = [];
  p.button;
  p.lastCallTime = -1;
  p.allWords = [];

  p.preload = function() {
    // p.LuaOnusUV = p.loadImage('js/capa_digital.jpg');
    p.edificio = p.loadModel('js/Edificios.obj');
    p.font = p.loadFont('./assets/SpaceGrotesk.ttf');
    p.names = p.loadStrings('js/recipes.txt');
  }


  p.setup = function(){
    p.frameRate(p.targetFrameRate);
    p.createCanvas(p.windowWidth,p.windowHeight, p.WEBGL);
    p.pg = p.createGraphics(p.hc.width, p.hc.height);

    if(p.windowWidth / p.windowHeight < 1){
      p.scaler = 0.3;
    } else {p.scaler = 1;
      }

    p.cols = p.windowWidth/p.scl;
    p.rows = p.windowHeight/p.scl;

    // p.tex = p.createGraphics(1, 1);
    p.vhs = p.createGraphics(p.windowWidth, p.windowHeight);
    p.textCanvas = p.createGraphics(p.windowWidth, p.windowHeight, p.WEBGL);
    p.cam = p.createCamera();
    p.background(0);
    p.setupMarkovText();
    p.showText();
    p.grid();
  }

  p.setupMarkovText = function() {
    for (let j = 0; j < p.names.length; j++) {
      let txt = p.names[j];
      let beginningsAdded = false;

      for (let i = 0; i <= txt.length - p.order; i++) {
        let gram = txt.substring(i, i + p.order);

        if (!beginningsAdded) {
          p.beginnings.push(gram);
          beginningsAdded = true;
        }

        p.ngrams[gram] = p.ngrams[gram] || [];
        p.ngrams[gram].push(txt.charAt(i + p.order));
      }
    }
  };

  p.markovIt = function() {
    let currentGram = p.random(p.beginnings);
    let result = currentGram;
    // console.log("p.markovIt() called");

    for (let i = 0; i < 20000; i++) {
      let possibilities = p.ngrams[currentGram];
      if (!possibilities) {
        break;
      }
      let next = p.random(possibilities);
      result += next;

      if (next === "." || next === "!" || next === "?") {
        break;
      }

      let len = result.length;
      currentGram = result.substring(len - p.order, len);
    }
    // console.log(result);
    return result;
    // p.createP(result);
  };

  p.chooseWord = function(newText) {
    if (typeof newText !== 'string') {
      console.error('Invalid newText:', newText);
      return ''; // or handle the error in an appropriate way
    }

    const ignoredWords = new Set([
      "AND", "OR", "OF", "WITH", "TO", "IF", "ELSE", "ON", "IN", "UNDER",
      "ABOVE", "BELOW", "THE", "OUT", "A", "FOR", "AS", "DO", "DOES", "DON'T",
      "DOESN'T", "THIS", "THAT", "ITS", "S", "IS", "I", "YOU", "HE", "SHE",
      "IT", "THEY", "THEM", "HIS", "HERS", "MINE", "YOURS"
    ]);

    let tokens = newText.split(/\W+/);

    p.allWords = tokens
      .map(word => word.toUpperCase())
      .filter(word => !ignoredWords.has(word));

    let randomIndex = p.floor(Math.random() * p.allWords.length);
    let chosenWord = p.allWords[randomIndex];

    // console.log(chosenWord);
    return chosenWord;
  };

  p.showText = function(chosenWord) {
        // console.log(chosenWord);
        // p.textCanvas.clear();
        p.textCanvas.push();
          p.textCanvas.fill(200);
          p.textCanvas.noStroke();
          p.textCanvas.textFont(p.font);
          p.textCanvas.textSize(p.windowWidth/20);
          p.textCanvas.textStyle(p.BOLD);
          p.textCanvas.textAlign(p.CENTER, p.CENTER);
          p.textCanvas.fill(Math.random()*255, Math.random()*255, Math.random()*255);
          p.textCanvas.blendMode(p.SCREEN);
          p.textCanvas.translate(Math.random()*p.windowWidth/4,0, Math.random()*p.windowHeight/9);

          if (typeof chosenWord == 'string') {
            p.textCanvas.text(chosenWord, 0, 0);
          }
        p.textCanvas.pop();
        console.log(chosenWord);
  }

  p.draw = function() {
      p.pg.drawingContext.drawImage(p.hc, 0, 0, p.pg.width, p.pg.height);

      // let fps = p.frameRate();
      // console.log(fps);
      p.background(0);
      p.texture(p.pg);
      p.push();
        p.noStroke();
        p.sphere(p.windowWidth, 24, 24);
      p.pop();
      firstPerson(p.cam, p.move);
      p.drawScene();

      //temepo aleatório para apagar palavra antiga. verificar que funciona?
      let gate = p.int(Math.random()*50);
      // console.log(gate);
      if (gate == 1) {
        p.textCanvas.clear();
      }

      p.push();
        // Draw the text every 60 frames (1 second)
        if (p.frameCount % 60 === 0) {
          p.drawText();
          p.translate(Math.random()*p.windowWidth/2-p.windowWidth/4,0, Math.random()*p.windowHeight/2);
          p.rotateX(Math.random()*p.vPI*0.2);
          p.rotateY(Math.random()*p.vPI*0.3);
          p.rotateZ(Math.random()*p.vPI*0.5);
        }
        p.noFill();
        p.texture(p.textCanvas);
        p.noStroke();
        p.blendMode(p.DIFFERENCE);
        p.plane(p.windowWidth, p.windowHeight);

      p.pop();//

      p.image(p.vhs, 0-p.windowWidth/2, 0-p.windowHeight/2);
  }

  p.drawText = function() {
    //NEW WORDS
    let currentTime = p.frameCount;
    // console.log(currentTime);

    // Check if one second has passed and the condition is true
    if (currentTime !== p.lastCallTime && currentTime % 600 === 0) { ///60 > 600
        p.lastCallTime = currentTime;

        // Call the function only once per second
        const newText = p.markovIt();
        console.log(newText);
        const chosenWord = p.chooseWord(newText);
        p.showText(chosenWord);
    }
  }

  p.drawScene = function(){
        // p.frameRate(10);
        p.lights();
        p.pointLight(255, 255, 255, 0, -100, 0);

          //comentar cenas de stroke se a sphericMesh estiver activa


        // p.push();
        //   // p.fill(Math.random()*100, Math.random()*120);
        //   p.rotateX(p.PI);
        //   p.translate(0,-500,0);
        //   p.scale(0.2);
        //   p.model(p.edificio);
        // p.pop();
        //
        // p.push();
        //   p.rotateX(p.PI);
        //   p.translate(-700,-500,-300);
        //   p.scale(0.2);
        //   p.model(p.edificio);
        // p.pop();

        p.push();
          p.strokeWeight(0.6);//p.strokeWeight(Math.random());
          p.stroke(Math.random()*180, Math.random()*90);
          // p.fill(Math.random()*100, Math.random()*120);
          // p.rotateX(p.PI);
          // p.translate(0,-500,0);
          p.scale(p.scaler);
          p.model(p.edificio);
        p.pop();

        //draw sphere
        // p.push();
        //   p.texture(p.LuaOnusUV);
        //   p.noStroke();
        //   p.rotateX(p.angle*0.3);
        //   p.rotateY(p.angle*-1.3);
        //   p.rotateZ(p.angle*1.2);
        //   p.sphere(100);
        // p.pop();
        //
        // // Draw a cube
        // p.push()
        //   p.fill(255, 100, 100)
        //   p.noStroke()
        //   p.translate(200, 50, 100)
        //   p.box(50)
        // p.pop()

        p.angle += 0.007;
      }

  p.grid = function() {
        p.vhs.strokeWeight(1);
        p.vhs.stroke(255, 20);
        p.vhs.noFill();

        for (var x = 0; x < p.cols; x++) {
          for (var y = 0; y < p.rows; y++) {
            p.vhs.line(x * p.scl, y * p.scl, (x + 1) * p.scl, y * p.scl);
            p.vhs.line(x * p.scl, y * p.scl, x * p.scl, (y + 1) * p.scl);
          }
        }
      };

  p.toImage = function(c) {
      	p.loadImage(c.toDataURL("image/png"), (im) => {
      		p.tex = im;
      	})
      }

  p.windowResized = function(){
          p.resizeCanvas(p.windowWidth, p.windowHeight);
    }
}

///VHS GRID FX
var sketch2 = function(p){

  p.vhs;
  p.scl = 5;
  p.cols;
  p.rows;
  // p.buttonClick;
  p.titleColor = 255;
  p.button;

  p.setup = function(){
    p.createCanvas(p.windowWidth,p.windowHeight);
    p.cols = p.windowWidth/p.scl;
    p.rows = p.windowHeight/p.scl;
    p.vhsGrid();
    // p.showTitle();
  }
  //
  // p.startSketch = function(){
  //   p.button = document.getElementById("start").innerText;
  //   console.log(p.button);
  // }
  //
  //
  // p.showTitle = function() {
  //   p.fill(p.titleColor);
  //   p.stroke(10);
  //   p.textAlign(p.CENTER);
  //   p.textSize(70);
  //   p.text('helloWorld', 300,300);
  // }
  //
  // p.titleToggle = function() {
  //   p.buttonValue = document.getElementById("start").innerText;
  //   // p.titleColor = 120;
  //   console.log('Button value:', p.buttonValue);
  //   // p.showTitle();
  // }
  //
  // p.startPause = function() {
  //
  //   p.fill(p.random(255), p.random(255), p.random(255));
  //   p.text('helloWorld', 300,300);
  // }


  p.vhsGrid = function() {
        p.clear();
        p.strokeWeight(2);
        p.stroke(5,20);
        p.noFill();
        for (var x = 0; x < p.cols; x++) {
          p.line(x * p.scl, 0, x * p.scl, p.windowHeight);
        }
        for (var y = 0; y < p.rows; y++) {
          p.line(0, y * p.scl, p.windowWidth, y * p.scl);
        }
    }

  p.windowResized = function(){
            p.resizeCanvas(p.windowWidth, p.windowHeight);
    }

}

///WELCOME SCREEN
var sketch3 = function(p){

  p.Xaxis = p.windowWidth;
  p.Yaxis = p.windowHeight;

  p.title =
  ["l  -  a   t  u  /   r  u  a   -  u  a",
   "l  u  .   t  u  a   <  u  a   s  u  a",
   "z  u  a   z  _  a   t  .  a   l  u  ^",
   "'  u  a   l  u  a   z  u  \   .  u  a",
   "s  u  -   r  >  a   z  u  a   l  u  a",
   "r  u  a   |  u  a   r  u  _   l  u  a",
   "<  u  a   z  u  a   t  ^  a   l  u  a",
   "t  u  a   t  u  a   r  u  a   l  u  a"];

  p.titleIndex = 0;
  p.textCanvas;
  p.preload = function(){
    p.font = p.loadFont('./assets/SpaceGrotesk.ttf');
  }

  p.setup = function(){
    p.createCanvas(p.Xaxis,p.Yaxis);
    p.textCanvas = p.createGraphics(p.Xaxis, p.Yaxis);
    p.frameRate(14);
    p.textFont = p.font;
    p.textCanvas.textAlign(p.CENTER);
    p.textCanvas.fill(255);
    // p.textFont('Courier New');

  }

  p.draw = function(){
    p.clear();
    p.rectDraw();
    p.textDraw();
    //INFO TEXT
    p.textCanvas.textAlign(p.CENTER,p.CENTER);
    p.textCanvas.textStyle(p.NORMAL);
    p.textCanvas.textSize(p.int(p.Xaxis/70));
    p.textCanvas.text("infinitely deformed and transformed cuts of lua onus. eyes with mouse/trackpad - w+a+s+d makes it move.\ncomputer use is recommended. mobile cpu is not good enough. select a pixel to make it sound. esc key to shut it up.", p.Xaxis/2, p.Yaxis/2.8);
// p.Yaxis/3.3
    //INFO TEXT 2
    p.textCanvas.textAlign(p.CENTER,p.CENTER);
    p.textCanvas.textStyle(p.NORMAL);
    p.textCanvas.textSize(p.int(p.Xaxis/70));
    p.textCanvas.text("piece created by nuno loureiro for gnration's órbita program [órbita #23]. huge thank yous to the authors of the open\nsource tools that were necessary to its development (webpd: sébastien piquemal / hydra: olivia jack / pd / p5js) as well \nas the respective discord communities, daniel shiffman and gnration's luís fernandes and ilídio marques for the invite.", p.Xaxis/2, p.Yaxis/1.53);
// p.Yaxis/1.4
    // p.Xaxis/7.7

    p.image(p.textCanvas, 0, 0);
  }
  p.rectDraw = function(){
    p.push();
      p.stroke(240,240,240);
      p.strokeWeight(5);
      p.rectMode(p.CENTER);
      p.fill(0,180);
      p.rect(p.Xaxis/2,p.Yaxis/2, p.Xaxis-p.Xaxis/6, p.Yaxis-p.Yaxis/3.5);
    p.pop();
  }

  p.textDraw = function(){

      p.textCanvas.clear();

      //TITLE CYCLE
      p.push();
        p.textCanvas.textAlign(p.CENTER,p.CENTER);
        p.textCanvas.textSize(p.int(p.Xaxis/18));
        p.textCanvas.textStyle(p.BOLD);
        p.titleIndex +=1;
        let i = p.titleIndex%8;
        p.textCanvas.text(p.title[i], p.Xaxis/2, p.Yaxis/2);
      p.pop();
  }

  p.windowResized = function(){
          p.resizeCanvas(p.windowWidth, p.windowHeight);
          p.Xaxis = p.windowWidth;
          p.Yaxis = p.windowHeight;
  }
}

p5.disableFriendlyErrors = false;

var myp5_1 = new p5(sketch1, 'c1');
var myp5_2 = new p5(sketch2, 'c2');
var myp5_3 = new p5(sketch3, 'c3');
