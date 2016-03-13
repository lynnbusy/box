/**
 *  My.jsx
 *  我的 页面
 */



define(['React','navBar', 'util'], function(React, NavBar, Util){
    'use strict'
    //defaultChecked="checked"
    var lock = false,
        languageLock = false;

    var Mine = React.createClass({
        render: function(){
            let _isOpen = (this.props.open) ? "open" : "";
            let apps = this.state.apps,
                seting = '', praise = '',
                language = this.props.language.mine,
                pushEnabledStr = this.state.pushEnabled ? language.push_ios.status[0] : language.push_ios.status[1];

            // ios version > 1.1    android version > 1.2
            if(apps.isApp && this.props.open){
                if(apps.type == 'iOS'){
                    seting = (
                        <li>
                            <span>{language.push_ios.title}</span>
                            <span className="pushenabled">{pushEnabledStr}</span>
                            <p>{language.push_ios.info}</p>
                        </li>
                    )

                    praise = <li className="arr-right" onClick={this.clickPraise}> {language.comment}</li>
                }else if(apps.type == 'Android'){
                    var _checked = this.state.pushEnabled ? "checked" : "";
                    seting = (
                        <li>
                            <span>{language.push_android.title}</span>
                            <input className="mui-switch mui-switch-anim" type="checkbox" defaultChecked={_checked} onChange={this.pushNotification} />
                            <p>{language.push_android.info}</p>
                        </li>
                    )
                }
            }
            /**/
            return (
                <div className={"movie-detail mine-page " + _isOpen}>
                    <NavBar
                        rightLogo
                        leftNav=" "
                        title={language.titlebar}
                        backCallback={this.props.backCallback} />
                    <ul className="myset">
                        {seting}
                        <li> 
                            <span>{language.language}</span> 
                            <input className="mui-switch mui-switch-anim" type="checkbox" onChange={this.changeLanguage} />
                        </li>
                        <li className="arr-right" onClick={this.clickGotoFeedblock}> {language.feedback}</li>
                        {praise}
                        <li> {language.version} <em>{apps.version}</em></li>
                    </ul>
                </div>
            )
        },
        /**/
        getInitialState: function(){
            return {
                apps: Util.compareVersion(),
                pushEnabled: null
            }
        },
        componentDidMount: function(){
            
        },
        pushNotification: function(evt){
            // console.log(evt)
            var checked = evt.target.checked;
            if(checked){
                if(window.XGPush && window.XGPush.setOn){
                    window.XGPush.setOn('');
                }
            }else{
                if(window.XGPush && window.XGPush.setOff){
                    window.XGPush.setOff('');
                }
            }

        },
        changeLanguage: function(evt){
            let checked = evt.target.checked,
                languageType = this.props.language.type == 'cn' ? 'en' : 'cn';
            if(checked && !languageLock){
                languageLock = true;
                localStorage.setItem('language', languageType);
                // location.reload();
                Util.toast(languageType == 'cn' ? '设置中...' : 'Setting...', 2e3);
                setTimeout(function(){
                    location.href = '/';
                }, 1800)
                    
            }
        },
        shouldComponentUpdate: function(nextProps, nextState) {
            let apps = this.state.apps;
            // ios version > 1.1    android version > 1.2
            if(apps.isApp && !lock){
                lock = true;
                this.appinit();
            } 

            var _isOpen = nextProps.open;
            var _el = document.getElementsByClassName('mine-page')[0];
            if(!_isOpen){
                _el.className = "movie-detail mine-page";
                return false;
            }else{
                _el.className = "movie-detail mine-page open";
            }
            return nextProps.open;
        },
        appinit: function(){
            let self = this;
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

            if(this.state.apps.type == 'Android'){
                // 
                window.androidXgpushCallBack = function(response){
                    // alert('Android回调成功0:' + typeof response)
                    
                    // console.log('Android回调成功');
                    self.setState({
                        pushEnabled: response
                    })
                    self.setAndroidXgpush(response)
                }
                //获取默认推送状态
                // alert('window.XGPush0:' + window.XGPush)
                // alert('window.XGPush1:' + window.XGPush.getStatus)
                // alert('window.setOn:' + window.XGPush.setOn)
                // alert('window.setOff:' + window.XGPush.setOff)
                if(window.XGPush && window.XGPush.getStatus){
                    window.XGPush.getStatus('androidXgpushCallBack');
                }
            }else if(this.state.apps.type == 'iOS'){
                this.connectWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler("checkPushStatus", '', function(response) {
                        console.log('iOS回调成功');
                        // alert(response.pushEnabled)
                        if(response){
                            self.setState({
                                pushEnabled: response.pushEnabled
                            })
                        }
                    });
                });
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
        },
        clickGotoFeedblock: function(){
            location.hash = "/feedback";
        },
        clickPraise: function(){
            window.location.href = 'https://itunes.apple.com/cn/app/wei-piao-er-piao-fang-fen-xi/id1048372216?mt=8';
            // alert(window.location.href)
            //https://itunes.apple.com/cn/app/wei-piao-er-piao-fang-fen-xi/id1048372216?mt=8
            //https://appsto.re/cn/4poF-.i
        },

        setAndroidXgpush: function(response){
            this.setState({
                pushEnabled: response
            })
            console.log(this.state.pushEnabled)
        },

        setPiaoFang: function(){
            ga('send', 'pageview', {
                'page': '/mine',
                'title': '我的'
            });
            //Hawkeye - Wepiao FE Analytics Solution
            he && he('send', 'pageview', 'mine');
        }

     })

     return Mine;
 })