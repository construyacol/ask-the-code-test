(window.webpackJsonp=window.webpackJsonp||[]).push([[48],{463:function(n,e,t){"use strict";e.a={usd:"USD",bitcoin:"BTC",cop:"COP",bitcoin_testnet:"BTCT"}},843:function(n,e,t){"use strict";t.r(e);var a=t(351),r=t(5),i=t.n(r),l=t(352),o=t(463);function c(){var n=Object(a.a)(["\n  height: 30px;\n  width: 2px;\n  margin: 0 4em;\n  background-color: #ffffff;\n  border-radius: 4px;\n  transform: rotate(10deg);\n  @media (max-width: 900px) {\n    height: 25px;\n    width: 1px;\n    transform: rotate(0deg);\n  }\n  @media (max-width: 370px) {\n    margin: 0 1.5em;\n  }\n"]);return c=function(){return n},n}function f(){var n=Object(a.a)(["\n  display: flex;\n  justify-content: center;\n  flex-direction: row;\n  height: 9%;\n  min-width: 230px;\n  color: rgba(255, 255, 255, 1);\n  align-items: center;\n  font-size: 8px;\n  position: absolute;\n  left: 50%;\n  transform: translateX(-50%);\n  width: auto;\n  min-width: 430px;\n  z-index: 2;\n"]);return f=function(){return n},n}function s(){var n=Object(a.a)(['\n  display: flex;\n  font-family: "Raleway";\n  && .root-content-numbers {\n    font-weight: bold;\n    font-size: 21px;\n    font-family: Tomorrow;\n    font-display: swap;\n  }\n  && label {\n    text-align: center;\n    letter-spacing: 4px;\n    font-size: 10px;\n    line-height: 26px;\n  }\n  && .strong {\n    font-weight: bold;\n    color: #ffffff;\n    font-family: "Raleway";\n  }\n  @media (max-width: 900px) {\n    transform: scale(1.2);\n    left: 0;\n    right: 0;\n    && label {\n      letter-spacing: 0px;\n      font-size: 9px;\n      line-height: 18px;\n    }\n    && .root-content-numbers {\n      font-size: 15px;\n      letter-spacing: -1;\n    }\n  }\n  @media (min-width: 481px) and (max-width: 767px) {\n    && label {\n      letter-spacing: 0px;\n      font-size: 9px;\n      line-height: 18px;\n    }\n    && .root-content-numbers {\n      font-size: 15px;\n      letter-spacing: -1;\n    }\n  }\n  @media (max-width: 320px) {\n    left: 22%;\n    transform: scale(1.1);\n  }\n']);return s=function(){return n},n}var p=function(n){var e=n.change,t=n.price,a=n.type,r=n.currencyLabel;return i.a.createElement(u,null,i.a.createElement("label",null,"TE ","buy"===a?"COMPRAMOS":"VENDEMOS"," ",i.a.createElement("label",{className:"strong"},r)," A",i.a.createElement("br",null),i.a.createElement("label",{className:"root-content-numbers",style:e?{color:"#1FE47B"}:{}},"$",t)))},u=l.b.div(s()),m=l.b.div(f()),d=l.b.div(c());e.default=function(n){var e=n.change,t=n.data,a=t.currencyLabel,r=t.buyPrice,l=t.sellPrice;return a=o.a[a],i.a.createElement(m,null,i.a.createElement(p,{change:e,price:l,type:"sell",currencyLabel:a}),i.a.createElement(d,null),i.a.createElement(p,{change:e,price:r,type:"buy",currencyLabel:a}))}}}]);
//# sourceMappingURL=48.5ebfa464.chunk.js.map