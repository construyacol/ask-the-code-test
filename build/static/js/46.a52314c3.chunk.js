(this["webpackJsonpcoinsenda-app"]=this["webpackJsonpcoinsenda-app"]||[]).push([[46],{361:function(e,t,a){},364:function(e,t,a){"use strict";var c=a(2),s=a(339),n=a(333),i=(a(361),a(14));t.a=e=>{const[t,a]=Object(c.useState)(),[r,o]=Object(c.useState)(),[d,l]=Object(c.useState)(),[u,b]=Object(c.useState)(),[j,h]=Object(c.useState)(),[f,p]=Object(c.useState)(),[O]=Object(n.a)(),m=t=>{setTimeout((()=>{e.toggle_anim&&e.toggle_anim(),p(e.toggle_anim&&!0)}),1200),setTimeout((()=>{e.authenticated&&e.authenticated(t)}),1500)},{label:x,handleFocus:v,handleBlur:y,disabled:g}=e;return Object(i.jsx)("div",{id:"authReq",className:"".concat(f?"desaparece":""),children:Object(i.jsx)(s.d,{disabled:g,type:"number",label:x,placeholder:"CODIGO 2FA",name:"auth",actualizarEstado:async t=>{const{value:c}=t.target;if(c.length>5){if(o(!0),a(!1),l("Verificando..."),e.isWithdraw2fa)return m(c);let t;return t=e.isTryToDisable2fa?await O.disable2fa(c):await O.addNewTransactionSecurity(c),t?((e,t)=>(a(!0),l("Verificado con \xc9xito"),b(!1),o(!1),h(e),m(t)))(c,t):(l("El c\xf3digo de verificaci\xf3n es incorrecto"),b(!0),o(!1))}l(""),a(!1),o(!1),b(!1)},active:t,verifying:r,value:j,status:d,error:u,handleFocus:v,handleBlur:y})})}},636:function(e,t,a){},671:function(e,t,a){"use strict";a.r(t);var c,s,n=a(327),i=a(2),r=a(330),o=a(365),d=a.n(o),l=a(364),u=a(98),b=a(28),j=a(99),h=a(433),f=a(328),p=a(343),O=a(333),m=(a(636),a(14));t.default=Object(u.b)((function(e,t){const{user:a}=e.modelData;return{user:a}}),(function(e){return{action:Object(b.bindActionCreators)(j.a,e)}}))((e=>{const[t,a]=Object(i.useState)(),[c,s]=Object(i.useState)(),[n,o]=Object(i.useState)(),[u,b]=Object(i.useState)(),[j,f]=Object(i.useState)(),[p,y]=Object(i.useState)(!0),[g]=Object(O.a)();return Object(i.useEffect)((()=>{(async()=>{const e=await g.getNew2faSecretCode();if(!e)return;const{data:t}=e;a(await d.a.toDataURL("otpauth://totp/".concat("Coinsenda","?secret=").concat(t))),o(t),y(!1)})()}),[]),Object(m.jsx)(x,{className:"TwoFactorActivate ".concat(j?"":"TwoFactorActivateOn"," ").concat(p?"skeleton":""),children:j?Object(m.jsx)("div",{className:"TwoFactorActivate success ".concat(u?"aparecer":""),children:Object(m.jsx)(h.a,{title:"Segundo factor de autenticaci\xf3n activado",cta_text:"El proceso de activaci\xf3n se ha realizado satisfactoriamente.",confetti:!0,cta_secondary:!1,cta_primary_text:"Finalizar",user_name:e.user.name,siguiente:async()=>{e.action.toggleModal()}})}):Object(m.jsxs)("div",{className:"TwoFactorActivate ".concat(u?"desaparecer":""),children:[Object(m.jsxs)("div",{className:"TLayout layer1",style:{opacity:c?"0.03":"1"},children:[Object(m.jsx)("div",{className:"header2fa"}),Object(m.jsxs)("div",{className:"body2fa",children:[Object(m.jsxs)("div",{className:"bodySon",children:[Object(m.jsx)("p",{className:"fuente",children:"Abre Google Authenticator y escanea el c\xf3digo QR"}),t&&!p?Object(m.jsx)("img",{src:t,alt:"",width:"200px"}):Object(m.jsx)(v,{className:"skeleton"})]}),Object(m.jsx)("div",{className:"footer2fa"})]})]}),Object(m.jsxs)("div",{className:"TLayout layer2",children:[Object(m.jsxs)("div",{className:"header2fa",children:[Object(m.jsxs)("h3",{className:"fuente",children:["Habilitar ",Object(m.jsx)("span",{className:"fuente2",children:"2FA"})]}),Object(m.jsx)(r.default,{icon:"2auth",size:75,color:"#1babec"})]}),Object(m.jsxs)("div",{className:"body2fa",children:[Object(m.jsx)("div",{className:"bodySon",style:{height:c?"10%":"50%"}}),Object(m.jsxs)("div",{className:"footer2fa",children:[Object(m.jsxs)("div",{className:"footer2faText",children:[Object(m.jsx)("div",{className:"footer2faTextDes ".concat(c?"desp":"desaparecer"),children:Object(m.jsxs)("p",{className:"fuente",children:["Recuerda que en caso de p\xe9rdida de tu dispositivo movil, solo podr\xe1s reactivar el 2FA con el c\xf3digo secreto"," ",Object(m.jsx)("span",{className:"secretCode fuente2",children:n})," ","escribelo en papel y guardalo, es tu responsabilidad"]})}),Object(m.jsx)("p",{className:"fuente ".concat(c?"desaparecer":"aparecer"),children:"\xd3 ingresa el c\xf3digo secreto manualmente"}),Object(m.jsx)("p",{className:"fuente2 secretCode ".concat(n?"":"skeleton text"," ").concat(c?"desaparecer":"aparecer"),children:n})]}),Object(m.jsx)(l.a,{handleFocus:()=>{n&&s(!0)},handleBlur:()=>{s(!1)},authenticated:async t=>{e.action.isAppLoading(!0),b(!0);const{transaction_security_id:a,scopes:c}=t;let s={...e.user,security_center:{...e.user.security_center,txSecurityId:a,authenticator:{...e.user.security_center.authenticator,auth:!0,withdraw:c.withdraw}}};await g.updateUser(s),e.action.isAppLoading(!1),setTimeout((()=>{f(!0)}),500)},disabled:p})]})]})]})]})})}));const x=f.b.div(c||(c=Object(n.a)(["\n  width: 100%;\n  height: 100%;\n  position: relative;\n  display: grid;\n  justify-items: center;\n\n  .skeleton {\n    animation-name: ",";\n    animation-duration: 1s;\n    animation-iteration-count: infinite;\n    opacity: 0.5;\n  }\n  .skeleton.text {\n    width: 250px;\n    height: 25px;\n    background: #bfbfbf;\n    border-radius: 3px;\n    justify-self: center;\n  }\n"])),p.c),v=f.b.div(s||(s=Object(n.a)(["\n  width: 180px;\n  height: 160px;\n  background: #bfbfbf;\n  border-radius: 3px;\n"])))}}]);
//# sourceMappingURL=46.a52314c3.chunk.js.map