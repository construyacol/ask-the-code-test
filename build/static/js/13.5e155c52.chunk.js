(this["webpackJsonpcoinsenda-app"]=this["webpackJsonpcoinsenda-app"]||[]).push([[13,61,62],{463:function(e,n,t){"use strict";t.r(n);var i=t(2),o=t.n(i),a=t(706),r=t(498),s=t(499),c=t(1);const l=e=>{var n,t;let{dataForm:o,setStageData:l,name:u,state:d,...p}=e;const[g,f]=Object(i.useState)(!1),v=u.includes("meta")?u:"meta_".concat(u),[x,m]=Object(i.useState)(null===o||void 0===o||null===(n=o.stages)||void 0===n||null===(t=n.nationality)||void 0===t?void 0:t.selectList[d[v]]),b=e=>{var n,t;e.stopPropagation(),(null===(n=e.target)||void 0===n||null===(t=n.dataset)||void 0===t?void 0:t.action)&&f((e=>!e))};Object(i.useEffect)((()=>{Object(s.setParentConfig)();const e=document.querySelector(".prefixContainer_");return e.addEventListener("click",b),()=>{e.removeEventListener("click",b),Object(s.removeParentConfig)()}}),[]),Object(i.useEffect)((()=>{var e;g?(Object(s.setMetaPhoneData)(l,o),Object(s.extendContainer)(),Object(s.inputFocus)(v,500)):(l({...null===o||void 0===o||null===(e=o.stages)||void 0===e?void 0:e.phone}),Object(s.colapseContainer)())}),[g]),Object(i.useEffect)((()=>{var e,n;const t=null===o||void 0===o||null===(e=o.stages)||void 0===e||null===(n=e.nationality)||void 0===n?void 0:n.selectList[d[v]];m(t),t&&f(!1)}),[d[v]]);const h=(null===x||void 0===x?void 0:x.prefix)||"+ --";return Object(c.jsxs)(r.PrefixContainer,{activeStage:g,className:"prefixContainer_",img:(null===x||void 0===x?void 0:x.flag)||"",children:[Object(c.jsx)("div",{"data-action":!0,className:"prefix_flag_"}),Object(c.jsx)("p",{"data-action":!0,className:"prefixContainer__prefix_text",children:h}),Object(c.jsx)("div",{className:"prefixInputContainer inputNumberFont",children:Object(c.jsx)("input",{name:v,onChange:p.onChange,defaultValue:null===x||void 0===x?void 0:x.uiName})}),Object(c.jsx)(a.a,{size:20,"data-action":!0})]})};n.default=o.a.memo(l)},498:function(e,n,t){"use strict";t.r(n),t.d(n,"PrefixContainer",(function(){return a}));var i,o=t(5);const a=t(6).b.div(i||(i=Object(o.a)(['\n\ntransition:.3s;\nposition:absolute;\nalign-self: center;\nheight: 70%;\nwidth: 75px;\ndisplay: grid;\ncursor:pointer;\nborder-right: 1px solid gray;\nbackground:white;\npadding: 0 15px;\nleft:0;\n\nalign-items: center;\ncolumn-gap: 8px;\noverflow: hidden;\ngrid-template-columns: auto auto 1fr;\n\n    .prefixInputContainer{\n        margin-left:25px;\n        input{\n            color:"gray";\n            transition:0s;\n        }\n    }\n    \n    svg{\n        position: absolute;\n        right: ',";\n    }\n    \n    .prefix_flag_{\n        border-radius:50%;\n        background:#bbbbbb;\n        height: 25px;\n        width: 25px;\n        background-image: url(",");\n        background-repeat: no-repeat;\n        background-position: center;\n        background-size: cover;\n    }\n\n    .prefixContainer__prefix_text::after{\n        content: '';\n        height: 100%;\n        width: 300%;\n        position: absolute;\n        left: -70%;\n    }\n\n    p{\n        position:relative;\n        height: 70%;\n        display: flex;\n        align-items: center;\n        align-self: center;\n        margin:0;\n        width: max-content;\n    }\n\n"])),(e=>e.activeStage?"15px":"5px"),(e=>e.img||""))},499:function(e,n,t){"use strict";t.r(n),t.d(n,"setMetaPhoneData",(function(){return i})),t.d(n,"colapseContainer",(function(){return o})),t.d(n,"inputFocus",(function(){return a})),t.d(n,"extendContainer",(function(){return r})),t.d(n,"setParentConfig",(function(){return s})),t.d(n,"removeParentConfig",(function(){return c}));const i=(e,n)=>{e((e=>{var t,i;return{...e,selectList:null===n||void 0===n||null===(t=n.stages)||void 0===t||null===(i=t.nationality)||void 0===i?void 0:i.selectList,uiType:"select",key:"meta_phone",uiName:"Define el prefijo",settings:{...e.settings,defaultMessage:"El\xedge el pa\xeds para asignar un prefijo",errors:[{pattern:/[^a-zA-Z _]{1,30}/g,message:"Solo se permiten letras..."}]}}}))},o=()=>{const e=document.querySelector(".prefixContainer_");e.style.width="75px",e.style.borderRight="1px solid gray",(()=>{const e=document.querySelector(".prefixInputContainer>input");e&&(e.style.color="transparent",setTimeout((()=>e.style.color="gray"),500))})()},a=function(e){let n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;setTimeout((()=>{var n;return null===(n=document.querySelector('[name="'.concat(e,'"]')))||void 0===n?void 0:n.focus()}),n)},r=()=>{const e=document.querySelector(".prefixContainer_");e.style.width="calc(100% - 32px)",e.style.borderRight="1px solid transparent"},s=()=>{var e;let n=document.querySelector(".inputContainer__"),t=(null===(e=document.querySelector(".prefixContainer_"))||void 0===e?void 0:e.clientWidth)||150;n.style.paddingLeft="".concat(t,"px"),n.style.width="calc(100% - ".concat(t,"px)")},c=()=>{let e=document.querySelector(".inputContainer__");e&&(e.style.paddingLeft="0px",e.style.width="100%")}}}]);
//# sourceMappingURL=13.5e155c52.chunk.js.map