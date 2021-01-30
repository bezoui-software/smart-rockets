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

class DOMElements {
  constructor() {
    this.elements;
  }

  set(elements) {
    this.elements = elements;
  }

  get(elementName) {
    const element = this.elements[elementName];
    if (!element) throw new Error('"'+elementName+'" element not found.');
    return element;
  }


  getEltOf(elementName) {
    return this.get(elementName).elt;
  }

  getInputOf(elementName) {
    return this.get(elementName).input;
  }

  valueOf(elementName) {
    const input = this.getInputOf(elementName);
    if (!input) throw new Error('.valueOf() function work with inputs.');
    return input.value;
  }

  render() {
    for (let elementName of Object.keys(this.elements)) {
      const element = this.elements[elementName];
      document.body.appendChild(element.elt);
    }
  }

  generate() {
    for (let elementName of Object.keys(this.elements)) {
      const element = this.elements[elementName];
      this.generateElt(element);
      this.generateClassList(element);
      this.generateEvents(element);
    }
  }

  generateElt(element) {
    if (element.type == 'input') {
      this.generateInputElt(element);
    } else {
      this.generateDefaultElt(element);
    }
    element.elt.id = element.id;
  }

  generateEvents(element) {
    if (element.events) {
      for (let eventName of Object.keys(element.events)) {
        element.elt.addEventListener(eventName, element.events[eventName]);
      }
    }
  }

  generateClassList(element) {
    if (element.classList) {
      const classListArray = element.classList.split(' ');
      element.elt.classList.add(...classListArray);
    }
  }

  generateInputElt(element) {
    element.elt = document.createElement('div');

    element.input = document.createElement('input');
    for (let inputOptionName of Object.keys(element.inputOptions)) {
      element.input[inputOptionName] = element.inputOptions[inputOptionName];
    }

    element.label = document.createElement('label');
    element.label.innerText = element.text;     
 
    element.elt.appendChild(element.label);
    element.elt.appendChild(element.input);
  }

  generateDefaultElt(element) {
    element.elt = document.createElement(element.type);
    element.elt.innerText = element.text;
  }
}