define(["React"],function(e){var t=e.createClass({displayName:"NavBar",render:function(){var t=this,a=this.props.leftNav&&e.createElement("span",{onClick:this.props.backCallback,className:"ico-back"},this.props.leftNav),l=this.props.rightLogo&&e.createElement("span",{className:"rightLogo"},e.createElement("img",{src:"icon/logo.png"})),n=this.props.bigLogo&&e.createElement("img",{className:"bigLogo",src:"icon/logo.png"}),c=function(){return t.props.bigLogo?e.createElement("h1",null,n,e.createElement("div",{className:"titleBox"},e.createElement("b",null,t.props.title),e.createElement("i",null,"piaofang.wepiao.com")),e.createElement("i",{className:"icon-search",onClick:t.handleClick})):e.createElement("h1",null,t.props.title)}();return e.createElement("header",null,a,l,c)},handleClick:function(){this.props.clickSearch(!0)}});return t});
//# sourceMappingURL=my.js.map