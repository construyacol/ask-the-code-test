(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{715:function(e){e.exports={a:[{id:2,name:"email",email:[{id:1,name:"email",label:"Correo electr\xf3nico",description:"Confirma tu correo electr\xf3nico como respaldo en caso de p\xe9rdida de tus contrase\xf1as, solo desde el correo o desde tu celular podr\xe1n ser recuperadas.",verify:!1,cta_primary:"Verificar",cta_secondary:"Verificado",tree:!1,available:!0}]},{id:1,name:"identity",identity:[{id:1,name:"identity",label:"Verificaci\xf3n de identidad",description:"La verificaci\xf3n de identidad es obligatoria para cumplir con las leyes de prevenci\xf3n del blanqueo de capitales reguladas por el gobierno. El cumplimiento de esta normativa sirve para proporcionarle una experiencia segura, sencilla y personalizada.",verify:!0,cta_primary:"Verificar",cta_secondary:"Verificado",tree:!0,available:!0,type:"identity"},{id:2,name:"kyc_basic",label:"B\xe1sica",description:"Completa los datos basicos de tu perfil (nombres, apellidos, pais, ciudad etc...)",verify:!1,cta_primary:"Verificar",cta_secondary:"Verificado",tree:!1,available:!0,type:"identity"},{id:3,name:"kyc_advanced",label:"Avanzada",description:"Adjunta foto tipo selfie con documento y papel en mano donde se vea la fecha actual",verify:!1,cta_primary:"Verificar",cta_secondary:"Verificado",tree:!1,available:!1,type:"identity"},{id:4,name:"kyc_financial",label:"Financiera",description:"Adjunta comprobante de ingresos RUT para operar con montos superiores a $7.000 dolares.",verify:!1,cta_primary:"Verificar",cta_secondary:"Verificado",tree:!1,available:!1,type:"identity"}]},{id:3,name:"2auth","2auth":[{id:1,name:"2auth",label:"Autenticaci\xf3n 2FA",description:"Agrega una segunda capa de seguridad al inicio de sesi\xf3n de tu cuenta con una contrase\xf1a dinamica que cambiara cada 30 segundos y que solo estar\xe1 accesible desde tu dispositivo movil   |   (RECOMENDADO).",verify:!0,cta_primary:"Habilitar",cta_secondary:"Deshabilitar",tree:!1,available:!0},{id:2,name:"withdraw",label:"Retiros de saldo",description:"Activa el segundo factor para realizar retiros de saldos en coinsenda.",verify:!0,cta_primary:"Habilitar",cta_secondary:"Deshabilitar",tree:!1,available:!0}]}]}},716:function(e,a,t){},737:function(e,a,t){"use strict";t.r(a);var r=t(2),n=t.n(r),c=t(3),i=t(8),o=t(10),s=t(13),l=t(11),d=t(12),u=t(0),p=t.n(u),m=t(93),f=t(14),v=t(19),b=t(20),y=t(21),h=t(715),g=t(4),_=t(22),x=t(17),w=function(e){function a(){var e,t;Object(i.a)(this,a);for(var r=arguments.length,n=new Array(r),c=0;c<r;c++)n[c]=arguments[c];return(t=Object(s.a)(this,(e=Object(l.a)(a)).call.apply(e,[this].concat(n)))).state=Object(g.a)({},t.props.subItem),t.actionHandle=function(){var e=t.props;(0,e.item_action)(e.subItem)},t}return Object(d.a)(a,e),Object(o.a)(a,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e=this.props,a=e.index,t=e.totalIndex,r=e.nextVerify,n=e.lastVerify,c=this.state,i=c.label,o=c.name,s=c.color,l=c.icon,d=c.description,m=c.cta_primary,f=c.cta_secondary,v=c.verify,b=c.tree,h=c.available,g=c.treeButton,w=c.classic_view,E=c.other_state,j=a-1,C=window.innerWidth<768,O={icon:l||o,size:40,color:"".concat(s||(v?"#1babec":"#989898"))};return p.a.createElement("div",{className:"subItemSecurityCenter",style:{gridTemplateColumns:w?"1fr":"12vw 1fr"},onClick:h&&C?"to_disable"===E?this.actionHandle:v||"confirmed"===E||"send"===E?null:this.actionHandle:null},C&&!b&&p.a.createElement("div",{className:"contCtaMovilSec"},"send"===E?p.a.createElement("i",{className:"enviarNero fas fa-angle-double-down",style:{color:"gray"}}):"confirmed"===E?p.a.createElement("i",{className:"fas fa-spinner rotateGono",style:{color:"#bbbbbb"}}):v?p.a.createElement("i",{className:"fas fa-check",style:{color:"#59B200"}}):h&&p.a.createElement("i",{className:"fas fa-chevron-right anim-flow",style:{color:"gray",fontSize:"20px"}})),p.a.createElement("div",{className:"SCimgItem",style:{display:w?"none":"grid"}},p.a.createElement("div",{className:"SCimgItemCont ".concat(v?"active":""," ").concat(1===a?"first":"")},p.a.createElement(x.a,O)),p.a.createElement("div",{className:"SCconector ".concat(t===a?"last":""," ").concat(r||n>j?"active":"")})),p.a.createElement("div",{className:"contentSubItem ".concat(t===a?"last":"","  ").concat("confirmed"===E?"confir":"")},p.a.createElement("div",{className:"contentSubText ".concat(h?"available":""," fuente"),style:{gridTemplateRows:b?"70px 1fr":"60px 20px 1fr",opacity:v&&h||"confirmed"===E||"send"===E?"1":"rejected"===E?"0.8":"0.35"}},p.a.createElement("div",{className:"SCtitle",style:{color:w&&v?"#1fa4e9":w?"gray":v&&b?"#1fa4e9":"send"===E?"#545454":"gray"}},p.a.createElement("div",{className:"ScimgClassicView ".concat(w?"classic_view":""),style:{display:w?"flex":"none"}},p.a.createElement(x.a,O)),i),p.a.createElement("div",{className:"SCverification",style:{color:v?"#59B200":"confirmed"===E?"gray":"send"===E?"#59B200":"#540000",display:b?"none":"visible"}},v?p.a.createElement(u.Fragment,null,p.a.createElement("i",{className:"fas fa-check"}),"Verificado y/o Habilitado con \xe9xito"):"confirmed"===E?p.a.createElement("div",{className:"confirmedIndentSc"},p.a.createElement("div",{className:"loaderScontainer"},p.a.createElement(y.c,{loader:2})),"verificando..."):"send"===E?p.a.createElement(u.Fragment,null,p.a.createElement("i",{className:"SCUnverify fas fa-share"}),"Informaci\xf3n enviada"):p.a.createElement(u.Fragment,null,p.a.createElement("i",{className:"SCUnverify fas fa-times"}),"".concat(i," sin ").concat(m))),p.a.createElement("p",{className:"fuente SCdesc",style:{alignSelf:b?"flex-start":"center",color:"send"===E?"#545454":"rejected"===E?"#a90000":"gray"}},"send"===E&&p.a.createElement("i",{className:"enviarNero fas fa-angle-double-down"}),d)),p.a.createElement("div",{className:"SCcta ".concat(E),style:{display:w||b&&!g?"none":"grid"}},p.a.createElement(_.b,{id:"subItemSC",type:"".concat(v?"secundary":"primary"),active:h,siguiente:"to_disable"===E?this.actionHandle:v||"confirmed"===E||"send"===E?null:this.actionHandle},"".concat("confirmed"===E?"Verificando":"send"===E?"Enviado":v?f:m))),p.a.createElement("div",{className:"SCcta",style:{display:w?"grid":"none"}},p.a.createElement(_.b,{id:"ClassicView",type:"".concat(v?"secundary":"primary"),active:h,siguiente:this.actionHandle},p.a.createElement("div",{className:"ClassicTextCont fuentePrin",style:{display:h?"grid":"none"}},p.a.createElement("p",{className:"ClassicViewText"},m),p.a.createElement("p",{className:"ClassicViewText"},f,p.a.createElement("i",{className:"fas fa-angle-right"}))),!h&&"".concat(v?f:m)))))}}]),a}(u.Component),E=(t(716),function(e){function a(){var e,t;Object(i.a)(this,a);for(var r=arguments.length,o=new Array(r),d=0;d<r;d++)o[d]=arguments[d];return(t=Object(s.a)(this,(e=Object(l.a)(a)).call.apply(e,[this].concat(o)))).state={current_item:[],lastVerify:null},t.initItem=Object(c.a)(n.a.mark(function e(){var a;return n.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:a=t.props.item,Object.keys(a).forEach(function(){var e=Object(c.a)(n.a.mark(function e(r){var c,i,o,s;return n.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if("id"===r||"name"===r){e.next=8;break}return c=a[r],e.next=4,t.update_items(c);case 4:for(o=e.sent,s=0;s<o.length;s++)!0===o[s].verify&&(i=s);return e.next=8,t.setState({current_item:o,lastVerify:i});case 8:case"end":return e.stop()}},e)}));return function(a){return e.apply(this,arguments)}}());case 2:case"end":return e.stop()}},e)})),t.update_items=function(){var e=Object(c.a)(n.a.mark(function e(a){var r,i;return n.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.props.update_state,i=[],a.map(function(){var e=Object(c.a)(n.a.mark(function e(a){var t,c;return n.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r(a);case 2:return t=e.sent,c=Object(g.a)({},a,t),e.abrupt("return",i.push(c));case 5:case"end":return e.stop()}},e)}));return function(a){return e.apply(this,arguments)}}()),e.abrupt("return",i);case 4:case"end":return e.stop()}},e)}));return function(a){return e.apply(this,arguments)}}(),t}return Object(d.a)(a,e),Object(o.a)(a,[{key:"componentDidMount",value:function(){this.initItem()}},{key:"render",value:function(){var e=this.props,a=e.item_action,t=e.update_state,r=this.state,n=r.current_item,c=r.lastVerify,i=0;return p.a.createElement("div",{name:this.props.name,className:"itemSecurityCenter",style:{padding:n[0]&&n[0].classic_view?"0":"20px 0 20px 0"}},n.length>0&&n.map(function(e){return i++,p.a.createElement(w,{subItem:e,item_action:a,key:e.id,index:i,totalIndex:n.length,lastVerify:c,nextVerify:n[i]&&n[i].verify,update_state:t})}))}}]),a}(u.Component)),j=function(e){function a(){var e,t;Object(i.a)(this,a);for(var r=arguments.length,o=new Array(r),d=0;d<r;d++)o[d]=arguments[d];return(t=Object(s.a)(this,(e=Object(l.a)(a)).call.apply(e,[this].concat(o)))).item_action=function(){var e=Object(c.a)(n.a.mark(function e(a){var r,c,i,o,s;return n.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:r=t.props.user,c=r.security_center.authenticator,i=r.settings.phone,o=a.name,s=a.other_state,console.log("CODE SWITCH",o,a,t.props.action),e.t0=o,e.next="kyc_basic"===e.t0?8:"kyc_financial"===e.t0?13:"kyc_advanced"===e.t0?18:"2auth"===e.t0?23:"phone"===e.t0?30:"pass"===e.t0?33:"transactional"===e.t0?36:"withdraw"===e.t0?39:"country"===e.t0?42:"currency"===e.t0?45:48;break;case 8:return e.next=10,t.props.action.ToStep("globalStep",0);case 10:return e.next=12,t.props.action.CurrentForm("kyc_basic");case 12:return e.abrupt("return",t.props.action.toggleModal());case 13:return e.next=15,t.props.action.CurrentForm("kyc_basic");case 15:return e.next=17,t.props.action.ToStep("globalStep",3);case 17:return e.abrupt("return",t.props.action.toggleModal());case 18:return e.next=20,t.props.action.CurrentForm("kyc_basic");case 20:return e.next=22,t.props.action.ToStep("globalStep",2);case 22:return e.abrupt("return",t.props.action.toggleModal());case 23:if("to_disable"!==s){e.next=27;break}return e.next=26,t.props.action.current_section_params({settings:{title:"Deshabilitando 2AUTH",description:"Desactivar\xe1s la segunda capa de seguridad en todos los servicios activos.",txtPrimary:"Desactivar",txtSecondary:"Cancelar",authenticator:c,code:o,other_state:s}});case 26:return e.abrupt("return",t.props.action.toggleOtherModal());case 27:return e.next=29,t.props.action.CurrentForm("2auth");case 29:return e.abrupt("return",t.props.action.toggleModal());case 30:return e.next=32,t.props.action.current_section_params({settings:{title:"Actualizar n\xfamero de movil",description:"".concat(i?"Tu n\xfamero actual es: ".concat(i):"A\xfan no tienes n\xfamero celular de respaldo"),txtPrimary:"Actualizar",txtSecondary:"Cancelar",payload:i,code:o,type:"number",placeholder:"Escribe el nuevo n\xfamero",authenticator:c}});case 32:return e.abrupt("return",t.props.action.toggleOtherModal());case 33:return e.next=35,t.props.action.current_section_params({settings:{title:"Cambia tu contrase\xf1a",description:"Esta contrase\xf1a es la que utilizas para acceder a tu cuenta",txtPrimary:"Actualizar",txtSecondary:"Cancelar",code:o,type:"number",placeholder:"Escribe el nuevo n\xfamero",authenticator:c}});case 35:return e.abrupt("return",t.props.action.toggleOtherModal());case 36:return e.next=38,t.props.action.current_section_params({settings:{title:"".concat("to_disable"===s?"Deshabilitando 2FA":"Agregando capa de seguridad"),description:"Activa el segundo factor para hacer operaciones de intercambio en coinsenda",txtPrimary:"Agregar",txtSecondary:"Cancelar",authenticator:c,code:o,other_state:s}});case 38:return e.abrupt("return",t.props.action.toggleOtherModal());case 39:return e.next=41,t.props.action.current_section_params({settings:{title:"".concat("to_disable"===s?"Deshabilitando 2FA":"Agregando capa de seguridad"),description:"Activa el segundo factor para hacer operaciones de Retiro en coinsenda",txtPrimary:"Agregar",txtSecondary:"Cancelar",authenticator:c,code:o,other_state:s}});case 41:return e.abrupt("return",t.props.action.toggleOtherModal());case 42:return e.next=44,t.props.action.current_section_params({settings:{title:"Elige el pa\xeds de operaci\xf3n actual",txtPrimary:"Agregar",txtSecondary:"Cancelar",authenticator:!1,code:o}});case 44:return e.abrupt("return",t.props.action.toggleOtherModal());case 45:return e.next=47,t.props.action.current_section_params({settings:{title:"Elige tu divisa de cotizaci\xf3n",txtPrimary:"Agregar",txtSecondary:"Cancelar",authenticator:!1,code:o}});case 47:return e.abrupt("return",t.props.action.toggleOtherModal());case 48:case"end":return e.stop()}},e)}));return function(a){return e.apply(this,arguments)}}(),t.update_state=function(){var e=Object(c.a)(n.a.mark(function e(a){var r,c,i,o,s,l,d,u,p,m;return n.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:r=a.name,c=a.description,i=t.props.user,o=i.security_center,s=o.kyc,l=o.authenticator,d=l.auth,u=l.transactional,p=l.withdraw,m=window.innerWidth<768,e.t0=r,e.next="email"===e.t0?9:"identity"===e.t0?10:"kyc_financial"===e.t0?11:"kyc_basic"===e.t0?12:"kyc_advanced"===e.t0?13:"2auth"===e.t0?14:"transactional"===e.t0?15:"withdraw"===e.t0?16:17;break;case 9:return e.abrupt("return",{available:!0,verify:o.email,classic_view:m});case 10:return e.abrupt("return",{available:!0,verify:!0,classic_view:m});case 11:return e.abrupt("return",{classic_view:m,icon:"rejected"===s.financial?"error":null,color:"rejected"===s.financial?"#c70000":null,available:"accepted"===s.basic&&"accepted"===s.advanced,verify:"accepted"===s.financial,other_state:s.financial,description:"confirmed"===s.financial?"Tus datos financieros estan siendo verificados en estos momentos...":"rejected"===s.financial?"Tus datos no se han podido verificar, intenta nuevamente":c});case 12:return e.abrupt("return",{classic_view:m,color:"rejected"===s.basic?"#c70000":null,icon:"rejected"===s.basic?"error":null,available:!0,verify:"accepted"===s.basic,description:"confirmed"!==s.basic||s.advanced?"confirmed"===s.basic&&"confirmed"===s.advanced?"El sistema esta verificando tus datos...":"rejected"===s.basic&&"rejected"===s.advanced?i.verification_error||"\xa1Vaya!, al parecer los datos no se han podido verificar, vuelve a intentarlo":"":"Contin\xfaa con la identificaci\xf3n avanzada para dar inicio a la verificaci\xf3n de tus datos.",other_state:"confirmed"===s.basic&&"confirmed"===s.advanced?"confirmed":"confirmed"!==s.basic||s.advanced&&"rejected"!==s.advanced?"rejected"===s.advanced?"rejected":null:"send"});case 13:return e.abrupt("return",{classic_view:m,available:"confirmed"===s.basic||"accepted"===s.advanced||null,verify:"accepted"===s.advanced,other_state:s.advanced,description:"confirmed"===s.basic&&"confirmed"===s.advanced?"El sistema esta verificando tus datos...":"rejected"===s.advanced&&""});case 14:return e.abrupt("return",{classic_view:m,available:!0,other_state:d?"to_disable":null,verify:d});case 15:return e.abrupt("return",{classic_view:m,available:d&&!0,other_state:u?"to_disable":null,verify:d&&u});case 16:return e.abrupt("return",{classic_view:m,available:d&&!0,other_state:p?"to_disable":null,verify:d&&p});case 17:return e.abrupt("return",!1);case 18:case"end":return e.stop()}},e)}));return function(a){return e.apply(this,arguments)}}(),t.update_phone=function(e){},t}return Object(d.a)(a,e),Object(o.a)(a,[{key:"render",value:function(){var e=this,a=this.props.data;return p.a.createElement("section",{className:"SecurityCenter"},a&&a.map(function(a){return p.a.createElement(E,Object.assign({name:a.name,item:a,key:a.id,item_action:e.item_action,update_state:e.update_state},e.props))}))}}]),a}(u.Component);var C=Object(f.b)(function(e,a){var t=e.modelData.user;return{loader:e.isLoading.loader,advace_global_step:e.form.globalStep,user:t}},function(e){return{action:Object(v.bindActionCreators)(b.a,e)}})(j),O=t(65),k=t(76),S=function(e){function a(){var e,t;Object(i.a)(this,a);for(var r=arguments.length,o=new Array(r),d=0;d<r;d++)o[d]=arguments[d];return(t=Object(s.a)(this,(e=Object(l.a)(a)).call.apply(e,[this].concat(o)))).validate_state=Object(c.a)(n.a.mark(function e(){return n.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.props.action.get_verification_state();case 2:"accepted"!==e.sent&&(O.scroller.scrollTo("firstInsideContainer",{offset:220,duration:1,smooth:!0,containerId:"containerElement"}),k.a.show_tags(["verify"],"article"));case 4:case"end":return e.stop()}},e)})),t}return Object(d.a)(a,e),Object(o.a)(a,[{key:"componentWillUnmount",value:function(){this.props.action.default_video_state()}},{key:"componentDidMount",value:function(){this.validate_state(),setTimeout(function(){},0)}},{key:"render",value:function(){return p.a.createElement(u.Fragment,null,p.a.createElement(m.a,Object.assign({title:"Centro de seguridad"},this.props),this.props.loader?p.a.createElement(y.c,{label:"Obteniendo configuraciones"}):h.a&&p.a.createElement(C,{data:h.a})))}}]),a}(u.Component);a.default=Object(f.b)(function(e,a){return{user:e.modelData.user,loader:e.isLoading.loader}},function(e){return{action:Object(v.bindActionCreators)(b.a,e)}})(S)}}]);
//# sourceMappingURL=5.70ef85cc.chunk.js.map