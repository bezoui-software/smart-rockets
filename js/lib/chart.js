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

class CHART {
  constructor(options, width, height) {
    this.options = options;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width || window.innerWidth;
    this.canvas.height = height || 400;
    this.ctx = this.canvas.getContext("2d");
    this.chart = new Chart(this.ctx, this.options);
    this.x = 0;
  }

  add(i, data) {
    this.chart.data.labels.push(this.x);
    this.chart.data.datasets[i].data.push(data);
    this.x++;
    this.update();
  }

  update() {
    this.chart.update();
  }

  render() {
    document.body.appendChild(this.canvas);
  }

  clear() {
    this.canvas.parentElement.removeChild(this.canvas);
  }
}

function createChart(data) {
  const chart = new CHART({type: 'line', data: data});
  return chart;
}