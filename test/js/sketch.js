
"use strict";

(function() {
  let canvas;
  let xoff = 0, yoff = 0;

  function setup() {
    canvas = createCanvas(800, 600);
    testFloor([
      {inputs: [-99.3], expectedOutput: -99},
      {inputs: [1/3], expectedOutput: 0},
      {inputs: [0.65], expectedOutput: 0},
      {inputs: [80.99], expectedOutput: 80}
    ]);
  }

  function update() {    

  }

  function testXDrawVectorDotProduct(options) {
    testFuncs(XDraw.Vector.dorProduct, options);
  }

  function testFloor(options) {
    testFuncs(floor, options);
  }

  function testFuncs(func, options) {
    for (let option of options) {
      const output = func(...option.inputs);
      console.log("OPTION : ", option);
      console.log("OUTPUT : ", output);
      console.log("EXPECTED OUTPUT : ", option.expectedOutput);
      (output == option.expectedOutput) ? console.log("%cTEST PASSED******************", "color: green;") : console.log("%cTEST FAILED******************", "color: red;");
    }
  }

  function loop() {
    update();
    requestAnimationFrame(loop);
  }

  function run() {
    setup();
    requestAnimationFrame(loop);
  }

  window.onload = run;
}())