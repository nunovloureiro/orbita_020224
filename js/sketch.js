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
  p.cameraPosition = [cam.eyeX, cam.eyeY, cam.eyeZ];

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
    userInput: false,
  };

  let userInput = p.keyIsPressed || mouseX !== cam.firstPersonState.mousePrevX || mouseY !== cam.firstPersonState.mousePrevY;
  cam.firstPersonState.userInput = userInput;

  if (!userInput && millis - cam.firstPersonState.directionChangeTime > cam.firstPersonState.directionChangeInterval) {
    cam.firstPersonState.transitioning = true;
    cam.firstPersonState.transitionStartTime = millis;
    cam.firstPersonState.startAzimuth = -Math.atan2(cam.eyeZ - cam.centerZ, cam.eyeX - cam.centerX);

    if (Math.abs(cam.eyeX) > p.windowWidth || Math.abs(cam.centerX) > p.windowWidth ||
        Math.abs(cam.eyeY) > p.windowWidth || Math.abs(cam.centerY) > p.windowWidth ||
        Math.abs(cam.eyeZ) > p.windowWidth || Math.abs(cam.centerZ) > p.windowWidth) {
      cam.firstPersonState.targetAzimuth = -Math.atan2(cam.eyeZ, cam.eyeX); // point towards (0, 0, 0)
    } else {
      cam.firstPersonState.targetAzimuth = Math.atan2(0 - cam.centerX, 0 - cam.eyeX);
    }

    cam.firstPersonState.directionChangeTime = millis;
  }

  if (cam.firstPersonState.transitioning) {
    const elapsedTime = millis - cam.firstPersonState.transitionStartTime;
    const t = Math.min(elapsedTime / cam.firstPersonState.transitionDuration, 1);
    cam.firstPersonState.azimuth = p.lerp(cam.firstPersonState.startAzimuth, cam.firstPersonState.targetAzimuth, t);
    if (t === 1) cam.firstPersonState.transitioning = false;
  }

  cam.firstPersonState.azimuth -= (mouseX - cam.firstPersonState.mousePrevX) / 100;
  if (abs(cam.firstPersonState.zenith + (mouseY - cam.firstPersonState.mousePrevY) / 100) < p.vPI / 2) cam.firstPersonState.zenith += (mouseY - cam.firstPersonState.mousePrevY) / 100;

  let moveSpeed = 2;
  let autoMoveSpeed = 0.5;
  let moveDirectionX = cos(cam.firstPersonState.azimuth);
  let moveDirectionZ = sin(cam.firstPersonState.azimuth);
  moveDirectionX *= cos(cam.firstPersonState.zenith);
  moveDirectionZ *= cos(cam.firstPersonState.zenith);
  let moveDirectionY = sin(cam.firstPersonState.zenith);

  if (!p.keyIsPressed) {
    cam.eyeX += autoMoveSpeed * moveDirectionX;
    cam.eyeY += autoMoveSpeed * moveDirectionY;
    cam.eyeZ += autoMoveSpeed * moveDirectionZ;
  }

  const moveKey = (keyCode, x, y, z) => {
    if (p.keyIsPressed && (p.keyCode == keyCode || p.keyIsDown(p[keyCode]))) {
      cam.eyeX += moveSpeed * x;
      cam.eyeY += moveSpeed * y;
      cam.eyeZ += moveSpeed * z;
    }
  };

  moveKey(87, moveDirectionX, moveDirectionY, moveDirectionZ);
  moveKey(83, -moveDirectionX, -moveDirectionY, -moveDirectionZ);
  moveKey(65, -cos(cam.firstPersonState.azimuth + p.vPI / 2), 0, sin(cam.firstPersonState.azimuth + p.vPI / 2));
  moveKey(68, cos(cam.firstPersonState.azimuth + p.vPI / 2), 0, -sin(cam.firstPersonState.azimuth + p.vPI / 2));

  // Restrict cam.eyeX and cam.centerX values within -p.windowWidth and p.windowWidth
  cam.eyeX = Math.max(-p.windowWidth, Math.min(p.windowWidth, cam.eyeX));
  cam.centerX = Math.max(-p.windowWidth, Math.min(p.windowWidth, cam.centerX));

  // Restrict cam.eyeY and cam.centerY values within -p.windowWidth and p.windowWidth
  cam.eyeY = Math.max(-p.windowWidth, Math.min(p.windowWidth, cam.eyeY));
  cam.centerY = Math.max(-p.windowWidth, Math.min(p.windowWidth, cam.centerY));

  // Restrict cam.eyeZ and cam.centerZ values within -p.windowWidth and p.windowWidth
  cam.eyeZ = Math.max(-p.windowWidth, Math.min(p.windowWidth, cam.eyeZ));
  cam.centerZ = Math.max(-p.windowWidth, Math.min(p.windowWidth, cam.centerZ));

  cam.firstPersonState.mousePrevX = mouseX;
  cam.firstPersonState.mousePrevY = mouseY;

  cam.centerX = cam.eyeX - cam.firstPersonState.lookAtDist * cos(cam.firstPersonState.zenith) * cos(cam.firstPersonState.azimuth);
  cam.centerY = cam.eyeY + cam.firstPersonState.lookAtDist * sin(cam.firstPersonState.zenith);
  cam.centerZ = cam.eyeZ + cam.firstPersonState.lookAtDist * cos(cam.firstPersonState.zenith) * sin(cam.firstPersonState.azimuth);

  p.camera(cam.eyeX, cam.eyeY, cam.eyeZ, cam.centerX, cam.centerY, cam.centerZ, 0, 1, 0);
};



  ///HYDRA BACKGROUND CANVAS
  p.hc = document.createElement('canvas')
  p.hc.width = 300;
  p.hc.height = 300;
  p.pg;

  let hydra = new Hydra({ detectAudio: false, canvas: p.hc });

  fps = 30;
  x = () => (-mouse.x/width+.5)*0.5;
  y = () => (-mouse.y/height+.5)*0.5;

  a = function(){return 0.8 * Math.sin(time*0.1)};
  b = function(){return 0.04 * Math.sin(time*0.01)};

  noise(()=> 0.1 + 1 + x() - y() * (Math.sin(time*0.01)+0.2),()=>Math.sin(time*0.05)*0.1+0.001).mult(solid(a,b,() => 0.2 + 0.5 * y()/1.5 / x()/1.5 * (Math.cos(time*0.025)*3+0.02))).modulate(noise(()=> 0.1*x()*x()*y()), 0.1).saturate(1.5).out()

  // noise(()=> 0.1 + 1 + x() - y() * (Math.sin(time*0.01)+0.2),()=>Math.sin(time*0.05)*0.2+0.001).mult(solid(a,b,() => 0.2 + 0.5 * y()/1.5 / x()/1.5 * (Math.cos(time*0.015)*0.3+0.02))).modulate(noise(()=> 0.1*x()*x()*y()), 0.1).saturate(1.5).out()

  // .saturate(1.5).contrast(2.5).out()

    // noise(()=> 0.2 + 1 * x() / y() * (Math.sin(time*0.01)+0.2),0.07).mult(solid(a,b,() => 0.2 + 0.5 * y()/1.5 / x()/1.5 * (Math.cos(time*0.015)+0.2))).modulate(noise(()=> 0.01*x()*x()*y()), 0.1).saturate(1.5).contrast(2.5).out()


  ////P5JS INIT

  p.isPhone = 0;
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
  // p.lua;
  //
  // p.luaX;
  // p.luaY;
  // p.luaZ;

  p.names;
  p.order = 4;
  p.ngrams = {};
  p.beginnings = [];
  p.button;
  p.lastCallTime = -1;
  p.allWords = [];

  p.preload = function() {
    // p.lua = p.loadModel('./assets/moon.obj');
    p.edificio = p.loadModel('./assets/Edificios.obj');
    // p.font = p.loadFont('./assets/SpaceGrotesk.ttf');
    p.font = p.loadFont('./assets/OpenSans-ExtraBold.ttf');
    p.names = p.loadStrings('./assets/recipes.txt');
  }


  p.setup = function(){
    p.frameRate(p.targetFrameRate);
    p.createCanvas(p.windowWidth,p.windowHeight, p.WEBGL);
    p.pg = p.createGraphics(p.hc.width, p.hc.height);

    if(p.windowWidth / p.windowHeight < 1){
      p.isPhone = 1;
      p.scaler = 0.15;
    } else {p.scaler = 1;
      }

    p.cols = p.windowWidth/p.scl;
    p.rows = p.windowHeight/p.scl;

    // p.luaX = p.int(p.windowWidth/(Math.random()*10+1));
    // p.luaY = p.int(p.windowHeight/(Math.random()*10+1));
    // p.luaZ = p.int(p.windowWidth/(Math.random()*20-10));
    // console.log(p.luaX, p.luaY, p.luaZ);

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
          p.textCanvas.textSize(p.windowWidth/3);
          p.textCanvas.textStyle(p.BOLD);
          p.textCanvas.textAlign(p.CENTER, p.CENTER);
          p.textCanvas.fill(Math.random()*255, Math.random()*255, Math.random()*255);
          p.textCanvas.blendMode(p.SCREEN);
          p.textCanvas.rotateY(Math.random()*p.windowWidth/4);
          // ,0, Math.random()*p.windowHeight/9);
          // p.textCanvas.translate(Math.random()*p.windowWidth/4,0, Math.random()*p.windowHeight/9);

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
        p.scale(1);
        p.sphere(p.windowWidth, 24, 24);
      p.pop();
      firstPerson(p.cam, p.move);
      p.scale(p.scaler);
      p.drawScene();

      console.log("cam.eyeX: ", p.cam.eyeX, "cam.eyeY: ", p.cam.eyeY, "cam.eyeZ: ", p.cam.eyeZ, "cam.centerX: ", p.cam.centerX, "cam.centerY: ", p.cam.centerY, "cam.centerZ: ", p.cam.centerZ);

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
      // console.log(p.cameraPosition);

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

        // p.strokeWeight(0.6);//p.strokeWeight(Math.random());
        // p.stroke(Math.random()*180, Math.random()*90)

        p.push();
          p.strokeWeight(0.6);//p.strokeWeight(Math.random());
          p.stroke(Math.random()*180, Math.random()*90);
          // p.fill(Math.random()*100, Math.random()*120);
          // p.rotateX(p.PI);
          // p.translate(0,-500,0);
          p.model(p.edificio);
        p.pop();

        // draw sphere
        // p.push();
        //   p.scale(100);
        //   p.translate(p.luaX, p.luaY, p.luaZ);
        //   p.rotateX(p.angle*0.3);
        //   p.rotateY(p.angle*-1.3);
        //   p.rotateZ(p.angle*1.2);
        //   p.model(p.lua);
        //   // p.sphere(100);
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

  p.windowResized = function() {
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
  p.value = 0;
  p.isPhone = 0;

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
    console.log("width: ",p.Xaxis);
    console.log("height: ",p.Yaxis);
    let conta = p.Xaxis/p.Yaxis;
    console.log("conta: ", conta);

    if(p.Xaxis / p.Yaxis < 1){
      p.isPhone = 1;
    } else {
      p.isPhone = 0;
    }
    // p.textFont('Courier New');
    console.log("isPhone: ", p.isPhone);
  }

  //INFO TEXT
  p.infoText = function() {
    p.textCanvas.textAlign(p.CENTER,p.CENTER);
    p.textCanvas.textStyle(p.NORMAL);
    p.textCanvas.textSize(p.int(p.Xaxis/70));
    p.textCanvas.text("infinitely deformed and transformed cuts of lua onus. eyes with mouse/trackpad - w+a+s+d makes it move.\ncomputer use is recommended. select a pixel to make it sound.", p.Xaxis/2, p.Yaxis/2.65);
    // p.Yaxis/3.3
    //INFO TEXT 2
    p.textCanvas.textAlign(p.CENTER,p.CENTER);
    p.textCanvas.textStyle(p.NORMAL);
    p.textCanvas.textSize(p.int(p.Xaxis/70));
    p.textCanvas.text("nuno loureiro for gnration [órbita #24].\n thank you to the authors of the open-source tools used (webpd: sébastien piquemal / hydra: olivia jack / pd / p5js),\n as well as the respective discord communities, daniel shiffman and gnration for the invite.\n\ncaution: fast and bright color movement.", p.Xaxis/2, p.Yaxis/1.5);
    // p.Yaxis/1.4
    // p.Xaxis/7.7

  }

  p.infoTextPhone = function() {
    p.textCanvas.textAlign(p.CENTER,p.CENTER);
    p.textCanvas.textStyle(p.NORMAL);
    p.textCanvas.textSize(p.int(p.Yaxis/70));
    p.textCanvas.text("infinitely deformed and transformed\ncuts of lua onus.\neyes with mouse/trackpad.\nw+a+s+d makes it move.\ncomputer use is recommended.\nselect a pixel to make it sound.", p.Xaxis/2, p.Yaxis/2.8);
    // p.Yaxis/3.3
    //INFO TEXT 2
    p.textCanvas.textAlign(p.CENTER,p.CENTER);
    p.textCanvas.textStyle(p.NORMAL);
    p.textCanvas.textSize(p.int(p.Yaxis/70));
    p.textCanvas.text("nuno loureiro for gnration [órbita #24].\nthank you to the authors of the open-source\ntools used (webpd: sébastien piquemal /\nhydra: olivia jack / pd / p5js) as well as the\nrespective discord communities, daniel\nshiffman and gnration for the invite.\n\ncaution: fast and bright color movement.", p.Xaxis/2, p.Yaxis/1.53);
    // p.Yaxis/1.4
    // p.Xaxis/7.7

  }

  p.draw = function(){
    p.clear();
    p.rectDraw();
    p.textDraw();
    //INFO TEXT

    // console.log("isPhone: ", p.isPhone);

    if (p.isPhone == 1){
      p.infoTextPhone();
      // console.log("isPhone");
    } else {
      p.infoText();
    }

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
        // console.log(p.pRotationX);
      p.pop();

      // p.value = map(p.rotationX, -p.PI, p.PI, 0, 255);
      // p.fill(p.value, 100, 100);
      // p.rectMode(p.CENTER);
      // p.rect(25, 25, 50, 50);

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
