(this["webpackJsonpcoinsenda-app"]=this["webpackJsonpcoinsenda-app"]||[]).push([[16],{403:function(t,e,n){var i;"undefined"!=typeof self&&self,t.exports=(i=n(2),function(t){var e={};function n(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(i,r,function(e){return t[e]}.bind(null,r));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=2)}([function(t,e){t.exports=i},function(t,e,n){"use strict";var i={linear:function(t,e,n,i){return(n-e)*t/i+e},easeInQuad:function(t,e,n,i){return(n-e)*(t/=i)*t+e},easeOutQuad:function(t,e,n,i){return-(n-e)*(t/=i)*(t-2)+e},easeInOutQuad:function(t,e,n,i){var r=n-e;return(t/=i/2)<1?r/2*t*t+e:-r/2*(--t*(t-2)-1)+e},easeInCubic:function(t,e,n,i){return(n-e)*(t/=i)*t*t+e},easeOutCubic:function(t,e,n,i){return(n-e)*((t=t/i-1)*t*t+1)+e},easeInOutCubic:function(t,e,n,i){var r=n-e;return(t/=i/2)<1?r/2*t*t*t+e:r/2*((t-=2)*t*t+2)+e},easeInQuart:function(t,e,n,i){return(n-e)*(t/=i)*t*t*t+e},easeOutQuart:function(t,e,n,i){return-(n-e)*((t=t/i-1)*t*t*t-1)+e},easeInOutQuart:function(t,e,n,i){var r=n-e;return(t/=i/2)<1?r/2*t*t*t*t+e:-r/2*((t-=2)*t*t*t-2)+e},easeInQuint:function(t,e,n,i){return(n-e)*(t/=i)*t*t*t*t+e},easeOutQuint:function(t,e,n,i){return(n-e)*((t=t/i-1)*t*t*t*t+1)+e},easeInOutQuint:function(t,e,n,i){var r=n-e;return(t/=i/2)<1?r/2*t*t*t*t*t+e:r/2*((t-=2)*t*t*t*t+2)+e},easeInSine:function(t,e,n,i){var r=n-e;return-r*Math.cos(t/i*(Math.PI/2))+r+e},easeOutSine:function(t,e,n,i){return(n-e)*Math.sin(t/i*(Math.PI/2))+e},easeInOutSine:function(t,e,n,i){return-(n-e)/2*(Math.cos(Math.PI*t/i)-1)+e},easeInExpo:function(t,e,n,i){return 0==t?e:(n-e)*Math.pow(2,10*(t/i-1))+e},easeOutExpo:function(t,e,n,i){var r=n-e;return t==i?e+r:r*(1-Math.pow(2,-10*t/i))+e},easeInOutExpo:function(t,e,n,i){var r=n-e;return 0===t?e:t===i?e+r:(t/=i/2)<1?r/2*Math.pow(2,10*(t-1))+e:r/2*(2-Math.pow(2,-10*--t))+e},easeInCirc:function(t,e,n,i){return-(n-e)*(Math.sqrt(1-(t/=i)*t)-1)+e},easeOutCirc:function(t,e,n,i){return(n-e)*Math.sqrt(1-(t=t/i-1)*t)+e},easeInOutCirc:function(t,e,n,i){var r=n-e;return(t/=i/2)<1?-r/2*(Math.sqrt(1-t*t)-1)+e:r/2*(Math.sqrt(1-(t-=2)*t)+1)+e},easeInElastic:function(t,e,n,i){var r,o,a,s=n-e;return a=1.70158,0===t?e:1==(t/=i)?e+s:((o=0)||(o=.3*i),(r=s)<Math.abs(s)?(r=s,a=o/4):a=o/(2*Math.PI)*Math.asin(s/r),-r*Math.pow(2,10*(t-=1))*Math.sin((t*i-a)*(2*Math.PI)/o)+e)},easeOutElastic:function(t,e,n,i){var r,o,a,s=n-e;return a=1.70158,0===t?e:1==(t/=i)?e+s:((o=0)||(o=.3*i),(r=s)<Math.abs(s)?(r=s,a=o/4):a=o/(2*Math.PI)*Math.asin(s/r),r*Math.pow(2,-10*t)*Math.sin((t*i-a)*(2*Math.PI)/o)+s+e)},easeInOutElastic:function(t,e,n,i){var r,o,a,s=n-e;return a=1.70158,0===t?e:2==(t/=i/2)?e+s:((o=0)||(o=i*(.3*1.5)),(r=s)<Math.abs(s)?(r=s,a=o/4):a=o/(2*Math.PI)*Math.asin(s/r),t<1?r*Math.pow(2,10*(t-=1))*Math.sin((t*i-a)*(2*Math.PI)/o)*-.5+e:r*Math.pow(2,-10*(t-=1))*Math.sin((t*i-a)*(2*Math.PI)/o)*.5+s+e)},easeInBack:function(t,e,n,i,r){return void 0===r&&(r=1.70158),(n-e)*(t/=i)*t*((r+1)*t-r)+e},easeOutBack:function(t,e,n,i,r){return void 0===r&&(r=1.70158),(n-e)*((t=t/i-1)*t*((r+1)*t+r)+1)+e},easeInOutBack:function(t,e,n,i,r){var o=n-e;return void 0===r&&(r=1.70158),(t/=i/2)<1?o/2*(t*t*((1+(r*=1.525))*t-r))+e:o/2*((t-=2)*t*((1+(r*=1.525))*t+r)+2)+e},easeInBounce:function(t,e,n,r){var o=n-e;return o-i.easeOutBounce(r-t,0,o,r)+e},easeOutBounce:function(t,e,n,i){var r=n-e;return(t/=i)<1/2.75?r*(7.5625*t*t)+e:t<2/2.75?r*(7.5625*(t-=1.5/2.75)*t+.75)+e:t<2.5/2.75?r*(7.5625*(t-=2.25/2.75)*t+.9375)+e:r*(7.5625*(t-=2.625/2.75)*t+.984375)+e},easeInOutBounce:function(t,e,n,r){var o=n-e;return t<r/2?.5*i.easeInBounce(2*t,0,o,r)+e:.5*i.easeOutBounce(2*t-r,0,o,r)+.5*o+e}};t.exports=i},function(t,e,n){t.exports=n(3)},function(t,e,n){"use strict";n.r(e);var i,r,o=n(0),a=n.n(o),s=n(1),c=n.n(s);function u(t,e){return t+Math.random()*(e-t)}function h(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function f(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}!function(t){t[t.Circle=0]="Circle",t[t.Square=1]="Square",t[t.Strip=2]="Strip"}(i||(i={})),function(t){t[t.Positive=1]="Positive",t[t.Negative=-1]="Negative"}(r||(r={}));var l=function(){function t(e,n,i,o){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),f(this,"context",void 0),f(this,"radius",void 0),f(this,"x",void 0),f(this,"y",void 0),f(this,"w",void 0),f(this,"h",void 0),f(this,"vx",void 0),f(this,"vy",void 0),f(this,"shape",void 0),f(this,"angle",void 0),f(this,"angularSpin",void 0),f(this,"color",void 0),f(this,"rotateY",void 0),f(this,"rotationDirection",void 0),f(this,"getOptions",void 0),this.getOptions=n;var a,s,c=this.getOptions().colors;this.context=e,this.x=i,this.y=o,this.w=u(5,20),this.h=u(5,20),this.radius=u(5,10),this.vx=u(-4,4),this.vy=u(-10,-0),this.shape=(a=0,s=2,Math.floor(a+Math.random()*(s-a+1))),this.angle=u(0,360)*Math.PI/180,this.angularSpin=u(-.2,.2),this.color=c[Math.floor(Math.random()*c.length)],this.rotateY=u(0,1),this.rotationDirection=u(0,1)?r.Positive:r.Negative}var e,n,o;return e=t,(n=[{key:"update",value:function(){var t=this.getOptions(),e=t.gravity,n=t.wind,o=t.friction,a=t.opacity,s=t.drawShape;this.x+=this.vx,this.y+=this.vy,this.vy+=e,this.vx+=n,this.vx*=o,this.vy*=o,this.rotateY>=1&&this.rotationDirection===r.Positive?this.rotationDirection=r.Negative:this.rotateY<=-1&&this.rotationDirection===r.Negative&&(this.rotationDirection=r.Positive);var c=.1*this.rotationDirection;if(this.rotateY+=c,this.angle+=this.angularSpin,this.context.save(),this.context.translate(this.x,this.y),this.context.rotate(this.angle),this.context.scale(1,this.rotateY),this.context.rotate(this.angle),this.context.beginPath(),this.context.fillStyle=this.color,this.context.strokeStyle=this.color,this.context.globalAlpha=a,this.context.lineCap="round",this.context.lineWidth=2,s&&"function"==typeof s)s.call(this,this.context);else switch(this.shape){case i.Circle:this.context.beginPath(),this.context.arc(0,0,this.radius,0,2*Math.PI),this.context.fill();break;case i.Square:this.context.fillRect(-this.w/2,-this.h/2,this.w,this.h);break;case i.Strip:this.context.fillRect(-this.w/6,-this.h/2,this.w/3,this.h)}this.context.closePath(),this.context.restore()}}])&&h(e.prototype,n),o&&h(e,o),t}();function p(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var v=function t(e,n){var i=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),p(this,"canvas",void 0),p(this,"context",void 0),p(this,"getOptions",void 0),p(this,"x",0),p(this,"y",0),p(this,"w",0),p(this,"h",0),p(this,"lastNumberOfPieces",0),p(this,"tweenInitTime",Date.now()),p(this,"particles",[]),p(this,"particlesGenerated",0),p(this,"removeParticleAt",(function(t){i.particles.splice(t,1)})),p(this,"getParticle",(function(){var t=u(i.x,i.w+i.x),e=u(i.y,i.h+i.y);return new l(i.context,i.getOptions,t,e)})),p(this,"animate",(function(){var t=i.canvas,e=i.context,n=i.particlesGenerated,r=i.lastNumberOfPieces,o=i.getOptions(),a=o.run,s=o.recycle,c=o.numberOfPieces,u=o.debug,h=o.tweenFunction,f=o.tweenDuration;if(!a)return!1;var l=i.particles.length,p=s?l:n,v=Date.now();if(p<c){r!==c&&(i.tweenInitTime=v,i.lastNumberOfPieces=c);for(var d=i.tweenInitTime,y=h(v-d>f?f:Math.max(0,v-d),p,c,f),b=Math.round(y-p),g=0;g<b;g++)i.particles.push(i.getParticle());i.particlesGenerated+=b}return u&&(e.font="12px sans-serif",e.fillStyle="#333",e.textAlign="right",e.fillText("Particles: ".concat(l),t.width-10,t.height-20)),i.particles.forEach((function(e,n){e.update(),(e.y>t.height||e.y<-100||e.x>t.width+100||e.x<-100)&&(s&&p<=c?i.particles[n]=i.getParticle():i.removeParticleAt(n))})),l>0||p<c})),this.canvas=e;var r=this.canvas.getContext("2d");if(!r)throw new Error("Could not get canvas context");this.context=r,this.getOptions=n};function d(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function y(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var b={width:"undefined"!=typeof window?window.innerWidth:300,height:"undefined"!=typeof window?window.innerHeight:200,numberOfPieces:200,friction:.99,wind:0,gravity:.1,colors:["#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4CAF50","#8BC34A","#CDDC39","#FFEB3B","#FFC107","#FF9800","#FF5722","#795548"],opacity:1,debug:!1,tweenFunction:c.a.easeInOutQuad,tweenDuration:5e3,recycle:!0,run:!0},g=function(){function t(e,n){var i=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),y(this,"canvas",void 0),y(this,"context",void 0),y(this,"_options",void 0),y(this,"generator",void 0),y(this,"rafId",void 0),y(this,"setOptionsWithDefaults",(function(t){var e={confettiSource:{x:0,y:0,w:i.canvas.width,h:0}};i._options=function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},i=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter((function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable})))),i.forEach((function(e){y(t,e,n[e])}))}return t}({},e,b,t),Object.assign(i,t.confettiSource)})),y(this,"update",(function(){var t=i.options,e=t.run,n=t.onConfettiComplete,r=i.canvas,o=i.context;e&&(o.fillStyle="white",o.clearRect(0,0,r.width,r.height)),i.generator.animate()?i.rafId=requestAnimationFrame(i.update):(n&&"function"==typeof n&&i.generator.particlesGenerated>0&&n.call(i,i),i._options.run=!1)})),y(this,"reset",(function(){i.generator&&i.generator.particlesGenerated>0&&(i.generator.particlesGenerated=0,i.generator.particles=[],i.generator.lastNumberOfPieces=0)})),y(this,"stop",(function(){i.options={run:!1},i.rafId&&(cancelAnimationFrame(i.rafId),i.rafId=void 0)})),this.canvas=e;var r=this.canvas.getContext("2d");if(!r)throw new Error("Could not get canvas context");this.context=r,this.generator=new v(this.canvas,(function(){return i.options})),this.options=n,this.update()}var e,n,i;return e=t,(n=[{key:"options",get:function(){return this._options},set:function(t){var e=this._options&&this._options.run,n=this._options&&this._options.recycle;this.setOptionsWithDefaults(t),this.generator&&(Object.assign(this.generator,this.options.confettiSource),"boolean"==typeof t.recycle&&t.recycle&&!1===n&&(this.generator.lastNumberOfPieces=this.generator.particles.length)),"boolean"==typeof t.run&&t.run&&!1===e&&this.update()}}])&&d(e.prototype,n),i&&d(e,i),t}();function w(t){return(w="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function O(t){return function(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function m(){return(m=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t}).apply(this,arguments)}function x(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},i=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter((function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable})))),i.forEach((function(e){C(t,e,n[e])}))}return t}function P(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=[],i=!0,r=!1,o=void 0;try{for(var a,s=t[Symbol.iterator]();!(i=(a=s.next()).done)&&(n.push(a.value),!e||n.length!==e);i=!0);}catch(t){r=!0,o=t}finally{try{i||null==s.return||s.return()}finally{if(r)throw o}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function M(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function I(t){return(I=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function S(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function j(t,e){return(j=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function C(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}n.d(e,"ReactConfetti",(function(){return _}));var _=function(t){function e(){var t,n,i,r;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e);for(var o=arguments.length,s=new Array(o),c=0;c<o;c++)s[c]=arguments[c];return i=this,n=!(r=(t=I(e)).call.apply(t,[this].concat(s)))||"object"!==w(r)&&"function"!=typeof r?S(i):r,C(S(n),"canvas",a.a.createRef()),C(S(n),"confetti",void 0),n}var n,i,r;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&j(t,e)}(e,o.Component),n=e,(i=[{key:"componentDidMount",value:function(){if(this.canvas.current){var t=E(this.props)[0];this.confetti=new g(this.canvas.current,t)}}},{key:"componentWillReceiveProps",value:function(t){var e=E(t)[0];this.confetti&&(this.confetti.options=e)}},{key:"componentWillUnmount",value:function(){this.confetti&&this.confetti.stop(),this.confetti=void 0}},{key:"render",value:function(){var t=P(E(this.props),2),e=t[0],n=t[1],i=x({zIndex:2,position:"absolute",top:0,left:0,bottom:0,right:0},n.style);return a.a.createElement("canvas",m({width:e.width,height:e.height,ref:this.canvas},n,{style:i}))}}])&&M(n.prototype,i),r&&M(n,r),e}();function E(t){var e={},n={},i=[].concat(O(Object.keys(b)),["confettiSource","drawShape","onConfettiComplete"]);for(var r in t){var o=t[r];i.includes(r)?e[r]=o:n[r]=o}return[e,n]}C(_,"defaultProps",x({},b)),e.default=_}]).default)},422:function(t,e,n){"use strict";n.r(e);var i=n(403),r=n.n(i),o=n(14);e.default=t=>Object(o.jsx)(r.a,{width:window.innerWidth,height:window.innerHeight,numberOfPieces:80,gravity:.05,recycle:!0,opacity:.6})}}]);
//# sourceMappingURL=16.b7649ca8.chunk.js.map