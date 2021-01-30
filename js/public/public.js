//Developed and created by Walid Bezoui
//Github: bezoui-software
//Mail: wbezoui@gmail.com

//Copyright 2020 - Walid Bezoui

//Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
//1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
//2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
//3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

//BSD-3-Clause License:
//THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
//AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, 
//THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
//IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS 
//BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, 
//OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) 
//HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, 
//OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, 
//EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


(function() {
  let canvas;
  const BACKGROUND_COLOR = createColor(0, 0, 0);
  let population, target;
  let walls,
      wallPreview,
      wallDim = {
        width: 40,
        height: 20,
        min: {
          width: 20,
          height: 10
        },
        max: {
          width: 200,
          height: 180
        }
     },
     removedWalls = [];
  let spawPosition;
  let pauseState;
  let elements;
  let tester;

  function setup() {
    setupCanvas();
    setupElements();
    setupTester();
    setupSpawnPosition();
    setupWalls();
    setupTarget();
    setupPopulation();
    setupEvents();
  }

  function update() {
    if (!canvas) return;
    clearCanvas();
    updatePlayToggleText();
    if (!pauseState) {
      for (let i = 0; i < elements.valueOf('speed-slider'); i++) {
        population.update();
      }
    }
    population.show();
    target.show(canvas);
    walls.show(canvas);

    canvas.ctx.setLineDash([5, 5]);
    wallPreview.set(canvas.mouseX, canvas.mouseY, wallDim.width, wallDim.height);
    wallPreview.color = createColor(100, 100, 100, 100);
    wallPreview.showOutline(canvas);
  }

  function run() {
    setup();
    setInterval(update, 1000/60);
  }

  window.addEventListener('load', run);

  function playToggle() {
    (!pauseState) ? pause(): play();
  }

  function updatePlayToggleText() {
    elements.getEltOf('play-toggle').innerText = getPlayToggleText();
  }

  function getPlayToggleText() {
    return ((pauseState) ? 'Play' : 'Pause');
  }

  function pause() {
    pauseState = true;
  }

  function play() {
    pauseState = false;
  }

  function resetWalls() {
    walls = new Walls();
    removedWalls = [];
  }

  function resetPopulation() {
    setupPopulation();
  }

  function resetTester() {
    tester.clear();
    tester = new Tester();
  }

  function reset() {
    resetTester();
    resetPopulation();
    resetWalls();
  }

  function handleKeyboardPressedEvent() {
    window.addEventListener('keypress', e => {
      const key = e.key.toLowerCase();
      switch (key) {
        case 'z':
          removeLastWall();
          break;
        case 'e':
          addLastRemovedWall();
          break;
        case 'r':
          reset();
          break;
      }
    })
  }

  function addWall(wall) {
    walls.add(wall);
    resetTester();
    resetPopulation();
  }

  function addWallAt(x, y) {
    addWall(new Wall(x, y, wallDim.width, wallDim.height));
  }

  function addWallAtAtMousePosition() {
    addWallAt(canvas.mouseX, canvas.mouseY);
  }

  function addWallByMouseClick() {
    canvas.elt.onclick = addWallAtAtMousePosition;
  }

  function changeWallDimByMouseWheel() {
    window.addEventListener('wheel', e => {
      e.preventDefault();
      (e.deltaY < 0) ? increaseWallDim(): decreaseWallDim();
    }, {
      passive: false
    });
  }

  function increaseWallDim() {
    if (wallDim.width < wallDim.max.width && wallDim.height < wallDim.max.height) {
      wallDim.width += 5;
      wallDim.height += 5;
    }
  }

  function decreaseWallDim() {
    if (wallDim.width > wallDim.min.width && wallDim.height > wallDim.min.height) {
      wallDim.width -= 5;
      wallDim.height -= 5;
    }
  }

  function addLastRemovedWall() {
    const wall = removedWalls.pop();
    if (wall) addWall(wall);
  }

  function removeLastWall() {
    const wall = walls.pop();
    if (wall) {
      removedWalls.push(wall);
      resetTester();
      resetPopulation();
    }
  }

  function clearCanvas() {
    canvas.background(BACKGROUND_COLOR);
  }

  function setupCanvas() {
    canvas = createCanvas(window.innerWidth, 400);
  }


  function setupTester() {
    tester = new Tester();
  }

  function setupWalls() {
    walls = new Walls();
    wallPreview = new Wall();
    wallPreview.color = createColor(150, 100);
  }

  function setupPopulation() {
    population = new Population(spawnPosition.x, spawnPosition.y);
    population.canvas = canvas;
    population.tester = tester;
    population.target = target;
    population.walls = walls; 
    population.run();
  }

  function setupTarget() {
    target = new Target(canvas.width / 2, 100);
  }

  function setupSpawnPosition() {
    spawnPosition = createVector(canvas.width / 2, canvas.height - 20);
  }

  function setupElements() {
    elements = new DOMElements();
    elements.set({
      'speed-slider': {
        text: 'Speed:',
        id: 'speed-slider',
        classList: 'flex-center-row',
        type: 'input',
        inputOptions: {
          type: 'range',
          min: 1,
          max: 2000,
          value: 1,
          step: 1
        }
      },
      'play-toggle': {
        text: 'Play',
        id: 'play-toggle',
        classList: 'small-button-max-radius',
        type: 'button',
        events: {
          click: playToggle
        }
      }
    });
    elements.generate();
    elements.render();
  }

  function setupEvents() {
    addWallByMouseClick();
    changeWallDimByMouseWheel();
    handleKeyboardPressedEvent();
  }
})();