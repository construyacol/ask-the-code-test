(this["webpackJsonpcoinsenda-app"]=this["webpackJsonpcoinsenda-app"]||[]).push([[54],{361:function(e,c,t){},388:function(e,c,t){"use strict";t.r(c);var a=t(2),s=t(53),i=t(15),n=(t(361),t(14));const l=Object(s.a)((()=>Promise.resolve().then(t.bind(null,330))));c.default=function(e){const c=()=>{const{name:c,code:t,currency_type:a,pair_id:s,actualizarEstado:i}=e;i&&i(c,t,a,s)};Object(a.useEffect)((()=>{e.actives&&c()}),[e.actives]);const{type:t,actives:s,name:o,code:d,placeholder:r,primarySelect:m,format:j,itemType:b}=e;return console.log("|||||||||||||||  ItemLayout ==> ",t),Object(n.jsxs)("div",{id:"".concat(m?"primarySelect":""),className:"".concat("payment_method"===t?"ILtuvieja":""," "),children:[Object(n.jsxs)("div",{className:"item ".concat(s?"itemSelection":""),onClick:s&&"banks"!==b?null:c,children:[j?Object(n.jsx)(l,{icon:d,size:45}):"coins"===t||"payment_method"===t||"service_mode"===t?s?Object(n.jsxs)("div",{title:o,id:d,children:["bank"===t&&Object(n.jsx)("img",{className:"itemSobre activaos",src:"".concat(Object(i.b)("assets"),"coins/").concat(d,".png"),alt:"",width:"60"}),Object(n.jsx)("img",{className:"itemSobre activaos",src:"".concat(Object(i.b)("assets")).concat(t,"/").concat(d,"2.png"),alt:"",width:"60"})]}):Object(n.jsxs)("div",{title:o,id:d,children:[Object(n.jsx)("img",{className:"itemFuera",src:"".concat(Object(i.b)("assets")).concat(t,"/").concat(d,".png"),width:"60",alt:"",id:d,title:o}),Object(n.jsx)("img",{className:"itemSobre",src:"".concat(Object(i.b)("assets")).concat(t,"/").concat(d,"2.png"),width:"60",alt:"",id:d,title:o})]}):Object(n.jsx)("img",{className:"banquis ".concat(s?"itemVisible":""),src:"".concat(Object(i.b)("assets")).concat(t,"/").concat(d,".png"),alt:"",id:d,title:o,width:"85"}),m?Object(n.jsxs)("div",{id:"primarySelectText",className:"primarySelectText",children:[Object(n.jsx)("p",{title:o,children:o}),r&&r.map((e=>Object(n.jsx)("p",{id:"ILplaceholder2",className:"fuente",children:e.name},e.id)))]}):Object(n.jsx)("p",{title:o,children:o})]}),r&&!m&&Object(n.jsx)("div",{className:"placeHoldCont",children:r.map((e=>Object(n.jsx)("p",{className:"ILplaceholder fuente",children:e.name},e.id)))})]})}}}]);
//# sourceMappingURL=54.c0e9b3db.chunk.js.map