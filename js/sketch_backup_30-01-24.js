///HYDRA + HYDRA P5JS CANVAS + SPHERIC MESH + 3D OBJECTS
var sketch1 = function(p){

  window.firstPerson = (cam) => {
      cam.firstPersonState = cam.firstPersonState || {
        azimuth: -p.atan2(cam.eyeZ - cam.centerZ, cam.eyeX - cam.centerX),
        zenith: -p.atan2(cam.eyeY - cam.centerY, p.dist(cam.eyeX, cam.eyeZ, cam.centerX, cam.centerZ)),
        lookAtDist: p.dist(cam.eyeX, cam.eyeY, cam.eyeZ, cam.centerX, cam.centerY, cam.centerZ),
        mousePrevX: p.mouseX,
        mousePrevY: p.mouseY
      }

      // Look around controls
      cam.firstPersonState.azimuth -= (p.mouseX - cam.firstPersonState.mousePrevX) / 100;
      if(p.abs(cam.firstPersonState.zenith + (p.mouseY - cam.firstPersonState.mousePrevY) / 100) < p.PI/2) cam.firstPersonState.zenith += (p.mouseY - cam.firstPersonState.mousePrevY) / 100;

      // Movement controls
      if(p.keyIsPressed && p.keyCode == 87 || p.keyIsDown(p.UP_ARROW)){
        cam.eyeX -= 2 * p.cos(cam.firstPersonState.azimuth)
        cam.eyeZ += 2 * p.sin(cam.firstPersonState.azimuth)
      }
      if(p.keyIsPressed && p.keyCode == 83 || p.keyIsDown(p.DOWN_ARROW)){
        cam.eyeX += 2 * p.cos(cam.firstPersonState.azimuth)
        cam.eyeZ -= 2 * p.sin(cam.firstPersonState.azimuth)
      }
      if(p.keyIsPressed && p.keyCode == 65 || p.keyIsDown(p.LEFT_ARROW)){
        cam.eyeX -= 2 * p.cos(cam.firstPersonState.azimuth + p.PI/2)
        cam.eyeZ += 2 * p.sin(cam.firstPersonState.azimuth + p.PI/2)
      }
      if(p.keyIsPressed && p.keyCode == 68 || p.keyIsDown(p.RIGHT_ARROW)){
        cam.eyeX += 2 * p.cos(cam.firstPersonState.azimuth + p.PI/2)
        cam.eyeZ -= 2 * p.sin(cam.firstPersonState.azimuth + p.PI/2)
      }

      // Update previous mouse position
      cam.firstPersonState.mousePrevX = p.mouseX;
      cam.firstPersonState.mousePrevY = p.mouseY;

      // Update the look-at point
      cam.centerX = cam.eyeX - cam.firstPersonState.lookAtDist * p.cos(cam.firstPersonState.zenith) * p.cos(cam.firstPersonState.azimuth);
      cam.centerY = cam.eyeY + cam.firstPersonState.lookAtDist * p.sin(cam.firstPersonState.zenith);
      cam.centerZ = cam.eyeZ + cam.firstPersonState.lookAtDist * p.cos(cam.firstPersonState.zenith) * p.sin(cam.firstPersonState.azimuth);

      // Call the built in p5 function 'camera' to position and orient the camera
      p.camera(cam.eyeX, cam.eyeY, cam.eyeZ,  // position
             cam.centerX, cam.centerY, cam.centerZ,  // look-at
             0, 1, 0)  // up vector
}

  ///HYDRA BACKGROUND CANVAS
  const c = document.createElement('canvas');
  const hydra = new Hydra({detectAudio: false, canvas: c})

  ///HYDRA BACKGROUND CODE
  noise(2,0.2).mult(solid(0.6,0,0.4)).out()

  ////P5JS INIT
  p.tex;
  p.angle = 0;

  p.globe = [];
  p.prevGlobe = [];
  p.r = 1000;
  p.total = 30;
  p.v;

  p.vhs;
  p.scl =  10;
  p.cols;
  p.rows;

  p.LuaOnusUV;
  p.edificio;

  p.preload = function() {
    p.LuaOnusUV = p.loadImage('js/capa_digital.jpg');
    p.edificio = p.loadModel('js/Edificios.obj')
  }


  p.setup = function(){
    // p.frameRate(30);
    p.createCanvas(p.windowWidth,p.windowHeight, p.WEBGL);
    p.cols = p.windowWidth/p.scl;
    p.rows = p.windowHeight/p.scl;

    p.tex = p.createGraphics(1, 1);

    p.vhs = p.createGraphics(p.windowWidth, p.windowHeight);

    p.cam = p.createCamera();

    // imageMode(CENTER);
    p.background(0);
    p.grid()
  }

  p.draw = function() {

      let fps = p.frameRate();
      console.log(fps);
      // p.clear(0,0,0,0);

      p.background(0);


      p.toImage(c);
      p.texture(p.tex);
      p.sphere(p.windowWidth, p.windowHeight);

  ///TRIANGLE MESH CIRCLE - TURNED OFF BC IT PUTS 2 MUCH ON THE CPU

      // p.sphericMesh();
      p.drawScene();
      firstPerson(p.cam);
      //

      p.image(p.vhs, 0-p.windowWidth/2, 0-p.windowHeight/2);
    }

  p.sphericMesh = function() {
      for (let i = 0; i < p.total + 1; i++) {
        p.globe[i] = [];
        const lat = p.map(i, 0, p.total, 0, p.PI);
        for (let j = 0; j < p.total + 1; j++) {
          const lon = p.map(j, 0, p.total, 0, p.TWO_PI);
          const x = p.r * p.sin(lat) * p.cos(lon);
          const y = p.r * p.sin(lat) * p.sin(lon);
          const z = p.r * p.cos(lat);
          p.globe[i][j] = p.createVector(x, y, z);
          let v = p5.Vector.random3D();
          v.mult(120);

          p.globe[i][j].add(v);
        }
      }

      for (let i = 0; i < p.total; i++) {
        p.beginShape(p.TRIANGLE_STRIP);
        for (let j = 0; j < p.total + 1; j++) {
          if ( j % 100 == 0) {
              p.fill(0, 0, p.random(0,255), p.random(40));
          } else { }

          p.strokeWeight(p.random(0,1));
          p.stroke(p.random(0,180), p.random(0,90));

          if ( j % 1 == 0) { ///CHANGING THE MODULUS VALUE CHANGES SPEED OF BACKGROUND AND SHAPES FORMED
          const v1 = p.globe[i][j];
          p.vertex(v1.x, v1.y, v1.z);
          const v2 = p.globe[i + 1][j];
          p.vertex(v2.x, v2.y, v2.z);
        }
        }
        p.endShape();
      }
    }

    p.drawScene = function(){
        // p.frameRate(20);
        p.lights();
        p.pointLight(255, 255, 255, 0, -100, 0);

        p.push();
          p.fill(p.random(0,100), p.random(0,120));
          p.model(p.edificio);
        p.pop();

        p.push();
          p.texture(p.LuaOnusUV);
          p.noStroke();
          p.rotateX(p.angle*0.3);
          p.rotateY(p.angle*-1.3);
          p.rotateZ(p.angle*1.2);
          p.sphere(100);
        p.pop();

        // Draw a cube
        p.push()
          p.fill(255, 100, 100)
          p.noStroke()
          p.translate(200, 50, 100)
          p.box(50)
        p.pop()

        p.angle += 0.007;
      }

    p.grid = function() {
          p.vhs.strokeWeight(1);
          p.vhs.stroke(255,20);
          p.vhs.noFill();
          for (var x = 0; x < p.cols; x++){
            for (var y = 0; y < p.rows; y++){
                p.vhs.rect(x * p.scl,y * p.scl, p.scl, p.scl);
            }
          }
      }

    p.toImage = function(c) {
      	p.loadImage(c.toDataURL("image/png"), (im) => {
      		p.tex = im;
      	})
      }

    p.windowResized = function(){
          p.resizeCanvas(p.windowWidth, p.windowHeight);
    }
}

///VHS GRID FX + MARKOV TEXT GEN
var sketch2 = function(p){

  p.vhs;
  p.scl = 5;
  p.cols;
  p.rows;

  p.names;
  p.order = 4;
  p.ngrams = {};
  p.beginnings = [];
  p.button;
  p.lastCallTime = -1;
  p.allWords = [];

  p.preload = function(){
    p.names = p.loadStrings('js/recipes.txt');
    // console.log(p.names);
  }

  p.setup = function(){

    p.createCanvas(p.windowWidth,p.windowHeight);

    p.cols = p.windowWidth/p.scl;
    p.rows = p.windowHeight/p.scl;

    p.vhs = p.createGraphics(p.windowWidth, p.windowHeight);
    p.textCanvas = p.createGraphics(p.windowWidth, p.windowHeight);

    p.setupMarkovText();
    p.showText();

    p.vhsGrid()
    p.imageMode(p.CENTER);
    p.image(p.textCanvas, p.windowWidth/2, p.windowHeight/2);
    p.image(p.vhs, p.windowWidth/2, p.windowHeight/2);

  }

  p.setupMarkovText = function() {

    for (let j = 0; j < p.names.length; j++) {
      let txt = p.names[j];
      for (let i = 0; i <= txt.length - p.order; i++) {
        let gram = txt.substring(i, i + p.order);
        if (i == 0) {
          p.beginnings.push(gram);
        }

        if (!p.ngrams[gram]) {
          p.ngrams[gram] = [];
        }
        p.ngrams[gram].push(txt.charAt(i + p.order));
      }
    }
    // p.button = p.createButton("generate");
    // p.button.mousePressed(p.markovIt);
    // console.log(p.ngrams);
    // p.markovIt();
  }

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
      let len = result.length;
      currentGram = result.substring(len - p.order, len);
      if (currentGram == ".") {
        break;
      }
    }
    // console.log(result);
    return result;
    // p.createP(result);
  }

  p.chooseWord = function(newText) {

    let tokens = newText.split(/\W+/);

    p.allWords = [];

    for (let i = 0; i < tokens.length; i++) {
      let word = tokens[i].toUpperCase();

      if (word != "AND" && word != "OR" && word != "OF" && word !="WITH" && word != "TO" && word != "IF" && word != "ELSE" && word != "ON" && word != "IN" && word != "UNDER" && word != "ABOVE" && word != "BELOW" && word != "THE" && word != "OUT" && word != "A" && word != "FOR" && word != "AS" && word != "DO" && word != "DOES" && word != "DON'T" && word != "DOESN'T" && word!= "THIS" && word != "THAT" && word != "ITS" && word != "S" && word != "IS" && word != "I" && word != "YOU" && word != "HE" && word != "SHE" && word != "IT" && word != "THEY" && word != "THEM" && word != "HIS" && word != "HERS" && word != "MINE" && word != "YOURS"){
          p.allWords.push(word);
      }
    }

    let randomIndex = p.floor(p.random(p.allWords.length));
    let chosenWord = p.allWords[randomIndex];

    // console.log(chosenWord);
    return chosenWord;
  }

  p.showText = function(chosenWord) {
        // console.log(chosenWord);
        p.textCanvas.clear();

        p.textCanvas.fill(200);
        p.textCanvas.noStroke();
        p.textCanvas.textSize(p.windowWidth/10);
        p.textCanvas.textStyle(p.BOLD);
        p.textCanvas.textAlign(p.CENTER, p.CENTER);
        p.textCanvas.text(chosenWord, p.windowWidth/2, p.windowHeight/2);
  }

  p.vhsGrid = function() {
        p.vhs.clear();
        p.vhs.strokeWeight(2);
        p.vhs.stroke(5,20);
        p.vhs.noFill();
        for (var x = 0; x < p.cols; x++){
          for (var y = 0; y < p.rows; y++){
              p.vhs.rect(x * p.scl,y * p.scl, p.scl, p.scl);
          }
        }
    }

  p.draw = function(){

        let currentTime = p.int(p.millis()/1000);
        // console.log(currentTime);

        // Check if one second has passed and the condition is true
        if (currentTime !== p.lastCallTime && currentTime % 30 === 0) {
            p.lastCallTime = currentTime;

            // Call the function only once per second
            const newText = p.markovIt();
            console.log(newText);
            const chosenWord = p.chooseWord(newText);

            // p.textCanvas.clear();

            p.showText(chosenWord);
            p.vhsGrid();

            p.clear();

            p.image(p.textCanvas, p.windowWidth/2, p.windowHeight/2);
            p.image(p.vhs, p.windowWidth/2, p.windowHeight/2);
        }

        let gate = p.int(p.random(50));

        // console.log(gate);

        if (gate == 1) {
          p.clear();
          p.image(p.vhs, p.windowWidth/2, p.windowHeight/2);
        }

  }

}

p5.disableFriendlyErrors = true;

var myp5_1 = new p5(sketch1, 'c1');


var myp5_2 = new p5(sketch2, 'c2');
