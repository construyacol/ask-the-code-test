(window.webpackJsonp=window.webpackJsonp||[]).push([[44],{781:function(e,t,a){},842:function(e,t,a){"use strict";a.r(t);var n=a(1),r=a(0),i=a.n(r),c=a(2),o=a(44),s=a(5),u=a.n(s),l=a(110),d=a(36),f=a(111),b=a(353),m=a(355);a(781);t.default=Object(l.b)(function(e,t){return{user:e.modelData.user,verification_state:e.ui.verification_state}},function(e){return{action:Object(d.bindActionCreators)(f.a,e)}})(function(e){var t=Object(m.a)(),a=Object(o.a)(t,1)[0],r=Object(s.useState)({visible:!1,message:"",icon:"",ctaText:"",background:"white",action:null}),l=Object(o.a)(r,2),d=l[0],f=l[1];Object(s.useEffect)(function(){"/security"===e.history.location.pathname&&p()},[e.user]);var p=function(){var e=Object(c.a)(i.a.mark(function e(){var t;return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,a.getVerificationState();case 2:if(t=e.sent){e.next=5;break}return e.abrupt("return",f({visible:!0,message:"Bienvenido, completa el proceso de verificaci\xf3n y comienza a operar en Coinsenda",icon:"verified",ctaText:"Ense\xf1ame ahora >>",background:"linear-gradient(to bottom right, #00D2FF, #3A7BD5)",action:g}));case 5:if("confirmed"!==t){e.next=7;break}return e.abrupt("return",f({visible:!0,message:"Nuestro sistema esta verificando tus documentos, en breve podr\xe1s operar en Coinsenda",icon:"verified",ctaText:null,background:"linear-gradient(to bottom right, #00D2FF, #3A7BD5)",action:null}));case 7:if("rejected"!==t){e.next=9;break}return e.abrupt("return",f({visible:!0,message:"Tus datos han sido rechazados, aprende a verificarte correctamente en tan solo 1 minuto.",icon:"rejected",ctaText:"Ense\xf1ame ahora >>",background:"#b31217",action:g}));case 9:if("pending"!==t){e.next=11;break}return e.abrupt("return",f({visible:!0,message:"\xa1Genial!, estas a 1 solo paso de completar tu proceso de verificaci\xf3n..",icon:"verified",ctaText:"Ense\xf1ame ahora >>",background:"#989500",action:v}));case 11:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),v=function(){e.action.play_video("kyc_advanced")},g=function(){e.action.play_video("kyc_basic")},k=function(){var e=Object(c.a)(i.a.mark(function e(){var t;return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,a.getVerificationState();case 2:return(!(t=e.sent)||"confirmed"!==t&&"accepted"!==t)&&a.freshChatTrack("need help to verification"),e.abrupt("return",f(Object(n.a)({},d,{visible:!1})));case 5:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),h=d.visible,x=d.message,j=d.ctaText,w=d.icon,E=d.background,y=d.action;return u.a.createElement("div",{className:"PanelAlertContainer ".concat(h&&"visible"),id:"PanelAlertContainer",style:{background:E}},u.a.createElement("i",{className:"fas fa-times",onClick:k}),u.a.createElement("div",{className:"alertContainer fuente"},u.a.createElement(b.default,{icon:w,size:25,color:"white"}),u.a.createElement("div",{className:"alertContainerText"},u.a.createElement("p",null,x),j&&u.a.createElement("div",{onClick:y},j))))})}}]);
//# sourceMappingURL=44.1501050d.chunk.js.map