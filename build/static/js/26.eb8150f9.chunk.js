(this["webpackJsonpcoinsenda-app"]=this["webpackJsonpcoinsenda-app"]||[]).push([[26],{336:function(e,t,n){"use strict";n.d(t,"g",(function(){return O})),n.d(t,"f",(function(){return f})),n.d(t,"b",(function(){return x})),n.d(t,"d",(function(){return v})),n.d(t,"h",(function(){return _})),n.d(t,"c",(function(){return w})),n.d(t,"a",(function(){return N})),n.d(t,"e",(function(){return k}));var c,r,a,s,i,o,l,d,u,b=n(327),j=(n(2),n(328)),p=n(353),h=n(346),m=n(14);const O=e=>{let{theme:t,opacity:n,size:c,id:r}=e;return Object(m.jsx)(y,{id:r||"IconCloseModal",color:"".concat("dark"===t&&"dark"),opacity:n,size:c+10,"data-close_modal":!0,children:Object(m.jsx)(h.b,{color:"".concat("dark"===t?"white":"gray"),size:c})})},f=j.b.div(c||(c=Object(b.a)(["\n  width: ",";\n  height: ",";\n  background: ",";\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 4px;\n"])),(e=>e.size&&"".concat(e.size,"px")||"35px"),(e=>e.size&&"".concat(e.size,"px")||"35px"),(e=>"dark"===e.color?"rgb(0, 0, 0, ".concat(e.opacity||".4",")"):"rgb(255, 255, 255, ".concat(e.opacity||".3",")"))),y=Object(j.b)(f)(r||(r=Object(b.a)(['\n  z-index: 2;\n  right: 5px;\n  top: -38px;\n  position: absolute;\n  cursor: pointer;\n  transition: 0.2s;\n\n  &::after {\n    content: "";\n    width: 100%;\n    height: 100%;\n    position: absolute;\n    z-index: 3;\n  }\n  &:hover {\n    transform: scale(1.1);\n  }\n  &:active {\n    transform: scale(0.97);\n  }\n\n  @media (max-width: 768px) {\n    top: 10px;\n    right: 15px;\n  }\n']))),x=j.b.div(a||(a=Object(b.a)(["\n  position: absolute;\n  width: 100%;\n  left: 0;\n  display: grid;\n  bottom: ",";\n  #controlsContainer {\n    transform: scale(0.95);\n  }\n"])),(e=>"".concat(e.bottom,"px"))),g=j.b.div(s||(s=Object(b.a)(["\n  display: block;\n  position: absolute;\n  ","\n  width: 100%;\n  height: 80px;\n"])),""),v=Object(j.b)(g)(i||(i=Object(b.a)([""]))),_=Object(j.b)(g)(o||(o=Object(b.a)(["\n  background: #fbfbfb;\n  transform: rotateX(90deg) translateZ(40px);\n  opacity: 0;\n  left: 0;\n"]))),w=j.b.div(l||(l=Object(b.a)(["\n  position: relative;\n  width: 100%;\n  height: 80px;\n  -webkit-transform-style: preserve-3d;\n  transform-style: preserve-3d;\n\n  &.rotate {\n    animation: "," 0.3s\n      cubic-bezier(0.25, 0.46, 0.45, 0.94) both;\n    "," {\n      transition: 0.3s;\n      opacity: 1;\n    }\n    "," {\n      transform: rotateY(0deg) translateZ(40px);\n    }\n  }\n  &.unrotate {\n    animation: "," 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)\n      both;\n    "," {\n      transition: 0.3s;\n      opacity: 0;\n    }\n    "," {\n      transform: rotateY(0deg) translateZ(40px);\n    }\n  }\n"])),p.k,_,v,p.j,_,v),N=j.b.div(d||(d=Object(b.a)(['\n  position: absolute;\n  top: 10px;\n  right: 10px;\n  width: 35px;\n  height: 35px;\n  background: white;\n  border-radius: 50%;\n  z-index: 2;\n  display: grid;\n  align-items: center;\n  justify-items: center;\n  cursor: pointer;\n  transition: 0.3s;\n\n  :hover {\n    transform: scale(1.1);\n  }\n\n  ::after {\n    content: "";\n    width: 100%;\n    height: 100%;\n    position: absolute;\n  }\n\n  i {\n    color: gray;\n  }\n']))),k=j.b.i(u||(u=Object(b.a)(["\n  font-weight: 400;\n  position: relative;\n  color: black;\n  font-size: 16px;\n\n  &:hover {\n    color: black;\n  }\n\n  span {\n    visibility: hidden;\n    width: 60px;\n    background-color: black;\n    color: #fff;\n    text-align: center;\n    padding: 5px 0;\n    border-radius: 6px;\n    font-size: 13px !important;\n    position: absolute;\n    z-index: 1;\n    top: 130%;\n    left: 50%;\n    margin-left: -30px;\n  }\n"])))},351:function(e,t,n){"use strict";n(2);var c=n(331),r=(n(356),n(14));t.a=e=>{const{children:t,on_click:n,onkeydown:a,id:s="render-modal-close-button"}=e,i=Object(c.a)(!0,s,27,!1,a?"onkeydown":"onkeyup",!0);return Object(r.jsx)("section",{className:"Modal aparecer",children:Object(r.jsx)("div",{id:n?i:"",className:"modalCont3 ConfirmationModal socketNotifyPers","data-close_modal":!0,onClick:n||null,children:t})})}},356:function(e,t,n){},382:function(e,t,n){"use strict";t.a={usd:"USD",bitcoin:"BTC",cop:"COP",bitcoin_testnet:"BTCT"}},437:function(e,t,n){"use strict";n.d(t,"a",(function(){return s}));var c=n(2),r=n(333),a=n(382);function s(){const[e,t]=Object(c.useState)(),[n,s]=Object(c.useState)(!1),[i,o]=Object(c.useState)(""),[l,d]=Object(c.useState)({currency_from:a.a.bitcoin,currency_to:a.a.cop,amount_days:60}),[u,{modelData:b}]=Object(r.a)();return Object(c.useEffect)((()=>{(async()=>{s(!0);const e=await u.fetchChartData({data:l});e&&(o(e.data.pair),t(e),s(!1))})()}),[l]),Object(c.useEffect)((()=>{const e=b.pairs.currentPair;if(e){const t=e.primary_currency.currency.includes("usd")?e.secondary_currency.currency:"usd",n={currency_from:a.a[e.primary_currency.currency],currency_to:a.a[t],amount_days:45};d(n)}}),[b.pairs.currentPair]),[e,n,i]}},569:function(e,t,n){},658:function(e,t,n){"use strict";n.r(t);var c=n(327),r=n(2),a=n(351),s=n(328),i=n(338),o=n(53),l=n(69),d=n(52),u=n(14);const b=Object(o.a)((()=>n.e(11).then(n.bind(null,366))));var j=e=>{const{currentPair:t}=e,[n,c]=Object(r.useState)(),[a,s]=Object(r.useState)("20000"),i=async e=>{let n=await Object(l.b)(t.secondary_currency,e,t.id,t);c(n)};Object(r.useEffect)((()=>{i(a.replace(/,/g,""))}),[t]);let o={fontSize:"16px"};return Object(u.jsxs)("div",{className:"root-content-items-calc",children:[Object(u.jsx)(p,{iconPath:"".concat(Object(d.b)("assets"),"prices-modal/ic_cop.svg"),type:"text",useCustomInput:!0,value:a,onChange:e=>{const t=String(e.target.value).replace(/,/g,"")||"0";if(isNaN(t)||"NaN"===t)return e.preventDefault();s(t),i(t)},autoComplete:"off",className:"numberFont",style:o}),Object(u.jsx)("div",{className:"exchange-arrows",style:{backgroundImage:"url(".concat(Object(d.b)("assets"),"prices-modal/ellipse.svg)")},children:Object(u.jsx)("img",{src:"".concat(Object(d.b)("assets"),"prices-modal/exchange_arrows.png"),style:{margin:"0.5em 1em"},alt:""})}),Object(u.jsx)(p,{iconPath:"".concat(Object(d.b)("assets"),"prices-modal/coin_assets/").concat(t.primary_currency.currency,".svg"),type:"text",defaultValue:n&&n.want_to_spend,readOnly:!0,className:"numberFont",style:o})]})};function p(e){let{iconPath:t,useCustomInput:n,...c}=e;return Object(u.jsxs)("div",{className:"item-content-calc-number",children:[Object(u.jsx)("img",{src:t,alt:""}),n?Object(u.jsx)(b,{...c}):Object(u.jsx)("input",{...c})]})}n(569);var h=n(437),m=n(11),O=n(1),f=n(430);var y=function(e){const[t,n]=Object(r.useState)([]),[c,,a]=Object(h.a)(),s=()=>{let n=e.height<1366?{chart:{height:e.height/2.4}}:{};n=e.width<900?{chart:{height:e.height/1.7}}:{};const c=window.Highcharts;if(!c)return;c.setOptions(O.R);const r=c.stockChart("chart",{navigator:{enabled:!1},title:{text:""},series:[{name:a,data:t,color:"#04D499",tooltip:{valueDecimals:2}}],rangeSelector:{selected:1,inputEnabled:!0,inputEditDateFormat:"%d/%m/%Y",inputDateParser:function(e){e=e.split("/");return new Date(+e[2],e[1]-1,+e[0]).getTime()},buttons:[{type:"week",count:1,text:"1s"},{type:"month",count:1,text:"1m"},{type:"all",text:"Todo"}]},...n});r&&(t.length>0?r.hideLoading():r.showLoading())};return Object(r.useEffect)((()=>{const e=Object(d.b)("highstock");Object(f.a)(s,e,"highstock")}),[t,e.width,e.height]),Object(r.useEffect)((()=>{(async()=>{if(!c)return;const e=[];c.data.historical_data.forEach((t=>{const n=new Date(1e3*t.date).getTime();Number.isNaN(n)||e.push([n,t.close_price])})),n(e)})()}),[c]),Object(r.useEffect)((()=>{setTimeout((()=>{Object(m.setInputFilter)(document.getElementsByName("min")[0],(function(e){return/^\d{0,2}?[/]?\d{0,2}?[/]?\d{0,4}?$/.test(e)}))}),500)}),[t]),Object(u.jsx)("div",{id:"chart"})};function x(){const{innerWidth:e,innerHeight:t}=window;return{width:e,height:t}}var g=n(382);const v=(e,t)=>{const[n,c]=Object(r.useState)(e),[a]=Object(r.useState)(t),s=async(e,t)=>{let n=Object(l.c)(e,t);c(n.toFormat())};return Object(r.useEffect)((()=>{n&&a&&s(n,a)}),[]),[n,s]};var _=function(e){const[t,n]=Object(r.useState)(g.a.bitcoin),[c,a]=v(e.buy_price,e.secondary_currency),[s,i]=v(e.sell_price,e.secondary_currency);return Object(r.useEffect)((()=>{e&&(a(e.buy_price,e.secondary_currency),i(e.sell_price,e.secondary_currency),n(g.a[e.primary_currency.currency]))}),[e]),[t,c,s]};const w=["BTC/COP","BTC/USD","BTC/"];function N(e){const[t,n,c]=function(){const[e,t]=Object(r.useState)(x());return Object(r.useEffect)((()=>{function e(){t(x())}return window.addEventListener("resize",Object(m.debounce)(e,500)),()=>window.removeEventListener("resize",e)}),[]),[e.width>900,e.width,e.height]}(),[a,s]=Object(r.useState)(!1),i=Object(r.useRef)(),o=Object(r.useRef)(),{currentPair:l,pairs:b}=e;return Object(r.useEffect)((()=>{window.requestAnimationFrame((()=>{i.current&&o.current&&(i.current.style.display=a?"block":"none",o.current.style.bottom=a?"70vh":"-1000px")}))}),[a]),b&&l?Object(u.jsxs)("div",{style:{overflow:"hidden",height:"100%"},children:[Object(u.jsx)("div",{ref:i,onClick:()=>s(!1),id:"overlay"}),Object(u.jsx)("div",{className:"prices-main-container",style:{height:"100%"},children:Object(u.jsxs)("div",{className:"base-container",children:[Object(u.jsxs)("div",{className:"chart-container",children:[Object(u.jsxs)("div",{className:"cta-pair",children:[Object(u.jsxs)("div",{className:"",onClick:t?()=>null:()=>s(!0),children:[Object(u.jsx)("img",{src:"".concat(Object(d.b)("assets"),"prices-modal/coin_assets/").concat(l.primary_currency.currency,".svg"),alt:""}),Object(u.jsx)("label",{className:"exchange-label",children:l.buy_pair}),!t&&Object(u.jsx)("img",{style:{transform:"rotate(".concat(a?-90:90,"deg)")},className:"arrow-down",src:"".concat(Object(d.b)("assets"),"prices-modal/ic_arrow_right_desabled.svg"),alt:""})]}),Object(u.jsx)(k,{currentPair:l})]}),Object(u.jsx)("div",{className:"fill"}),Object(u.jsx)(y,{currentPair:l,height:c,width:n})]}),Object(u.jsxs)("div",{className:"pair-list-container",children:[t&&Object(u.jsx)(P,{...e}),Object(u.jsx)(j,{currentPair:l})]})]})}),!t&&Object(u.jsx)(P,{setShowSelect:s,selectRef:o,...e})]}):null}const k=e=>{let{currentPair:t}=e;const[n,c,r]=_(t);return Object(u.jsxs)("div",{className:"pair-prices",children:[Object(u.jsxs)("div",{className:"price-container sell",children:[Object(u.jsxs)("p",{className:"font price",children:["Te compramos ",n," a"]}),Object(u.jsx)("p",{className:"numberFont amount_price",children:r})]}),Object(u.jsxs)("div",{className:"price-container buy",children:[Object(u.jsxs)("p",{className:"font price",children:["Te vendemos ",n," a"]}),Object(u.jsx)("p",{className:"numberFont amount_price",children:c})]})]})},C=(e,t)=>e.buy_pair.includes(w)||e.buy_pair>t.buy_pair?1:t.buy_pair>e.buy_pair?-1:0,P=e=>{let{pairs:t,currentPair:n,changePair:c,selectRef:r,setShowSelect:a}=e;return Object(u.jsx)("div",{ref:r,className:"pair-list",children:t.sort(C).map(((e,t)=>{const r=n.id===e.id,s="\n          base-horizontal-container base-item-content\n          ".concat(r?"item-content-active":"","\n          ");return Object(u.jsxs)("div",{className:s,onClick:t=>{c(e.buy_pair,"pair"),a&&a(!1)},children:[Object(u.jsx)("img",{className:"".concat(r?"img-enable":"img-disable"),src:"".concat(Object(d.b)("assets"),"prices-modal/coin_assets/").concat(e.primary_currency.currency,".svg"),alt:""}),Object(u.jsxs)("div",{className:"base-item-text-cont",children:[Object(u.jsx)("h2",{className:"font",children:e.primary_currency.currency}),Object(u.jsx)("p",{className:"numberFont",children:e.buy_pair})]}),Object(u.jsx)("img",{style:r?{}:{opacity:"0.5"},src:"".concat(Object(d.b)("assets"),"prices-modal/").concat(r?"ic_select":"ic_arrow_right_desabled",".svg"),alt:""})]},t)}))})};var S,z=n(333),E=n(336);const D=s.b.div(S||(S=Object(c.a)(["\n  width: 90%;\n  height: 90%;\n  background: white;\n  position: relative;\n  border-radius: 6px;\n  @media "," {\n    width: 100%;\n    height: 100%;\n    position: absolute;\n  }\n"])),O.T.tabletL);t.default=()=>{const e=Object(i.a)(),[,t]=Object(z.a)(),n=t.modelData.pairs.currentPair,c=t.modelData.pairs.local_collections;return Object(u.jsx)(a.a,{on_click:t=>{(!t||t.target.dataset&&t.target.dataset.close_modal)&&e.renderModal(null)},children:Object(u.jsxs)(D,{children:[Object(u.jsx)(E.g,{theme:"dark",size:20}),Object(u.jsx)(N,{changePair:e.searchCurrentPairAction,currentPair:n,pairs:c})]})})}}}]);
//# sourceMappingURL=26.eb8150f9.chunk.js.map