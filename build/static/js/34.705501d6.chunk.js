(this["webpackJsonpcoinsenda-app"]=this["webpackJsonpcoinsenda-app"]||[]).push([[34],{451:function(e,t,s){"use strict";s.d(t,"b",(function(){return d})),s.d(t,"c",(function(){return u})),s.d(t,"a",(function(){return m})),s.d(t,"d",(function(){return j}));var a=s(2),c=s(4),n=s(14),i=s(61),o=s(21),l=(s(43),s(473),s(1));const r=Object(c.a)((()=>Promise.resolve().then(s.bind(null,30)))),{CountryUrl:p}=(Object(c.a)((()=>s.e(69).then(s.bind(null,534)))),o.a),d=e=>{const{clase:t,disabled:s,address:a,focusAction:c,status:n,addressVerify:i,unFocusAction:o,state_item:p,autoFocus:d}=e;return Object(l.jsxs)("div",{className:"".concat(t||"containerInputComponent"),children:[Object(l.jsx)("p",{className:"labelText fuente",style:{display:e.label?"initial":"none"},children:e.label}),Object(l.jsxs)("div",{className:"inputContainer ".concat(e.active?"inputActivado":""," ").concat(p),children:[Object(l.jsx)("input",{className:"inputElement ".concat(e.active?"inputActivado":""," ").concat(i),type:e.type,placeholder:e.placeholder,onChange:e.actualizarEstado,onFocus:c,onBlur:o,name:e.name,value:e.value,onKeyPress:"account_number"===e.name?e.handleKeyPress:null,disabled:s,autoFocus:d,autoComplete:"off"}),a&&Object(l.jsx)("div",{className:"contIconAddress",children:Object(l.jsx)(r,{icon:"Verify"===i?"verify":"wallet",color:"Verify"===i?"#4caf50":"gray",size:25})})]}),("number"===e.type||"password"===e.type)&&Object(l.jsx)("p",{className:"statusInput",children:n})]})},u=e=>{const{clase:t,label:s,active:a,type:c,placeholder:n,actualizarEstado:o,name:r,value:p,handleKeyPress:d,status:u,verifying:m,error:h,handleFocus:j,handleBlur:b,disabled:x}=e;return Object(l.jsxs)("div",{className:"".concat(t||"containerInputComponent AuthInputComp"),children:[Object(l.jsx)("p",{className:"labelText fuente",style:{display:s?"initial":"none"},children:s}),Object(l.jsx)("div",{className:"inputContainer inputAuths",style:{border:m&&!a?"1px solid #039aff":a?"1px solid #59b200":h?"1px solid red":"1px solid #50667a61"},children:m?Object(l.jsx)("div",{className:"AuthLoader",children:Object(l.jsx)(i.SimpleLoader,{})}):Object(l.jsx)("input",{className:"inputElement TwoFactorTypo fuente2",style:{color:a?"#59b200":"gray"},type:c,placeholder:n,onChange:o,name:r,defaultValue:p,onKeyPress:"account_number"===r?d:null,onFocus:j||null,onBlur:b||null,disabled:x,autoFocus:!0})}),Object(l.jsxs)("p",{className:"statusInput fuente",style:{color:m&&!a?"#039aff":a?"#59b200":h?"red":"#50667a61"},children:[Object(l.jsx)("i",{className:"fas fa-check",style:{display:a?"initial":"none"}}),u]})]})};a.Component;class m extends a.Component{constructor(){super(...arguments),this.state={placeHolder:(window.innerWidth>768&&this.props.classNames,"0"),finalValue:""}}componentDidMount(){const{value:e,service:t}=this.props;this.setState({finalValue:e?t(e):this.state.placeHolder})}componentWillReceiveProps(e){const{value:t}=e;t?this.setState({finalValue:Object(n.number_format)(t)}):this.setState({finalValue:this.state.placeHolder})}render(){const{actualizar:e,handleKeyPress:t,value:s,name:a,autoFocus:c,classNames:n,minAmountLabel:i}=this.props,{finalValue:o}=this.state,r={fontSize:o.length<8?"50px":o.length<12?"40px":"30px"};return console.log("finalValue ==> ",s),Object(l.jsxs)("div",{className:"containerInputComponent with-adapt ".concat(n||""),children:[Object(l.jsx)("input",{className:"inp2_ inputElement2 signoPesos fuente2 width-adapt-child",type:"text",style:r,placeholder:"$ ".concat(this.state.placeHolder),onChange:e,name:a,autoFocus:c,value:s?"$ ".concat(o):"",onKeyPress:t}),i&&s&&Object(l.jsx)("p",{className:"__minAmountLabel fuente2",children:i})]})}}const h=e=>{const{toggleSection:t,search_result:s,open:a,update:c,clean_search_result:n,autoFocus:i}=e;return Object(l.jsxs)("div",{className:"PhoneamEsta ".concat(a?"openS":""),onClick:a?null:t,children:[Object(l.jsxs)("div",{className:"inputPhone",children:[s&&Object(l.jsx)("img",{src:"".concat(p).concat(s.flag),alt:"",className:"PhoneamEsta_img",width:20,height:20}),Object(l.jsxs)("p",{className:"fuentePrin PhoneamEsta_p",children:["+ ",s?s.prefix[0]:"--"]}),Object(l.jsx)("div",{className:"inputComponentPhone ".concat(a?"openS":""," ").concat(s?"search_result":""),children:s?Object(l.jsxs)("p",{className:"search_result_kyc ".concat(a?"openS":""),children:[s.name,Object(l.jsx)("i",{className:"fas fa-times cerratelo",onClick:n})]}):Object(l.jsx)("input",{type:"text",className:"inputElement3",autoFocus:i,placeholder:"Escribe el pa\xeds del indicativo.",onChange:c,name:"country_prefix"})})]}),Object(l.jsx)("i",{className:"fas fa-chevron-down PhoneamEsta_icon ".concat(a?"anim":""),onClick:t}),Object(l.jsx)("span",{className:"linePhone"})]})},j=e=>{const{kyc:t,update:s,handleSubmit:a,state:c,step:n,toggleSection:i,_onFocus:o,search_results:r,clean_search_result:p}=e;let d=Array.isArray(r)&&r[0];return Object(l.jsxs)("div",{id:"kycPrime",className:"containerInputComponent2 ".concat(c.open_sect?"openS":""),children:[Object(l.jsx)("div",{className:"inputLabelsCont",children:Object(l.jsx)("div",{className:"InputCarous",style:{top:"-".concat(40*(n-1),"px")},children:t.map((e=>Object(l.jsx)("p",{className:"labelText2 fuente",children:e.label},e.id)))})}),Object(l.jsxs)("div",{className:"inputContainer3 ".concat(c.active?"inputActivado":""),children:[t.map((t=>{let i={};"date"===c.ui_type&&(console.log("|||||||||||| isDateInput ====> ",c),i={min:"1940-01-01",max:"2003-12-12",pattern:/\d{4}-\d{2}-\d{2}/,autoFocus:!0});const r="inputElement3 ".concat(c.active?"inputActivado":""," ").concat("phone"===c.ui_type?"phone":"");return n===t.id&&Object(l.jsxs)("form",{onSubmit:a,id:"".concat("phone"===c.ui_type?"phone":""),children:["phone"===c.ui_type&&Object(l.jsx)(h,{open:c.open_sect,autoFocus:!0,search_result:d,...e}),d&&"select"===c.ui_type?Object(l.jsxs)("p",{className:"search_result_kyc openS",children:[d.name,Object(l.jsx)("i",{className:"fas fa-times cerratelo",onClick:p})]}):Object(l.jsx)("input",{autoFocus:!0,className:r,type:"phone"===c.ui_type||"select"===c.ui_type?"text":c.ui_type,placeholder:c.data_state[t.name]?c.data_state[t.name]:t.placeholder,onChange:s,name:t.name,value:c.data_state[t.name],onFocus:o,...i},t.id)]},t.id)})),Object(l.jsx)("div",{className:"InputProgressBar",children:Object(l.jsx)("div",{className:"InputProgressed",style:{width:n<2?0:"".concat(100*n/t.length,"%")}})}),Object(l.jsx)("div",{className:"ctaInputKyc ".concat(c.open_sect?"openPhone":""),onClick:c.open_sect?i:a,children:Object(l.jsxs)("div",{className:"contCtaKyc",children:[Object(l.jsx)("i",{className:"fas fa-arrow-right arrowcito backInputKyc"}),Object(l.jsx)("i",{className:" ".concat("phone"===c.ui_type?"fas fa-mobile-alt":"fas fa-check"," frontInputKyc")})]})})]}),Object(l.jsxs)("div",{className:"InputContainerT",children:[Object(l.jsx)("p",{className:"fuente Inputmsg",style:{color:"".concat(c.colorMessage)},children:c.message}),Object(l.jsxs)("p",{className:"fuente2 InputStep",children:[n,"/",t.length]})]})]})};t.e=d},473:function(e,t,s){},569:function(e,t,s){"use strict";var a=s(2),c=s(570),n=s(451),i=s(89),o=s(9),l=s(50),r=s(24),p=s(19),d=s(61),u=s(66),m=s(14),h=(s(241),s(1));class j extends a.Component{constructor(){super(...arguments),this.state={placeholder:"coins"===this.props.type?"ej: Bitcoin":"ej: Bancolombia",selected:this.props.selected,coincidencia:"",items:this.props.items},this.load_items=async e=>{let t;"coins"===e&&(t=this.props.coins?this.props.coins:await this.props.coinsendaServices.fetchAllCurrencies()),"banks"===e&&(t=l.a),"remittance"===e&&(t=l.h),this.setState({items:t})},this.buscarResultados=e=>{this.buscarItemStore(e);let t={name:"",code:""};this.props.search.length<2&&this.state.items.filter((s=>{let a=e.toLowerCase();return!!s.name.toLowerCase().includes(a)&&(this.setState({selected:!0,coincidencia:s.name.toLowerCase()}),t=s)}));const{current:s}=this.props,a={target:{name:"wallets"===s?"currency":"bank"===s?"bank_name":"deposit_service",value:t.name.toLowerCase(),short_name:t.code.toLowerCase()}};this.props.actualizarEstado(a)},this.actualizar=e=>{const t=e.target.value;Object(m.debounce)(this.buscarResultados,250)(t)},this.buscarItemStore=(e,t)=>{this.props.action.Search(e,this.props.current,this.state.items,t),this.props.update_control_form(e)},this.seleccionarItem=(e,t)=>{this.setState({coincidencia:e,selected:!0});const{current:s}=this.props,a={target:{name:"wallets"===s?"currency":"bank"===s||"withdraw"===s?"bank_name":"deposit_service",value:e,short_name:t}};this.buscarItemStore(e,!0),this.props.actualizarEstado(a)},this.close=()=>(this.props.clearItem&&this.props.clearItem(),this.setState({selected:!1,placeholder:"coins"===this.props.type?"ej: Bitcoin":"ej: Bancolombia"}),this.buscarItemStore(""))}componentDidMount(){const{items:e}=this.state;if(e)return!1;this.load_items(this.props.type)}render(){const{search:e,buttonActive:t,itemSelect:s,label:o}=this.props,{items:l}=this.state;return Object(h.jsxs)("section",{className:"ItemSelectionContainers",id:"itemSelect",children:[this.state.selected?Object(h.jsx)(i.j,{close:this.close,label:o,active:s||e.length,value:s||e.length&&e[0].currency,children:this.state.coincidencia||s||e.length&&e[0].currency}):Object(h.jsx)(n.e,{type:"text",autoFocus:this.props.autoFocus,label:o,placeholder:this.state.placeholder,name:"currency",actualizarEstado:this.actualizar,active:t}),Object(h.jsx)("div",{className:"ItemSelectionContainer",children:this.state.items?Object(h.jsx)("div",{className:"containerItems",children:e.length>0?e.length<2?e.map((e=>Object(a.createElement)(c.a,{itemType:this.props.type,actualizarEstado:this.seleccionarItem,actives:!0,...e,key:e.id,format:this.props.format}))):e.map((e=>Object(a.createElement)(c.a,{actualizarEstado:this.seleccionarItem,...e,key:e.id,format:this.props.format}))):l.map((e=>Object(a.createElement)(c.a,{actualizarEstado:this.seleccionarItem,...e,key:e.id,format:this.props.format})))}):Object(h.jsx)(d.default,{})})]})}}t.a=Object(o.b)((function(e,t){const{form_control_deposit:s,form_deposit:a,current:c,search_coin:n,search_bank:i,form_wallet:o,form_bank:l,form_control_wallet:r,form_control_bank:p,search_deposit:d}=e.form,{currencies:u}=e.modelData;return{search:"wallets"===c?n:"bank"===c||"withdraw"===c?i:d,form:"wallets"===c?o:"bank"===c||"withdraw"===c?l:a,buttonActive:"wallets"===c?r:"bank"===c||"withdraw"===c?p:s,selected:"wallets"===c?1===n.length:"bank"===c||"withdraw"===c?1===i.length:1===d.length,current:c,coins:u}}),(function(e){return{action:Object(p.bindActionCreators)(r.a,e)}}))(Object(u.a)(j))},570:function(e,t,s){"use strict";var a=s(2),c=s(4),n=s(21),i=(s(241),s(1));const o=Object(c.a)((()=>Promise.resolve().then(s.bind(null,30))));t.a=function(e){const t=()=>{const{name:t,code:s,currency_type:a,pair_id:c,actualizarEstado:n}=e;n&&n(t,s,a,c)};Object(a.useEffect)((()=>{e.actives&&t()}),[e.actives]);const{type:s,actives:c,name:l,code:r,placeholder:p,primarySelect:d,format:u,itemType:m}=e;return console.log("|||||||||||||||  ItemLayout ==> ",s),Object(i.jsxs)("div",{id:"".concat(d?"primarySelect":""),className:"".concat("payment_method"===s?"ILtuvieja":""," "),children:[Object(i.jsxs)("div",{className:"item ".concat(c?"itemSelection":""),onClick:c&&"banks"!==m?null:t,children:[u?Object(i.jsx)(o,{icon:r,size:45}):"coins"===s||"payment_method"===s||"service_mode"===s?c?Object(i.jsxs)("div",{title:l,id:r,children:["bank"===s&&Object(i.jsx)("img",{className:"itemSobre activaos",src:"".concat(Object(n.b)("assets"),"coins/").concat(r,".png"),alt:"",width:"60"}),Object(i.jsx)("img",{className:"itemSobre activaos",src:"".concat(Object(n.b)("assets")).concat(s,"/").concat(r,"2.png"),alt:"",width:"60"})]}):Object(i.jsxs)("div",{title:l,id:r,children:[Object(i.jsx)("img",{className:"itemFuera",src:"".concat(Object(n.b)("assets")).concat(s,"/").concat(r,".png"),width:"60",alt:"",id:r,title:l}),Object(i.jsx)("img",{className:"itemSobre",src:"".concat(Object(n.b)("assets")).concat(s,"/").concat(r,"2.png"),width:"60",alt:"",id:r,title:l})]}):Object(i.jsx)("img",{className:"banquis ".concat(c?"itemVisible":""),src:"".concat(Object(n.b)("assets")).concat(s,"/").concat(r,".png"),alt:"",id:r,title:l,width:"85"}),d?Object(i.jsxs)("div",{id:"primarySelectText",className:"primarySelectText",children:[Object(i.jsx)("p",{title:l,children:l}),p&&p.map((e=>Object(i.jsx)("p",{id:"ILplaceholder2",className:"fuente",children:e.name},e.id)))]}):Object(i.jsx)("p",{title:l,children:l})]}),p&&!d&&Object(i.jsx)("div",{className:"placeHoldCont",children:p.map((e=>Object(i.jsx)("p",{className:"ILplaceholder fuente",children:e.name},e.id)))})]})}}}]);
//# sourceMappingURL=34.705501d6.chunk.js.map