(this["webpackJsonpcoinsenda-app"]=this["webpackJsonpcoinsenda-app"]||[]).push([[56],{616:function(e,t,i){},667:function(e,t,i){"use strict";i.r(t);var s=i(2),n=i(609),a=i.n(n),o=i(98),c=i(28),l=i(99),r=i(614),d=i.n(r),u=(i(616),i(14));class p extends s.Component{constructor(){super(...arguments),this.state={isFull:!1},this.goFull=()=>{this.setState({isFull:!0})},this.minimize=()=>{this.setState({isFull:!1})}}componentWillUnmount(){}render(){const{video:e}=this.props,{isFull:t}=this.state;return Object(u.jsx)("div",{className:"VideoPlayer",style:{display:e&&e.play?"block":"none"},children:e&&e.play&&Object(u.jsxs)("div",{className:"videoPlayerContainer",children:[Object(u.jsx)("div",{className:"closeButtonPlayer",onClick:this.props.action.default_video_state,children:Object(u.jsx)("i",{className:"far fa-times-circle"})}),Object(u.jsx)(d.a,{enabled:t,onChange:e=>this.setState({isFull:e}),children:Object(u.jsx)(a.a,{ref:"player",id:"putis",width:"100%",height:"100%",url:e.url,playing:e.play,controls:!0,onStart:this.goFull,onPause:this.minimize,onEnded:this.props.action.default_video_state})})]})})}}t.default=Object(o.b)((function(e,t){const{user:i}=e.modelData,{videos:s,verification_state:n}=e.ui;return{user:i,video:s["rejected"!==n&&n?"pending"===n&&"kyc_advanced":"kyc_basic"],verification_state:n}}),(function(e){return{action:Object(c.bindActionCreators)(l.a,e)}}))(p)}}]);
//# sourceMappingURL=56.566e2bd1.chunk.js.map