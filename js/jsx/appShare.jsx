/**
 *  share.jsx
 *  App 显示，web 隐藏
 *
 */

define(['React', 'util'], function(React, Util){
    'use strict'

    var AppShare = React.createClass({
        render: function(){
            var isApp = this.state.apps.isApp;
            if(isApp){
                this.appinit();
            }
            return (
                <div className={"nav-share " + (isApp ? "" : "cached")}>
                    <h4 onClick={this.onClickShare.bind()}><i className="icon-share"></i></h4>
                </div>
            )
        },

        getInitialState: function(){
            return {
                apps: Util.compareVersion()
            }
        },

        shouldComponentUpdate: function(nextProps, nextState) {
            var isApp = this.state.apps.isApp;
            return isApp;
        },

        onClickShare: function(evt){
            var app_el = document.getElementById('app');
            app_el.className = 'share_img';
            var _iScrolls = window.app_iScrolls,
                _iScrollsLen = _iScrolls.length;
            // alert(navigator.userAgent);
            // alert(this.state.apps.version)
            if(!this.state.apps.version){
                for(var i = 0; i < _iScrollsLen; i++){
                    var _iScroll = _iScrolls[i];
                    if(_iScroll){
                        _iScroll.scrollTo(0, 0);
                    }
                }
            }
            // console.log(window.shareinfo)
            if(window.shareinfo && window.shareinfo.page){
                var shearPage = window.shareinfo.page;
            }else{
                var shearPage = '票房-分享';
            }
            //点击分享时调用
            if(this.state.apps.type == 'iOS'){
                Util.setPiaoFangEventGa("iOS分享", "photo", window.shareinfo.page, 'iOS:' + shearPage);

                // ga('send', 'event', 'iOS分享', 'click', window.shareinfo.page , 1);
                // //Hawkeye - Wepiao FE Analytics Solution
                // he && he('send', 'event', 'photo', 'click', 'iOS截屏:' + window.shareinfo.page, 1);
                this.connectWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler("clickShare", window.shareinfo, function(response) {
                        console.log('iOS回调成功');
                        app_el.className = '';
                    });
                });
            }else if(this.state.apps.type == 'Android'){
                Util.setPiaoFangEventGa("Android分享", "photo", window.shareinfo.page, 'Android:' + shearPage);
                // ga('send', 'event', 'Android分享', 'click', window.shareinfo.page , 1);
                // //Hawkeye - Wepiao FE Analytics Solution
                // he && he('send', 'event', 'photo', 'click', 'Android截屏:' + window.shareinfo.page, 1);
                window.androidCallBack = function(){
                    console.log('Android回调成功');
                    app_el.className = '';
                }
                if(window.clickShare && window.clickShare.clickShare){
                    window.clickShare.clickShare(JSON.stringify(window.shareinfo), 'androidCallBack');
                }
            }

        },

        appinit: function(){
            // var oHead = document.getElementsByTagName('HEAD').item(0); 
            // var oScript= document.createElement("script"); 
            // oScript.type = "text/javascript"; 
            // oScript.src="js/html2canvas.min.js"; 
            // oHead.appendChild( oScript);
            if(this.state.apps.type == 'iOS' && !window.isiOSInit){
                window.isiOSInit = true;
                this.connectWebViewJavascriptBridge(function(bridge) {
                    bridge.init(function(message, responseCallback) {
                        if (responseCallback) {
                            responseCallback()
                        }
                    })
                })
            }
        },

        //iOS 需要的部分
        connectWebViewJavascriptBridge: function(callback) {
            if (window.WebViewJavascriptBridge) {
                callback(WebViewJavascriptBridge);
            } else {
                document.addEventListener('WebViewJavascriptBridgeReady', function() {
                    callback(WebViewJavascriptBridge);
                }, false);
            }
        }

     })

     return AppShare;
 })




