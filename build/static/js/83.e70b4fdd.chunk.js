(this["webpackJsonpcoinsenda-app"]=this["webpackJsonpcoinsenda-app"]||[]).push([[83,57],{449:function(e,n,t){"use strict";t.r(n),t.d(n,"FIAT_DEPOSIT_COMPONENTS",(function(){return a})),t.d(n,"FIAT_DEPOSIT_STAGES",(function(){return i})),t.d(n,"ApiGetOnFiatDepositStages",(function(){return r})),t.d(n,"FIAT_DEPOSIT_DEFAULT_STATE",(function(){return c})),t.d(n,"ApiPostCreateDeposit",(function(){return l}));var o=t(49);const s={amount:"",costId:""},a={wrapperComponent:{fiatDeposit:"fiatDeposit"}},i={fiatDeposit:s},r=async()=>s,c={},l=async(e,n)=>{const{setLoader:t,nextStage:s}=n;t(!0);let a=await o.a.createDeposit(e);if(t(!1),a)return s(),a}},450:function(e,n,t){"use strict";t.r(n),t.d(n,"ApiGetPersonalStages",(function(){return i})),t.d(n,"ApiPostPersonalKyc",(function(){return r})),t.d(n,"PERSONAL_DEFAULT_STATE",(function(){return c})),t.d(n,"PERSONAL_COMPONENTS",(function(){return l})),t.d(n,"PERSONAL_STAGES",(function(){return p}));var o=t(49),s=t(20),a=t.n(s);console.log({res:{levels:{level_1:{personal:{natural:{name:{ui_name:"Nombres completos"},phone:{ui_name:"Numero de tel\xe9fono",ui_type:"phone"},nationality:{colombia:{ui_name:"Colombia"},afghanistan:{ui_name:"Afghanistan"},ui_name:"Nacionalidad del documento",ui_type:"select"},address:{ui_name:"Direcci\xf3n de residencia"},city:{ui_name:"Ciudad"},id_type:{ui_name:"Tipo de documento",ui_type:"select",cedula_ciudadania:{ui_name:"Cedula de ciudadan\xeda"},cedula_extranjeria:{ui_name:"Cedula de extranjer\xeda"},pasaporte:{ui_name:"Pasaporte"},pep:{ui_name:"Permiso especial de permanencia"}},id_number:{ui_name:"N\xfamero de documento",ui_type:"text"},birthday:{ui_name:"Fecha de nacimiento",ui_type:"date"},country:{colombia:{ui_name:"Colombia",value:"colombia"},peru:{ui_name:"Per\xfa",value:"peru"},ui_name:"Pa\xeds",ui_type:"select"},surname:{ui_name:"Apellidos completos"}}}}}}});const i=async e=>{var n;const{personType:t,level:s,formName:a}=e;let i=await o.a.countryValidators();if(i)return null===i||void 0===i||null===(n=i.res)||void 0===n?void 0:n.levels[s][a][t]},r=async(e,n)=>{const{setLoading:t,prevStage:s,toastMessage:i}=n;let r={info:{...e},info_type:"personal",verification_level:"level_1"};const c=new Date(r.info.birthday).getTime();r.info.birthday=a()(c).div(1e3).toString(),t(!0);let l=await o.a.updateLevelProfile(r);if(t(!1),!l)return i("No ha sido posible completar la verificaci\xf3n.","error"),s();const{user:p}=o.a.globalState.modelData,{data:{personal:u}}=l;let m={...p,...u,levels:{...p.levels,personal:"confirmed"},security_center:{...p.security_center,kyc:{...p.security_center.kyc,basic:"confirmed"}},country:p.country};return await o.a.updateUser(m),l},c={personal:{meta_phone:"colombia"}},l={wrapperComponent:{personal:"personalKycComponent"}},p={personal:{id_type:{key:"id_type",uiType:"text",settings:{defaultMessage:"Elige el documento de identidad con el cual verificar\xe1s tu cuenta.",successPattern:/[a-zA-Z ]{3,40}/g,placeholder:"Elije tu documento de identidad",selectList:{},queryParams:{form:"personal_id_type"},errors:[]}},city:{key:"city",uiType:"text",settings:{defaultMessage:"Escribe la ciudad en la que resides actualmente",successPattern:/[a-zA-Z ]{3,40}/g,placeholder:"Elije tu ciudad actual",queryParams:{form:"personal_residence_city"},errors:[{pattern:/[^a-zA-Z ]{1,30}/g,message:"Solo se permiten letras..."}]}},address:{key:"address",uiType:"text",settings:{defaultMessage:"Escribe de forma completa tu direcci\xf3n actual de residencia",successPattern:/[a-zA-Z ]{3,40}/g,placeholder:"Escribe la direcci\xf3n",queryParams:{form:"personal_address"},errors:[{pattern:/[^a-zA-Z ]{1,30}/g,message:"Solo se permiten letras..."}]}},surname:{key:"surname",uiType:"text",settings:{defaultMessage:"Tus apellidos deben coincidir con los de tu documento de identidad.",successPattern:/[a-zA-Z ]{3,40}/g,label:"Apellidos completos:",placeholder:"Ej: Sanchez buitrago",queryParams:{form:"personal_surnames"},errors:[{pattern:/[^a-zA-Z ]{1,30}/g,message:"Solo se permiten letras..."}]}},name:{key:"name",uiType:"text",settings:{defaultMessage:"Los nombres deben coincidir con los de tu documento de identidad",successPattern:/[a-zA-Z ]{3,40}/g,label:"Nombres completos (Sin apellidos):",placeholder:"Ej: Juan jos\xe9 ",queryParams:{form:"personal_names"},errors:[{pattern:/[^a-zA-Z ]{1,30}/g,message:"Solo se permiten letras..."}],AuxComponent:null,MainComponent:null}},nationality:{key:"nationality",uiType:"select",settings:{defaultMessage:"Selecciona la nacionalidad de tu documento de identidad",successPattern:/[a-zA-Z _]{1,40}/g,errors:[{pattern:/[^a-zA-Z _]{1,30}/g,message:"Solo se permiten letras..."}],placeholder:"Ej: pasaporte",queryParams:{form:"personal_country"}}},country:{uiName:"Pa\xeds",key:"country",uiType:"select",selectList:{},settings:{defaultMessage:"Elige el pa\xeds de residencia actual",successPattern:/[a-zA-Z _]{1,40}/g,errors:[{pattern:/[^a-zA-Z _]{1,30}/g,message:"Solo se permiten letras..."}],label:"Pa\xeds",placeholder:"",queryParams:{form:"personal_country"},auxComponent:null,mainComponent:null}},birthday:{key:"birthday",uiType:"date",settings:{defaultMessage:"Ingresa t\xfa fecha de nacimiento (D\xeda / Mes / A\xf1o)",props:{min:"1930-01-01",max:"2003-12-31",pattern:"[0-9]{2}-[0-9]{2}-[0-9]{4}"},queryParams:{form:"personal_birthday"}}},id_number:{key:"id_number",uiType:"text",settings:{defaultMessage:"Dig\xedta tu n\xfamero de documento",successPattern:{pasaporte:/[0-9A-Z]{5,15}/g,others:/[0-9]{5,15}/g},placeholder:"D\xedgita el n\xfamero del documento que eleg\xedste",queryParams:{form:"personal_number_id"},errors:{pasaporte:[{pattern:/[^0-9A-Z]/g,message:"Solo se permiten valores alfanum\xe9ricos..."}],others:[{pattern:/[^0-9]/g,message:"Solo se permiten valores n\xfamericos..."}]},mainComponent:null}},phone:{uiName:"N\xfamero de tel\xe9fono",key:"phone",uiType:"text",settings:{defaultMessage:"Dig\xedta tu n\xfamero de celular",successPattern:/[0-9]{5,40}/g,queryParams:{form:"personal_phone"},errors:[{pattern:/[^0-9]/g,message:"Solo se permiten N\xfameros..."}],auxComponent:"personalKycComponent/countryPrefix",mainComponent:null}}}}},452:function(e,n,t){"use strict";t.r(n),t.d(n,"ONBOARDING_COMPONENTS",(function(){return s})),t.d(n,"ONBOARDING_STAGES",(function(){return a})),t.d(n,"ApiGetOnBoardingStages",(function(){return i}));const o={firstStage:{},secondStage:{},thirdStage:{}},s={successStage:{onBoarding:{component:"biometricKycSuccess"}},wrapperComponent:{onBoarding:"onBoardingComponent"}},a={onBoarding:o},i=async()=>o},453:function(e,n,t){"use strict";t.r(n),t.d(n,"ApiGetBiometricStages",(function(){return s})),t.d(n,"BIOMETRIC_COMPONENTS",(function(){return a})),t.d(n,"BIOMETRIC_STAGES",(function(){return i}));var o=t(49);const s=async()=>{let e={};const n=await o.a.getUserBiometric();if(n){for(const t in n.challenge)e={...e,[t]:{key:t,solved:n.solved,biometricId:n.id,ui_type:"img",ui_name:"smile"===t?"Sonr\xede":"Abre la boca y levanta las cejas"}};return e}},a={wrapperComponent:{biometric:"biometricKycComponent"}},i={biometric:{}}},455:function(e,n,t){"use strict";t.d(n,"b",(function(){return d})),t.d(n,"a",(function(){return y})),t.d(n,"d",(function(){return f})),t.d(n,"c",(function(){return _}));var o=t(467),s=t(449),a=t(452),i=t(450),r=t(453);let c={...r.BIOMETRIC_STAGES,...i.PERSONAL_STAGES,...a.ONBOARDING_STAGES,...s.FIAT_DEPOSIT_STAGES};const l={...i.PERSONAL_DEFAULT_STATE,...s.FIAT_DEPOSIT_DEFAULT_STATE},p={},u={...r.BIOMETRIC_COMPONENTS.wrapperComponent,...i.PERSONAL_COMPONENTS.wrapperComponent,...a.ONBOARDING_COMPONENTS.wrapperComponent,...s.FIAT_DEPOSIT_COMPONENTS.wrapperComponent};var m=e=>({wrapperComponent:u[e],handleError:p[e],successStage:null,defaultState:l[e],stages:c[e]});const d=e=>Object.entries(e).map(((e,n)=>{let t="".concat(n<1?"?":"&");return"".concat(t).concat(e[0],"=").concat(e[1])})).join(""),y=e=>{let n={};const t={...e.stages,...null===e||void 0===e?void 0:e.defaultState};return Object.keys(t).map((t=>{var o,s;if(n[t]=(null===e||void 0===e?void 0:e.defaultState)?null===e||void 0===e?void 0:e.defaultState[t]:"",(null===e||void 0===e||null===(o=e.handleError)||void 0===o?void 0:o.errors)&&(null===e||void 0===e||null===(s=e.handleError)||void 0===s?void 0:s.errors[t]))return n[t]=""})),n},f=(e,n)=>{const t=document.querySelector(e);if(!t)return!1;t.innerHTML=n,t.style.color="red"},C=(e,n,t)=>{let o={...e},s={};return o.uiName=o.ui_name,o.uiType=o.ui_type,delete o.ui_name,delete o.ui_type,Object.keys(o).map((async a=>{if(s={key:t,...s,...n,[a]:o[a]},"select"===s[a]){let n=e;["nationality","country"].includes(s.key)&&(n=await g()),s.selectList=(e=>{let n={...e};return delete n.ui_name,delete n.ui_type,Object.keys(n).map((e=>{var t,o,s,a,i,r;n[e].uiName=(null===(t=n[e])||void 0===t?void 0:t.ui_name)||(null===(o=n[e])||void 0===o?void 0:o.name),n[e].value=e,null===(s=n[e])||void 0===s||delete s.ui_name,null===(a=n[e])||void 0===a||delete a.name,null===(i=n[e])||void 0===i||delete i.id,null===(r=n[e])||void 0===r||delete r.code})),n})(n)}})),s},g=async()=>{const e=await fetch("".concat(o.a,"/api/countrys")),n=await e.json();if(!n)return;let t={};for(const s of n)s.code=s.code.split(" ").join("_"),s.currencySymbol=s.currency_symbol,delete s.currency_symbol,t={...t,[s.code]:{...s,flag:"".concat(o.a).concat(s.flag)}};return t},b={biometric:r.ApiGetBiometricStages,onBoarding:a.ApiGetOnBoardingStages,personal:i.ApiGetPersonalStages,fiatDeposit:s.ApiGetOnFiatDepositStages},_=async e=>{const n=await b[e.formName](e);if(!n)return;const t=Object.keys(n);let o={};for(const a of t){var s;o={...o,[a]:C(n[a],null===(s=m(e.formName))||void 0===s?void 0:s.stages[a],a)}}return{...m(e.formName),stages:o}}},467:function(e,n,t){"use strict";t.d(n,"b",(function(){return o})),t.d(n,"a",(function(){return s}));const o="#00ffc4",s="https://info.bitsenda.com"},482:function(e,n,t){"use strict";var o=t(2),s=t(483),a=t(4),i=t(455),r=(t(525),t(526),t(1));n.a=e=>{var n,c;let{handleDataForm:l,...p}=e;const u=Object(a.a)((()=>t(527)("./".concat(l.dataForm.wrapperComponent||"personalKycComponent","/skeleton")))),[m,d]=Object(o.useState)();return Object(o.useEffect)((()=>{d(Object(i.a)(l.dataForm))}),[null===l||void 0===l||null===(n=l.dataForm)||void 0===n?void 0:n.wrapperComponent]),Object(r.jsx)(s.default,{component:null===l||void 0===l||null===(c=l.dataForm)||void 0===c?void 0:c.wrapperComponent,Fallback:()=>Object(r.jsx)(u,{}),handleDataForm:l,handleState:{setState:d,state:m},...p})}},483:function(e,n,t){"use strict";t.r(n);var o=t(2),s=t(1);n.default=e=>{let{component:n,Fallback:a,...i}=e;const[r,c]=Object(o.useState)();return Object(o.useEffect)((()=>{(async()=>{if(!n)return;const e=await t(524)("./".concat(n));c(e)})()}),[n]),a&&!r?Object(s.jsx)(a,{}):Object(s.jsx)(s.Fragment,{children:r&&Object(s.jsx)(r.default,{...i})})}},503:function(e,n,t){"use strict";t.r(n);var o=t(2),s=t(482),a=t(455),i=t(1);n.default=e=>{const[n,t]=Object(o.useState)();return Object(o.useEffect)((()=>{(async()=>{const e=await Object(a.c)({formName:"onBoarding"});t(e)})()}),[]),Object(i.jsx)(i.Fragment,{children:n?Object(i.jsx)(s.a,{handleDataForm:{dataForm:n,setDataForm:t}}):Object(i.jsx)("p",{children:"Cargando..."})})}},524:function(e,n,t){var o={"./biometricKycComponent":[465,9,1,6,8],"./biometricKycComponent/":[465,9,1,6,8],"./biometricKycComponent/api":[453,9],"./biometricKycComponent/api.js":[453,9],"./biometricKycComponent/biometricStatus":[492,9,1,49],"./biometricKycComponent/biometricStatus.js":[492,9,1,49],"./biometricKycComponent/captures":[493,9,50],"./biometricKycComponent/captures.js":[493,9,50],"./biometricKycComponent/continueFromMobile":[494,9,3,42],"./biometricKycComponent/continueFromMobile.js":[494,9,3,42],"./biometricKycComponent/index":[465,9,1,6,8],"./biometricKycComponent/index.js":[465,9,1,6,8],"./biometricKycComponent/init":[489,9,1,40],"./biometricKycComponent/init.js":[489,9,1,40],"./biometricKycComponent/onBoardingAgreement":[523,9,3,39],"./biometricKycComponent/onBoardingAgreement.js":[523,9,3,39],"./biometricKycComponent/scanner":[495,9,51],"./biometricKycComponent/scanner.js":[495,9,51],"./biometricKycComponent/skeleton":[478,9,24],"./biometricKycComponent/skeleton.js":[478,9,24],"./biometricKycComponent/styles":[459,9,52],"./biometricKycComponent/styles.css":[551,7,100],"./biometricKycComponent/styles.js":[459,9,52],"./biometricKycComponent/success":[517,9,30],"./biometricKycComponent/success.js":[517,9,30],"./biometricKycComponent/utils":[477,9,53],"./biometricKycComponent/utils.js":[477,9,53],"./biometricKycComponent/validations":[496,9,43],"./biometricKycComponent/validations.js":[496,9,43],"./fiatDeposit":[460,9,1,4,3,2,7],"./fiatDeposit/":[460,9,1,4,3,2,7],"./fiatDeposit/amount":[511,9,11],"./fiatDeposit/amount.js":[511,9,11],"./fiatDeposit/api":[449,9],"./fiatDeposit/api.js":[449,9],"./fiatDeposit/costId":[518,9,11,41],"./fiatDeposit/costId.js":[518,9,11,41],"./fiatDeposit/index":[460,9,1,4,3,2,7],"./fiatDeposit/index.js":[460,9,1,4,3,2,7],"./fiatDeposit/init":[512,9,54],"./fiatDeposit/init.js":[512,9,54],"./fiatDeposit/skeleton":[479,9,25],"./fiatDeposit/skeleton.js":[479,9,25],"./fiatDeposit/styles":[456,9,55],"./fiatDeposit/styles.js":[456,9,55],"./fiatDeposit/success":[458,9,1,4,3,2,28],"./fiatDeposit/success.js":[458,9,1,4,3,2,28],"./identityKycComponent/success":[513,9,31],"./identityKycComponent/success.js":[513,9,31],"./infoPanel":[461,9,16],"./infoPanel/":[461,9,16],"./infoPanel/index":[461,9,16],"./infoPanel/index.js":[461,9,16],"./layout":[443,9,15],"./layout/":[443,9,15],"./layout/index":[443,9,15],"./layout/index.js":[443,9,15],"./layout/styles":[447,9,56],"./layout/styles.js":[447,9,56],"./onBoardingComponent":[462,9,1,9],"./onBoardingComponent/":[462,9,1,9],"./onBoardingComponent/api":[452,9],"./onBoardingComponent/api.js":[452,9],"./onBoardingComponent/assets/hand.png":[552,9,140],"./onBoardingComponent/assets/isoType.png":[553,9,141],"./onBoardingComponent/assets/nerdFace.png":[554,9,142],"./onBoardingComponent/assets/party.png":[555,9,143],"./onBoardingComponent/firstStage":[519,9,37],"./onBoardingComponent/firstStage.js":[519,9,37],"./onBoardingComponent/index":[462,9,1,9],"./onBoardingComponent/index.js":[462,9,1,9],"./onBoardingComponent/init":[503,9,57],"./onBoardingComponent/init.js":[503,9,57],"./onBoardingComponent/secondStage":[520,9,35],"./onBoardingComponent/secondStage.js":[520,9,35],"./onBoardingComponent/skeleton":[480,9,26],"./onBoardingComponent/skeleton.js":[480,9,26],"./onBoardingComponent/styles":[485,9,58],"./onBoardingComponent/styles.js":[485,9,58],"./onBoardingComponent/thirdStage":[521,9,36],"./onBoardingComponent/thirdStage.js":[521,9,36],"./onBoardingComponent/utils":[475,9,59],"./onBoardingComponent/utils.js":[475,9,59],"./onBoardingComponent/validations":[514,7,27],"./onBoardingComponent/validations.js":[514,7,27],"./personalKycComponent":[464,9,2,5,10],"./personalKycComponent/":[464,9,2,5,10],"./personalKycComponent/api":[450,9],"./personalKycComponent/api.js":[450,9],"./personalKycComponent/buttons":[497,9,2,44],"./personalKycComponent/buttons.js":[497,9,2,44],"./personalKycComponent/const":[471,9,60],"./personalKycComponent/const.js":[471,9,60],"./personalKycComponent/countryPrefix":[463,9,17,13],"./personalKycComponent/countryPrefix/":[463,9,17,13],"./personalKycComponent/countryPrefix/index":[463,9,17,13],"./personalKycComponent/countryPrefix/index.js":[463,9,17,13],"./personalKycComponent/countryPrefix/methods":[499,9,61],"./personalKycComponent/countryPrefix/methods.js":[499,9,61],"./personalKycComponent/countryPrefix/styles":[498,9,62],"./personalKycComponent/countryPrefix/styles.js":[498,9,62],"./personalKycComponent/index":[464,9,2,5,10],"./personalKycComponent/index.js":[464,9,2,5,10],"./personalKycComponent/init":[487,9,1,32],"./personalKycComponent/init.js":[487,9,1,32],"./personalKycComponent/input":[500,9,38],"./personalKycComponent/input.js":[500,9,38],"./personalKycComponent/labelComponent":[501,9,46],"./personalKycComponent/labelComponent.js":[501,9,46],"./personalKycComponent/selectList":[466,9,14],"./personalKycComponent/selectList/":[466,9,14],"./personalKycComponent/selectList/index":[466,9,14],"./personalKycComponent/selectList/index.js":[466,9,14],"./personalKycComponent/selectList/itemList":[502,9,47],"./personalKycComponent/selectList/itemList.js":[502,9,47],"./personalKycComponent/selectList/styles":[481,9,63],"./personalKycComponent/selectList/styles.js":[481,9,63],"./personalKycComponent/skeleton":[457,9,20],"./personalKycComponent/skeleton.js":[457,9,20],"./personalKycComponent/styles":[446,9,64],"./personalKycComponent/styles.js":[446,9,64],"./personalKycComponent/success":[515,9,5],"./personalKycComponent/success.js":[515,9,5],"./personalKycComponent/utils":[472,9,45],"./personalKycComponent/utils.js":[472,9,45],"./personalKycComponent/validations":[488,9,21],"./personalKycComponent/validations.js":[488,9,21],"./sharedStyles":[448,9,65],"./sharedStyles.js":[448,9,65],"./success/confetti":[468,9,48],"./success/confetti.js":[468,9,48],"./success/icons":[469,9,66],"./success/icons.js":[469,9,66],"./success/styles":[470,9,67],"./success/styles.js":[470,9,67]};function s(e){if(!t.o(o,e))return Promise.resolve().then((function(){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}));var n=o[e],s=n[0];return Promise.all(n.slice(2).map(t.e)).then((function(){return t.t(s,n[1])}))}s.keys=function(){return Object.keys(o)},s.id=524,e.exports=s},525:function(e,n,t){},526:function(e,n,t){},527:function(e,n,t){var o={"./biometricKycComponent/skeleton":[478,24],"./fiatDeposit/skeleton":[479,25],"./onBoardingComponent/skeleton":[480,26],"./personalKycComponent/skeleton":[457,20]};function s(e){if(!t.o(o,e))return Promise.resolve().then((function(){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}));var n=o[e],s=n[0];return t.e(n[1]).then((function(){return t(s)}))}s.keys=function(){return Object.keys(o)},s.id=527,e.exports=s}}]);
//# sourceMappingURL=83.e70b4fdd.chunk.js.map