  //
  // const main = async function(){
  //     await loadScript("https://cdn.statically.io/gl/metagrowing/extra-shaders-for-hydra/main/lib/lib-pattern.js");
  //     noise(2,0.2).out()
  // }


  window.onload = function(){
    var hydra = new Hydra({detectAudio: false, canvas: document.getElementById("myCanvas")});
      // main();

    var x;
    var y;

    // noise(1.2,0.2).out()

// _________

    noise(3,0.2,0.6)
      .modulateHue(noise(2))
      .scale(1)
      .mask(shape(999))
        .rotate(()=> mouse.x / 100000, ()=> mouse.y / 100000)
      .out(o1)
    
    noise(2.5,0.2,0.6)
      .modulateHue(noise(2.2))
      .scale(1)
      .brightness(0.2)
      .mask(shape(999,0,0.5))
        .rotate(()=> mouse.x / 100000, ()=> mouse.y / 100000)
      .out(o2)

    osc(2,0.1,0.9)
      .modulateHue(noise(0.2))
      .modulateRotate(noise(0.1))
      .saturate(20)
      .add(osc(2).modulatePixelate(noise(2000,0,9000)))
      .out(o3)


    src(o1)
      .layer(solid(0,0,0))
      .layer(src(o3)
        .mult(src(o2)))
      .modulateScrollX(noise(1.5))
      .rotate( () => mouse.x/1000000 * 0.00001, () => mouse.y/10000000 * 0.00001)
      .saturate(5)
      .mask(shape(4,0.5,0.1)).scale(1.2)
      .saturate(2)
      .luma(0.1,0.9)
      .out()

// ________

    // osc(6500).color(1,0.3,0.1).saturate(10).modulateScrollX(osc(0.1)).modulateRotate(noise(1,0.3,01)).out(o1)
    //
    // shape(4).mult(osc(0.2),0.1).mult(src(o1)).out()
  }
