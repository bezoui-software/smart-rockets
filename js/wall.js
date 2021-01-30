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

class Wall {
  constructor(a, b, c, d) {
    if (a instanceof Wall) {
      this.position = a.position.copy();
      this.width = a.width;
      this.height = a.height;
      this.color = a.color;
    } else {
      this.position = createVector(a, b);
      this.width = c;
      this.height = d;
      this.color = createColor(255);
    }
  }

  set(x, y, w, h) {
    this.position.set(x, y);
    this.width = w;
    this.height = h;
  }

  showOutline(canvas) {
    canvas.begin();
    canvas.translate(this.position.x, this.position.y);
    canvas.noFill();
    canvas.stroke(this.color);
    canvas.strokeWeight(2);
    canvas.rect(-this.width/2, -this.height/2, this.width, this.height);
    canvas.end();
  }

  show(canvas) {
    canvas.begin();
    canvas.translate(this.position.x, this.position.y);
    canvas.noStroke();
    canvas.fill(this.color);
    canvas.rect(-this.width/2, -this.height/2, this.width, this.height);
    canvas.end();
  }
}