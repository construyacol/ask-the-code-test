(this["webpackJsonpcoinsenda-app"]=this["webpackJsonpcoinsenda-app"]||[]).push([[37],{339:function(e,t,s){"use strict";s.d(t,"c",(function(){return p})),s.d(t,"d",(function(){return h})),s.d(t,"b",(function(){return m})),s.d(t,"e",(function(){return b})),s.d(t,"a",(function(){return x}));var a=s(2),c=s(53),n=s(11),i=s(332),o=s(15),r=s(330),l=(s(353),s(14));const d=Object(c.a)((()=>Promise.resolve().then(s.bind(null,331)))),{CountryUrl:u}=(Object(c.a)((()=>s.e(25).then(s.bind(null,372)))),o.a),p=e=>{const{clase:t,disabled:s,address:a,focusAction:c,status:n,addressVerify:i,unFocusAction:o,state_item:r,autoFocus:u}=e;return Object(l.jsxs)("div",{className:"".concat(t||"containerInputComponent"),children:[Object(l.jsx)("p",{className:"labelText fuente",style:{display:e.label?"initial":"none"},children:e.label}),Object(l.jsxs)("div",{className:"inputContainer ".concat(e.active?"inputActivado":""," ").concat(r),children:[Object(l.jsx)("input",{className:"inputElement ".concat(e.active?"inputActivado":""," ").concat(i),type:e.type,placeholder:e.placeholder,onChange:e.actualizarEstado,onFocus:c,onBlur:o,name:e.name,value:e.value,onKeyPress:"account_number"===e.name?e.handleKeyPress:null,disabled:s,autoFocus:u,autoComplete:"off"}),a&&Object(l.jsx)("div",{className:"contIconAddress",children:Object(l.jsx)(d,{icon:"Verify"===i?"verify":"wallet",color:"Verify"===i?"#4caf50":"gray",size:25})})]}),("number"===e.type||"password"===e.type)&&Object(l.jsx)("p",{className:"statusInput",children:n})]})},h=e=>{const{clase:t,label:s,active:a,type:c,placeholder:n,actualizarEstado:o,name:r,value:d,handleKeyPress:u,status:p,verifying:h,error:m,handleFocus:j,handleBlur:b,disabled:x}=e;return Object(l.jsxs)("div",{className:"".concat(t||"containerInputComponent AuthInputComp"),children:[Object(l.jsx)("p",{className:"labelText fuente",style:{display:s?"initial":"none"},children:s}),Object(l.jsx)("div",{className:"inputContainer inputAuths",style:{border:h&&!a?"1px solid #039aff":a?"1px solid #59b200":m?"1px solid red":"1px solid #50667a61"},children:h?Object(l.jsx)("div",{className:"AuthLoader",children:Object(l.jsx)(i.SimpleLoader,{})}):Object(l.jsx)("input",{className:"inputElement TwoFactorTypo fuente2",style:{color:a?"#59b200":"gray"},type:c,placeholder:n,onChange:o,name:r,defaultValue:d,onKeyPress:"account_number"===r?u:null,onFocus:j||null,onBlur:b||null,disabled:x,autoFocus:!0})}),Object(l.jsxs)("p",{className:"statusInput fuente",style:{color:h&&!a?"#039aff":a?"#59b200":m?"red":"#50667a61"},children:[Object(l.jsx)("i",{className:"fas fa-check",style:{display:a?"initial":"none"}}),p]})]})};a.Component;class m extends a.Component{constructor(){super(...arguments),this.state={placeHolder:window.innerWidth>768?"Escribe la cantidad":"Cantidad",finalValue:""}}componentDidMount(){this.setState({finalValue:this.state.placeHolder})}componentWillReceiveProps(e){const{value:t}=e;t?this.setState({finalValue:Object(n.number_format)(t)}):this.setState({finalValue:this.state.placeHolder})}render(){const{actualizar:e,handleKeyPress:t,value:s,name:a,autoFocus:c}=this.props,{finalValue:n}=this.state,i={fontSize:n.length<10?"90px":n.length<15?"60px":"40px"};return Object(l.jsx)("div",{className:"containerInputComponent with-adapt",children:Object(l.jsx)("input",{className:"inputElement2 signoPesos fuente2 width-adapt-child",type:"text",style:i,placeholder:"$ ".concat(n),onChange:e,name:a,autoFocus:c,value:s?"$ ".concat(n):"",onKeyPress:t})})}}const j=e=>{const{toggleSection:t,search_result:s,open:a,update:c,clean_search_result:n,autoFocus:i}=e;return Object(l.jsxs)("div",{className:"PhoneamEsta ".concat(a?"openS":""),onClick:a?null:t,children:[Object(l.jsxs)("div",{className:"inputPhone",children:[s&&Object(l.jsx)("img",{src:"".concat(u).concat(s.flag),alt:"",className:"PhoneamEsta_img",width:20,height:20}),Object(l.jsxs)("p",{className:"fuentePrin PhoneamEsta_p",children:["+ ",s?s.prefix[0]:"--"]}),Object(l.jsx)("div",{className:"inputComponentPhone ".concat(a?"openS":""," ").concat(s?"search_result":""),children:s?Object(l.jsxs)("p",{className:"search_result_kyc ".concat(a?"openS":""),children:[s.name,Object(l.jsx)("i",{className:"fas fa-times cerratelo",onClick:n})]}):Object(l.jsx)("input",{type:"text",className:"inputElement3",autoFocus:i,placeholder:"Escribe el pa\xeds del indicativo.",onChange:c,name:"country_prefix"})})]}),Object(l.jsx)("i",{className:"fas fa-chevron-down PhoneamEsta_icon ".concat(a?"anim":""),onClick:t}),Object(l.jsx)("span",{className:"linePhone"})]})},b=e=>{const{kyc:t,update:s,handleSubmit:a,state:c,step:n,toggleSection:i,_onFocus:o,search_results:r,clean_search_result:d}=e;let u=Array.isArray(r)&&r[0];return Object(l.jsxs)("div",{id:"kycPrime",className:"containerInputComponent2 ".concat(c.open_sect?"openS":""),children:[Object(l.jsx)("div",{className:"inputLabelsCont",children:Object(l.jsx)("div",{className:"InputCarous",style:{top:"-".concat(40*(n-1),"px")},children:t.map((e=>Object(l.jsx)("p",{className:"labelText2 fuente",children:e.label},e.id)))})}),Object(l.jsxs)("div",{className:"inputContainer3 ".concat(c.active?"inputActivado":""),children:[t.map((t=>{let i={};"date"===c.ui_type&&(console.log("|||||||||||| isDateInput ====> ",c),i={min:"1940-01-01",max:"2003-12-12",pattern:/\d{4}-\d{2}-\d{2}/,autoFocus:!0});const r="inputElement3 ".concat(c.active?"inputActivado":""," ").concat("phone"===c.ui_type?"phone":"");return n===t.id&&Object(l.jsxs)("form",{onSubmit:a,id:"".concat("phone"===c.ui_type?"phone":""),children:["phone"===c.ui_type&&Object(l.jsx)(j,{open:c.open_sect,autoFocus:!0,search_result:u,...e}),u&&"select"===c.ui_type?Object(l.jsxs)("p",{className:"search_result_kyc openS",children:[u.name,Object(l.jsx)("i",{className:"fas fa-times cerratelo",onClick:d})]}):Object(l.jsx)("input",{autoFocus:!0,className:r,type:"phone"===c.ui_type||"select"===c.ui_type?"text":c.ui_type,placeholder:c.data_state[t.name]?c.data_state[t.name]:t.placeholder,onChange:s,name:t.name,value:c.data_state[t.name],onFocus:o,...i},t.id)]},t.id)})),Object(l.jsx)("div",{className:"InputProgressBar",children:Object(l.jsx)("div",{className:"InputProgressed",style:{width:n<2?0:"".concat(100*n/t.length,"%")}})}),Object(l.jsx)("div",{className:"ctaInputKyc ".concat(c.open_sect?"openPhone":""),onClick:c.open_sect?i:a,children:Object(l.jsxs)("div",{className:"contCtaKyc",children:[Object(l.jsx)("i",{className:"fas fa-arrow-right arrowcito backInputKyc"}),Object(l.jsx)("i",{className:" ".concat("phone"===c.ui_type?"fas fa-mobile-alt":"fas fa-check"," frontInputKyc")})]})})]}),Object(l.jsxs)("div",{className:"InputContainerT",children:[Object(l.jsx)("p",{className:"fuente Inputmsg",style:{color:"".concat(c.colorMessage)},children:c.message}),Object(l.jsxs)("p",{className:"fuente2 InputStep",children:[n,"/",t.length]})]})]})},x=e=>{const{handleSubmit:t,update_country:s,country_match:a,reset_data:c,disabled:n,active:o,loader:u}=e,p=Object(r.a)(!0,"id-next-subfix-button",13,!1,"onkeydown");return Object(l.jsxs)("div",{id:"kycPrime",className:"containerInputComponent3",children:[Object(l.jsx)("div",{className:"inputLabelsCont",children:Object(l.jsx)("div",{className:"InputCarous",children:Object(l.jsx)("p",{className:"labelText3 fuente ",children:"Elige el pa\xeds desde el que operar\xe1s"})})}),Object(l.jsxs)("div",{className:"inputContainer3 ".concat(o?"inputActivado":""),children:[u&&Object(l.jsx)("div",{className:"inputCountryLoader",children:Object(l.jsx)(i.SimpleLoader,{loader:2})}),a?Object(l.jsxs)("div",{className:"country_selected",children:[Object(l.jsx)(d,{icon:a.value,size:25}),Object(l.jsx)("p",{className:"fuente",children:a.ui_name}),Object(l.jsx)("i",{className:"fas fa-times cerratelo",onClick:c})]}):Object(l.jsx)("form",{onSubmit:t,children:Object(l.jsx)("input",{className:"inputElement3 ".concat(o?"inputActivado":""),type:"text",placeholder:"Ej: Colombia",onChange:s,name:"country",disabled:n})}),Object(l.jsx)("div",{className:"InputProgressBar countryppp",children:Object(l.jsx)("div",{className:"InputProgressed",style:{width:a?"100%":"0"}})}),Object(l.jsx)("i",{id:p,className:"fas fa-arrow-right arrowcito2 ".concat(a?"aparecer":""),onClick:a?t:null})]}),Object(l.jsx)("div",{className:"InputContainerT"})]})};t.f=p},353:function(e,t,s){},361:function(e,t,s){},363:function(e,t,s){},367:function(e,t,s){"use strict";var a=s(2),c=s(339),n=s(333),i=(s(361),s(14));t.a=e=>{const[t,s]=Object(a.useState)(),[o,r]=Object(a.useState)(),[l,d]=Object(a.useState)(),[u,p]=Object(a.useState)(),[h,m]=Object(a.useState)(),[j,b]=Object(a.useState)(),[x,O]=Object(n.a)(),v=t=>{setTimeout((()=>{e.toggle_anim&&e.toggle_anim(),b(e.toggle_anim&&!0)}),1200),setTimeout((()=>{e.authenticated&&e.authenticated(t)}),1500)},{label:y,handleFocus:f,handleBlur:_,disabled:g}=e;return Object(i.jsx)("div",{id:"authReq",className:"".concat(j?"desaparece":""),children:Object(i.jsx)(c.d,{disabled:g,type:"number",label:y,placeholder:"CODIGO 2FA",name:"auth",actualizarEstado:async t=>{const{value:a}=t.target;if(a.length>5){if(r(!0),s(!1),d("Verificando..."),e.isWithdraw2fa)return v(a);let t;return O.isAppLoading(!0),t=e.isTryToDisable2fa?await x.disableTransactionSecutiry("2fa",a):await x.addNewTransactionSecurity("2fa",a),O.isAppLoading(!1),t?((e,t)=>(s(!0),d("Verificado con \xc9xito"),p(!1),r(!1),m(e),v(t)))(a,t):(d("El c\xf3digo de verificaci\xf3n es incorrecto"),p(!0),r(!1))}d(""),s(!1),r(!1),p(!1)},active:t,verifying:o,value:h,status:l,error:u,handleFocus:f,handleBlur:_})})}},475:function(e,t,s){"use strict";s(2),s(363);var a=s(14);t.a=e=>{const{Anim2:t,color:s}=e;let c={transform:t?"scale(1)":"scale(0)",animationDelay:t?".12s":"",background:"green"===s?"linear-gradient(to right, #11998e, #38ef7d)":"red"===s?"linear-gradient(to right, #ab2f26, #ff1100)":"linear-gradient(to right, #377FD7, #00D2FF)"},n={animationDelay:t?".15s":"",background:"green"===s?"#3be18545":"red"===s?"rgba(255, 17, 0, 0.3)":"#109cd04f"};return Object(a.jsxs)("div",{className:"active_account",title:"Cuenta Habilitada",children:[Object(a.jsx)("div",{className:"bigEgg",style:n}),Object(a.jsx)("div",{className:"egg",style:c})]})}},478:function(e,t,s){"use strict";s(2);var a=s(330),c=(s(354),s(334)),n=s(14);t.a=e=>{const{children:t,title:s,close_modal:i,classes:o}=e,r=Object(a.a)(!0,"close-modal-button-orders",27,!0,"onkeyup",!0),l=e=>{(!e||e.target.dataset&&e.target.dataset.close_modal)&&i&&i()};return Object(n.jsx)("section",{className:"Modal aparecer",children:Object(n.jsx)("div",{id:r,className:"modalCont2 ConfirmationModal","data-close_modal":!0,onClick:l||null,children:Object(n.jsxs)("div",{className:"PairList ".concat("2auth"===o?"auth":o),children:[Object(n.jsx)(c.g,{theme:"dark",size:20}),Object(n.jsx)("div",{className:"PairListtitle",children:Object(n.jsx)("h1",{className:"fuente",children:s})}),t]})})})}},648:function(e){e.exports=JSON.parse('{"a":[{"name":"Colombia","code":"colombia","id":"1"},{"name":"Argentina","code":"argentina","id":"2"},{"name":"Chile","code":"chile","id":"3"},{"name":"brasil","id":"4"},{"name":"Republica Dominicana","code":"republica_dominicana","id":"5"},{"name":"Ecuador","code":"ecuador","id":"6"}]}')},649:function(e){e.exports=JSON.parse('{"a":[{"name":"Pesos Colombanos","code":"cop","id":"1"},{"name":"Pesos Argentinos","code":"ars","id":"2"},{"name":"Pesos Chilenos","code":"clp","id":"3"},{"name":"Uruguay","code":"uyu","id":"4"},{"name":"Peru","code":"pen","id":"5"}]}')},650:function(e,t,s){},682:function(e,t,s){"use strict";s.r(t),s.d(t,"ModalSettingsView",(function(){return S}));var a=s(2),c=s(98),n=s(27),i=s(99),o=s(332),r=s(339),l=s(14);class d extends a.Component{constructor(){super(...arguments),this.state={status:""},this.actualizarEstado=e=>{const{payload:t}=this.props,{value:s}=e.target;return s.length>6&&s!==t?(this.setState({status:""}),this.props.update_state({buttonActive:!0,data:s})):(s.length>6&&s===t&&this.setState({status:"Tu nuevo n\xfamero no puede coincidir con el n\xfamero actual, cambialo."}),this.props.update_state({buttonActive:!1,data:s}))}}render(){const{description:e,placeholder:t,code:s,type:a,buttonActive:c}=this.props,{status:n}=this.state;return Object(l.jsx)(r.f,{type:a,label:e,placeholder:t,name:s,actualizarEstado:this.actualizarEstado,active:c,status:n})}}var u=d;class p extends a.Component{constructor(){super(...arguments),this.state={status:"",pass1:"",pass2:""},this.actualizarEstado=async e=>{const{name:t,value:s}=e.target;await this.setState({[t]:s});const{pass1:a,pass2:c}=this.state;return console.log("actualizarEstado",this.state.status),"pass1"!==t&&c.length===a.length&&c!==a?(await this.props.update_state({buttonActive:!1}),this.setState({status:"Las contrase\xf1as no coinciden"})):"pass1"!==t&&c.length===a.length&&c===a?(await this.props.update_state({buttonActive:!0}),this.setState({status:""})):(this.props.update_state({buttonActive:!1}),this.setState({status:""}))}}render(){const{buttonActive:e}=this.props,{status:t}=this.state;return Object(l.jsxs)(a.Fragment,{children:[Object(l.jsx)(r.f,{type:"password",placeholder:"Escribe la nueva contrase\xf1a",name:"pass1",actualizarEstado:this.actualizarEstado,active:e}),Object(l.jsx)(r.f,{type:"password",placeholder:"Repite la nueva contrase\xf1a",name:"pass2",actualizarEstado:this.actualizarEstado,active:e,status:t})]})}}var h=p,m=s(331),j=s(335),b=s(367),x=s(478),O=s(648),v=s(649),y=s(475);class f extends a.Component{constructor(){super(...arguments),this.itemSelect=()=>{const{item:e}=this.props;this.props.item_selection(e)}}render(){const{noIcon:e,item_active:t,item:s,theme:a,iconType:c}=this.props,{id:n,code:i,name:o,flag:r}=s,d={icon:i,size:40};return Object(l.jsxs)("div",{id:"".concat(n),className:"ItemlistViewart ".concat(parseInt(t)===parseInt(n)?"itemActiveListView":""," ").concat(a),onClick:this.itemSelect,style:{gridTemplateColumns:e?"1fr 90px":"60px 1fr 90px"},children:[!e&&Object(l.jsx)("div",{className:"centerItem",id:"".concat(n),children:"svg"===c?Object(l.jsx)(m.default,{...d}):Object(l.jsx)("img",{src:r,alt:"",width:"30",height:"30"})}),Object(l.jsxs)("span",{id:"".concat(n),className:"fuente span_text_itemView ".concat(a),children:[parseInt(t)===parseInt(n)&&Object(l.jsx)("img",{src:r,alt:"",width:"25",height:"25",style:{display:c?"block":"none"}}),o]}),"ultimate"===a&&Object(l.jsx)("div",{className:"optionsLIV",children:Object(l.jsxs)("div",{className:"controlDespegableLIV",children:[Object(l.jsx)("div",{className:" ".concat(parseInt(t)===parseInt(n)?"forrillo":"sinForri"),children:Object(l.jsx)("div",{className:"contDesp",children:Object(l.jsx)(m.default,{icon:"arrow_right",size:25,color:"#38ef7d"})})}),Object(l.jsx)("div",{className:"contActiveItem",children:Object(l.jsx)(y.a,{Anim2:!0,color:"green"})})]})})]})}}var _=f,g=s(11);s(650),s(361);class N extends a.Component{constructor(){super(...arguments),this.state={select_id:null,current_item:null,current_list:this.props.list?this.props.list:"country"===this.props.type?O.a:v.a,search:[]},this.findCurrentItem=async e=>{let t=await Object(g.matchItem)(this.state.current_list,{primary:e},"code");if(!t)return!1;let s=t[0];this.setState({select_id:s.id,current_item:s}),this.props.actualizarEstado(s)},this.item_selection=async e=>{const{id:t,code:s}=e;if(this.setState({select_id:t,current_item:e}),this.props.actualizarEstado(e),this.props.external_findbar){let e={target:{name:"",value:s}};await this.update(e)}},this.update=async e=>{let{target:t}=e;const{value:s}=t,{current_list:a}=this.state;let c=await Object(g.matchItem)(a,{primary:s.toLowerCase()},"name",!0);if((!c||c&&c.length>1||0===c.length)&&this.unSelection(),c&&c.length>0)return 1===c.length&&(this.visiblePosition(c[0],a),this.props.external_findbar&&this.props.export_result(c[0])),this.setState({select_id:1===c.length?c[0].id:this.state.select_id,search:c})},this.unSelection=()=>{let e={target:{name:this.props.name_item,value:""}};this.setState({select_id:null,current_item:null}),this.props.actualizarEstado(e)},this.visiblePosition=(e,t)=>{let s=[];s.push(e),t.map((t=>t.id!==e.id&&s.push(t))),this.setState({current_list:s,current_item:e}),this.props.external_findbar||this.item_selection(e)}}componentWillReceiveProps(e){}componentDidMount(){this.props.current_item&&this.findCurrentItem(this.props.current_item)}render(){const{noIcon:e,noFindbar:t,theme:s,iconType:a}=this.props,{select_id:c,current_list:n,search:i,current_item:o}=this.state;return Object(l.jsxs)("section",{className:"contListItemMV ".concat(s),style:{paddingTop:t?"10px":"60px"},children:[Object(l.jsx)("div",{className:"findbar ".concat(s),style:{display:t?"none":"grid"},children:Object(l.jsx)(r.c,{type:"text",actualizarEstado:this.update,placeholder:o?o.name:"Ej. Cali, Medellin, Bogot\xe1"})}),i.length>0?i.map((t=>Object(l.jsx)(_,{noIcon:e,item_selection:this.item_selection,item_active:c,item:t,theme:s,iconType:a},t.id))):n.map((t=>Object(l.jsx)(_,{noIcon:e,item_selection:this.item_selection,item_active:c,item:t,theme:s,iconType:a},t.id)))]})}}var C=N,w=s(349);class S extends a.Component{constructor(){super(...arguments),this.state={buttonActive:!1,auth:this.props.params.authenticator.auth,section:"",data:null,action_triger:null,animOn:!1,loader:!1,success:!1},this.close_modal=()=>{this.props.action.toggleOtherModal()},this.authenticated=()=>{this.setState({auth:!1})},this.update_state=e=>{this.setState(e)},this.view_switch=e=>{const{code:t}=e;switch(t){case"phone":default:return Object(l.jsx)(u,{...e,...this.state,cancelarClick:this.close_modal,update_state:this.update_state});case"pass":return Object(l.jsx)(h,{...e,...this.state,cancelarClick:this.close_modal,update_state:this.update_state});case"transactional":case"withdraw":case"2auth":return this.success(e),Object(l.jsx)(o.default,{label:"Actualizando"});case"country":case"currency":return Object(l.jsx)(C,{type:t})}},this.toggle_anim=e=>{this.setState({animOn:!this.state.animOn}),e&&setTimeout((()=>{this.setState({section:e})}),200),setTimeout((()=>{this.setState({animOn:!this.state.animOn})}),2e3)},this.handleClick=e=>{this.setState({loader:!0}),setTimeout((()=>{this.success()}),1e3)},this.success=e=>{const{code:t}=e;setTimeout((async()=>{await this.props.action.isAppLoading(!0);const{other_state:s}=e;let a={...this.props.user};"transactional"===t&&(a.security_center.authenticator.transactional="to_disable"!==s,await this.props.coinsendaServices.updateUser(a)),"2auth"!==t&&"withdraw"!==t||(a.security_center.authenticator.auth="to_disable"!==s,a.security_center.authenticator.transactional="to_disable"!==s,a.security_center.authenticator.withdraw="to_disable"!==s,await this.props.coinsendaServices.updateUser(a)),await this.props.action.isAppLoading(!1),this.setState({loader:!1,success:!0,section:"success",buttonActive:!0})}),600)}}componentDidMount(){const{params:e}=this.props,{code:t}=e;this.setState({section:t})}render(){const{params:e}=this.props,{title:t,txtPrimary:s,txtSecondary:c,code:n}=e,{buttonActive:i,auth:r,animOn:d,section:u,loader:p,success:h}=this.state,O={icon:"".concat(r?"2auth":u),size:80,color:"".concat(h?"#59b200":"#1babec")};let v=window.innerWidth<768;return Object(l.jsx)(x.a,{title:t,close_modal:this.close_modal,classes:n,children:Object(l.jsxs)("section",{className:" ".concat("country"===n||"currency"===n?"MVList":"","  ").concat("pass"===u?"PassView":h?"SuccessOtherView":""," PhoneView"),children:["country"===n||"currency"===n?Object(l.jsx)(this.view_switch,{...e}):Object(l.jsxs)(a.Fragment,{children:[Object(l.jsx)(m.default,{...O,animon:d||"false"}),h?Object(l.jsx)("div",{className:"contenidoView",children:Object(l.jsx)("p",{id:"successOperation",className:"fuente",children:"Operaci\xf3n Exitosa"})}):Object(l.jsx)("div",{className:"contenidoView phoneView fuentePrin",children:p?Object(l.jsx)(o.default,{}):r?Object(l.jsx)(b.a,{label:"Digita el c\xf3digo Authenticator aqu\xed:",authenticated:this.authenticated,toggle_anim:this.toggle_anim,isTryToDisable2fa:!0}):Object(l.jsx)(this.view_switch,{...e})})]}),Object(l.jsx)("div",{className:"CMControls",children:h||v?Object(l.jsx)(j.b,{type:"primary",active:i,siguiente:this.close_modal,children:"Finalizar"}):Object(l.jsxs)(a.Fragment,{children:[Object(l.jsx)(j.b,{type:"secundary",active:!0,siguiente:this.close_modal,children:c}),Object(l.jsx)(j.b,{type:"primary",active:i,siguiente:this.handleClick,children:s})]})})]})})}}t.default=Object(c.b)((function(e,t){const{user:s}=e.modelData;return{params:e.ui.current_section.params.settings,user:s}}),(function(e){return{action:Object(n.bindActionCreators)(i.a,e)}}))(Object(w.a)(S))}}]);
//# sourceMappingURL=37.a1f3268e.chunk.js.map