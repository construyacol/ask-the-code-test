(this["webpackJsonpcoinsenda-app"]=this["webpackJsonpcoinsenda-app"]||[]).push([[97],{670:function(e,a,t){},719:function(e,a,t){"use strict";t.r(a);var i=t(2),n=t(9),c=t(19),o=t(24),s=t(30),r=t(44),d=(t(670),t(1));a.default=Object(n.b)((function(e,a){const{user:t}=e.modelData,{verification_state:i}=e.ui;return{user:t,verification_state:i}}),(function(e){return{action:Object(c.bindActionCreators)(o.a,e)}}))((e=>{const[a]=Object(r.a)(),[t,n]=Object(i.useState)({visible:!1,message:"",icon:"",ctaText:"",background:"white",action:null}),{user:c}=e;Object(i.useEffect)((()=>{"/security"===e.history.location.pathname&&o()}),[c]);const o=async()=>{const e=await a.getVerificationState();return e?"confirmed"===e?n({visible:!0,message:"Nuestro sistema esta verificando tus documentos, en breve podr\xe1s operar en Coinsenda",icon:"verified",ctaText:null,background:"linear-gradient(to bottom right, #00D2FF, #3A7BD5)",action:null}):"rejected"===e?n({visible:!0,message:"Tus datos han sido rechazados, aprende a verificarte correctamente en tan solo 1 minuto.",icon:"rejected",ctaText:"Ense\xf1ame ahora >>",background:"#b31217",action:u}):"pending"===e?n({visible:!0,message:"\xa1Genial!, estas a 1 solo paso de completar tu proceso de verificaci\xf3n..",icon:"verified",ctaText:"Ense\xf1ame ahora >>",background:"#989500",action:l}):void 0:n({visible:!0,message:"Bienvenido, completa el proceso de verificaci\xf3n y comienza a operar en Coinsenda",icon:"verified",ctaText:"Ense\xf1ame ahora >>",background:"linear-gradient(to bottom right, #00D2FF, #3A7BD5)",action:u})},l=()=>{e.action.play_video("kyc_advanced")},u=()=>{e.action.play_video("kyc_basic")},{visible:b,message:v,ctaText:m,icon:f,background:p,action:h}=t;return Object(d.jsxs)("div",{className:"PanelAlertContainer ".concat(b&&"visible"),id:"PanelAlertContainer",style:{background:p},children:[Object(d.jsx)("i",{className:"fas fa-times",onClick:async()=>{const e=await a.getVerificationState();return(!e||"confirmed"!==e&&"accepted"!==e)&&a.freshChatTrack("need help to verification"),n({...t,visible:!1})}}),Object(d.jsxs)("div",{className:"alertContainer fuente",children:[Object(d.jsx)(s.default,{icon:f,size:25,color:"white"}),Object(d.jsxs)("div",{className:"alertContainerText",children:[Object(d.jsx)("p",{children:v}),m&&Object(d.jsx)("div",{onClick:h,children:m})]})]})]})}))}}]);
//# sourceMappingURL=97.dceb4913.chunk.js.map