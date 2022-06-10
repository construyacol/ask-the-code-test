(this["webpackJsonpcoinsenda-app"]=this["webpackJsonpcoinsenda-app"]||[]).push([[9],{473:function(e,t,n){"use strict";n.d(t,"c",(function(){return v})),n.d(t,"b",(function(){return T})),n.d(t,"f",(function(){return S})),n.d(t,"d",(function(){return A})),n.d(t,"a",(function(){return E})),n.d(t,"e",(function(){return C}));var a=n(488),o=n(62),r=n(484),i=n(496),s=n(497),u=n(493),c=n(494),l=n(491),d=n(495),m=n(498);let p={...m.BIOMETRIC_STAGES,...u.PERSONAL_STAGES,...i.ONBOARDING_STAGES,...r.FIAT_DEPOSIT_STAGES,...s.NEW_WALLET_STAGES,...l.IDENTITY_STAGES,...c.LOCATION_STAGES,...d.CONTACT_STAGES};const y={...u.PERSONAL_DEFAULT_STATE,...r.FIAT_DEPOSIT_DEFAULT_STATE,...l.IDENTITY_DEFAULT_STATE,...c.LOCATION_DEFAULT_STATE,...d.CONTACT_DEFAULT_STATE},f={},g={...m.BIOMETRIC_COMPONENTS.wrapperComponent,...u.PERSONAL_COMPONENTS.wrapperComponent,...i.ONBOARDING_COMPONENTS.wrapperComponent,...r.FIAT_DEPOSIT_COMPONENTS.wrapperComponent,...s.NEW_WALLET_COMPONENTS.wrapperComponent,...l.IDENTITY_COMPONENTS.wrapperComponent,...c.LOCATION_COMPONENTS.wrapperComponent,...d.CONTACT_COMPONENTS.wrapperComponent};var _=e=>({wrapperComponent:g[e],handleError:f[e],successStage:null,defaultState:y[e],stages:p[e]});const v=e=>Object.entries(e).map(((e,t)=>{let n="".concat(t<1?"?":"&");return"".concat(n).concat(e[0],"=").concat(e[1])})).join(""),T=e=>{let t={};const n={...e.stages,...null===e||void 0===e?void 0:e.defaultState};return Object.keys(n).map((n=>{var a,o;if(t[n]=(null===e||void 0===e?void 0:e.defaultState)?null===e||void 0===e?void 0:e.defaultState[n]:"",(null===e||void 0===e||null===(a=e.handleError)||void 0===a?void 0:a.errors)&&(null===e||void 0===e||null===(o=e.handleError)||void 0===o?void 0:o.errors[n]))return t[n]=""})),t},S=(e,t)=>{const n=document.querySelector(e);if(!n)return!1;n.innerHTML=t,n.style.color="red"},A=async(e,t)=>{let n,r=await o.a[a.a[e]]&&await o.a[a.a[e]](t);if(r)return n=await h(r),(e=>{let t={...e};return delete t.ui_name,delete t.ui_type,Object.keys(t).forEach((e=>{var n,a,o,r,i;t[e].uiName=(null===(n=t[e])||void 0===n?void 0:n.ui_name)||(null===(a=t[e])||void 0===a?void 0:a.name),t[e].value=e,null===(o=t[e])||void 0===o||delete o.ui_name,null===(r=t[e])||void 0===r||delete r.name,null===(i=t[e])||void 0===i||delete i.code})),t})(n)},E=async(e,t,n)=>{let a="object"===typeof e?structuredClone(e):{...e},o={};var r;(a.uiName=a.ui_name,a.uiType=a.ui_type,delete a.ui_name,delete a.ui_type,Object.keys(a).forEach((e=>{o={key:n,...o,...t,[e]:a[e]}})),"select"===(null===a||void 0===a?void 0:a.uiType))&&(o.selectList=await A(null===(r=o)||void 0===r?void 0:r.key));return o},h=async e=>{let t={};for(const n of e){n.currencySymbol=n.currency_symbol,delete n.currency_symbol;let e=null===n||void 0===n?void 0:n.name;(null===n||void 0===n?void 0:n.code)&&(t={...t,[null===n||void 0===n?void 0:n.code]:{...n,name:e}},n.flag&&(t[null===n||void 0===n?void 0:n.code].flag="".concat(null===a.b||void 0===a.b?void 0:a.b.replace("/api/","")).concat(n.flag)))}return{...t}},O={biometric:m.ApiGetBiometricStages,onBoarding:i.ApiGetOnBoardingStages,personal:u.ApiGetPersonalStages,identity:l.ApiGetIdentityStages,fiatDeposit:r.ApiGetOnFiatDepositStages,newWallet:s.ApiGetNewWalletStages,location:c.ApiGetLocationStages,contact:d.ApiGetContactStages},C=async e=>{const t=await O[e.formName](e);if(!t)return;const n=Object.keys(t);let a={};for(const r of n){var o;a={...a,[r]:await E(t[r],null===(o=_(e.formName))||void 0===o?void 0:o.stages[r],r)}}return{..._(e.formName),stages:a}}},484:function(e,t,n){"use strict";n.r(t),n.d(t,"FIAT_DEPOSIT_COMPONENTS",(function(){return r})),n.d(t,"FIAT_DEPOSIT_STAGES",(function(){return i})),n.d(t,"ApiGetOnFiatDepositStages",(function(){return s})),n.d(t,"FIAT_DEPOSIT_DEFAULT_STATE",(function(){return u})),n.d(t,"ApiPostCreateDeposit",(function(){return c}));var a=n(62);const o={amount:"",costId:""},r={wrapperComponent:{fiatDeposit:"fiatDeposit"}},i={fiatDeposit:o},s=async()=>o,u={},c=async(e,t)=>{const{setLoader:n,nextStage:o}=t;n(!0);let r=await a.a.createDeposit(e);if(n(!1),r)return o(),r}},488:function(e,t,n){"use strict";n.d(t,"a",(function(){return i})),n.d(t,"c",(function(){return s})),n.d(t,"d",(function(){return u})),n.d(t,"b",(function(){return c}));var a=n(26);const{IdentityApIUrl:o,CountryUrl:r}=a.a,i={location_country:"getCountryList",country:"getCountryList",nationality:"getCountryList",province:"getProvinceList",city:"getCityList",id_type:"createAvailableIdentityList"},s={location_country:"province",province:"city",nationality:"id_type"},u="#00ffc4",c=r},491:function(e,t,n){"use strict";n.r(t),n.d(t,"INFO_DOCUMENT_NEEDED",(function(){return s})),n.d(t,"ApiGetIdentityStages",(function(){return l})),n.d(t,"ApiPostIdentityInfo",(function(){return d})),n.d(t,"ApiPostIdentityFiles",(function(){return m})),n.d(t,"createInfoStages",(function(){return p})),n.d(t,"IDENTITY_DEFAULT_STATE",(function(){return y})),n.d(t,"IDENTITY_COMPONENTS",(function(){return f})),n.d(t,"IDENTITY_STAGES",(function(){return g}));var a=n(62),o=n(500),r=n(504),i=n(473);const s={name:{ui_name:"Nombres completos",ui_type:"text"},surname:{ui_name:"Apellidos completos",ui_type:"text"},birthday:{ui_name:"Fecha de nacimiento",ui_type:"date"},id_number:{ui_name:"N\xfamero de documento",ui_type:"text"}},u={nationality:{ui_name:"Pa\xeds",ui_type:"select"},id_type:{ui_name:"Tipo de documento",ui_type:"select",cedula_ciudadania:{ui_name:"Cedula de ciudadan\xeda"},cedula_extranjeria:{ui_name:"Cedula de extranjer\xeda"},pasaporte:{ui_name:"Pasaporte"},pep:{ui_name:"Permiso especial de permanencia"}}},c={selfie:{ui_name:"Selfie",ui_type:"attach"},id_front:{ui_name:"Frente del documento",ui_type:"attach"},id_back:{ui_name:"reverso del documento",ui_type:"attach"}},l=async e=>{const{pendingOrRejectedIdentity:t}=Object(r.identityInfo)();if(!t||["pending","rejected"].includes(null===t||void 0===t?void 0:t.info_state))return u;{const{id_type:e,nationality:n}=t,o=await a.a.getOneDocument({id_type:e,nationality:n});if(!o)return c;let r={};return null===o||void 0===o||o.file_needed.forEach((e=>{c[e]&&(r={...r,[e]:c[e]})})),r}},d=async e=>{var t,n;const i=structuredClone(e),{pendingOrRejectedIdentity:s}=Object(r.identityInfo)();let u;i.birthday.includes("/")&&(i.birthday=Object(o.formatMaskDate)(i.birthday));const c=Object(o.parseDateToTimeStamp)(i.birthday);i.birthday=c;let l={};var d;(null===i||void 0===i||null===(t=i.document)||void 0===t||null===(n=t.info_needed)||void 0===n||n.forEach((e=>{i[e]&&(l={...l,[e]:i[e]})})),s)?u=await a.a.updateInfoIdentity({...i,identity_id:null===s||void 0===s?void 0:s.id,info_needed:l}):u=await a.a.createIdentity({...i,document_id:null===i||void 0===i||null===(d=i.document)||void 0===d?void 0:d.id,info_needed:l});if(u)return await a.a.fetchCompleteUserData()},m=async e=>{var t,n;const o=structuredClone(e),i=null===a.a||void 0===a.a?void 0:a.a.user,{pendingIdentityFile:s}=Object(r.identityInfo)(),u=null===i||void 0===i||null===(t=i.user)||void 0===t?void 0:t.identity,c=s||u,{id_type:l,nationality:d,id:m}=c,p=await a.a.getOneDocument({id_type:l,nationality:d});if(!p)return;let y={};null===p||void 0===p||null===(n=p.file_needed)||void 0===n||n.forEach((e=>{var t;(null===o||void 0===o?void 0:o.state[e])&&(y={...y,[e]:null===o||void 0===o||null===(t=o.state[e])||void 0===t?void 0:t.img})}));return await a.a.addFilesToIdentity({...o,identity_id:m,files_needed:y})?await a.a.fetchCompleteUserData():void 0},p=async e=>{var t,n,a,o;let{stageData:r,dataForm:u,setDataForm:c,state:l}=e;const d=null===r||void 0===r?void 0:r.key;if(!(null===u||void 0===u||null===(t=u.stages[d])||void 0===t?void 0:t.selectList))return;const m=null===u||void 0===u||null===(n=u.stages[d])||void 0===n?void 0:n.selectList[l[d]];if(!m||!(null===m||void 0===m||null===(a=m.info_needed)||void 0===a?void 0:a.length))return;let p={};null===m||void 0===m||null===(o=m.info_needed)||void 0===o||o.forEach((e=>{s[e]&&(p={...p,[e]:s[e]})}));let y={};for(const s of Object.keys(p))y={...y,[s]:await Object(i.a)(p[s],null===g||void 0===g?void 0:g.identity[s],s)};c((e=>({...e,stages:{...e.stages,...y}})))},y={identity:{}},f={wrapperComponent:{identity:"kyc/identityComponent"}},g={identity:{nationality:{uiName:"Pa\xeds emisor del documento:",key:"nationality",uiType:"select",settings:{defaultMessage:"Selecciona la nacionalidad de tu documento de identidad",successPattern:/[a-zA-Z _]{1,40}/g,errors:[{pattern:/[^a-zA-Z _()]{1,30}/g,message:"Solo se permiten letras..."}],placeholder:"Ej: pasaporte",queryParams:{form:"personal_country"}}},id_type:{key:"id_type",uiType:"text",settings:{defaultMessage:"Elige el documento de identidad con el que verificar\xe1s tu cuenta.",successPattern:/[a-zA-Z ]{3,40}/g,placeholder:"Elije tu documento de identidad",selectList:{},queryParams:{form:"personal_id_type"},errors:[]}},birthday:{key:"birthday",uiType:"date",settings:{defaultMessage:"Ingresa t\xfa fecha de nacimiento (D\xeda / Mes / A\xf1o)",props:{min:"1930-01-01",max:"2003-12-31",pattern:"[0-9]{2}-[0-9]{2}-[0-9]{4}"},queryParams:{form:"personal_birthday"}}},id_number:{key:"id_number",uiType:"text",settings:{defaultMessage:"Dig\xedta tu n\xfamero de documento",successPattern:{pasaporte:/[0-9A-Z]{5,15}/g,others:/[0-9]{5,15}/g},placeholder:"D\xedgita el n\xfamero del documento que eleg\xedste",queryParams:{form:"personal_number_id"},errors:{pasaporte:[{pattern:/[^0-9A-Z]/g,message:"Solo se permiten valores alfanum\xe9ricos..."}],others:[{pattern:/[^0-9]/g,message:"Solo se permiten valores n\xfamericos..."}]},mainComponent:null}},surname:{key:"surname",uiType:"text",settings:{defaultMessage:"Tus apellidos deben coincidir con los de tu documento de identidad.",successPattern:/[a-zA-Z\u00f1\u00d1 ]{3,40}/g,label:"Apellidos completos:",placeholder:"Ej: Sanchez buitrago",queryParams:{form:"personal_surnames"},errors:[{pattern:/[^a-zA-Z\u00f1\u00d1 ]{1,30}/g,message:"Solo se permiten letras..."}]}},name:{key:"name",uiType:"text",settings:{defaultMessage:"Los nombres deben coincidir con los de tu documento de identidad",successPattern:/[a-zA-Z\u00f1\u00d1 ]{3,40}/g,label:"Nombres completos (Sin apellidos):",placeholder:"Ej: Juan jos\xe9 ",queryParams:{form:"personal_names"},errors:[{pattern:/[^a-zA-Z\u00f1\u00d1 ]{1,30}/g,message:"Solo se permiten letras..."}],AuxComponent:null,MainComponent:null}}}}},493:function(e,t,n){"use strict";n.r(t),n.d(t,"ApiGetPersonalStages",(function(){return r})),n.d(t,"ApiPostPersonalKyc",(function(){return i})),n.d(t,"PERSONAL_DEFAULT_STATE",(function(){return s})),n.d(t,"PERSONAL_COMPONENTS",(function(){return u})),n.d(t,"PERSONAL_STAGES",(function(){return c}));var a=n(62),o=n(503);console.log({res:{levels:{level_1:{personal:{natural:{name:{ui_name:"Nombres completos"},phone:{ui_name:"Numero de tel\xe9fono",ui_type:"phone"},nationality:{colombia:{ui_name:"Colombia"},afghanistan:{ui_name:"Afghanistan"},ui_name:"Nacionalidad del documento",ui_type:"select"},address:{ui_name:"Direcci\xf3n de residencia"},city:{ui_name:"Ciudad"},id_type:{ui_name:"Tipo de documento",ui_type:"select",cedula_ciudadania:{ui_name:"Cedula de ciudadan\xeda"},cedula_extranjeria:{ui_name:"Cedula de extranjer\xeda"},pasaporte:{ui_name:"Pasaporte"},pep:{ui_name:"Permiso especial de permanencia"}},id_number:{ui_name:"N\xfamero de documento",ui_type:"text"},birthday:{ui_name:"Fecha de nacimiento",ui_type:"date"},country:{colombia:{ui_name:"Colombia",value:"colombia"},peru:{ui_name:"Per\xfa",value:"peru"},ui_name:"Pa\xeds",ui_type:"select"},surname:{ui_name:"Apellidos completos"}}}}}}});const r=async e=>{var t;const{personType:n,level:o,formName:r}=e;let i=await a.a.countryValidators();if(i)return null===i||void 0===i||null===(t=i.res)||void 0===t?void 0:t.levels[o][r][n]},i=async(e,t)=>{const{setLoading:n,prevStage:r,toastMessage:i}=t;let s={info:{...e},info_type:"personal",verification_level:"level_1"};s.info.birthday.includes("/")&&(s.info.birthday=Object(o.formatMaskDate)(s.info.birthday));const u=Object(o.parseDateToTimeStamp)(s.info.birthday);console.log("timeStampDate",s.info.birthday),console.log("timeStampDate",u),s.info.birthday=u,n(!0);let c=await a.a.updateLevelProfile(s);if(n(!1),!c)return i("No ha sido posible completar la verificaci\xf3n.","error"),r();const{user:l}=a.a.globalState.modelData,{data:{personal:d}}=c;let m={...l,...d,levels:{...l.levels,personal:"confirmed"},security_center:{...l.security_center,kyc:{...l.security_center.kyc,basic:"confirmed"}},country:l.country};return await a.a.updateUser(m),c},s={personal:{meta_phone:"colombia"}},u={wrapperComponent:{personal:"personalKycComponent"}},c={personal:{id_type:{key:"id_type",uiType:"text",settings:{defaultMessage:"Elige el documento de identidad con el cual verificar\xe1s tu cuenta.",successPattern:/[a-zA-Z ]{3,40}/g,placeholder:"Elije tu documento de identidad",selectList:{},queryParams:{form:"personal_id_type"},errors:[]}},city:{key:"city",uiType:"text",settings:{defaultMessage:"Escribe la ciudad en la que resides actualmente",successPattern:/[a-zA-Z ]{3,40}/g,placeholder:"Elije tu ciudad actual",queryParams:{form:"personal_residence_city"},errors:[{pattern:/[^a-zA-Z ]{1,30}/g,message:"Solo se permiten letras..."}]}},address:{key:"address",uiType:"text",settings:{defaultMessage:"Escribe de forma completa tu direcci\xf3n actual de residencia",successPattern:/[a-zA-Z ]{3,40}/g,placeholder:"Escribe la direcci\xf3n",queryParams:{form:"personal_address"},errors:[{pattern:/[^a-zA-Z ]{1,30}/g,message:"Solo se permiten letras..."}]}},surname:{key:"surname",uiType:"text",settings:{defaultMessage:"Tus apellidos deben coincidir con los de tu documento de identidad.",successPattern:/[a-zA-Z\u00f1\u00d1 ]{3,40}/g,label:"Apellidos completos:",placeholder:"Ej: Sanchez buitrago",queryParams:{form:"personal_surnames"},errors:[{pattern:/[^a-zA-Z\u00f1\u00d1 ]{1,30}/g,message:"Solo se permiten letras..."}]}},name:{key:"name",uiType:"text",settings:{defaultMessage:"Los nombres deben coincidir con los de tu documento de identidad",successPattern:/[a-zA-Z\u00f1\u00d1 ]{3,40}/g,label:"Nombres completos (Sin apellidos):",placeholder:"Ej: Juan jos\xe9 ",queryParams:{form:"personal_names"},errors:[{pattern:/[^a-zA-Z\u00f1\u00d1 ]{1,30}/g,message:"Solo se permiten letras..."}],AuxComponent:null,MainComponent:null}},nationality:{key:"nationality",uiType:"select",settings:{defaultMessage:"Selecciona la nacionalidad de tu documento de identidad",successPattern:/[a-zA-Z _]{1,40}/g,errors:[{pattern:/[^a-zA-Z _]{1,30}/g,message:"Solo se permiten letras..."}],placeholder:"Ej: pasaporte",queryParams:{form:"personal_country"}}},country:{uiName:"Pa\xeds",key:"country",uiType:"select",selectList:{},settings:{defaultMessage:"Elige el pa\xeds de residencia actual",successPattern:/[a-zA-Z _]{1,40}/g,errors:[{pattern:/[^a-zA-Z _]{1,30}/g,message:"Solo se permiten letras..."}],label:"Pa\xeds",placeholder:"",queryParams:{form:"personal_country"},auxComponent:null,mainComponent:null}},birthday:{key:"birthday",uiType:"date",settings:{defaultMessage:"Ingresa t\xfa fecha de nacimiento (D\xeda / Mes / A\xf1o)",props:{min:"1930-01-01",max:"2003-12-31",pattern:"[0-9]{2}-[0-9]{2}-[0-9]{4}"},queryParams:{form:"personal_birthday"}}},id_number:{key:"id_number",uiType:"text",settings:{defaultMessage:"Dig\xedta tu n\xfamero de documento",successPattern:{pasaporte:/[0-9A-Z]{5,15}/g,others:/[0-9]{5,15}/g},placeholder:"D\xedgita el n\xfamero del documento que eleg\xedste",queryParams:{form:"personal_number_id"},errors:{pasaporte:[{pattern:/[^0-9A-Z]/g,message:"Solo se permiten valores alfanum\xe9ricos..."}],others:[{pattern:/[^0-9]/g,message:"Solo se permiten valores n\xfamericos..."}]},mainComponent:null}},phone:{uiName:"N\xfamero de tel\xe9fono",key:"phone",uiType:"text",settings:{defaultMessage:"Dig\xedta tu n\xfamero de celular",successPattern:/[0-9]{5,40}/g,queryParams:{form:"personal_phone"},errors:[{pattern:/[^0-9]/g,message:"Solo se permiten N\xfameros..."}],auxComponent:"personalKycComponent/countryPrefix",mainComponent:null}}}}},494:function(e,t,n){"use strict";n.r(t),n.d(t,"ApiGetLocationStages",(function(){return r})),n.d(t,"ApiPostLocation",(function(){return i})),n.d(t,"LOCATION_DEFAULT_STATE",(function(){return s})),n.d(t,"LOCATION_COMPONENTS",(function(){return u})),n.d(t,"LOCATION_STAGES",(function(){return c}));var a=n(62);const o={location_country:{ui_name:"Pa\xeds",ui_type:"select"},province:{ui_name:"Provincia",ui_type:"text"},city:{ui_name:"Ciudad",ui_type:"text"},address:{ui_name:"Direcci\xf3n",ui_type:"text"}},r=async e=>o,i=async e=>{const t=await a.a.createLocation({data:e});if(!t)return;await a.a.fetchCompleteUserData();const n=await a.a.createRequirementLevel();if(n){const{requirements:e}=n;return e[0]}return t},s={location:{}},u={wrapperComponent:{location:"kyc/locationComponent"}},c={location:{province:{uiName:"Departamento:",key:"province",uiType:"select",settings:{defaultMessage:"Selecciona el departamento de residencia actual",successPattern:/[a-zA-Z _]{1,40}/g,errors:[{pattern:/[^a-zA-Z _]{1,30}/g,message:"Solo se permiten letras..."}],placeholder:"Ej: Antioquia",queryParams:{form:"province"}}},location_country:{uiName:"Pa\xeds de residencia:",key:"location_country",uiType:"select",settings:{defaultMessage:"Selecciona el pa\xeds de residencia actual",successPattern:/[a-zA-Z _]{1,40}/g,errors:[{pattern:/[^a-zA-Z _]{1,30}/g,message:"Solo se permiten letras..."}],placeholder:"Ej: pasaporte",queryParams:{form:"location_country"}}},address:{key:"address",uiType:"text",settings:{defaultMessage:"Escribe de forma completa tu direcci\xf3n actual de residencia",successPattern:/[a-zA-Z ]{3,40}/g,placeholder:"Escribe la direcci\xf3n",queryParams:{form:"personal_address"},errors:[{pattern:/[^a-zA-Z ]{1,30}/g,message:"Solo se permiten letras..."}]}}}}},495:function(e,t,n){"use strict";n.r(t),n.d(t,"CONTACT_DEFAULT_STATE",(function(){return r})),n.d(t,"ApiGetContactStages",(function(){return i})),n.d(t,"ApiPostContact",(function(){return s})),n.d(t,"CONTACT_COMPONENTS",(function(){return u})),n.d(t,"CONTACT_STAGES",(function(){return c}));var a=n(62);const o={phone:{ui_name:"N\xfamer de celular",ui_type:"text"}},r={contact:{}},i=async e=>o,s=async e=>{const t=await a.a.createContact(e);if(!t)return;await a.a.fetchCompleteUserData();const n=await a.a.createRequirementLevel();if(n){const{requirements:e}=n;return e[0]}return t},u={wrapperComponent:{contact:"kyc/contactComponent"}},c={contact:{phone:{uiName:"N\xfamero de tel\xe9fono",key:"phone",uiType:"text",settings:{defaultMessage:"Dig\xedta tu n\xfamero de celular",successPattern:/[0-9]{5,40}/g,queryParams:{form:"personal_phone"},errors:[{pattern:/[^0-9]/g,message:"Solo se permiten N\xfameros..."}],auxComponent:null,mainComponent:null}}}}},496:function(e,t,n){"use strict";n.r(t),n.d(t,"ONBOARDING_COMPONENTS",(function(){return o})),n.d(t,"ONBOARDING_STAGES",(function(){return r})),n.d(t,"ApiGetOnBoardingStages",(function(){return i}));const a={firstStage:{},secondStage:{},thirdStage:{}},o={successStage:{onBoarding:{component:"biometricKycSuccess"}},wrapperComponent:{onBoarding:"onBoardingComponent"}},r={onBoarding:a},i=async()=>a},497:function(e,t,n){"use strict";n.r(t),n.d(t,"NEW_WALLET_COMPONENTS",(function(){return o})),n.d(t,"NEW_WALLET_STAGES",(function(){return r})),n.d(t,"ApiGetNewWalletStages",(function(){return i})),n.d(t,"NEW_WALLET_DEFAULT_STATE",(function(){return s}));const a={currency:""},o={wrapperComponent:{newWallet:"newWallet"}},r={newWallet:a},i=async()=>a,s={}},498:function(e,t,n){"use strict";n.r(t),n.d(t,"ApiGetBiometricStages",(function(){return o})),n.d(t,"BIOMETRIC_COMPONENTS",(function(){return r})),n.d(t,"BIOMETRIC_STAGES",(function(){return i}));var a=n(62);const o=async()=>{let e={};const t=await a.a.getUserBiometric();if(t){for(const n in t.challenge)e={...e,[n]:{key:n,solved:t.solved,biometricId:t.id,ui_type:"img",ui_name:"smile"===n?"Sonr\xede":"Abre la boca y levanta las cejas"}};return e}},r={wrapperComponent:{biometric:"biometricKycComponent"}},i={biometric:{}}},500:function(e,t,n){"use strict";n.r(t),n.d(t,"parseTimeStampToDate",(function(){return l})),n.d(t,"parseDateToTimeStamp",(function(){return d})),n.d(t,"formatJsonUTFDate",(function(){return m})),n.d(t,"formatMaskDate",(function(){return p})),n.d(t,"removeItemTag",(function(){return y})),n.d(t,"debugItemTag",(function(){return f})),n.d(t,"getBody",(function(){return g})),n.d(t,"parseOnlyLetters",(function(){return _})),n.d(t,"parseOnlyNumbers",(function(){return v})),n.d(t,"parseAlphanumeric",(function(){return T})),n.d(t,"writeOnLabel",(function(){return S})),n.d(t,"validateLabelMsg",(function(){return A})),n.d(t,"addItemTag",(function(){return E})),n.d(t,"getNextSelectList",(function(){return O}));var a=n(20),o=n.n(a),r=n(523),i=n(488),s=n(473);const u=/[0-9]{4}-[0-9]{2}-[0-9]{2}/g,c=/[0-9]{2}[/][0-9]{2}[/][0-9]{4}/g,l=e=>{if(e.includes("-"))return e;const t=new Date(new o.a(e).multipliedBy(1e3).toNumber()).toISOString().match(u);return t&&t[0]},d=e=>{const{year:t,month:n,day:a}=m(e),r=new Date(t,n,a).getTime();return o()(r).div(1e3).toString()},m=e=>{if(!(null===e||void 0===e?void 0:e.match(u)))return e;let t=e.split("-");const n=t[0],a=parseInt(t[1])-1;return{day:t[2],month:a,year:n}},p=e=>{if(!(e=>{if(e)return e.match(c)})(e))return e;let t=e.split("/");const n=t[0],a=t[1],o=t[2];return"".concat(o,"-").concat(a,"-").concat(n)},y=(e,t,n)=>{var a,o,r,i;if(null===e||void 0===e||null===(a=e.target)||void 0===a||null===(o=a.className)||void 0===o?void 0:o.includes)return(null===(r=e.target)||void 0===r||null===(i=r.className)||void 0===i?void 0:i.includes("selectedItemTag__closeButton"))?(e.stopPropagation(),t&&(document.querySelector('[name="'.concat(t,'"]')).value="",document.querySelector('[name="'.concat(t,'"]')).focus()),n&&n({target:{value:""}}),document.querySelector("#selectedItemTag").remove()):void 0},f=e=>{const t=document.querySelector(".selectedItemTag"),n=document.querySelector(".selectedItemTag._".concat(e));if(t&&!n)return t.remove()},g=(e,t)=>{var n,a;let{stages:{nationality:o}}=t;console.log("|||||||||||||||||  select List =====> ",null===o||void 0===o?void 0:o.selectList,null===e||void 0===e?void 0:e.meta_phone);const r=(null===o||void 0===o||null===(n=o.selectList[null===e||void 0===e?void 0:e.meta_phone])||void 0===n?void 0:n.prefix)?null===o||void 0===o||null===(a=o.selectList[null===e||void 0===e?void 0:e.meta_phone])||void 0===a?void 0:a.prefix[0]:"",i={...e};return delete i.meta_phone,i.phone="".concat(r," ").concat(e.phone),i},_=e=>e.replace(/[^a-zA-Z\u00f1\u00d1 ]/g,""),v=e=>e.replace(/[^0-9]/g,""),T=e=>e.replace(/[^0-9a-zA-Z]/g,""),S=function(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"default",a=document.querySelector(e);a&&(a.style.color=r.LABEL_COLOR[n],a.innerHTML=t)},A=(e,t)=>{var n;const a=".label_text__".concat(t.key);if(null===t||void 0===t||null===(n=t.settings)||void 0===n?void 0:n.errors){console.log("validateLabelMsg",e);for(let n of t.settings.errors)e.match(n.pattern)?S(a,n.message,"error"):S(a,t.settings.defaultMessage)}},E=(e,t,n)=>{if(!document.querySelector(".selectedItemTag._".concat(e))){var a;const o=n||".inputContainer__",r=document.querySelector(o),i=h(e,t);r.appendChild(i),null===(a=document.querySelector('[name="'.concat(e,'"]')))||void 0===a||a.blur()}},h=(e,t)=>{const n=document.createElement("div");n.className="fuente selectedItemTag _".concat(e),n.id="selectedItemTag";const a=document.createElement("div");a.className="selectedItemTag__title";const o=document.createElement("p");o.innerHTML=null===t||void 0===t?void 0:t.toLowerCase();const r=document.createElement("p");return r.innerHTML="x",r.className="selectedItemTag__closeButton",a.appendChild(o),a.appendChild(r),n.appendChild(a),n},O=async e=>{var t;let{state:n,stageData:a,setDataForm:o}=e;const r=null===a||void 0===a?void 0:a.key;if(!i.c[r])return;const u=i.c[r],c=await Object(s.d)(u,n[null===a||void 0===a?void 0:a.key]);return!c||c&&!(null===(t=Object.keys(c))||void 0===t?void 0:t.length)?o((e=>({...e,stages:{...e.stages,[u]:{...e.stages[u],uiType:"text",selectList:null}}}))):(o((e=>({...e,stages:{...e.stages,[u]:{...e.stages[u],uiType:"select",selectList:c}}}))),c)}},503:function(e,t,n){"use strict";n.r(t),n.d(t,"parseTimeStampToDate",(function(){return u})),n.d(t,"parseDateToTimeStamp",(function(){return c})),n.d(t,"formatJsonUTFDate",(function(){return l})),n.d(t,"formatMaskDate",(function(){return d})),n.d(t,"removeItemTag",(function(){return m})),n.d(t,"debugItemTag",(function(){return p})),n.d(t,"getBody",(function(){return y})),n.d(t,"parseOnlyLetters",(function(){return f})),n.d(t,"parseOnlyNumbers",(function(){return g})),n.d(t,"parseAlphanumeric",(function(){return _})),n.d(t,"writeOnLabel",(function(){return v})),n.d(t,"validateLabelMsg",(function(){return T})),n.d(t,"addItemTag",(function(){return S}));var a=n(20),o=n.n(a),r=n(522);const i=/[0-9]{4}-[0-9]{2}-[0-9]{2}/g,s=/[0-9]{2}[/][0-9]{2}[/][0-9]{4}/g,u=e=>{if(e.includes("-"))return e;const t=new Date(new o.a(e).multipliedBy(1e3).toNumber()).toISOString().match(i);return t&&t[0]},c=e=>{const{year:t,month:n,day:a}=l(e),r=new Date(t,n,a).getTime();return o()(r).div(1e3).toString()},l=e=>{if(!(null===e||void 0===e?void 0:e.match(i)))return e;let t=e.split("-");const n=t[0],a=parseInt(t[1])-1;return{day:t[2],month:a,year:n}},d=e=>{if(!(e=>{if(e)return e.match(s)})(e))return e;let t=e.split("/");const n=t[0],a=t[1],o=t[2];return"".concat(o,"-").concat(a,"-").concat(n)},m=(e,t,n)=>{var a,o,r,i;if(null===e||void 0===e||null===(a=e.target)||void 0===a||null===(o=a.className)||void 0===o?void 0:o.includes)return(null===(r=e.target)||void 0===r||null===(i=r.className)||void 0===i?void 0:i.includes("selectedItemTag__closeButton"))?(e.stopPropagation(),t&&(document.querySelector('[name="'.concat(t,'"]')).value="",document.querySelector('[name="'.concat(t,'"]')).focus()),n&&n({target:{value:""}}),document.querySelector("#selectedItemTag").remove()):void 0},p=e=>{const t=document.querySelector(".selectedItemTag"),n=document.querySelector(".selectedItemTag._".concat(e));if(t&&!n)return t.remove()},y=(e,t)=>{var n,a;let{stages:{nationality:o}}=t;console.log("|||||||||||||||||  select List =====> ",null===o||void 0===o?void 0:o.selectList,null===e||void 0===e?void 0:e.meta_phone);const r=(null===o||void 0===o||null===(n=o.selectList[null===e||void 0===e?void 0:e.meta_phone])||void 0===n?void 0:n.prefix)?null===o||void 0===o||null===(a=o.selectList[null===e||void 0===e?void 0:e.meta_phone])||void 0===a?void 0:a.prefix[0]:"",i={...e};return delete i.meta_phone,i.phone="".concat(r," ").concat(e.phone),i},f=e=>e.replace(/[^a-zA-Z\u00f1\u00d1 ]/g,""),g=e=>e.replace(/[^0-9]/g,""),_=e=>e.replace(/[^0-9a-zA-Z]/g,""),v=function(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"default",a=document.querySelector(e);a&&(a.style.color=r.LABEL_COLOR[n],a.innerHTML=t)},T=(e,t)=>{var n;const a=".label_text__".concat(t.key);if(null===t||void 0===t||null===(n=t.settings)||void 0===n?void 0:n.errors)for(let o of t.settings.errors)e.match(o.pattern)?v(a,o.message,"error"):v(a,t.settings.defaultMessage)},S=(e,t,n)=>{if(!document.querySelector(".selectedItemTag._".concat(e))){var a;const o=n||".inputContainer__",r=document.querySelector(o),i=A(e,t);r.appendChild(i),null===(a=document.querySelector('[name="'.concat(e,'"]')))||void 0===a||a.blur()}},A=(e,t)=>{const n=document.createElement("div");n.className="fuente selectedItemTag _".concat(e),n.id="selectedItemTag";const a=document.createElement("div");a.className="selectedItemTag__title";const o=document.createElement("p");o.innerHTML=t;const r=document.createElement("p");return r.innerHTML="x",r.className="selectedItemTag__closeButton",a.appendChild(o),a.appendChild(r),n.appendChild(a),n}},522:function(e,t,n){"use strict";n.r(t),n.d(t,"LABEL_COLOR",(function(){return a}));const a={default:"gray",error:"red"}},523:function(e,t,n){"use strict";n.r(t),n.d(t,"LABEL_COLOR",(function(){return a}));const a={default:"gray",error:"red"}}}]);
//# sourceMappingURL=9.f7f864f6.chunk.js.map