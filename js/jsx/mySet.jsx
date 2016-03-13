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
    'datacenter'
], function(
    React,
    NavBar,
    Util,
    DataCenter
) {
    'use strict'

    // same order with UI
    const QUESTION_TYPE = {
        0: "BOX_OFFICE",            // 实时票房
        1: "TOTAL_BOX_OFFICE",      // 票房统计
        2: "SCHEDULE",              // 排片统计
        3: "TICKET_SEAT_RATE",      // 上座率
        4: "AVG_PERSON",            // 场均人次
        5: "TICKETS",               // 观影人次
        6: "OTHER"                  // 其他
    }

    // Parmas
    let _params = {
        "question": {
            "sourceUrl": "undefined",
            "content": "",
            "tel": "",
            "email": "",
            "questionType": "",
        }
    }

    // let Checkbox = React.createClass({
    //     getInitialState(){
    //         return {check: true}
    //     },
    //     handleChange(e){
    //         this.setState({message: e.target.checked});
    //     },
    //     render(){
    //         return(
    //             <li>
    //                 <div>
    //                     <input
    //                         type="checkbox"
    //                         className="ico-arr-check"
    //                         checked={this.props.check}
    //                         onChange={this.handleChange}
    //                     />
    //                     <label>{this.props.label}</label>
    //                 </div>
    //             </li>
    //         )
    //     }
    // })

    // Component
    var FeedbackPage = React.createClass({
        render: function(){
            var _isOpen = (this.props.open) ? "open" : "";
            var _title = this.props.movieName;
            var _current = this.state.currentSegment;

            return (
                <div className={"movie-detail feedback-page " + _isOpen}>
                    <NavBar
                        rightLogo
                        leftNav=" "
                        title="用户反馈"
                        backCallback={this.props.backCallback}
                    />
                        <div className="fp-scroller contentView">
                            <form
                                action=""
                                className = "scroller"
                                onSubmit={this.handleSubmit}
                            >
                            <h2>如果在使用过程中遇到问题，请按以下方式反馈，你的支持就是我们的动力。你也可以加入用户QQ群反馈给我们：237610287</h2>
                            <h2 className="contact"></h2>
                                <p>请选择问题</p>
                                <ol>
                                    <li><div><input type="checkbox" className="ico-arr-check" /><label>实时票房</label></div></li>
                                    <li><div><input type="checkbox" className="ico-arr-check" /><label>票房统计</label></div></li>
                                    <li><div><input type="checkbox" className="ico-arr-check"   /><label>排片统计</label></div></li>
                                </ol>
                                <ol>
                                    <li><div><input type="checkbox" className="ico-arr-check" /><label className="str3">上座率</label></div></li>
                                    <li><div><input type="checkbox" className="ico-arr-check"   /><label>场均人次</label></div></li>
                                    <li><div><input type="checkbox" className="ico-arr-check"   /><label>观影人次</label></div></li>
                                </ol>
                                <ol>
                                    <li><div><input type="checkbox" className="ico-arr-check"   /><label className="str2">其他</label></div></li>
                                </ol>
                                <textarea
                                    required
                                    name="content"
                                    className="border-1px"
                                    placeholder="请简要描述你的问题或者建议"
                                />
                                <ul>
                                    <li><label>联系电话</label>
                                        <input name="tel" placeholder="选填，便于我们与你联系" />
                                    </li>
                                    <li><label>邮箱</label>
                                        <input name="email" placeholder="选填，便于我们与你联系" />
                                    </li>
                                </ul>
                                <div className="btn-box">
                                    <input type="submit" className="btn submit" value="提交" />
                                </div>
                            </form>
                        </div>
                </div>
            )
        },
        getInitialState: function(){
            return {

            }
        },
        getDefaultProps: function(){
            return {

            }
        },
        shouldComponentUpdate: function(nextProps, nextState) {
            var _isOpen = nextProps.open;
            var _el = document.getElementsByClassName('feedback-page')[0];
            if(!_isOpen){
                _el.className = "movie-detail feedback-page";
            }else{
                _el.className = "movie-detail feedback-page open";
                ga('send', 'pageview', '/feedback-page');
            }
            return false;
        },
        componentDidMount: function(){
            this.initIScroll();
        },
        componentDidUpdate: function(){
            if(this.props.open){
                this.Scroll.refresh();
            }
        },
        componentWillReceiveProps: function(nextProps){

        },
        handleSubmit: function(event){
            let e = event.nativeEvent;
            let form = e.target;
            e.preventDefault();

            let questionTypeArr = [];
            form.forEach = Array.prototype.forEach;
            form.forEach(function(el, key){
                if(el.name == "content") _params.question.content = el.value;
                if(el.name == "email")   _params.question.email = el.value;
                if(el.name == "tel")     _params.question.tel = el.value;
                if(el.type == "checkbox" && el.checked == true){
                    questionTypeArr.push(QUESTION_TYPE[key])
                }
            })

            _params.question.questionType = questionTypeArr.join(',')
            console.log(_params);
            if(questionTypeArr.length == 0){
                Util.toast("请选择你想反馈的问题", 2e3);
                return;
            }

            // Post feedback
            DataCenter.Feedback.post(_params, (res) => {
                console.log("Feedback success");
                Util.toast("提交成功，感谢反馈！", 2e3);
                setTimeout(() => {
                    this.props.backCallback();
                }, 1000)

            }, (err) => {
                Util.toast("提交没有成功，请稍后再试~", 2e3);
                console.log(err);
            })

        },
        initIScroll: function(){
            //init IScroll
            this.Scroll = new IScroll('.fp-scroller', {
                mouseWheel: true,
                bindToWrapper: true,
                preventDefault:  Util.iScrollClick(),
                tap: Util.iScrollClick(),
                click: Util.iScrollClick(),
            });
        }
    })

    return FeedbackPage;
 })
