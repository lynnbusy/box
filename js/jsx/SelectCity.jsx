/**
 *  SelectCity.jsx
 *  选择城市
 *
 */

define([
    'React',
    'Chart',
    'ReactChart',
    'IScroll',
    'Router',
    'util',
    '../mock/city_with_english',
    '../mock/cinema_line'
], function(
    React,
    Chart,
    ReactChart,
    IScroll,
    Router,
    Util,
    CITY,
    Cinemaline
) {
    'use strict'
    //最近访问
    var data_recentCity = [{
        'label': '最近访问',
        'cityList': []
    }]
    //格式化城市列表数据
    function formatCityList(cityData){
        var icons = Object.keys(cityData);
        var len = icons.length;
        var _cityData = [];
        for (var i = 0; i < len; i++) {
            var titel = icons[i];
            var tempSec = {
                label: titel,
                cityList: cityData[titel]
            };
            _cityData.push(tempSec);
        }
        return _cityData;
    }

    var style = {
        position: 'relative',
        height: document.body.offsetHeight - 80 + 'px',
        overflow: 'hidden'
    }

    var citylistStyle = {
        zIndex: 10000
    }
    var citylistStyleH = {
        height: "100%"
    }
    // 打开状态
    var openStatus = false;
    var navCityEl;
    var SelectCity = React.createClass({
        render: function(){
            var language = window._language.util.cities;
            //var cityLists = CITY.citylis;
            var _handleClick = this.handlebarClick;
            return (
                <div className="nav_city" onClick={_handleClick}><i className="icon-location"></i><span className="arr-down"><span className="location-name">{this.state.city[language.cityName]}</span></span></div>
            )
        },
        /**/
        getInitialState: function(){
            return {
                city: {
                    cityid: '0',
                    cityName: '全国',
                    cityNameEnglish: 'National'
                },
                openstatus: false
            }
        },

        componentDidMount: function(){
            // this.fetchData();
            // this.setBarColor();
            // this.initIScroll();
            // this.setState({
            //     city:{
            //         cityid: '0',
            //         cityName: window._language.util.cities.nation
            //     }
            // })
        },
        componentDidUpdate: function(){

        },

        handlebarClick: function(event){
            navCityEl = event.currentTarget;
            var dialog = document.getElementById("dialog");
            if(openStatus){
                navCityEl.className = 'nav_city';
                if(dialog){
                    dialog.innerHTML = '';
                }
                openStatus = false;
            }else{
                navCityEl.className = 'nav_city arr-solid-up';
                openStatus = true;
                if(!dialog){
                    dialog = document.createElement("p");
                    dialog.id = "dialog";
                    dialog.style.height = "100%";
                    var app = document.getElementById("app")
                    app.appendChild(dialog);
                }

                React.render(<CityLisDialog
                    isMovieDetail={this.props.isMovieDetail}
                    klassName={this.props.klassName}
                    handleClick={this.handleClick}
                    handleTabClick={this.handleTabClick}
                    removeDialog={this.removeDialog} />,
                    dialog);
                this.initIScroll();
            }
            this.props.showDailogCallback && this.props.showDailogCallback();
        },
        /**/

        handleClick: function(city) {
            var _city = {};
            _city.cityName = city[0];
            _city.cityid = city[1].toString().split(',');
            _city.cityNameEnglish = city[2];
            _city.localStorageKeyName = city[3] == 'city' ? 'data_recentCity' : 'data_recentCinema';

            this.setState({city: _city});
            this.props.selectCityCallback(_city, _city.localStorageKeyName);
            var dialog = document.getElementById('dialog');
            dialog.innerHTML = '';
            openStatus = false;
            navCityEl.className = 'nav_city';
            if(_city.cityid.length == 1 && _city.cityid[0] != '0'){
                if(city[3] == 'city'){
                    var _data_recentCity = [{
                        'cityId': city[1],
                        'cityName': city[0],
                        'cityNameEnglish': city[2]
                    }];
                }else{//item.nameShort, item.id, item.nameEnglish
                    var _data_recentCity = [{
                        'id': city[1],
                        'nameShort': city[0],
                        'nameEnglish': city[2]
                    }];
                }
                var concat_arr;
                var local_recentCity = localStorage.getItem(_city.localStorageKeyName);
                if(local_recentCity){
                    var recentCitys = JSON.parse(local_recentCity);
                    var recentCitysLen = recentCitys.length;
                    for(var i = 0; i < recentCitys.length; i++){
                        if(city[3] == 'city'){
                            if(recentCitys[i].cityId == city[1]){
                                recentCitysLen -= 1;
                                recentCitys.splice(i, 1);
                            }
                        }else{
                            if(recentCitys[i].id == city[1]){
                                recentCitysLen -= 1;
                                recentCitys.splice(i, 1);
                            }
                        }
                    }
                    concat_arr = _data_recentCity.concat(recentCitys);
                    //只留最近8条数据
                    if(concat_arr.length > 8){
                        concat_arr.pop();
                    }
                }else{
                    concat_arr = _data_recentCity;
                }
                localStorage.setItem(_city.localStorageKeyName, JSON.stringify(concat_arr));
            }
            Util.setPiaoFangEventGa("选择城市", "city", city[0], city[2]);
            // ga('send', 'event', '选择城市', 'click', city[0], 1);
            // //Hawkeye - Wepiao FE Analytics Solution
            // he && he('send', 'event', 'button', 'click', 'city', 1);
        },
        handleTabClick: function(){
            let self = this;
            setTimeout(function(){
                self.cityScroll.refresh();
            }, 500)
            
        },
        initIScroll: function(){
            //init IScroll
            this.cityScroll = new IScroll('.city-list', {
                mouseWheel: true,
                bindToWrapper: true,
                preventDefault:  Util.iScrollClick(),
                tap: Util.iScrollClick(),
                click: Util.iScrollClick(),
            });
        },
        removeDialog: function(){
            var dialog = document.getElementById("dialog");
            if(dialog){
                dialog.innerHTML = '';
            }
            openStatus = false;
            if(navCityEl){
                navCityEl.className = 'nav_city';
            }
        }
    });


    var CityLisDialog = React.createClass({
        render: function(){
            var cityLists = formatCityList(CITY.citylis);
            var _handleClick = this.props.handleClick;
            var _handleClickDialogBack = this.props.removeDialog;
            var klassName = 'citylist-wrap ' + this.props.klassName;
            var citiesLanguage = window._language.util.cities;
            var cinemaLanguage = window._language.util.cinemaLine;
            var languageType = window._language.type;
            var cinemaLineLists = formatCityList(Cinemaline.Cinemas);
            var _onClick = this.onTabClick;
            var _current = this.state.currentTab

            var _cityItems = this.buildCityDom(cityLists, citiesLanguage, _handleClick);

            var _cinemaItems = this.buildCinemaDom(cinemaLineLists, cinemaLanguage, _handleClick);
            //
            return (
                <div style={citylistStyleH}>
                    <div className="dialog_back" onClick={_handleClickDialogBack}></div>
                    <div className={klassName} >
                        <div className="subview fixed-box citypicker-wrapper">
                            <div className="city-list" style={style}>
                                <div className="inner">
                                    
                                    <div className="tab-wrapper">
                                        <span className={"follow-tab " + (_current == 0 ? "current" : "")} onClick={_onClick.bind(null, 0)}>{citiesLanguage.title}</span>
                                        <span className={"follow-tab " + (_current == 1 ? "current" : "")} onClick={_onClick.bind(null, 1)}>{cinemaLanguage.title}</span>
                                    </div>
                                    
                                    <div className={"follow-city " + (_current == 0 ? "" : "m-hide")}>{_cityItems}</div>
                                    <div className={"follow-cinema " + (_current == 1 ? "" : "m-hide")}>{_cinemaItems}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        //
        getInitialState: function(){
            return {
                currentTab: 0
            }
        },
        onTabClick: function(index){
            this.setState({
                currentTab: index
            })
            this.props.handleTabClick();
        },
        buildCityDom: function(lists, language, _handleClick){
            if(lists){
                var _data_recentCity = localStorage.getItem('data_recentCity');
                if(_data_recentCity){
                    var recentCitys = JSON.parse(_data_recentCity);
                    data_recentCity[0].cityList = recentCitys;
                    lists = data_recentCity.concat(lists);
                }

                var _cityItems = lists.map(function(city, i){
                    var ul_class = '';
                    var _cityLi = city.cityList.map(function(item, i){
                        var cityInfo = null;
                        if(item.cityInfo){
                            cityInfo = <mark>{item.cityInfo}</mark>
                        }
                        return (
                            <li
                                key={i}
                                data-cityid={item.cityId}
                                data-cityname={item.cityName}
                                className="touchable item"
                                onClick={_handleClick.bind(null, [item.cityName, item.cityId, item.cityNameEnglish, 'city'])}
                            >
                                <span>{item[language.cityName]}</span>
                                {cityInfo}
                            </li>
                        )
                    })
                    return (
                        <div className="list-wrapper">
                            <h3>{setCityregion('city', city.label)}</h3>
                            <ul className={ul_class} data-label={city.label}>
                                {_cityLi}
                            </ul>
                        </div>
                    )
                })
            }else{
                var _cityItems =  (
                    <li> 加载中... </li>
                )
            }

            return _cityItems;
        },
        //
        buildCinemaDom: function(lists, language, _handleClick){
            if(lists){
                var _data_recentCity = localStorage.getItem('data_recentCinema');
                if(_data_recentCity){
                    var recentCitys = JSON.parse(_data_recentCity);
                    data_recentCity[0].cityList = recentCitys;
                    lists = data_recentCity.concat(lists);
                }

                var _items = lists.map(function(cinema, i){
                    var ul_class = '';
                    var _cityLi = cinema.cityList.map(function(item, i){
                        var cityInfo = null;
                        if(item.cityInfo){
                            cityInfo = <mark>{item.cityInfo}</mark>
                        }
                        return (
                            <li
                                key={i}
                                data-cityid={item.id}
                                data-cityname={item.nameShort}
                                className="touchable item"
                                onClick={_handleClick.bind(null, [item.nameShort, item.id, item.nameEnglish, 'cinemaline'])}
                            >
                                <span>{item[language.cinemaName]}</span>
                                {cityInfo}
                            </li>
                        )
                    })
                    return (
                        <div className="list-wrapper">
                            <h3>{setCityregion('cinema', cinema.label)}</h3>
                            <ul className={ul_class} data-label={cinema.label}>
                                {_cityLi}
                            </ul>
                        </div>
                    )
                })
            }else{
                var _items =  (
                    <li> 加载中... </li>
                )
            }

            return _items;
        }

    });
    /**/
    function setCityregion(type, key){
        if(type == 'city'){
            var language = window._language.util.cities;
        }else{
            var language = window._language.util.cinemaLine;
        }
            
        var languageType = window._language.type;
        if(languageType == 'en'){
            if(key == '区域'){
                return language.region;
            }
            if(key == '热门城市'){
                return language.hotCities;
            }
            if(key == '最近访问'){
                return language.recentVisit;
            }
        }else{
            if(key == 'all'){
                return language.allCinemas
            }
            if(key == 'hot'){
                return language.hotCinemas;
            }
        }
        return key;
    }

    return SelectCity;
 })
