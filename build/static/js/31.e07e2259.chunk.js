(window.webpackJsonp=window.webpackJsonp||[]).push([[31],{386:function(t,e,n){},389:function(t,e,n){"use strict";var a=n(0),r=n.n(a),i=n(2),o=n(44),c=n(5),s=n.n(c),u=n(363),l=n(355);n(386);e.a=function(t){var e=Object(c.useState)(),n=Object(o.a)(e,2),a=n[0],f=n[1],h=Object(c.useState)(),p=Object(o.a)(h,2),d=p[0],v=p[1],b=Object(c.useState)(),y=Object(o.a)(b,2),m=y[0],g=y[1],O=Object(c.useState)(),w=Object(o.a)(O,2),x=w[0],j=w[1],E=Object(c.useState)(),P=Object(o.a)(E,2),S=P[0],M=P[1],I=Object(c.useState)(),N=Object(o.a)(I,2),_=N[0],k=N[1],C=Object(l.a)(),A=Object(o.a)(C,1)[0],T=function(t,e){return f(!0),g("Verificado con \xc9xito"),j(!1),v(!1),M(t),F(e)},D=function(){var e=Object(i.a)(r.a.mark(function e(n){var a,i;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!((a=n.target.value).length>5)){e.next=21;break}if(v(!0),f(!1),g("Verificando..."),!t.isWithdraw2fa){e.next=7;break}return e.abrupt("return",F(a));case 7:if(!t.isTryToDisable2fa){e.next=13;break}return e.next=10,A.disable2fa(a);case 10:i=e.sent,e.next=16;break;case 13:return e.next=15,A.addNewTransactionSecurity(a);case 15:i=e.sent;case 16:if(i){e.next=20;break}return g("El c\xf3digo de verificaci\xf3n es incorrecto"),j(!0),e.abrupt("return",v(!1));case 20:return e.abrupt("return",T(a,i));case 21:g(""),f(!1),v(!1),j(!1);case 25:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),F=function(e){setTimeout(function(){t.toggle_anim&&t.toggle_anim(),k(t.toggle_anim&&!0)},1200),setTimeout(function(){t.authenticated&&t.authenticated(e)},1500)},B=t.label,Q=t.handleFocus,R=t.handleBlur,W=t.disabled;return s.a.createElement("div",{id:"authReq",className:"".concat(_?"desaparece":"")},s.a.createElement(u.d,{disabled:W,type:"number",label:B,placeholder:"CODIGO 2FA",name:"auth",actualizarEstado:D,active:a,verifying:d,value:S,status:m,error:x,handleFocus:Q,handleBlur:R}))}},520:function(t,e,n){"use strict";var a=n(5),r=n.n(a),i=n(64),o=n(356),c=n(11),s=n(13),u=n(18),l=n(16),f=n(17),h=n(570),p=n.n(h),d=function(t){function e(){var t,n;Object(c.a)(this,e);for(var a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];return(n=Object(u.a)(this,(t=Object(l.a)(e)).call.apply(t,[this].concat(r)))).state={width:null,height:null},n}return Object(f.a)(e,t),Object(s.a)(e,[{key:"componentDidMount",value:function(){var t=window.innerWidth,e=window.innerHeight;this.setState({width:t,height:e})}},{key:"render",value:function(){var t=this.state,e=t.width,n=t.height,a={position:"absolute",top:"0px",left:"-40px",width:e,height:n,zIndex:-1};return r.a.createElement("div",{style:a},e&&n&&r.a.createElement(p.a,{width:e,height:n,numberOfPieces:80,gravity:.05,recycle:!0,opacity:.6}))}}]),e}(a.Component),v=n(353),b=Object(i.a)(function(){return Promise.resolve().then(n.bind(null,352))});e.a=function(t){var e=t.user_name,n=t.exit,a=t.siguiente,i=t.confetti,c=t.cta_primary_text,s=t.cta_secondary,u=t.title,l=t.cta_text,f=t.classes,h=Object(v.a)(s,"exit-button-success",8,!1,"onkeyup",!0),p=Object(v.a)(!0,"continue-button-success",13,!1,"onkeyup",!0);return r.a.createElement("div",{className:"KycLayoutBasicWin",id:"callese"},r.a.createElement("h1",{className:"fuente KycTitles"},"Genial ",e),r.a.createElement(b,{withoutwrapper:!0,icon:"accepted",size:window.innerWidth>768?190:150}),r.a.createElement("p",{className:"KycParra1 ".concat(f," fuente")},u),r.a.createElement("p",{className:"fuente continueKyc"},l),r.a.createElement("div",{className:"Kyccontrols"},r.a.createElement("div",{className:"Kcontrols"},window.innerWidth>350&&s&&r.a.createElement(o.b,{_id:h,active:!0,type:"secundary",siguiente:s?n:null},"Lo har\xe9 despues"),r.a.createElement(o.b,{_id:p,active:!0,type:"primary",siguiente:a},c))),i&&r.a.createElement(d,null))}},570:function(t,e,n){var a;"undefined"!=typeof self&&self,t.exports=(a=n(5),function(t){var e={};function n(a){if(e[a])return e[a].exports;var r=e[a]={i:a,l:!1,exports:{}};return t[a].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,a){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(a,r,function(e){return t[e]}.bind(null,r));return a},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=2)}([function(t,e){t.exports=a},function(t,e,n){"use strict";var a={linear:function(t,e,n,a){return(n-e)*t/a+e},easeInQuad:function(t,e,n,a){return(n-e)*(t/=a)*t+e},easeOutQuad:function(t,e,n,a){return-(n-e)*(t/=a)*(t-2)+e},easeInOutQuad:function(t,e,n,a){var r=n-e;return(t/=a/2)<1?r/2*t*t+e:-r/2*(--t*(t-2)-1)+e},easeInCubic:function(t,e,n,a){return(n-e)*(t/=a)*t*t+e},easeOutCubic:function(t,e,n,a){return(n-e)*((t=t/a-1)*t*t+1)+e},easeInOutCubic:function(t,e,n,a){var r=n-e;return(t/=a/2)<1?r/2*t*t*t+e:r/2*((t-=2)*t*t+2)+e},easeInQuart:function(t,e,n,a){return(n-e)*(t/=a)*t*t*t+e},easeOutQuart:function(t,e,n,a){return-(n-e)*((t=t/a-1)*t*t*t-1)+e},easeInOutQuart:function(t,e,n,a){var r=n-e;return(t/=a/2)<1?r/2*t*t*t*t+e:-r/2*((t-=2)*t*t*t-2)+e},easeInQuint:function(t,e,n,a){return(n-e)*(t/=a)*t*t*t*t+e},easeOutQuint:function(t,e,n,a){return(n-e)*((t=t/a-1)*t*t*t*t+1)+e},easeInOutQuint:function(t,e,n,a){var r=n-e;return(t/=a/2)<1?r/2*t*t*t*t*t+e:r/2*((t-=2)*t*t*t*t+2)+e},easeInSine:function(t,e,n,a){var r=n-e;return-r*Math.cos(t/a*(Math.PI/2))+r+e},easeOutSine:function(t,e,n,a){return(n-e)*Math.sin(t/a*(Math.PI/2))+e},easeInOutSine:function(t,e,n,a){return-(n-e)/2*(Math.cos(Math.PI*t/a)-1)+e},easeInExpo:function(t,e,n,a){return 0==t?e:(n-e)*Math.pow(2,10*(t/a-1))+e},easeOutExpo:function(t,e,n,a){var r=n-e;return t==a?e+r:r*(1-Math.pow(2,-10*t/a))+e},easeInOutExpo:function(t,e,n,a){var r=n-e;return 0===t?e:t===a?e+r:(t/=a/2)<1?r/2*Math.pow(2,10*(t-1))+e:r/2*(2-Math.pow(2,-10*--t))+e},easeInCirc:function(t,e,n,a){return-(n-e)*(Math.sqrt(1-(t/=a)*t)-1)+e},easeOutCirc:function(t,e,n,a){return(n-e)*Math.sqrt(1-(t=t/a-1)*t)+e},easeInOutCirc:function(t,e,n,a){var r=n-e;return(t/=a/2)<1?-r/2*(Math.sqrt(1-t*t)-1)+e:r/2*(Math.sqrt(1-(t-=2)*t)+1)+e},easeInElastic:function(t,e,n,a){var r,i,o,c=n-e;return o=1.70158,0===t?e:1==(t/=a)?e+c:((i=0)||(i=.3*a),(r=c)<Math.abs(c)?(r=c,o=i/4):o=i/(2*Math.PI)*Math.asin(c/r),-r*Math.pow(2,10*(t-=1))*Math.sin((t*a-o)*(2*Math.PI)/i)+e)},easeOutElastic:function(t,e,n,a){var r,i,o,c=n-e;return o=1.70158,0===t?e:1==(t/=a)?e+c:((i=0)||(i=.3*a),(r=c)<Math.abs(c)?(r=c,o=i/4):o=i/(2*Math.PI)*Math.asin(c/r),r*Math.pow(2,-10*t)*Math.sin((t*a-o)*(2*Math.PI)/i)+c+e)},easeInOutElastic:function(t,e,n,a){var r,i,o,c=n-e;return o=1.70158,0===t?e:2==(t/=a/2)?e+c:((i=0)||(i=a*(.3*1.5)),(r=c)<Math.abs(c)?(r=c,o=i/4):o=i/(2*Math.PI)*Math.asin(c/r),t<1?r*Math.pow(2,10*(t-=1))*Math.sin((t*a-o)*(2*Math.PI)/i)*-.5+e:r*Math.pow(2,-10*(t-=1))*Math.sin((t*a-o)*(2*Math.PI)/i)*.5+c+e)},easeInBack:function(t,e,n,a,r){return void 0===r&&(r=1.70158),(n-e)*(t/=a)*t*((r+1)*t-r)+e},easeOutBack:function(t,e,n,a,r){return void 0===r&&(r=1.70158),(n-e)*((t=t/a-1)*t*((r+1)*t+r)+1)+e},easeInOutBack:function(t,e,n,a,r){var i=n-e;return void 0===r&&(r=1.70158),(t/=a/2)<1?i/2*(t*t*((1+(r*=1.525))*t-r))+e:i/2*((t-=2)*t*((1+(r*=1.525))*t+r)+2)+e},easeInBounce:function(t,e,n,r){var i=n-e;return i-a.easeOutBounce(r-t,0,i,r)+e},easeOutBounce:function(t,e,n,a){var r=n-e;return(t/=a)<1/2.75?r*(7.5625*t*t)+e:t<2/2.75?r*(7.5625*(t-=1.5/2.75)*t+.75)+e:t<2.5/2.75?r*(7.5625*(t-=2.25/2.75)*t+.9375)+e:r*(7.5625*(t-=2.625/2.75)*t+.984375)+e},easeInOutBounce:function(t,e,n,r){var i=n-e;return t<r/2?.5*a.easeInBounce(2*t,0,i,r)+e:.5*a.easeOutBounce(2*t-r,0,i,r)+.5*i+e}};t.exports=a},function(t,e,n){t.exports=n(3)},function(t,e,n){"use strict";n.r(e);var a,r,i=n(0),o=n.n(i),c=n(1),s=n.n(c);function u(t,e){return t+Math.random()*(e-t)}function l(t,e){for(var n=0;n<e.length;n++){var a=e[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}function f(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}!function(t){t[t.Circle=0]="Circle",t[t.Square=1]="Square",t[t.Strip=2]="Strip"}(a||(a={})),function(t){t[t.Positive=1]="Positive",t[t.Negative=-1]="Negative"}(r||(r={}));var h=function(){function t(e,n,a,i){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),f(this,"context",void 0),f(this,"radius",void 0),f(this,"x",void 0),f(this,"y",void 0),f(this,"w",void 0),f(this,"h",void 0),f(this,"vx",void 0),f(this,"vy",void 0),f(this,"shape",void 0),f(this,"angle",void 0),f(this,"angularSpin",void 0),f(this,"color",void 0),f(this,"rotateY",void 0),f(this,"rotationDirection",void 0),f(this,"getOptions",void 0),this.getOptions=n;var o=this.getOptions().colors;this.context=e,this.x=a,this.y=i,this.w=u(5,20),this.h=u(5,20),this.radius=u(5,10),this.vx=u(-4,4),this.vy=u(-10,-0),this.shape=Math.floor(0+3*Math.random()),this.angle=u(0,360)*Math.PI/180,this.angularSpin=u(-.2,.2),this.color=o[Math.floor(Math.random()*o.length)],this.rotateY=u(0,1),this.rotationDirection=u(0,1)?r.Positive:r.Negative}var e,n;return e=t,(n=[{key:"update",value:function(){var t=this.getOptions(),e=t.gravity,n=t.wind,i=t.friction,o=t.opacity,c=t.drawShape;this.x+=this.vx,this.y+=this.vy,this.vy+=e,this.vx+=n,this.vx*=i,this.vy*=i,this.rotateY>=1&&this.rotationDirection===r.Positive?this.rotationDirection=r.Negative:this.rotateY<=-1&&this.rotationDirection===r.Negative&&(this.rotationDirection=r.Positive);var s=.1*this.rotationDirection;if(this.rotateY+=s,this.angle+=this.angularSpin,this.context.save(),this.context.translate(this.x,this.y),this.context.rotate(this.angle),this.context.scale(1,this.rotateY),this.context.rotate(this.angle),this.context.beginPath(),this.context.fillStyle=this.color,this.context.strokeStyle=this.color,this.context.globalAlpha=o,this.context.lineCap="round",this.context.lineWidth=2,c&&"function"==typeof c)c.call(this,this.context);else switch(this.shape){case a.Circle:this.context.beginPath(),this.context.arc(0,0,this.radius,0,2*Math.PI),this.context.fill();break;case a.Square:this.context.fillRect(-this.w/2,-this.h/2,this.w,this.h);break;case a.Strip:this.context.fillRect(-this.w/6,-this.h/2,this.w/3,this.h)}this.context.closePath(),this.context.restore()}}])&&l(e.prototype,n),t}();function p(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var d=function t(e,n){var a=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),p(this,"canvas",void 0),p(this,"context",void 0),p(this,"getOptions",void 0),p(this,"x",0),p(this,"y",0),p(this,"w",0),p(this,"h",0),p(this,"lastNumberOfPieces",0),p(this,"tweenInitTime",Date.now()),p(this,"particles",[]),p(this,"particlesGenerated",0),p(this,"removeParticleAt",function(t){a.particles.splice(t,1)}),p(this,"getParticle",function(){var t=u(a.x,a.w+a.x),e=u(a.y,a.h+a.y);return new h(a.context,a.getOptions,t,e)}),p(this,"animate",function(){var t=a.canvas,e=a.context,n=a.particlesGenerated,r=a.lastNumberOfPieces,i=a.getOptions(),o=i.run,c=i.recycle,s=i.numberOfPieces,u=i.debug,l=i.tweenFunction,f=i.tweenDuration;if(!o)return!1;var h=a.particles.length,p=c?h:n,d=Date.now();if(p<s){r!==s&&(a.tweenInitTime=d,a.lastNumberOfPieces=s);for(var v=a.tweenInitTime,b=l(d-v>f?f:Math.max(0,d-v),p,s,f),y=Math.round(b-p),m=0;m<y;m++)a.particles.push(a.getParticle());a.particlesGenerated+=y}return u&&(e.font="12px sans-serif",e.fillStyle="#333",e.textAlign="right",e.fillText("Particles: ".concat(h),t.width-10,t.height-20)),a.particles.forEach(function(e,n){e.update(),(e.y>t.height||e.y<-100||e.x>t.width+100||e.x<-100)&&(c&&p<=s?a.particles[n]=a.getParticle():a.removeParticleAt(n))}),h>0||p<s}),this.canvas=e;var r=this.canvas.getContext("2d");if(!r)throw new Error("Could not get canvas context");this.context=r,this.getOptions=n};function v(t,e){for(var n=0;n<e.length;n++){var a=e[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}function b(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var y={width:"undefined"!=typeof window?window.innerWidth:300,height:"undefined"!=typeof window?window.innerHeight:200,numberOfPieces:200,friction:.99,wind:0,gravity:.1,colors:["#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4CAF50","#8BC34A","#CDDC39","#FFEB3B","#FFC107","#FF9800","#FF5722","#795548"],opacity:1,debug:!1,tweenFunction:s.a.easeInOutQuad,tweenDuration:5e3,recycle:!0,run:!0},m=function(){function t(e,n){var a=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),b(this,"canvas",void 0),b(this,"context",void 0),b(this,"_options",void 0),b(this,"generator",void 0),b(this,"rafId",void 0),b(this,"setOptionsWithDefaults",function(t){var e={confettiSource:{x:0,y:0,w:a.canvas.width,h:0}};a._options=function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},a=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(a=a.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),a.forEach(function(e){b(t,e,n[e])})}return t}({},e,y,t),Object.assign(a,t.confettiSource)}),b(this,"update",function(){var t=a.options,e=t.run,n=t.onConfettiComplete,r=a.canvas,i=a.context;e&&(i.fillStyle="white",i.clearRect(0,0,r.width,r.height)),a.generator.animate()?a.rafId=requestAnimationFrame(a.update):(n&&"function"==typeof n&&a.generator.particlesGenerated>0&&n.call(a,a),a._options.run=!1)}),b(this,"reset",function(){a.generator&&a.generator.particlesGenerated>0&&(a.generator.particlesGenerated=0,a.generator.particles=[],a.generator.lastNumberOfPieces=0)}),b(this,"stop",function(){a.options={run:!1},a.rafId&&(cancelAnimationFrame(a.rafId),a.rafId=void 0)}),this.canvas=e;var r=this.canvas.getContext("2d");if(!r)throw new Error("Could not get canvas context");this.context=r,this.generator=new d(this.canvas,function(){return a.options}),this.options=n,this.update()}var e,n;return e=t,(n=[{key:"options",get:function(){return this._options},set:function(t){var e=this._options&&this._options.run,n=this._options&&this._options.recycle;this.setOptionsWithDefaults(t),this.generator&&(Object.assign(this.generator,this.options.confettiSource),"boolean"==typeof t.recycle&&t.recycle&&!1===n&&(this.generator.lastNumberOfPieces=this.generator.particles.length)),"boolean"==typeof t.run&&t.run&&!1===e&&this.update()}}])&&v(e.prototype,n),t}();function g(t){return(g="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function O(){return(O=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(t[a]=n[a])}return t}).apply(this,arguments)}function w(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},a=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(a=a.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),a.forEach(function(e){S(t,e,n[e])})}return t}function x(t,e){for(var n=0;n<e.length;n++){var a=e[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}function j(t){return(j=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function E(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function P(t,e){return(P=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function S(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}n.d(e,"ReactConfetti",function(){return M});var M=function(t){function e(){var t,n,a;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e);for(var r=arguments.length,i=new Array(r),c=0;c<r;c++)i[c]=arguments[c];return n=!(a=(t=j(e)).call.apply(t,[this].concat(i)))||"object"!==g(a)&&"function"!=typeof a?E(this):a,S(E(n),"canvas",o.a.createRef()),S(E(n),"confetti",void 0),n}var n,a;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&P(t,e)}(e,i.Component),n=e,(a=[{key:"componentDidMount",value:function(){if(this.canvas.current){var t=I(this.props)[0];this.confetti=new m(this.canvas.current,t)}}},{key:"componentWillReceiveProps",value:function(t){var e=I(t)[0];this.confetti&&(this.confetti.options=e)}},{key:"componentWillUnmount",value:function(){this.confetti&&this.confetti.stop(),this.confetti=void 0}},{key:"render",value:function(){var t=function(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=[],a=!0,r=!1,i=void 0;try{for(var o,c=t[Symbol.iterator]();!(a=(o=c.next()).done)&&(n.push(o.value),!e||n.length!==e);a=!0);}catch(t){r=!0,i=t}finally{try{a||null==c.return||c.return()}finally{if(r)throw i}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}(I(this.props),2),e=t[0],n=t[1],a=w({zIndex:2,position:"absolute",top:0,left:0,bottom:0,right:0},n.style);return o.a.createElement("canvas",O({width:e.width,height:e.height,ref:this.canvas},n,{style:a}))}}])&&x(n.prototype,a),e}();function I(t){var e={},n={},a=[].concat(function(t){return function(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}(Object.keys(y)),["confettiSource","drawShape","onConfettiComplete"]);for(var r in t){var i=t[r];a.includes(r)?e[r]=i:n[r]=i}return[e,n]}S(M,"defaultProps",w({},y)),e.default=M}]).default)},821:function(t,e,n){},859:function(t,e,n){"use strict";n.r(e);var a=n(349),r=n(0),i=n.n(r),o=n(1),c=n(2),s=n(44),u=n(5),l=n.n(u),f=n(352),h=n(462),p=n.n(h),d=n(389),v=n(110),b=n(36),y=n(111),m=n(520),g=n(350),O=n(365),w=n(355);n(821);function x(){var t=Object(a.a)(["\n  width: 180px;\n  height: 160px;\n  background: #bfbfbf;\n  border-radius: 3px;\n"]);return x=function(){return t},t}function j(){var t=Object(a.a)(["\n  width: 100%;\n  height: 100%;\n  position: relative;\n  display: grid;\n  justify-items: center;\n\n  .skeleton {\n    animation-name: ",";\n    animation-duration: 1s;\n    animation-iteration-count: infinite;\n    opacity: 0.5;\n  }\n  .skeleton.text {\n    width: 250px;\n    height: 25px;\n    background: #bfbfbf;\n    border-radius: 3px;\n    justify-self: center;\n  }\n"]);return j=function(){return t},t}e.default=Object(v.b)(function(t,e){return{user:t.modelData.user}},function(t){return{action:Object(b.bindActionCreators)(y.a,t)}})(function(t){var e=Object(u.useState)(),n=Object(s.a)(e,2),a=n[0],r=n[1],h=Object(u.useState)(),v=Object(s.a)(h,2),b=v[0],y=v[1],g=Object(u.useState)(),O=Object(s.a)(g,2),x=O[0],j=O[1],S=Object(u.useState)(),M=Object(s.a)(S,2),I=M[0],N=M[1],_=Object(u.useState)(),k=Object(s.a)(_,2),C=k[0],A=k[1],T=Object(u.useState)(!0),D=Object(s.a)(T,2),F=D[0],B=D[1],Q=Object(w.a)(),R=Object(s.a)(Q,1)[0],W=function(){var e=Object(c.a)(i.a.mark(function e(n){var a,r,c;return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t.action.isAppLoading(!0),N(!0),a=n.transaction_security_id,r=n.scopes,c=Object(o.a)({},t.user,{security_center:Object(o.a)({},t.user.security_center,{txSecurityId:a,authenticator:Object(o.a)({},t.user.security_center.authenticator,{auth:!0,withdraw:r.withdraw})})}),e.next=6,R.updateUser(c);case 6:t.action.isAppLoading(!1),setTimeout(function(){A(!0)},500);case 8:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),q=function(){var e=Object(c.a)(i.a.mark(function e(){return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t.action.toggleModal();case 1:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}();return Object(u.useEffect)(function(){!function(){var t=Object(c.a)(i.a.mark(function t(){var e,n;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,R.getNew2faSecretCode();case 2:if(e=t.sent){t.next=5;break}return t.abrupt("return");case 5:return n=e.data,t.t0=r,t.next=9,p.a.toDataURL("otpauth://totp/".concat("Coinsenda","?secret=").concat(n));case 9:t.t1=t.sent,(0,t.t0)(t.t1),j(n),B(!1);case 13:case"end":return t.stop()}},t)}));return function(){return t.apply(this,arguments)}}()()},[]),l.a.createElement(E,{className:"TwoFactorActivate ".concat(C?"":"TwoFactorActivateOn"," ").concat(F?"skeleton":"")},C?l.a.createElement("div",{className:"TwoFactorActivate success ".concat(I?"aparecer":"")},l.a.createElement(m.a,{title:"Segundo factor de autenticaci\xf3n activado",cta_text:"El proceso de activaci\xf3n se ha realizado satisfactoriamente.",confetti:!0,cta_secondary:!1,cta_primary_text:"Finalizar",user_name:t.user.name,siguiente:q})):l.a.createElement("div",{className:"TwoFactorActivate ".concat(I?"desaparecer":"")},l.a.createElement("div",{className:"TLayout layer1",style:{opacity:b?"0.03":"1"}},l.a.createElement("div",{className:"header2fa"}),l.a.createElement("div",{className:"body2fa"},l.a.createElement("div",{className:"bodySon"},l.a.createElement("p",{className:"fuente"},"Abre Google Authenticator y escanea el codigo QR"),a&&!F?l.a.createElement("img",{src:a,alt:"",width:"200px"}):l.a.createElement(P,{className:"skeleton"})),l.a.createElement("div",{className:"footer2fa"}))),l.a.createElement("div",{className:"TLayout layer2"},l.a.createElement("div",{className:"header2fa"},l.a.createElement("h3",{className:"fuente"},"Habilitar ",l.a.createElement("span",{className:"fuente2"},"2FA")),l.a.createElement(f.default,{icon:"2auth",size:75,color:"#1babec"})),l.a.createElement("div",{className:"body2fa"},l.a.createElement("div",{className:"bodySon",style:{height:b?"10%":"50%"}}),l.a.createElement("div",{className:"footer2fa"},l.a.createElement("div",{className:"footer2faText"},l.a.createElement("div",{className:"footer2faTextDes ".concat(b?"desp":"desaparecer")},l.a.createElement("p",{className:"fuente"},"Recuerda que en caso de p\xe9rdida de tu dispositivo movil, solo podr\xe1s reactivar el 2FA con el codigo secreto"," ",l.a.createElement("span",{className:"secretCode fuente2"},x)," ","escribelo en papel y guardalo, es tu responsabilidad")),l.a.createElement("p",{className:"fuente ".concat(b?"desaparecer":"aparecer")},"\xd3 ingresa el codigo secreto manualmente"),l.a.createElement("p",{className:"fuente2 secretCode ".concat(x?"":"skeleton text"," ").concat(b?"desaparecer":"aparecer")},x)),l.a.createElement(d.a,{handleFocus:function(){x&&y(!0)},handleBlur:function(){y(!1)},authenticated:W,disabled:F}))))))});var E=g.b.div(j(),O.c),P=g.b.div(x())}}]);
//# sourceMappingURL=31.e07e2259.chunk.js.map