/**
 *  comingFile.jsx
 *  即将上映
 *  Created by gaojing on 16/03/08.
 */

define([
    'React',
    'Chart',
    'ReactChart',
    'IScroll',
    'Router',
    'navBar',
    'util',
    'comingMovieTable',
    'datacenter',
    'commonTable',
    'SelectCity',
    'SelectDate',
    'TimeZone',
    'feedbackBlock',
    'share',
    'pullRefresh'
], function(
    React,
    Chart,
    ReactChart,
    IScroll,
    Router,
    NavBar,
    Util,
    ComingMovieTable,
    DataCenter,
    CommonTable,
    SelectCity,
    SelectDate,
    TimeZone,
    FeedbackBlock,
    Share,
    PullRefresh
) {
    'use strict'
    // Component
    var ComingMovie = React.createClass({
        // pass through funciton
        getInitialState: function(){
            return {
                toggle: 'date',
                language: null,
                params: {
                    "paging" : {
                        "page": 1,// 分页查询的页码
                        "pageSize": 50// 分页查询的每页显示数量
                    }
                }
            }
        },
        componentDidMount: function(){
            var language = this.props.language;
            this.setState({ language : language })
        },
        onBackBtnClick: function(){
            // manually judge the hashchange.
            let oldURL = location.href;
            setTimeout(()=>{
                let newURL = location.href;
                if(oldURL === newURL){
                    console.log("hey you must on the history stack bottom, let me send you to the home.");
                    //this.router.setRoute("/boxoffice")
                    // 修改Android下切换响应慢的问题
                    location.href = '#/boxoffice';
                }
                if(location.hash === ''){
                    location.hash = '/boxoffice';
                }
            },100)

            window.history.back(1);
        },
        selectDate: function(){
            if (this.state.toggle != 'date') {
                this.setState({
                    toggle: 'date',
                    params:{
                        "paging" : {
                            "page": 1,// 分页查询的页码
                            "pageSize": 50// 分页查询的每页显示数量
                        }
                    }
                });
            }
        },
        selectCount: function(){
            if (this.state.toggle != 'count') {
                this.setState({
                    toggle: 'count',
                    params:{
                        "paging" : {
                            "page": 1,// 分页查询的页码
                            "pageSize": 50// 分页查询的每页显示数量
                        },
                        "movieFilter": {
                            "sortColumn": "wantCount",   
                            "sortType": "desc"
                        }
                    }
                });
            }
        },
        setPiaoFang: function(){
            ga('send', 'pageview', {
                'page': '/comingmovie',
                'title': 'coming'
            });
            //Hawkeye - Wepiao FE Analytics Solution
            he && he('send', 'pageview', 'comingmovie');
        },
        render: function(){
            var that = this,
                state = that.state,
                toggle = state.toggle,
                language = state.language,
                tabDate = 'tab-date',
                tabWant = 'tab-want';
            if (!language) {
                language = that.props.language;
                console.log(language)

            }
            if (toggle == 'date') {
                tabDate += ' active';
            }else {
                tabWant += ' active';
            }
            return (
                <div>
                    <NavBar title={language.comingFilm.title} leftNav=" " rightLogo backCallback={this.onBackBtnClick}/>
                    <div className="coming-wrapper">
                        <div className="coming-tab"> 
                            <div className={tabDate}  onClick={that.selectDate.bind(null)}>
                                <span>{language.comingFilm.item_tab.releaseDate}</span>
                                <i className="icon-down"></i>
                            </div>
                            <div className={tabWant} onClick={that.selectCount.bind(null)}>
                                <span>{language.comingFilm.item_tab.wantCount}</span>
                                <i className="icon-down"></i>
                            </div>
                        </div>
                        <ComingMovieTable params={state.params} language={language.comingFilm.item_info}/>
                    </div>
                </div>
            )
        }
    })
    
    return ComingMovie;
 })
