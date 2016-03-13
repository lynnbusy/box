/**
 *  Feedback Page.jsx
 *  用户反馈详情页
 *
 *  @props  {Bool}      open            是否开启
 *  @props  {Function}  backCallback    返回回调
 *  @return {Component} FeedbackPage
 */

define([
    'React',
    'navBar',
    'util',
    'IScroll'
], function(
    React,
    NavBar,
    Util,
    IScroll
) {
    'use strict'

    // Component
    var AdPage = React.createClass({
        render: function(){
            let _isOpen = (this.props.open) ? "open" : "",
            	ad = window.adLists ? window.adLists[this.props.targeturlPageIndex] : null,
            	_title = ad ? ad.title : '',
                targetUrl = '',
                _iframe = '';
            	// targetUrl = (ad && this.props.open) ? decodeURIComponent(ad.url) : '';

            if(ad && this.props.open){
                targetUrl = decodeURIComponent(ad.url);
                _iframe = (
                    <div className="targeturl-scroller" style={{"-webkit-overflow-scrolling": "touch", "overflow":"auto", "z-index":"100", "height": "100%"}}>
                        <iframe id="iframepage" style={{"position":"relative", "top": "40px", "width":document.body.clientWidth, "height":"100%", "overflow": "hidden"}} src={targetUrl}></iframe>
                    </div>
                )
            }

            return (
                <div className={"movie-detail targeturl-page " + _isOpen}>
                    <NavBar
                        rightLogo
                        leftNav=" "
                        title={_title}
                        backCallback={this.backCallback} />
                    {_iframe}
                </div>
            )
        },
        /**/
        getInitialState: function(){
            return {

            }
        },
        getDefaultProps: function(){
            return {

            }
        },
        componentDidMount: function(){
        	// this.initIScroll();
            var ifm = document.getElementById("iframepage");
            if(ifm){
                var _system = Util.compareSystem();
                if(_system === 'iOS'){
                    ifm.scrolling = "no";
                }

                ifm.frameBorder = "0";
            }
        },
        componentDidUpdate: function(){
            if(this.props.open){
                // this.targeturlScroll.refresh();
                // var ifm = document.getElementById("iframepage");

                // var subWeb = document.frames ? document.frames["iframepage"].document : ifm.contentDocument;   
                // if(ifm != null && subWeb != null) {
                //    ifm.height = subWeb.body.scrollHeight;
                //    ifm.width = subWeb.body.scrollWidth;
                // }  
            }
        },
        // shouldComponentUpdate: function(nextProps, nextState) {
        //     let open = nextProps.open;
        //     let _el = document.getElementsByClassName('targeturl-page')[0];
        //     if(open){
        //         _el.className = "movie-detail targeturl-page open";
        //         return true;
        //     }else{
                
        //         _el.className = "movie-detail targeturl-page ";
        //         return false;
        //     }
            
        // },
        initIScroll: function(){
            var self = this;
            //init IScroll
            this.targeturlScroll = new IScroll('.targeturl-scroller', {
                scrollX: false,
                scrollY: true,
                mouseWheel: true,
                bindToWrapper: true,
                probeType: 3,
                preventDefault:  Util.iScrollClick(),
                tap: Util.iScrollClick(),
                click: Util.iScrollClick()
            });
            
        },
        backCallback: function(){
            this.props.backCallback('adpage');
        }
    })

    return AdPage;
 })
