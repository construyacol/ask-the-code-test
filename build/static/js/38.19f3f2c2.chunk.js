(this["webpackJsonpcoinsenda-app"]=this["webpackJsonpcoinsenda-app"]||[]).push([[38],{362:function(t,e,a){"use strict";a.d(e,"a",(function(){return n}));a(2);var s=a(331),i=a(14);function n(t){return function(e){const a=Object(s.a)(!0,"cancel-button-".concat(e.eventName),8,!0,e.eventName,!0),n=Object(s.a)(!0,"accept-button-".concat(e.eventName),13,!1,e.eventName,!0);return Object(i.jsx)(t,{idCancel:a,idAccept:n,...e})}}},453:function(t,e,a){},490:function(t,e,a){"use strict";a.r(e);var s=a(2),i=a(53),n=a(332),r=a(54),o=a(334),c=a(339),p=a(14);var l=t=>{const{elements:e,label:a,open:s,active:i,placeholder:n}=t;return Object(p.jsxs)("div",{className:"containerInputComponent",children:[Object(p.jsx)("p",{className:"labelText fuente",children:a}),Object(p.jsx)("div",{className:"inputContainer2 ".concat(i?"inputActivado":""),children:Object(p.jsxs)("div",{className:"InputDropDown ".concat(i?"activeText":""),onClick:t.abrir,children:[n,Object(p.jsx)("div",{className:"InputDesplegable ".concat(s?"Idesplegado":""),style:{height:s?"".concat(45*e.length,"px"):"0px"},children:e.map(((e,a)=>Object(p.jsxs)("p",{"data-value":e.value,"data-ui_name":e.ui_name,onClick:t.selectItem,children:[e.ui_name," "]},a)))})]})})]})};a(352);class h extends s.Component{constructor(){super(...arguments),this.state={elements:this.props.elements,open:!1,placeHolder:this.props.placeholder},this.abrir=t=>{this.setState({open:!this.state.open})},this.selectItem=t=>{let e;console.log("_________________________________________________________selectItem",this.state.elements,t.target.dataset),t.target.dataset.value||("Cuenta corriente"===t.target.dataset.ui_name&&(e="cuenta_corriente"),"Cuenta de ahorros"===t.target.dataset.ui_name&&(e="cuenta_ahorro"),"Dep\xf3sito electr\xf3nico"===t.target.dataset.ui_name&&(e="deposito_electronico"));const a={target:{name:this.props.name,value:t.target.dataset.value||e}};this.setState({placeHolder:t.target.dataset.ui_name}),this.props.actualizarEstado(a)}}componentDidMount(){if(this.props.selected&&this.props.elements){const t=this.props.elements.findIndex((t=>t.value===this.props.selected));this.setState({placeHolder:this.props.elements[t].ui_name})}}render(){const{label:t,active:e}=this.props;return Object(p.jsx)(l,{elements:this.state.elements,open:this.state.open,abrir:this.abrir,placeholder:this.state.placeHolder,selectItem:this.selectItem,label:t,active:e})}}var d=h,u=a(401),_=a(386),m=a(52),b=a(98),w=a(26),j=a(99),f=a(11),v=a(27),g=a(350),y=a(362);class O extends s.Component{constructor(){super(...arguments),this.state={banks:null,cities:null,loader:!1},this.initComponent=async()=>{const{withdraw_providers_list:t}=this.props;this.setState({loader:!0});let e=t;if(!e||e&&!e.length)return Object(v.a)("?message=Vuelve a iniciar session");let a=e&&e[0].info_needed.bank_name,s=await Object(f.serveBankOrCityList)(a,"bank");console.log("============================================================== serve_bank_list",s);let i=await Object(f.addIndexToRootObject)(e&&e[0].info_needed.id_type),n=await Object(f.objectToArray)(i),r=await Object(f.addIndexToRootObject)(e&&e[0].info_needed.account_type),o=await Object(f.objectToArray)(r);console.log("|||||||||||||||||||||||||| \xb0\xb0\xb0\xb0\xb0\xb0\xb0\xb0\xb0\xb0\xb0\xb0\xb0\xb0\xb0\xb0\xb0\xb0\xb0\xb0\xb0\xb0\xb0\xb0\xb0\xb0\xb0\xb0\xb0\xb0| account_type_list |",o),await this.props.actualizarEstado({target:{name:"currency",value:e[0].currency}}),this.setState({banks:s,id_types:n,account_types:o,loader:!1})},this.update_city=t=>{let e={target:{name:"city",value:t.code}};this.props.actualizarEstado(e)}}componentDidMount(){this.initComponent(),this.props.actualizarEstado({target:{name:"provider_type",value:"bank"}})}componentDidUpdate(t){if(t!==this.props&&this.props.short_name&&this.props.withdraw_providers_list&&this.props.withdraw_providers_list[0]){const t={...this.props.withdraw_providers_list&&this.props.withdraw_providers_list[0].info_needed},e=this.props.short_name,a=t.bank_name[e]&&t.bank_name[e].compatible_account_types.map((e=>t.account_type[e]));console.log("===================================0 accountTypes ",a,t),a&&this.setState({account_types:a})}}render(){const{statusInput:t,handleKeyPress:e,short_name:a,siguiente:i,update_control_form:r,handleSubmit:l,account_number:h,account_type:b,bank_name:w,step:j,search:f,name:v,actualizarEstado:g,final_step_create_account:y,idAccept:O}=this.props,{banks:k,loader:x}=this.state;return console.log("|||||| step::",j),Object(p.jsxs)(s.Fragment,{children:[2===j&&Object(p.jsxs)("div",{className:"nBstep1 fuente",children:[Object(p.jsxs)("div",{className:"titleNewAccount",children:[Object(p.jsx)("img",{src:"".concat(Object(m.b)("assets"),"bank.png"),alt:"",height:"70"}),Object(p.jsxs)("p",{children:["Genial ",Object(p.jsx)("strong",{children:v})]})]}),Object(p.jsxs)("p",{className:"nBtextInit fuente",children:[" ","Al a\xf1adir una cuenta bancaria para realizar tus retiros de moneda local por primera vez, el tiempo promedio que tarda para inscribirse son 2 horas h\xe1biles a partir del momento en que se realiz\xf3 el proceso. Tener tu cuenta inscrita previamente puede hacer que tus retiros en moneda local se ejecuten m\xe1s r\xe1pido."]}),Object(p.jsx)("div",{id:"bankChooseButton",children:Object(p.jsx)(o.b,{_id:O,type:"primary",active:!0,siguiente:i,children:"OK, comencemos"})})]}),3===j&&Object(p.jsx)("div",{className:"step1",children:Object(p.jsxs)("form",{onSubmit:l,className:"NWithdrawAccountFlow",children:[Object(p.jsxs)("div",{className:"titleAccountFlow",children:[Object(p.jsx)("h1",{className:"DLtitles2",children:"Elige la entidad bancaria"}),Object(p.jsx)("p",{className:"fuente DLstitles",children:"de la cuenta que quieres agregar:"})]}),x?Object(p.jsx)(n.default,{label:"Cargando..."}):Object(p.jsx)(u.a,{type:"banks",autoFocus:!0,items:k,format:"svg",itemSelect:w,actualizarEstado:g,handleSubmit:l,update_control_form:r}),Object(p.jsx)("div",{id:"bankChooseButton",children:Object(p.jsx)(o.i,{id:O,preventSubmit:!0,label:"Continuar",type:"primary",active:1===f.length&&""!==w})})]})}),(4===j||5===j)&&Object(p.jsx)("div",{className:"step2",children:Object(p.jsxs)("div",{id:"contMsg",className:"contMsg",style:{gridTemplateRows:4===j?"auto 1fr 15vh":j>=5?"auto 1fr":""},children:[Object(p.jsx)("div",{className:"nBcontBank",children:Object(p.jsx)(_.default,{format:"svg",actives:!0,type:"bank",code:a,name:w})}),4===j&&Object(p.jsxs)("form",{className:"formAccountFlow",onSubmit:async t=>{await l(t),y(t)},children:[Object(p.jsxs)("div",{className:"contForminputsAccount",children:[Object(p.jsx)(d,{placeholder:"Tipo de cuenta",elements:this.state.account_types,label:"Elige el tipo de cuenta:",actualizarEstado:g,name:"account_type",selected:b,active:b&&h}),Object(p.jsx)(c.c,{type:"text",label:"Escribe el n\xfamero de cuenta",placeholder:"Ej. 1123321...",name:"account_number",autoFocus:!0,actualizarEstado:g,active:b&&h,value:h,handleKeyPress:e,status:t})]}),Object(p.jsx)("div",{id:"bankChooseButton",className:"contbuttonAccount",children:Object(p.jsx)(o.i,{id:O,preventSubmit:!0,label:"Continuar",type:"primary",active:b&&h})})]})]})})]})}}const k=Object(g.a)([t=>t.modelData.user.withdrawProviders,t=>t.modelData.withdrawProviders],((t,e)=>{const a=[];return t&&t.map((t=>"bank"===e[t].provider_type&&a.push(e[t]))),a}));var x=Object(b.b)((function(t){const{user:e}=t.modelData;return{withdraw_providers_list:k(t),user:e,current:t.form.current}}),(function(t){return{action:Object(w.bindActionCreators)(j.a,t)}}))(Object(y.a)(O));a(453),a(170);const C=Object(i.a)((()=>a.e(43).then(a.bind(null,488)))),S=Object(i.a)((()=>Promise.all([a.e(2),a.e(1),a.e(3),a.e(5),a.e(25)]).then(a.bind(null,487)))),N=Object(i.a)((()=>a.e(79).then(a.bind(null,654))));var A=t=>{const{siguiente:e,step:a,select_withdraw_way:i,withdraw_way:o,ticket:c,finalizar:l,eventName:h}=t;return Object(p.jsxs)("div",{className:"containerFormWallet",children:[1===a&&Object(p.jsx)(s.Fragment,{children:Object(p.jsx)(C,{title:"En esta cuenta deseas",subtitle:"efectuar los retiros por:",items:r.g,select_method:i,item_active:o,siguiente:e,withdraw:!0})}),a>=2&&"bankaccount"===o&&Object(p.jsx)(x,{eventName:h,...t}),a>=2&&"cash"===o&&Object(p.jsx)(N,{...t}),6===a&&Object(p.jsx)(s.Fragment,{children:c?Object(p.jsx)(S,{finishAction:l,ticket:c,ticket_type:"withdraw_form"}):Object(p.jsx)(n.default,{label:"Creando Cuenta de retiro"})})]})},z=a(354),F=a(347);class I extends s.Component{constructor(){super(...arguments),this.state={name:this.props.user.name,surname:this.props.user.surname,bank_name:this.props.form_bank.bank_name,account_type:this.props.form_bank.account_type,account_number:this.props.form_bank.account_number,short_name:this.props.form_bank.short_name,id_type:null,statusInput:"",withdraw_way:"bankaccount",provider_type:"",id_number:"",city:"medellin",email:this.props.user.email,currency:null,ticket:null},this.update_control_form=t=>{switch((!t||this.props.search.length>1)&&this.props.action.UpdateFormControl("bank",!1),this.props.step){case 3:1===this.props.search.length&&this.props.action.UpdateFormControl("bank",!0);break;case 5:""!==this.state.account_type&&""!==this.state.account_number&&this.props.action.UpdateFormControl("bank",!0);break;default:console.log("")}},this.select_withdraw_way=async(t,e)=>{await this.setState({withdraw_way:e,provider_type:"bankaccount"===e?"bank":""}),this.update_form()},this.handleKeyPress=t=>{var e=window.event?window.event.keyCode:t.which;return e<48||e>57?(this.setState({statusInput:"Solo se aceptan n\xfameros en este campo"}),!0):(this.setState({statusInput:""}),/\d/.test(String.fromCharCode(e)))},this.handleSubmit=async t=>{t.preventDefault(),this.actualizarEstado(t),await this.siguiente()},this.final_step_create_account=async t=>{await this.handleSubmit(t),this.crearCuenta()},this.crearCuenta=async()=>{const{withdraw_accounts:t}=this.props;if(this.props.action.isAppLoading(!0),t){if(Object.values(t).filter((t=>t.info.bank_name===this.state.bank_name&&t.info.account_number===this.state.account_number)).length)return this.props.action.ReduceStep(this.props.current,2),this.props.toastMessage("La cuenta de retiro ya existe","error"),this.props.action.isAppLoading(!1)}let e=await this.props.coinsendaServices.addNewWithdrawAccount(this.state);return e?(await this.props.coinsendaServices.fetchWithdrawAccounts(),this.props.withdraw_flow?this.props.withdraw_flow_action(e):(await this.setState({ticket:e}),this.props.action.success_sound(),this.update_form(),this.props.action.isAppLoading(!1),void this.props.action.ModalView("modalSuccess"))):(this.props.action.ReduceStep(this.props.current,2),this.props.toastMessage("No es posible crear la cuenta ahora.","error"),this.props.action.isAppLoading(!1))},this.actualizarEstado=async t=>{t.persist&&t.persist(),t.target&&t.target.short_name&&this.setState({short_name:t.target.short_name});const e=t.target.name;let a=t.target.value;console.log("|||||||||||||||||||||||||||||||||||||||||||  actualizarEstado  ===>",t.target,this.state),window.requestAnimationFrame((()=>{let t=!1,s=50;if(e&&"id_number"===e)if(t=!0,"pasaporte"===this.state.id_type){if(a&&!/^[a-zA-Z0-9]{1,20}$/g.test(a))return}else if("nit"===this.state.id_type)s=11,a=a.replace(/(\d{9})(\d{1})/,"$1-$2");else if(a&&!/^[0-9]{1,12}$/g.test(a))return;e&&"account_number"===e&&(a=a.replace(/[^0-9]/g,""),t=!0,s=20),"nequi"===this.state.short_name&&(s=10),"bancolombia"===this.state.bank_name&&(s=11),t&&a.length>s&&(a=a.slice(0,s)),e&&this.setState({[e]:a}),this.update_control_form(a),this.update_form()}))},this.update_form=()=>{this.props.action.UpdateForm("bank",this.state)},this.siguiente=async()=>(1===this.props.step&&await this.cleanSearch(),this.props.action.IncreaseStep(this.props.current)),this.finalizar=t=>{this.props.action.CleanForm("bank"),this.props.action.CleanForm("withdraw")},this.cleanSearch=()=>{this.setState({bank_name:""}),this.props.action.UpdateFormControl("bank",!1),this.props.action.cleanSearch("bank")}}componentDidMount(){setTimeout((()=>{this.props.history.push("?form=wa_terms")}),100);const{withdraw_flow:t}=this.props;if(t)return this.props.action.CurrentForm("withdraw");this.props.action.CurrentForm("bank")}componentDidUpdate(t){if(t.step===this.props.step)return;let e;2===this.props.step&&(e="?form=wa_terms"),3===this.props.step&&(e="?form=wa_choose_bank"),4===this.props.step&&(e="?form=wa_enter_bank_details"),5===this.props.step&&(e="?form=wa_id_type"),6===this.props.step&&(e="?form=wa_opening_city"),7===this.props.step&&(e="?form=wa_success"),setTimeout((()=>{this.props.history.push(e)}),100)}render(){const{step:t,search:e,withdraw_flow:a,withdraw_flow_action:s,eventName:i="onkeyup"}=this.props;return Object(p.jsx)(A,{withdraw_flow:a,withdraw_flow_action:s,statusInput:this.state.statusInput,handleKeyPress:this.handleKeyPress,crearCuenta:this.crearCuenta,siguiente:this.siguiente,actualizarEstado:this.actualizarEstado,handleSubmit:this.handleSubmit,update_control_form:this.update_control_form,buttonActive:this.props.buttonActive,loader:this.props.loader,finalizar:this.finalizar,step:t,select_withdraw_way:this.select_withdraw_way,cleanSearch:this.cleanSearch,initPrevKeyActions:this.props.initPrevKeyActions,search:e,final_step_create_account:this.final_step_create_account,eventName:i,...this.state})}}const D=Object(g.a)([t=>t.modelData.user.withdrawProviders,t=>t.modelData.withdrawProviders],((t,e)=>t&&t.map((t=>e[t]))));e.default=Object(z.h)(Object(b.b)((function(t,e){const{withdraw_flow:a}=e,{user:s,withdraw_accounts:i}=t.modelData;return{search:t.form.search_bank,withdrawProviders:D(t),form_bank:t.form.form_bank,buttonActive:t.form.form_control_bank,loader:t.isLoading.loader,current:t.form.current,step:a?t.form.form_withdraw.step:t.form.form_bank.step,user:s,withdraw_accounts:i}}),(function(t){return{action:Object(w.bindActionCreators)(j.a,t)}}))(Object(F.a)(I)))}}]);
//# sourceMappingURL=38.19f3f2c2.chunk.js.map