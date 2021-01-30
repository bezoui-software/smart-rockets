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

"use strict";

class Population {
  constructor(x, y) {
    this.rockets = [];
    this.matingpool;
    this.totale = 100;
    this.initialLifespan = 400;
    this.lifespan = this.initialLifespan;
    this.spawPosition = createVector(x, y);
    this.rocketDim = {width: 5, height: 20};
    this.canvas;
    this.tester;
    this.target;
    this.walls;
    this.MUTATION_CHANCE = 0.1;
  }

  run() {
    this.spawnRockets();
  }

  get() {
    return this.rockets;
  }

  size() {
    return this.get().length;
  }

  add(rocket) {
    this.rockets.push(rocket);
  }

  show() {
    for (let rocket of this.get()) rocket.show();
  }

  reset() {
    this.lifespan = this.initialLifespan;
    this.rockets = [];
  }

  update() {
    this.updateLifespan();
    this.updateRockets();
    this.handleCollisionWithWalls();
    this.handleCollisionWithEdges();
  }

  spawnRockets() {
    for (let i=0; i<this.totale; i++) {
      const x = this.spawPosition.x;
      const y = this.spawPosition.y;
      const rocket = new Rocket(x, y, this.rocketDim.width, this.rocketDim.height);
      rocket.canvas = this.canvas;
      rocket.target = this.target;
      rocket.dna.totalePath = this.lifespan;
      rocket.dna.run();
      this.add(rocket);
    }
  }

  nextGeneration() {
    this.normalizeDurations();
    this.updateFitnesses();
    this.normalizeFitnesses(); 
    this.tester.update(this);
    this.generateMatingpool();
    this.generateNextGeneration();
  }

  normalizeFitnesses() {
    let maxFitness = -Infinity;
    for (let rocket of this.get()) if (rocket.fitness > maxFitness) maxFitness = rocket.fitness;
    for (let rocket of this.get()) rocket.fitness /= maxFitness;
  }

  normalizeDurations() {
    let maxDuration = -Infinity;
    for (let rocket of this.get()) if (rocket.reachTarget()) if (rocket.time.duration > maxDuration) maxDuration = rocket.time.duration;
    for (let rocket of this.get()) rocket.time.duration /= maxDuration;
  }

  generateMatingpool() {
    this.matingpool = [];
    for (let rocket of this.get()) {
      const chance = rocket.fitness * 10000;
      for (let i=0; i<chance; i++) {
        this.matingpool[i] = rocket;
      }
    }
  }
 
  generateNextGeneration() {
    this.reset();
    for (let i=0; i<this.totale; i++) {
      const parentA = this.getRandomParent();
      const parentB = this.getRandomParent();
      if (parentA && parentB) {
        const child = new Rocket(this.spawPosition.x, this.spawPosition.y, this.rocketDim.width, this.rocketDim.height);
        child.canvas = this.canvas;
        child.target = this.target;
        child.dna = DNA.Crossover(parentA, parentB);
        child.dna.mutate(this.MUTATION_CHANCE);
        child.dna.totalePath = this.lifespan;
        this.add(child);
      }
    }
  }

  handleCollisionWithWalls() {
    if (!this.walls) return;
    for (let rocket of this.get()) {
      for (let wall of this.walls.get()) {
        if (rocket.onCollision(wall)) {
          rocket.stopMoving = true;
          rocket.fail = true;
        }
      }
    }
  }

  handleCollisionWithEdges() {
    for (let rocket of this.get()) {
      if (rocket.onCollisionWithEdges()) {
        rocket.color = 100;
        rocket.stopMoving = true;
        rocket.fail = true;
      }
    }
  }

  updateLifespan() {
    (this.lifespan > 0) ? this.lifespan -= 1 : this.nextGeneration();
  } 

  updateRockets() {
    for (let rocket of this.get()) rocket.update();
  }

  updateFitnesses() {
    for (let rocket of this.get()) rocket.updateFitness();
  }
    
  getRandomParent() {
    return random(this.matingpool);
  }

  getWinnersNumber() {
    let winnersNumber = 0;
    for (let rocket of this.get()) if (rocket.win) winnersNumber++;
    return winnersNumber;
  }

  getAvgFitness() {
    let avgFitness = 0;
    for (let rocket of this.get()) {
      avgFitness += rocket.fitness;
    }
    avgFitness /= this.size();
    return avgFitness;
  }

  getMaxFitness() {
    let maxFitness = -Infinity;
    for (let rocket of this.get()) {
      if (rocket.fitness > maxFitness) {
        maxFitness = rocket.fitness;
      }
    }
    return maxFitness;
  }

  getAvgDuration() {
    let avgDuration = 0;
    for (let rocket of this.get()) {
      if (rocket.win) {
        this.avgDuration += rocket.time.duration;
      }
    }
    avgDuration /= this.getWinnersNumber();
    return avgDuration;
  }

  getMinDuration() {
    let minDuration = Infinity;
    for (let rocket of this.get()) {
      if (rocket.reachTarget()) {
        if (rocket.time.duration < minDuration) {
          minDuration = rocket.time.duration;
        }
      }
    }
    return minDuration;
  }
}