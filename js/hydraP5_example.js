var sketch1 = function(p){

  p.hc = document.createElement('canvas')
  p.hc.width = p.windowWidth;
  p.hc.height = p.windowHeight;
  // document.body.appendChild(p.hc);
  let hydra = new Hydra({ detectAudio: false, canvas: p.hc });
  p.pg;

  x = () => (-mouse.x/width)+.5
  y = () => (-mouse.y/height)+.5
  a = function(){return 0.8 * Math.sin(time*0.1)};
  b = function(){return 0.04 * Math.sin(time*0.01)};

  noise(()=> 2 + 1 * x() / y() * (Math.sin(time*0.01)+0.2),0.2).mult(solid(a,b,() => 0.2 + 0.5 * y() / x() * (Math.cos(time*0.015)+0.2))).modulate(noise(()=> 0.1*x()*y()), 0.1).out()


////P5JS INIT

p.tex;

p.setup = function(){
  p.createCanvas(p.windowWidth,p.windowHeight, p.WEBGL);
  p.background(0);
  p.pg = p.createGraphics(p.hc.width, p.hc.height);

}

p.draw = function() {
    p.pg.drawingContext.drawImage(p.hc, 0, 0, p.pg.width, p.pg.height);
    p.background(0);
    p.texture(p.pg);
    p.noStroke();
    p.sphere(600, 24, 24);
}

}

var myp5_1 = new p5(sketch1, 'c1');
