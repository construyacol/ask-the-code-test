(this["webpackJsonpcoinsenda-app"]=this["webpackJsonpcoinsenda-app"]||[]).push([[35,76,81,99,136],{479:function(n,e,t){"use strict";t.r(e),t.d(e,"showButton",(function(){return m})),t.d(e,"Button",(function(){return h})),t.d(e,"showWelcome",(function(){return j})),t.d(e,"hideWelcome",(function(){return x})),t.d(e,"hideStage",(function(){return y})),t.d(e,"showStage",(function(){return O})),t.d(e,"flipInVerRight",(function(){return w})),t.d(e,"tiltInFwdTl",(function(){return S})),t.d(e,"Container",(function(){return k})),t.d(e,"Layout",(function(){return C})),t.d(e,"ContentContainer",(function(){return F})),t.d(e,"Content",(function(){return D}));var a,i,r,o,c,s,l,d,u,p,f,b,g=t(2),v=t(3);const m=Object(v.c)(a||(a=Object(g.a)(["\n    0% {\n      filter: grayscale(1) blur(1px);\n        opacity:.1;\n    }\n    20% {\n      filter: grayscale(1) blur(0px);\n      opacity:.1;\n    }\n    90% {\n      filter: grayscale(1) blur(0px);\n      opacity:.1;\n    }\n   \n    100%{\n      filter: grayscale(0) blur(0px);\n        opacity:1;\n    }\n"]))),h=v.b.button(i||(i=Object(g.a)(["\n  background: #0198ff;\n  font-size: 17px;\n  font-weight: bold;\n  width:270px;\n  height:60px;\n  border-radius:5px;\n  border: none;\n  color: white;\n  cursor:pointer;\n  position:absolute;\n  bottom:40px;\n  opacity:.1;\n  filter: grayscale(1) blur(1px);\n\n  &.showButton{\n    animation: "," .8s linear forwards;\n  }\n\n"])),m),j=Object(v.c)(r||(r=Object(g.a)(["\n    0% {\n        transform: translateY(50px);\n        filter:blur(5px);\n        opacity:0;\n    }\n    50% {\n        transform: translateY(50px);\n        filter:blur(1px);\n        opacity:0;\n    }\n    100%{\n        transform: translateY(0px);\n        filter:blur(0px);\n        opacity:1;\n    }\n"]))),x=Object(v.c)(o||(o=Object(g.a)(["\n    0% {\n        transform: translateY(0px);\n        filter:blur(0px) grayscale(0.2);\n        opacity:1;\n        \n    }\n    60% {\n        transform: translateY(5px);\n        filter:blur(3px) grayscale(1);\n        opacity:1;\n    }\n    100%{\n        transform: translateY(-70px);\n        filter:blur(5px) grayscale(1);\n        opacity:0;\n    }\n"]))),y=Object(v.c)(c||(c=Object(g.a)(["\n    0% {\n        transform: translateY(0px);\n        filter:blur(0px) grayscale(0.2);\n        opacity:1;\n        \n    }\n    100%{\n        transform: translateY(-15px);\n        filter:blur(1px);\n        opacity:0;\n    }\n"]))),O=Object(v.c)(s||(s=Object(g.a)(["\n    0% {\n        transform: translateY(10px);\n        filter:blur(1px);\n        opacity:0;\n    }\n    100%{\n        transform: translateY(0px);\n        filter:blur(0px);\n        opacity:1;\n    }\n"]))),w=Object(v.c)(l||(l=Object(g.a)(["\n  0% {\n    transform: rotateY(80deg);\n    opacity: 0;\n  }\n  100% {\n    transform: rotateY(0);\n    opacity: 1;\n  }\n"]))),S=Object(v.c)(d||(d=Object(g.a)(["\n    0% {\n            transform: rotateY(-65deg) rotateX(35deg) translate(-60px, -60px) skew(45deg, -20deg);\n    opacity: 0;\n  }\n  50%{\n    opacity: 1;\n  }\n  100% {\n            transform: rotateY(0) rotateX(0deg) translate(0, 0) skew(0deg, 0deg);\n    opacity: 1;\n  }\n"]))),k=v.b.div(u||(u=Object(g.a)(["\n    &.show_{\n        animation: "," .5s linear forwards;\n    }\n    &.hide_{\n        animation: "," .5s linear forwards;\n    }\n\n    row-gap: ",";\n\n    perspective: 500px;\n    perspective-origin: calc(50% + 120px) 50%;\n\n    .flip-in-ver-right {\n        animation: "," 0.6s .25s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;\n    \n    }\n    display: grid;\n    align-items: center;\n    justify-items: center;\n    transform: translateY(50px);\n    opacity:0;\n\n    h1, h2{\n        color: var(--paragraph_color);\n        font-size: 30px;\n        margin: 0;\n        font-weight:300;\n    }\n    span{\n        font-size:45px;\n    }\n"])),j,x,(n=>n.rowGap?"".concat(n.rowGap,"px"):0),S),C=v.b.div(p||(p=Object(g.a)(["\n    display: grid;\n    width: 100vw;\n    height: 100vh;\n    background: #ffffffff;\n    position: absolute;\n    top: 0;\n    left: 0;\n    z-index:1000;\n  @media screen and (max-height: 900px){\n  }\n"]))),F=v.b.div(f||(f=Object(g.a)(["\n  position:relative;\n  width:100vw;\n  height:auto;\n  max-width:800px;\n  display: grid;\n  grid-template-columns: 1fr;\n  grid-template-rows: auto 1fr auto auto auto;\n  height: calc(100vh - 80px);\n  padding: 40px 0;\n"]))),D=v.b.section(b||(b=Object(g.a)(['\n  width:100vw;\n  height:100vh;\n  display:grid;\n  position:relative;\n  align-items:center;\n  justify-items:center;\n  \n  [alt="isoType"]{\n    position: absolute;\n    margin: auto;\n    top: 30px;\n    left: 40px;\n    left: 0px;\n    right:0;\n  }\n'])))},520:function(n,e,t){"use strict";var a=t(1),i=t(473),r=t(4);e.a=function(n,e){let t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;const[o,c]=Object(a.useState)(),[s,l]=Object(a.useState)(t),[d,u]=Object(a.useState)(e[n[s]]),p=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;s>=n.length||l((n=>n+e))},f=()=>{s<=0||l((n=>n-1))};return Object(a.useEffect)((()=>{var n;if(null===d||void 0===d||null===(n=d.settings)||void 0===n?void 0:n.queryParams){let n=Object(i.c)(d.settings.queryParams);null===r.hb||void 0===r.hb||r.hb.push(n)}}),[d]),Object(a.useEffect)((()=>{const t=e[n[s]];u(t)}),[s,e[n[s]]]),{currentStage:s,nextStage:p,prevStage:f,stageController:n,stageData:d,setStageData:u,stageStatus:o,setStageStatus:c,finalStage:s>=n.length}}},554:function(n,e,t){"use strict";t.r(e),t.d(e,"getDisplaySize",(function(){return a})),t.d(e,"getFrame",(function(){return i}));const a=()=>{const n=document.querySelector("#streamingVideo");return{width:n.clientWidth,height:n.clientHeight}},i=()=>{const{width:n,height:e}=a(),t=document.querySelector("#faceApiCanvas");t.width=n,t.height=e;const i=document.querySelector("#streamingVideo");return t.getContext("2d").drawImage(i,0,0,n,e),t.toDataURL("image/jpeg")}},565:function(n,e,t){"use strict";t.r(e);var a,i,r=t(2),o=t(1),c=t(3),s=t(481),l=t(620),d=t(4),u=t(0);const p=Object(c.c)(a||(a=Object(r.a)(["\n    0% {\n        opacity: 1;\n        transform: scale(1);\n    }\n    30% {\n        transform: scale(0);\n        opacity: 0;\n    }\n    50%{\n        transform: scale(0);\n        opacity: 0;\n    }\n    80%{\n        opacity: 1;\n        transform: scale(1.3);\n    }\n    100%{\n        opacity: 1;\n        transform: scale(0.9);\n        background:#2ad083;\n        border: 4px solid white;\n    }\n    "]))),f=c.b.div(i||(i=Object(r.a)(["\n    width: 60px;\n    height: 60px;\n    position: absolute;\n    border-radius: 50%;\n    background: white;\n    border: 2px solid #cfcfcf;\n    top:175px;\n    right:200px;\n    z-index: 1;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n\n    &.approve{\n        animation: "," .6s linear forwards;\n    }\n\n    @media "," {\n      top: 40px;\n      right: 180px;\n    }\n\n    @media (max-width: 768px) {\n      top: 100px;\n      right: 0;\n    }\n  "])),p,d.gb.laptopM);e.default=n=>{let{data:e}=n;const[t,a]=Object(o.useState)();return Object(o.useEffect)((()=>{e?a("approve"):setTimeout((()=>a()),400)}),[e]),Object(u.jsx)(f,{className:"".concat("approve"===t?"approve":"normal"),children:t?Object(u.jsx)(l.a,{size:37,color:"white"}):Object(u.jsx)(s.d,{size:30,color:"#a3a3a3"})})}},601:function(n,e,t){"use strict";t.r(e);var a,i,r,o,c=t(2),s=t(1),l=t(520),d=t(682),u=t(554),p=t(5),f=t(3),b=t(565),g=t(26),v=t(183),m=t(49),h=t(684),j=t(8),x=t(4),y=t(479),O=(t(618),t(0));const w="development"===x.r?"/models":"".concat(Object(g.b)("tensor"),"/"),S=Object(p.a)((()=>Promise.resolve().then(t.bind(null,492))));e.default=n=>{var e;let{handleDataForm:t,handleState:a,...i}=n;const r=Object(j.d)((n=>n.modelData)),{dataForm:o}=t,c=null===o||void 0===o?void 0:o.wrapperComponent,{state:p,setState:f}=a,[x,z]=Object(s.useState)(!1),[N,E]=Object(s.useState)(),[U,A]=Object(s.useState)(!1),[Y]=Object(m.a)(),L=Object(d.a)(c),M=Object(s.useRef)(null);let _=Object(s.useRef)(null);const T=Object(s.useRef)(window.faceapi),[q]=Object(h.a)("/biometric_data/".concat(r.authData.userId)),R=Object(l.a)(Object.keys((null===o||void 0===o||null===(e=o.handleError)||void 0===e?void 0:e.errors)||o.stages),o.stages),{stageData:I,currentStage:B,nextStage:G,finalStage:P,setStageData:V,stageController:K}=R,W=async()=>{if(z(!0),!window.faceapi)return alert("No est\xe1n cargando las librer\xedas FACE_API");T.current=window.faceapi,await T.current.nets.tinyFaceDetector.loadFromUri(w),await T.current.nets.faceLandmark68Net.loadFromUri(w),await T.current.nets.faceRecognitionNet.loadFromUri(w),await T.current.nets.faceExpressionNet.loadFromUri(w),H()},J=n=>{E(!0),M.current&&(M.current.srcObject=n)},X=n=>{console.log("No hay camara conectada o los permisos han sido denegados",n),E(!1)},H=()=>{if(navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia||navigator.oGetUserMedia,navigator.getUserMedia){var n;if(navigator.getUserMedia({video:!0},J,X),!(null===(n=M.current)||void 0===n?void 0:n.addEventListener))return;M.current.addEventListener("play",(()=>{console.log("el streaming a comenzado",T.current);const n=T.current.createCanvasFromMedia(M.current);n.style.display="none",n.id="faceApiCanvas",document.querySelector("#videoContainer").append(n),T.current.matchDimensions(n,Object(u.getDisplaySize)()),z(!1)}))}},Q=(n,e)=>{const t=document.querySelector(".FRecScanner");let a=1;_.current=setInterval((async()=>{const e=await T.current.detectAllFaces(M.current,new T.current.TinyFaceDetectorOptions).withFaceLandmarks().withFaceDescriptors().withFaceExpressions();if(null===e||void 0===e?void 0:e.length){var i,r;if(console.log("validations",null===I||void 0===I?void 0:I.key),t&&!(null===t||void 0===t||null===(i=t.classList)||void 0===i||null===(r=i.value)||void 0===r?void 0:r.includes("scanning"))&&t.classList.add("scanning"),!L[null===I||void 0===I?void 0:I.key])return;const[c]=L[I.key](e[0],{...I,state:p,dataForm:o});if(!c||a>1)return;n.style.display="none",f((n=>({...n,[null===I||void 0===I?void 0:I.key]:c||n[null===I||void 0===I?void 0:I.key]}))),clearInterval(_.current),a++;const s=await Y.addNewBiometricData({file:c.split(",")[1],biometric_id:I.biometricId,challenge_name:I.key});!1===(null===s||void 0===s?void 0:s.data)&&Z(),console.log("|||||||||||||||  addNewBiometricData res ==> ",s)}else{var c;console.log("Detectando..."),t&&(null===t||void 0===t||null===(c=t.classList)||void 0===c?void 0:c.value.includes("scanning"))&&t.classList.remove("scanning")}}),e)};Object(s.useEffect)((()=>{const n=document.querySelector("#faceApiCanvas");return U&&n&&!(null===I||void 0===I?void 0:I.solved)&&!P&&Q(n,600),()=>clearInterval(_.current)}),[I,U,x]);const Z=()=>{V((n=>({...n,solved:!0}))),setTimeout((()=>G()),1500)};return Object(s.useEffect)((()=>{if(console.log("|||||||||||||  biometricData ==> ",q),"accepted"!==(null===q||void 0===q?void 0:q.state)||N||(console.log("cameraAvailable",N),(async()=>{const n=await Y.getUserBiometric();(null===n||void 0===n?void 0:n.solved)&&G(K.length+1)})()),(null===q||void 0===q?void 0:q.challenge_name)===(null===I||void 0===I?void 0:I.key))if("accepted"===q.state)Z();else if("rejected"===q.state){f((n=>({...n,[null===I||void 0===I?void 0:I.key]:""})));const n=document.querySelector("#faceApiCanvas");Q(n,600)}}),[q]),Object(s.useEffect)((()=>{if(P){(async()=>await Y.disableTransactionSecutiry("biometric"))()}}),[P]),Object(s.useEffect)((()=>(Object(v.a)(W,"".concat(Object(g.b)("faceApi")),"faceApi"),()=>{var n,e,t;null===(n=M.current)||void 0===n||n.pause(),null===(e=M.current)||void 0===e||null===(t=e.srcObject)||void 0===t||t.getTracks()[0].stop()})),[]),P?Object(O.jsx)(O.Fragment,{children:Object(O.jsx)(S,{component:"".concat(null===o||void 0===o?void 0:o.wrapperComponent,"/success"),handleDataForm:t,handleState:a,coinsendaServices:Y,...i})}):Object(O.jsxs)(y.Layout,{className:"faceApiLayout__",children:[!U&&Object(O.jsx)(S,{component:"biometricKycComponent/onBoardingAgreement",cameraAvailable:N,handleAction:()=>{A(!0)}}),Object(O.jsxs)(D,{id:"faceApiContainer",children:[Object(O.jsx)(b.default,{data:null===I||void 0===I?void 0:I.solved}),Object(O.jsx)("h3",{className:"FRecTitle fuente",children:"Reconocimiento Facial"}),Object(O.jsxs)(F,{id:"videoContainer",children:[x&&Object(O.jsx)("div",{className:"biometricLoaderContainer"}),Object(O.jsx)("video",{id:"streamingVideo",autoPlay:!0,ref:M,width:"100%",height:"100%"})]}),Object(O.jsxs)(C,{children:[Object(O.jsx)(k,{className:"".concat(0===B?"active":"")}),Object(O.jsx)(k,{className:"".concat(1===B?"active":"")})]}),Object(O.jsx)("h1",{className:"fuente",children:null===I||void 0===I?void 0:I.uiName}),Object(O.jsx)("p",{className:"fuente",children:"Mant\xe9n tu cabeza erguida y asegurate que tu rostro encaje dentro del circulo"})]})]})};const k=f.b.div(a||(a=Object(c.a)(["\n  width:7px;\n  height:12px;\n  background:#c9c9c9;\n  border-radius:5px;\n  margin:0 4px;\n  transition:.3s;\n  &.active{\n    height:22px;\n    background:#0198ff;\n  }\n"]))),C=f.b.div(i||(i=Object(c.a)(["\n  height:30px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n"]))),F=f.b.div(r||(r=Object(c.a)(["\n  position: relative;\n  clip-path: circle(37% at 50% 50%);\n\n  @media "," {\n    max-height: 300px;\n    clip-path: none;\n    width: fit-content;\n    justify-self: center;\n    overflow: hidden;\n    border-radius: 15px;\n  }\n"])),x.gb.laptopM),D=Object(f.b)(y.ContentContainer)(o||(o=Object(c.a)(["\n\n  justify-self:center;\n\n  .FRecTitle{\n    color:#0198ff;\n    font-weight:bold;\n  }\n  p{\n    text-align:center;\n    color:gray;\n    font-size: 1.2em;\n    max-width: 500px;\n    justify-self: center;\n  }\n  h1{\n    text-align:center;\n    font-size: 2.7em;\n    margin-bottom:0;\n  }\n  h3{\n    span{\n      color: transparent;\n      border-radius: 50%;\n      background: #2ad083;\n      margin-right: 10px;\n      font-size:15px;\n    }\n  }\n\n  @media "," {\n    padding: 10px 0;\n    height: calc(100vh - 20px);\n  }\n\n  @media (max-width: 768px) {\n    ","{\n      ","\n    }\n\n    padding: 30px 20px;\n    width:calc(100vw - 40px);\n    height: calc(100vh - 60px);\n\n    p{\n      font-size:1em;\n    }\n    h1{\n      font-size:2em;\n    }\n\n  }\n\n\n"])),x.gb.laptopM,F,"")},618:function(n,e,t){},665:function(n,e){},682:function(n,e,t){"use strict";var a=t(1);e.a=n=>{const[e,i]=Object(a.useState)();return Object(a.useEffect)((()=>{(async()=>{var e;let a={};try{a=await t(683)("./".concat(n,"/validations"))}catch(r){console.log(r)}i(null===(e=a)||void 0===e?void 0:e.default)})()}),[]),e}},683:function(n,e,t){var a={"./biometricKycComponent/validations":[570,9,140],"./kyc/validations":[540,9,28],"./onBoardingComponent/validations":[588,7,29],"./personalKycComponent/validations":[568,9,30]};function i(n){if(!t.o(a,n))return Promise.resolve().then((function(){var e=new Error("Cannot find module '"+n+"'");throw e.code="MODULE_NOT_FOUND",e}));var e=a[n],i=e[0];return t.e(e[2]).then((function(){return t.t(i,e[1])}))}i.keys=function(){return Object.keys(a)},i.id=683,n.exports=i},684:function(n,e,t){"use strict";t.d(e,"a",(function(){return s}));var a=t(1),i=t(661),r=t.n(i),o=t(26),c=t(21);function s(n,e){const{SocketUrl:t}=o.a,i=r()(t),[s,l]=Object(a.useState)(),d=async()=>{const{userToken:n}=await Object(c.d)(),e={body:{access_token:n}};i.emit("authentication",e)};return Object(a.useEffect)((()=>{i.on("connect",d),i.on("authenticated",(()=>{i.on(n,(n=>{l((e=>({...e,...n})))}))}))}),[]),[s]}}}]);
//# sourceMappingURL=35.ed061e27.chunk.js.map