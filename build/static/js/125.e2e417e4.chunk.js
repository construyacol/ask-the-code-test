(this["webpackJsonpcoinsenda-app"]=this["webpackJsonpcoinsenda-app"]||[]).push([[125,43,72,90,137],{472:function(n,t,e){"use strict";e.d(t,"e",(function(){return v})),e.d(t,"k",(function(){return w})),e.d(t,"m",(function(){return K})),e.d(t,"n",(function(){return O})),e.d(t,"a",(function(){return B})),e.d(t,"l",(function(){return D})),e.d(t,"i",(function(){return L})),e.d(t,"h",(function(){return _})),e.d(t,"c",(function(){return P})),e.d(t,"f",(function(){return S})),e.d(t,"j",(function(){return W})),e.d(t,"d",(function(){return I})),e.d(t,"b",(function(){return M})),e.d(t,"g",(function(){return N}));var o,i,s,c,a,r,p,l,d,m,y,u,b,f,C,j=e(2),x=(e(1),e(3)),g=e(76),k=e(481),h=e(0);const v=x.b.section(o||(o=Object(j.a)(["\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background: rgba(255, 255, 255, 0.85);\n  z-index: 3;\n  display: grid;\n  align-items: center;\n  justify-items: center;\n  ","\n\n  &.dottedBorder{\n    border: 5px dotted var(--primary);\n    border-radius: 10px;\n    background: rgba(255, 255, 255, 1);\n  }\n\n  svg {\n    fill: #0198ff;\n  }\n  p {\n    color: #0198ff;\n  }\n"])),""),w=x.b.section(i||(i=Object(j.a)(["\n  display: grid;\n  justify-items: center;\n  row-gap: 12px;\n  width: 100%;\n  min-height: 170px;\n  height: auto;\n  &.unButton{\n    min-height: 100px;\n  }\n\n  &.loaded { \n    grid-template-rows: auto 1fr;\n  }\n  &.unload {\n    grid-template-columns: 1fr;\n    max-width: 400px;\n    grid-template-rows: repeat(4, auto);\n  }\n"]))),K=x.b.p(s||(s=Object(j.a)(["\n  margin:0;\n  font-size: 16px;\n  color: var(--paragraph_color);\n"]))),O=x.b.p(c||(c=Object(j.a)(["\n  margin:0;\n  z-index: 2;\n  font-size: 12px;\n  width: 150px;\n  background: ",";\n  text-align: center;\n  color: var(--paragraph_color);\n\n  &.titleSection {\n    font-size: 15px;\n    width: auto;\n    padding: 0 20px;\n    align-self: center;\n    justify-self: baseline;\n  }\n\n  &.consolidatedStyle{\n    background:white;\n    margin-left:20px;\n  }\n"])),(n=>n.background?n.background:"#eeeeee")),B=x.b.div(a||(a=Object(j.a)(['\n  width: 320px;\n  height: 45px;\n  border-radius: 6px;\n  border: 2px solid #0198ff;\n  background: #0198ff;\n  display: grid;\n  align-items: center;\n  justify-items: center;\n  cursor: pointer;\n  position: relative;\n\n  input[type="file"]{\n    position: absolute;\n    z-index: 4;\n    width: 100%;\n    height: 100%;\n    opacity: 0;\n    cursor: pointer;\n  }\n\n  &.loader{\n    ::after{\n      content: "";\n      position: absolute;\n      width: 100%;\n      height: 100%;\n      background: #ffffffcf;\n      top: 0;\n    }\n  }\n\n']))),D=x.b.div(r||(r=Object(j.a)(["\n  font-size: 14px;\n  position: relative;\n  display: grid;\n  width: 100%;\n  justify-items: center;\n  max-width: 320px;\n  hr{\n    position: absolute;\n    width: 100%;\n    align-self: center;\n  }\n\n  &.titleSection{\n    max-width: inherit;\n    position: absolute;\n    align-self: start;\n    hr{\n      border-top: 1px solid;\n      color: #d4d4d4;\n      position: absolute;\n      width: 80%;\n      right: 0;\n    }\n  }\n  &.payment{\n    p{\n      padding-left: 0 !important;\n    }\n    position: relative !important;\n  }\n\n  &.swaps{\n    hr{\n      width: 98%;\n    }\n  }\n}\n"]))),L=n=>{let{theme:t,opacity:e,size:o,id:i,...s}=n;return Object(h.jsx)(z,{id:i||"IconCloseModal",color:"".concat("dark"===t&&"dark"),opacity:e,size:o+10,"data-close_modal":!0,...s,children:Object(h.jsx)(k.b,{color:"".concat("dark"===t?"white":"gray"),size:o})})},_=x.b.div(p||(p=Object(j.a)(["\n  width: ",";\n  height: ",";\n  background: ",";\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 4px;\n"])),(n=>n.size&&"".concat(n.size,"px")||"35px"),(n=>n.size&&"".concat(n.size,"px")||"35px"),(n=>"dark"===n.color?"rgb(0, 0, 0, ".concat(n.opacity||".4",")"):"rgb(255, 255, 255, ".concat(n.opacity||".3",")"))),z=Object(x.b)(_)(l||(l=Object(j.a)(["\n  z-index: 9999;\n  right: ",";\n  top: ",';\n  position: absolute;\n  cursor: pointer;\n  transition: 0.2s;\n\n  &::after {\n    content: "";\n    width: 100%;\n    height: 100%;\n    position: absolute;\n    z-index: 3;\n  }\n  &:hover {\n    transform: scale(1.1);\n  }\n  &:active {\n    transform: scale(0.97);\n  }\n\n  @media (max-width: 768px) {\n    top: 10px;\n    right: 15px;\n  }\n'])),(n=>n.right?"".concat(n.right,"px"):"5px"),(n=>n.top?"".concat(n.top,"px"):"-38px")),P=x.b.div(d||(d=Object(j.a)(["\n  position: absolute;\n  width: 100%;\n  left: 0;\n  display: grid;\n  bottom: ",";\n  #controlsContainer {\n    transform: scale(0.95);\n  }\n"])),(n=>"".concat(n.bottom,"px"))),F=x.b.div(m||(m=Object(j.a)(["\n  display: block;\n  position: absolute;\n  ","\n  width: 100%;\n  height: 80px;\n"])),""),S=Object(x.b)(F)(y||(y=Object(j.a)([""]))),W=Object(x.b)(F)(u||(u=Object(j.a)(["\n  background: #fbfbfb;\n  transform: rotateX(90deg) translateZ(40px);\n  opacity: 0;\n  left: 0;\n"]))),I=x.b.div(b||(b=Object(j.a)(["\n  position: relative;\n  width: 100%;\n  height: 80px;\n  -webkit-transform-style: preserve-3d;\n  transform-style: preserve-3d;\n\n  &.rotate {\n    animation: "," 0.3s\n      cubic-bezier(0.25, 0.46, 0.45, 0.94) both;\n    "," {\n      transition: 0.3s;\n      opacity: 1;\n    }\n    "," {\n      transform: rotateY(0deg) translateZ(40px);\n    }\n  }\n  &.unrotate {\n    animation: "," 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)\n      both;\n    "," {\n      transition: 0.3s;\n      opacity: 0;\n    }\n    "," {\n      transform: rotateY(0deg) translateZ(40px);\n    }\n  }\n"])),g.g,W,S,g.f,W,S),M=x.b.div(f||(f=Object(j.a)(['\n  position: absolute;\n  top: 10px;\n  right: 10px;\n  width: 35px;\n  height: 35px;\n  background: white;\n  border-radius: 50%;\n  z-index: 2;\n  display: grid;\n  align-items: center;\n  justify-items: center;\n  cursor: pointer;\n  transition: 0.3s;\n\n  :hover {\n    transform: scale(1.1);\n  }\n\n  ::after {\n    content: "";\n    width: 100%;\n    height: 100%;\n    position: absolute;\n  }\n\n  i {\n    color: gray;\n  }\n']))),N=x.b.i(C||(C=Object(j.a)(["\n  font-weight: 400;\n  position: relative;\n  color: black;\n  font-size: 16px;\n\n  &:hover {\n    color: black;\n  }\n\n  span {\n    visibility: hidden;\n    width: 60px;\n    background-color: black;\n    color: #fff;\n    text-align: center;\n    padding: 5px 0;\n    border-radius: 6px;\n    font-size: 13px !important;\n    position: absolute;\n    z-index: 1;\n    top: 130%;\n    left: 50%;\n    margin-left: -30px;\n  }\n"])))},492:function(n,t,e){"use strict";e.r(t);var o=e(1),i=e(0);t.default=n=>{let{component:t,Fallback:s,...c}=n;const[a,r]=Object(o.useState)();return Object(o.useEffect)((()=>{(async()=>{if(!t)return;const n=await e(617)("./".concat(t));r(n)})()}),[t]),s&&!a?Object(i.jsx)(s,{}):Object(i.jsx)(i.Fragment,{children:a&&Object(i.jsx)(a.default,{...c})})}},504:function(n,t,e){"use strict";e.r(t),e.d(t,"identityInfo",(function(){return i}));var o=e(62);const i=()=>{const n=o.a.user;let t;return t=null===n||void 0===n?void 0:n.identities.find((n=>["pending","rejected"].includes(null===n||void 0===n?void 0:n.file_state))),{pendingIdentityFile:t,pendingOrRejectedIdentity:null===n||void 0===n?void 0:n.identities.find((n=>["pending","rejected"].includes(null===n||void 0===n?void 0:n.file_state)||["pending","rejected"].includes(null===n||void 0===n?void 0:n.info_state))),confirmedIdentity:null===n||void 0===n?void 0:n.identities.find((n=>["confirmed"].includes(null===n||void 0===n?void 0:n.file_state)&&["confirmed"].includes(null===n||void 0===n?void 0:n.info_state)))}}},526:function(n,t,e){"use strict";var o=e(1),i=e(492),s=e(473),c=(e(527),e(528),e(0));t.a=n=>{var t,e;let{handleDataForm:a,Fallback:r,...p}=n;const[l,d]=Object(o.useState)();return Object(o.useEffect)((()=>{d(Object(s.b)(a.dataForm))}),[null===a||void 0===a||null===(t=a.dataForm)||void 0===t?void 0:t.wrapperComponent]),Object(c.jsx)(i.default,{component:null===a||void 0===a||null===(e=a.dataForm)||void 0===e?void 0:e.wrapperComponent,Fallback:r,handleDataForm:a,handleState:{setState:d,state:l},...p})}},527:function(n,t,e){},528:function(n,t,e){},533:function(n,t,e){"use strict";e.r(t),e.d(t,"Title",(function(){return y})),e.d(t,"Option",(function(){return u})),e.d(t,"ButtonContainer",(function(){return b})),e.d(t,"ListContainer",(function(){return f})),e.d(t,"Content",(function(){return C})),e.d(t,"Layout",(function(){return j}));var o,i,s,c,a,r,p=e(2),l=e(3),d=e(4),m=e(64);const y=l.b.h1(o||(o=Object(p.a)(["\n    &.skeleton{\n        position:relative;\n        color:transparent;\n        display: flex;\n        justify-content: center;\n        ",'\n    }\n    &.skeleton::after{\n        content:"Crea una billetera";\n        position:absolute;\n        color:#bfbfbf;\n        background:#bfbfbf;\n        border-radius:4px;\n    }\n'])),m.a),u=l.b.div(i||(i=Object(p.a)(['\n  height: 142px;\n  width: 172px;\n  border: 1px solid #bfbfbf;\n  position: relative;\n  border-radius: 6px;\n  display: grid;\n\n  &::after{\n    position: absolute;\n    content: "";\n    width: 50px;\n    height: 45px;\n    background: #bfbfbf;\n    align-self: center;\n    justify-self: center;\n    border-radius: 5px;\n    margin-bottom: 40px;\n  }\n\n  &::before{\n    position: absolute;\n    content: "";\n    width: 100px;\n    height: 15px;\n    background: #bfbfbf;\n    border-radius: 3px;\n    justify-self: center;\n    align-self:flex-end;\n    margin-bottom: 15px;\n  }\n']))),b=l.b.div(s||(s=Object(p.a)(["\n    height:80px;\n    display: flex;\n    place-content: center;\n"]))),f=l.b.div(c||(c=Object(p.a)(["\n    display: grid;\n    overflow-y: scroll;\n    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));\n    grid-template-rows: repeat(auto-fill, 150px);\n    column-gap: 15px;\n    row-gap: 15px;\n    padding:25px 0;\n    height:calc(100% - 50px);\n\n    &.skeleton{\n        ","{\n            ","\n        }\n    }\n\n    &::-webkit-scrollbar {\n        width: 7px;\n    }\n\n    &::-webkit-scrollbar-thumb {\n        background: #475a681f;\n    }\n\n    .__itemContainerL__ .item:hover{\n        transform: scale(1) !important;\n    }\n\n    @media "," {\n\n        padding:25px 0;\n\n\n        .__itemContainerL__{\n            display: grid;\n            justify-items: center;\n        }\n\n        .__itemContainerL__ .item, ","{\n            width:160px;\n            height:140px;\n        }\n        \n    }\n"])),u,m.a,d.gb.tablet,u),C=l.b.div(a||(a=Object(p.a)(["\n\n    max-width:580px;\n    height: calc(100% - 50px);\n    width: calc(100% - 50px);\n    padding: 25px;\n    display:grid;\n    grid-template-rows:auto auto 1fr auto;\n    row-gap:20px;\n\n    h1{\n        color:var(--title1);\n        font-size:1.5em;\n        text-align:center;\n    }\n\n    @media "," {\n        h1{\n           margin-bottom:0;\n        }\n        height: calc(100% - 70px);\n        width: calc(100% - 40px);\n        padding: 20px 20px 50px;\n    }\n\n"])),d.gb.mobile),j=l.b.section(r||(r=Object(p.a)(["\n    width:100vw;\n    height:100vh;\n    background:white;\n    display:flex;\n    background:white;\n    position:absolute;\n    top:0;\n    left:0;\n    display: flex;\n    place-content: center;\n"])))},558:function(n,t,e){"use strict";e.r(t);var o=e(173),i=e(533),s=e(0);t.default=n=>Object(s.jsxs)(s.Fragment,{children:[Object(s.jsx)(i.Title,{className:"fuente skeleton",children:"Crea una billetera"}),Object(s.jsx)(o.b,{skeleton:!0}),Object(s.jsxs)(i.ListContainer,{className:"skeleton",children:[Object(s.jsx)(i.Option,{}),Object(s.jsx)(i.Option,{})]})]})},597:function(n,t,e){"use strict";e.r(t);var o=e(1),i=e(526),s=e(473),c=e(558),a=e(472),r=e(171),p=e(58),l=e(533),d=e(0);t.default=n=>{const[t,e]=Object(o.useState)(),m=Object(p.a)();return Object(o.useEffect)((()=>{(async()=>{const n=await Object(s.e)({formName:"newWallet"});e(n)})()}),[]),Object(d.jsxs)(r.a,{className:"fullScreen",on_click:(n,t)=>{n&&(n.target.dataset.close_modal||t)&&m.renderModal(null)},children:[Object(d.jsx)(a.i,{theme:"dark",top:15,right:20}),Object(d.jsx)(l.Layout,{children:Object(d.jsx)(l.Content,{className:"_contentNewWallet",children:t?Object(d.jsx)(i.a,{handleDataForm:{dataForm:t,setDataForm:e},Fallback:c.default}):Object(d.jsx)(c.default,{})})})]})}},617:function(n,t,e){var o={"./biometricKycComponent":[508,9,2,8,12],"./biometricKycComponent/":[508,9,2,8,12],"./biometricKycComponent/api":[498,9],"./biometricKycComponent/api.js":[498,9],"./biometricKycComponent/biometricStatus":[565,9,2,76],"./biometricKycComponent/biometricStatus.js":[565,9,2,76],"./biometricKycComponent/captures":[600,9,77],"./biometricKycComponent/captures.js":[600,9,77],"./biometricKycComponent/continueFromMobile":[574,9,3,64],"./biometricKycComponent/continueFromMobile.js":[574,9,3,64],"./biometricKycComponent/index":[508,9,2,8,12],"./biometricKycComponent/index copy":[601,9,2,8,35],"./biometricKycComponent/index copy.js":[601,9,2,8,35],"./biometricKycComponent/index.js":[508,9,2,8,12],"./biometricKycComponent/init":[573,9,41],"./biometricKycComponent/init.js":[573,9,41],"./biometricKycComponent/onBoardingAgreement":[616,9,3,58],"./biometricKycComponent/onBoardingAgreement.js":[616,9,3,58],"./biometricKycComponent/scanner":[575,9,78],"./biometricKycComponent/scanner.js":[575,9,78],"./biometricKycComponent/skeleton":[602,9,79],"./biometricKycComponent/skeleton.js":[602,9,79],"./biometricKycComponent/styles":[532,9,80],"./biometricKycComponent/styles.css":[618,7,136],"./biometricKycComponent/styles.js":[532,9,80],"./biometricKycComponent/success":[603,9,44],"./biometricKycComponent/success.js":[603,9,44],"./biometricKycComponent/utils":[554,9,81],"./biometricKycComponent/utils.js":[554,9,81],"./biometricKycComponent/validations":[570,9,65],"./biometricKycComponent/validations.js":[570,9,65],"./fiatDeposit":[482,9,1,2,4,3,10],"./fiatDeposit/":[482,9,1,2,4,3,10],"./fiatDeposit/amount":[485,9,1,2,4,3,10],"./fiatDeposit/amount.js":[485,9,1,2,4,3,10],"./fiatDeposit/api":[484,9],"./fiatDeposit/api.js":[484,9],"./fiatDeposit/costId":[604,9,1,2,4,3,32],"./fiatDeposit/costId.js":[604,9,1,2,4,3,32],"./fiatDeposit/index":[482,9,1,2,4,3,10],"./fiatDeposit/index.js":[482,9,1,2,4,3,10],"./fiatDeposit/init":[596,9,1,2,4,3,31],"./fiatDeposit/init.js":[596,9,1,2,4,3,31],"./fiatDeposit/skeleton":[605,9,82],"./fiatDeposit/skeleton.js":[605,9,82],"./fiatDeposit/styles":[477,9,1,4,47],"./fiatDeposit/styles.js":[477,9,1,4,47],"./fiatDeposit/success":[483,9,1,2,4,3,33],"./fiatDeposit/success.js":[483,9,1,2,4,3,33],"./infoPanel":[509,9,26],"./infoPanel/":[509,9,26],"./infoPanel/index":[509,9,26],"./infoPanel/index.js":[509,9,26],"./kyc/InputComponent":[502,9,5],"./kyc/InputComponent/":[502,9,5],"./kyc/InputComponent/index":[502,9,5],"./kyc/InputComponent/index.js":[502,9,5],"./kyc/MaskDateComponent":[505,9,20],"./kyc/MaskDateComponent/":[505,9,20],"./kyc/MaskDateComponent/index":[505,9,20],"./kyc/MaskDateComponent/index.js":[505,9,20],"./kyc/contactComponent":[511,9,1,5,14],"./kyc/contactComponent/":[511,9,1,5,14],"./kyc/contactComponent/api":[495,9],"./kyc/contactComponent/api.js":[495,9],"./kyc/contactComponent/buttons":[576,9,1,66],"./kyc/contactComponent/buttons.js":[576,9,1,66],"./kyc/contactComponent/const":[606,9,83],"./kyc/contactComponent/const.js":[606,9,83],"./kyc/contactComponent/countryPrefix":[510,9,7,21],"./kyc/contactComponent/countryPrefix/":[510,9,7,21],"./kyc/contactComponent/countryPrefix/index":[510,9,7,21],"./kyc/contactComponent/countryPrefix/index.js":[510,9,7,21],"./kyc/contactComponent/countryPrefix/methods":[578,9,84],"./kyc/contactComponent/countryPrefix/methods.js":[578,9,84],"./kyc/contactComponent/countryPrefix/styles":[577,9,85],"./kyc/contactComponent/countryPrefix/styles.js":[577,9,85],"./kyc/contactComponent/index":[511,9,1,5,14],"./kyc/contactComponent/index.js":[511,9,1,5,14],"./kyc/contactComponent/init":[571,9,37],"./kyc/contactComponent/init.js":[571,9,37],"./kyc/contactComponent/labelComponent":[579,9,67],"./kyc/contactComponent/labelComponent.js":[579,9,67],"./kyc/contactComponent/skeleton":[556,9,59],"./kyc/contactComponent/skeleton.js":[556,9,59],"./kyc/identityComponent":[512,9,19],"./kyc/identityComponent/":[512,9,19],"./kyc/identityComponent/api":[491,9],"./kyc/identityComponent/api.js":[491,9],"./kyc/identityComponent/buttons":[580,9,1,68],"./kyc/identityComponent/buttons.js":[580,9,1,68],"./kyc/identityComponent/const":[607,9,86],"./kyc/identityComponent/const.js":[607,9,86],"./kyc/identityComponent/files":[608,9,63,36],"./kyc/identityComponent/files.js":[608,9,63,36],"./kyc/identityComponent/identityUtils":[504,9],"./kyc/identityComponent/identityUtils.js":[504,9],"./kyc/identityComponent/index":[512,9,19],"./kyc/identityComponent/index.js":[512,9,19],"./kyc/identityComponent/info":[609,9,1,5,46],"./kyc/identityComponent/info.js":[609,9,1,5,46],"./kyc/identityComponent/init":[566,9,38],"./kyc/identityComponent/init.js":[566,9,38],"./kyc/identityComponent/labelComponent":[582,9,69],"./kyc/identityComponent/labelComponent.js":[582,9,69],"./kyc/identityComponent/skeleton":[536,9,60],"./kyc/identityComponent/skeleton.js":[536,9,60],"./kyc/identityComponent/success":[581,9,45],"./kyc/identityComponent/success.js":[581,9,45],"./kyc/locationComponent":[513,9,1,5,15],"./kyc/locationComponent/":[513,9,1,5,15],"./kyc/locationComponent/api":[494,9],"./kyc/locationComponent/api.js":[494,9],"./kyc/locationComponent/buttons":[583,9,1,70],"./kyc/locationComponent/buttons.js":[583,9,1,70],"./kyc/locationComponent/const":[523,9],"./kyc/locationComponent/const.js":[523,9],"./kyc/locationComponent/index":[513,9,1,5,15],"./kyc/locationComponent/index.js":[513,9,1,5,15],"./kyc/locationComponent/init":[572,9,39],"./kyc/locationComponent/init.js":[572,9,39],"./kyc/locationComponent/labelComponent":[584,9,71],"./kyc/locationComponent/labelComponent.js":[584,9,71],"./kyc/locationComponent/skeleton":[557,9,61],"./kyc/locationComponent/skeleton.js":[557,9,61],"./kyc/locationComponent/success":[610,9,48],"./kyc/locationComponent/success.js":[610,9,48],"./kyc/selectList":[514,9,16],"./kyc/selectList/":[514,9,16],"./kyc/selectList/index":[514,9,16],"./kyc/selectList/index.js":[514,9,16],"./kyc/selectList/itemList":[585,9,56],"./kyc/selectList/itemList.js":[585,9,56],"./kyc/selectList/styles":[563,9,87],"./kyc/selectList/styles.js":[563,9,87],"./kyc/styles":[478,9,88],"./kyc/styles.js":[478,9,88],"./kyc/utils":[500,9],"./kyc/utils.js":[500,9],"./kyc/validations":[540,9,28],"./kyc/validations.js":[540,9,28],"./layout":[476,9,24],"./layout/":[476,9,24],"./layout/index":[476,9,24],"./layout/index.js":[476,9,24],"./layout/styles":[474,9,89],"./layout/styles.js":[474,9,89],"./newWallet":[515,9,13],"./newWallet/":[515,9,13],"./newWallet/api":[497,9],"./newWallet/api.js":[497,9],"./newWallet/index":[515,9,13],"./newWallet/index.js":[515,9,13],"./newWallet/init":[597,9,43],"./newWallet/init.js":[597,9,43],"./newWallet/skeleton":[558,9,72],"./newWallet/skeleton.js":[558,9,72],"./newWallet/styles":[533,9,90],"./newWallet/styles.js":[533,9,90],"./newWallet/tagItem":[586,9,91],"./newWallet/tagItem.js":[586,9,91],"./onBoardingComponent":[516,9,18],"./onBoardingComponent/":[516,9,18],"./onBoardingComponent/api":[496,9],"./onBoardingComponent/api.js":[496,9],"./onBoardingComponent/assets/hand.png":[623,9,179],"./onBoardingComponent/assets/isoType.png":[624,9,180],"./onBoardingComponent/assets/nerdFace.png":[625,9,181],"./onBoardingComponent/assets/party.png":[626,9,182],"./onBoardingComponent/firstStage":[611,9,55],"./onBoardingComponent/firstStage.js":[611,9,55],"./onBoardingComponent/index":[516,9,18],"./onBoardingComponent/index.js":[516,9,18],"./onBoardingComponent/init":[612,9,42],"./onBoardingComponent/init.js":[612,9,42],"./onBoardingComponent/secondStage":[613,9,52],"./onBoardingComponent/secondStage.js":[613,9,52],"./onBoardingComponent/skeleton":[587,9,92],"./onBoardingComponent/skeleton.js":[587,9,92],"./onBoardingComponent/styles":[567,9,93],"./onBoardingComponent/styles.js":[567,9,93],"./onBoardingComponent/thirdStage":[614,9,50],"./onBoardingComponent/thirdStage.js":[614,9,50],"./onBoardingComponent/utils":[490,9,94],"./onBoardingComponent/utils.js":[490,9,94],"./onBoardingComponent/validations":[588,7,29],"./onBoardingComponent/validations.js":[588,7,29],"./personalKycComponent":[518,9,1,23,11],"./personalKycComponent/":[518,9,1,23,11],"./personalKycComponent/api":[493,9],"./personalKycComponent/api.js":[493,9],"./personalKycComponent/buttons":[589,9,1,73],"./personalKycComponent/buttons.js":[589,9,1,73],"./personalKycComponent/const":[522,9],"./personalKycComponent/const.js":[522,9],"./personalKycComponent/countryPrefix":[517,9,7,22],"./personalKycComponent/countryPrefix/":[517,9,7,22],"./personalKycComponent/countryPrefix/index":[517,9,7,22],"./personalKycComponent/countryPrefix/index.js":[517,9,7,22],"./personalKycComponent/countryPrefix/methods":[591,9,95],"./personalKycComponent/countryPrefix/methods.js":[591,9,95],"./personalKycComponent/countryPrefix/styles":[590,9,96],"./personalKycComponent/countryPrefix/styles.js":[590,9,96],"./personalKycComponent/index":[518,9,1,23,11],"./personalKycComponent/index.js":[518,9,1,23,11],"./personalKycComponent/init":[598,9,40],"./personalKycComponent/init.js":[598,9,40],"./personalKycComponent/input":[592,9,53],"./personalKycComponent/input.js":[592,9,53],"./personalKycComponent/labelComponent":[593,9,74],"./personalKycComponent/labelComponent.js":[593,9,74],"./personalKycComponent/maskDateComponent":[569,9,62],"./personalKycComponent/maskDateComponent.js":[569,9,62],"./personalKycComponent/selectList":[519,9,17],"./personalKycComponent/selectList/":[519,9,17],"./personalKycComponent/selectList/index":[519,9,17],"./personalKycComponent/selectList/index.js":[519,9,17],"./personalKycComponent/selectList/itemList":[595,9,57],"./personalKycComponent/selectList/itemList.js":[595,9,57],"./personalKycComponent/selectList/styles":[564,9,97],"./personalKycComponent/selectList/styles.js":[564,9,97],"./personalKycComponent/skeleton":[559,9,54],"./personalKycComponent/skeleton.js":[559,9,54],"./personalKycComponent/styles":[521,9,98],"./personalKycComponent/styles.js":[521,9,98],"./personalKycComponent/success":[594,9,49],"./personalKycComponent/success.js":[594,9,49],"./personalKycComponent/utils":[503,9],"./personalKycComponent/utils.js":[503,9],"./personalKycComponent/validations":[568,9,30],"./personalKycComponent/validations.js":[568,9,30],"./sharedStyles":[479,9,99],"./sharedStyles.js":[479,9,99],"./success/confetti":[529,9,75],"./success/confetti.js":[529,9,75],"./success/icons":[530,9,100],"./success/icons.js":[530,9,100],"./success/styles":[531,9,101],"./success/styles.js":[531,9,101]};function i(n){if(!e.o(o,n))return Promise.resolve().then((function(){var t=new Error("Cannot find module '"+n+"'");throw t.code="MODULE_NOT_FOUND",t}));var t=o[n],i=t[0];return Promise.all(t.slice(2).map(e.e)).then((function(){return e.t(i,t[1])}))}i.keys=function(){return Object.keys(o)},i.id=617,n.exports=i}}]);
//# sourceMappingURL=125.e2e417e4.chunk.js.map