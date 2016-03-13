/**
 *  SelectDate.jsx
 *  选择日期
 *
 */

define([
    'React',
    'Chart',
    'ReactChart',
    'IScroll',
    'Router',
    'util',
    'DatePicker'
], function(
    React,
    Chart,
    ReactChart,
    IScroll,
    Router,
    Util,
    DatePicker
) {
    'use strict'
    // <input type="date" value="2011-01-04">
    var style = {
        fontSize: "12px"
    }
    var timeZoneStyleH = {
        height: "100%"
    }
    // 点击日期对象
    var navDateEl;
    var defaultCss = 'datePicker';
    var currentCss = 'datePicker arr-solid-up';
    // 打开状态
    var openStatus = false;
    var VALUEDay = Util.getTodayStr();//Date.now()
    var LOCALE = 'zh-cn';
    var MINDate = '2015-07-22';
    var MAXDate = Util.getIndexDaysStr(VALUEDay, 2);
    var SelectDate = React.createClass({
        render: function(){
            var _handleClick = this.handleClick;
            var _date = this.state.date;

            return (
                <div className="nav_cal" onClick={_handleClick}>
                    <i className="icon-calendar"></i>
                    <span id="nav_date" className="datePicker">{_date}</span>
                    <span className="arr-down"></span>
                </div>
            )
        },
        getInitialState: function(){
            return {
                date : this.props.date ? this.props.date : Util.getTodayStr()
            }
        },

        componentDidMount: function(){
            // this.fetchData();
            // this.setBarColor();
            // this.initIScroll();
        },
        componentDidUpdate: function(){

        },
        handleClick: function(event) {
            navDateEl = event.currentTarget.childNodes[1];
            var dialog = document.getElementById("dialog");
            
            if(openStatus){
                navDateEl.className = defaultCss;
                if(dialog){
                    dialog.innerHTML = '';
                }
                openStatus = false;
            }else{
                navDateEl.className = currentCss;
                openStatus = true;
                if(!dialog){
                    dialog = document.createElement("p");
                    dialog.id = "dialog";
                    dialog.style.height = "100%";
                    var app = document.getElementById("app")
                    app.appendChild(dialog);
                }
                var _maxDate = this.props.MAXDate ? this.props.MAXDate : MAXDate;
                React.render(<SelectDateDialog
                    isMovieDetail={this.props.isMovieDetail}
                    date={this.state.date}
                    minDate={MINDate}
                    maxDate={_maxDate}
                    klassName={this.props.klassName}
                    isAds={this.props.isAds}
                    handleChange={this.handleChange}
                    removeDialog={this.removeDialog} />,
                    dialog);
                
            }
            this.props.showDailogCallback && this.props.showDailogCallback();
        },
        /**/
        handleChange: function(_date) {
            console.log('selected ', _date);
            this.setState({date: _date});
            this.props.selectDateCallback(_date);
            this.removeDialog();
            Util.setPiaoFangEventGa("选择日期", "date", _date, _date);
            // ga('send', 'event', '选择日期', 'click', _date , 1);
            //     //Hawkeye - Wepiao FE Analytics Solution
            // he && he('send', 'event', 'date', 'click', _date, 1);
        },

        removeDialog: function(){
            var dialog = document.getElementById("dialog");
            //var nav_date = document.getElementById("nav_date");
            if(dialog){
                dialog.innerHTML = '';
            }
            if(navDateEl){
                navDateEl.className = defaultCss;
            }
            openStatus = false;
        }
    });

    //选择日期的弹出层
    var SelectDateDialog = React.createClass({
        render: function(){
            LOCALE = window._language.type == 'cn' ? 'zh-cn' : 'en';
            var _minDate = this.props.minDate;
            var _maxDate = this.props.maxDate;
            var _handleClickDialogBack = this.props.removeDialog;
            var klassName = 'citylist-wrap date-wrap ' + (this.props.klassName || '');
            klassName += this.props.isAds ? 'citylist-ads' : '';
            var _handleChange = this.props.handleChange;

            // if(this.props.isMovieDetail){
            //     timeZoneStyleH = {
            //         height: "100%",
            //         position: "absolute",
            //         top: "122px",
            //         width: "100%"
            //     }
            // }

            return (
                <div style={timeZoneStyleH}>
                    <div className="dialog_back" onClick={_handleClickDialogBack}></div>
                    <div className={klassName} >
                        <div className="subview fixed-box citypicker-wrapper">
                            <DatePicker
                              minDate={_minDate}
                              maxDate={_maxDate}
                              locale={LOCALE}
                              date={this.props.date}
                              onChange={_handleChange}
                            />
                        </div>
                        <div className="dialog_back" onClick={_handleClickDialogBack}></div>
                    </div>
                </div>
            )
        }
    });

    return SelectDate;
 })
