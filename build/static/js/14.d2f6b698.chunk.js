(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{504:function(e,t,n){"use strict";n.r(t),n.d(t,"default",function(){return o});var a=n(15),r=n(44),u=n(5),c=n.n(u),i=function(e){var t=function(e){return e?e.replace(/,/g,""):""}(e).split(".");return t[0]=t[0].replace(/\B(?=(\d{3})+(?!\d))/g,","),t.join(".")};function o(e){var t=Object(u.useRef)(),n=Object(u.useState)(i(e.value)||""),o=Object(r.a)(n,2),l=o[0],f=o[1],s=Object(u.useState)([0,0]),v=Object(r.a)(s,2),g=v[0],p=v[1],b=function(t){var n=String(t.target.value);if(/^[\d,]{0,30}([.])?([\d]{1,8})?$/.test(n)){var a=t.target.selectionEnd||0,r=n||"";r=i(r),e.onChange&&e.onChange(t),d(r,n,a)}},d=function(e,t,n){var a=t.length-n,r=Math.max(e.length-a,0);f(e),p([r,r])};return Object(u.useEffect)(function(){var e;t.current&&(e=t.current).setSelectionRange.apply(e,Object(a.a)(g))},[g]),Object(u.useEffect)(function(){e.value===e.max_available&&b({target:{value:e.value}})},[e.value]),c.a.createElement("input",Object.assign({ref:t},e,{value:l,onChange:b,onKeyDown:function(e){if(188===e.keyCode||"Comma"===e.key)return e.preventDefault();if(8===e.keyCode||"Backspace"===e.key){var t=e.currentTarget.value,n=e.currentTarget.selectionStart||0,a=Math.max(n-1,0);t[a]&&t[a].includes(",")&&(d(t,t,a),e.preventDefault())}}}))}}}]);
//# sourceMappingURL=14.d2f6b698.chunk.js.map