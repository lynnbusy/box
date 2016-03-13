/**
 *  Feedback Page.jsx
 *  用户反馈详情页
 *
 *  @props  {Bool}      open            是否开启
 *  @props  {Function}  backCallback    返回回调
 *  @return {Component} FeedbackPage
 */



define(['React', 'navBar', 'util', 'datacenter'], function (React, NavBar, Util, DataCenter) {
    

    // same order with UI
    var QUESTION_TYPE = {
        0: 'BOX_OFFICE', // 实时票房
        1: 'TOTAL_BOX_OFFICE', // 票房统计
        2: 'SCHEDULE', // 排片统计
        3: 'TICKET_SEAT_RATE', // 上座率
        4: 'AVG_PERSON', // 场均人次
        5: 'TICKETS', // 观影人次
        6: 'OTHER' // 其他
    };

    // Parmas
    var _params = {
        'question': {
            'sourceUrl': 'undefined',
            'content': '',
            'tel': '',
            'email': '',
            'questionType': ''
        }
    };

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
        displayName: 'FeedbackPage',

        render: function render() {
            var _isOpen = this.props.open ? 'open' : '';
            var _title = this.props.movieName;
            var _current = this.state.currentSegment;

            return React.createElement(
                'div',
                { className: 'movie-detail feedback-page ' + _isOpen },
                React.createElement(NavBar, {
                    rightLogo: true,
                    leftNav: ' ',
                    title: '用户反馈',
                    backCallback: this.props.backCallback
                }),
                React.createElement(
                    'div',
                    { className: 'fp-scroller contentView' },
                    React.createElement(
                        'form',
                        {
                            action: '',
                            className: 'scroller',
                            onSubmit: this.handleSubmit
                        },
                        React.createElement(
                            'h2',
                            null,
                            '如果在使用过程中遇到问题，请按以下方式反馈，你的支持就是我们的动力。你也可以加入用户QQ群反馈给我们：237610287'
                        ),
                        React.createElement('h2', { className: 'contact' }),
                        React.createElement(
                            'p',
                            null,
                            '请选择问题'
                        ),
                        React.createElement(
                            'ol',
                            null,
                            React.createElement(
                                'li',
                                null,
                                React.createElement(
                                    'div',
                                    null,
                                    React.createElement('input', { type: 'checkbox', className: 'ico-arr-check' }),
                                    React.createElement(
                                        'label',
                                        null,
                                        '实时票房'
                                    )
                                )
                            ),
                            React.createElement(
                                'li',
                                null,
                                React.createElement(
                                    'div',
                                    null,
                                    React.createElement('input', { type: 'checkbox', className: 'ico-arr-check' }),
                                    React.createElement(
                                        'label',
                                        null,
                                        '票房统计'
                                    )
                                )
                            ),
                            React.createElement(
                                'li',
                                null,
                                React.createElement(
                                    'div',
                                    null,
                                    React.createElement('input', { type: 'checkbox', className: 'ico-arr-check' }),
                                    React.createElement(
                                        'label',
                                        null,
                                        '排片统计'
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            'ol',
                            null,
                            React.createElement(
                                'li',
                                null,
                                React.createElement(
                                    'div',
                                    null,
                                    React.createElement('input', { type: 'checkbox', className: 'ico-arr-check' }),
                                    React.createElement(
                                        'label',
                                        { className: 'str3' },
                                        '上座率'
                                    )
                                )
                            ),
                            React.createElement(
                                'li',
                                null,
                                React.createElement(
                                    'div',
                                    null,
                                    React.createElement('input', { type: 'checkbox', className: 'ico-arr-check' }),
                                    React.createElement(
                                        'label',
                                        null,
                                        '场均人次'
                                    )
                                )
                            ),
                            React.createElement(
                                'li',
                                null,
                                React.createElement(
                                    'div',
                                    null,
                                    React.createElement('input', { type: 'checkbox', className: 'ico-arr-check' }),
                                    React.createElement(
                                        'label',
                                        null,
                                        '观影人次'
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            'ol',
                            null,
                            React.createElement(
                                'li',
                                null,
                                React.createElement(
                                    'div',
                                    null,
                                    React.createElement('input', { type: 'checkbox', className: 'ico-arr-check' }),
                                    React.createElement(
                                        'label',
                                        { className: 'str2' },
                                        '其他'
                                    )
                                )
                            )
                        ),
                        React.createElement('textarea', {
                            required: true,
                            name: 'content',
                            className: 'border-1px',
                            placeholder: '请简要描述你的问题或者建议'
                        }),
                        React.createElement(
                            'ul',
                            null,
                            React.createElement(
                                'li',
                                null,
                                React.createElement(
                                    'label',
                                    null,
                                    '联系电话'
                                ),
                                React.createElement('input', { name: 'tel', placeholder: '选填，便于我们与你联系' })
                            ),
                            React.createElement(
                                'li',
                                null,
                                React.createElement(
                                    'label',
                                    null,
                                    '邮箱'
                                ),
                                React.createElement('input', { name: 'email', placeholder: '选填，便于我们与你联系' })
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'btn-box' },
                            React.createElement('input', { type: 'submit', className: 'btn submit', value: '提交' })
                        )
                    )
                )
            );
        },
        getInitialState: function getInitialState() {
            return {};
        },
        getDefaultProps: function getDefaultProps() {
            return {};
        },
        shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
            var _isOpen = nextProps.open;
            var _el = document.getElementsByClassName('feedback-page')[0];
            if (!_isOpen) {
                _el.className = 'movie-detail feedback-page';
            } else {
                _el.className = 'movie-detail feedback-page open';
                ga('send', 'pageview', '/feedback-page');
            }
            return false;
        },
        componentDidMount: function componentDidMount() {
            this.initIScroll();
        },
        componentDidUpdate: function componentDidUpdate() {
            if (this.props.open) {
                this.Scroll.refresh();
            }
        },
        componentWillReceiveProps: function componentWillReceiveProps(nextProps) {},
        handleSubmit: function handleSubmit(event) {
            var _this = this;

            var e = event.nativeEvent;
            var form = e.target;
            e.preventDefault();

            var questionTypeArr = [];
            form.forEach = Array.prototype.forEach;
            form.forEach(function (el, key) {
                if (el.name == 'content') _params.question.content = el.value;
                if (el.name == 'email') _params.question.email = el.value;
                if (el.name == 'tel') _params.question.tel = el.value;
                if (el.type == 'checkbox' && el.checked == true) {
                    questionTypeArr.push(QUESTION_TYPE[key]);
                }
            });

            _params.question.questionType = questionTypeArr.join(',');
            console.log(_params);
            if (questionTypeArr.length == 0) {
                Util.toast('请选择你想反馈的问题', 2e3);
                return;
            }

            // Post feedback
            DataCenter.Feedback.post(_params, function (res) {
                console.log('Feedback success');
                Util.toast('提交成功，感谢反馈！', 2e3);
                setTimeout(function () {
                    _this.props.backCallback();
                }, 1000);
            }, function (err) {
                Util.toast('提交没有成功，请稍后再试~', 2e3);
                console.log(err);
            });
        },
        initIScroll: function initIScroll() {
            //init IScroll
            this.Scroll = new IScroll('.fp-scroller', {
                mouseWheel: true,
                bindToWrapper: true,
                preventDefault: Util.iScrollClick(),
                tap: Util.iScrollClick(),
                click: Util.iScrollClick()
            });
        }
    });

    return FeedbackPage;
});