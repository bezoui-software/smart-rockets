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

class Rocket {
  constructor(x, y, w, h) {
    this.position = createVector(x, y);
    this.velocity = createVector();
    this.acceleration = createVector();
    this.width = w || 5;
    this.height = h || 20;
    this.color = createColor(255, 255, 255);
    this.canvas;
    this.target;
    this.speed = 0.2;
    this.fitness;
    this.moveIndex = 0;
    this.stopMoving;
    this.fail;
    this.win;
    this.dna = new DNA();
    this.dna.totalePath = 400;
    this.dna.run();
    this.time = {start: Date.now()};
  }
  
  update() {
    if (!this.target) return;
    this.move();
    this.updateFitness();
    this.updateDurationTime();
    this.updateWin();
  }

  reachTarget() {
    let d = XDraw.Vector.dist(this.position, this.target.position);
    return d < this.target.radius;
  }

  updateWin() {
    this.win = this.reachTarget();
  }

  updatePosition() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(2);
    this.acceleration.mult(0);
    this.position.add(this.velocity);
  }

  move() {
    if ((this.moveIndex < this.dna.size()) && !this.win && !this.stopMoving) {
      this.applyForce(this.dna.get(this.moveIndex));
      this.updatePosition();
      this.moveIndex++;
    }
  }

  updateFitness() {
    let d = XDraw.Vector.dist(this.position, this.target.position);
    this.fitness = 1/d;

    if (this.reachTarget()) this.fitness *= 20/this.time.duration;
    if (this.fail) this.fitness /= 10;   
  }

  updateDurationTime() {
    this.time.end = Date.now();
    this.time.duration = (this.time.end - this.time.start);
  }

  show() {
    if (this.win) this.color = createColor(0, 78, 204);
    if (this.fail) this.color = createColor(100);   
    this.canvas.begin();
    this.canvas.translate(this.position.x, this.position.y);
    this.canvas.rotate(this.rotation());
    this.canvas.noStroke();
    this.canvas.fill(this.color); 
    this.canvas.rect(-this.width/2, -this.height/2, this.width, this.height);
    this.canvas.end();
  }

  applyForce(force) {
    this.acceleration.add(force);
    this.acceleration.setMag(this.speed);
  }

  center() {
    return {x: this.position.x - this.width/2, y: this.position.y - this.height/2};
  }

  rotation() {
    return this.velocity.headingRad()-radians(90);
  }

  onCollision(other) {
    return ((this.position.x > other.position.x-other.width/2 && this.position.x < other.position.x + other.width/2) && 
            (this.position.y > other.position.y-other.height/2 && this.position.y < other.position.y + other.height/2)); 
  }

  onCollisionWithEdges() {
    return (
            (this.position.x-this.width/2  <= 0) ||
            (this.position.x+this.width/2  >= this.canvas.width) ||  
            (this.position.y-this.height/2 <= 0) || 
            (this.position.y+this.height/2 >= this.canvas.height)
           );
  }
}


              