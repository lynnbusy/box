/**
 *  search.jsx
 */

define(['React', 'datacenter', 'IScroll', 'util'], function(React, DataCenter, IScroll, Util){
    'use strict'
    var _hide = {'display': 'none;'};
    var _show = {'display': 'block;'};
    var inputEl, searchHistorys = [];
    var isFisrtReload = true;
    var language;

    // <i className="ico-close"></i>
    //传递接口数据
    var params = {
        "name": '',
        "moviePaging": {
            "page": 1,
            "pageSize": 200
        },
        "cinemaPaging": {
            "page": 1,
            "pageSize": 200
        }
    }

    var Search = React.createClass({
        render: function(){
            
            language = this.props.language.search;
            var _isOpen = (this.props.open) ? "open" : "",
                backCallback = this.gotoBack,
                keySearch = this.keySearch,
                model = this.state.model,
                searchMovieList = '',
                searchCinemaList = '',
                cinemas = null,
                movies = null,
                cinemasTotal = 0,
                moviesTotal = 0,
                _searchHistory = this.getLocalStorageSearchHistory(),
                noMovieResult, noCinemaResult;

            if(model){
                cinemas = model.cinemas;
                movies = model.movies;
            }
            if(movies && movies.length > 0){
                moviesTotal = model.moviePaging.total;
                var movieList = this.getLiList(movies, 'movie', language);

                searchMovieList = (
                    <div className="search-list">
                        <h4>{moviesTotal}{language.movie.title}</h4>
                        <div className="m-list-title">
                            <span>{language.movie.th1}</span>
                            <span>{language.movie.th2}</span>
                        </div>
                        <ul className="m-list">
                            {movieList}
                        </ul>
                    </div>
                )
                noMovieResult = false;
            }else{
                noMovieResult = true;
            }
            if(cinemas && cinemas.length > 0){
                cinemasTotal = model.cinemaPaging.total;
                var cinemasList = this.getLiList(cinemas, 'cinema', language);
                searchCinemaList = (
                    <div className="search-list">
                        <h4>{cinemasTotal}{language.cinema.title}</h4>
                        <div className="m-list-title">
                            <span>{language.cinema.th1}</span>
                            <span>{language.cinema.th2}</span>
                        </div>
                        <ul className="m-list">
                            {cinemasList}
                        </ul>
                    </div>
                )
                noCinemaResult = false;
            }else{
                noCinemaResult = true;
            }

            return (
                <div className={"movie-detail _search "+_isOpen} >

                    <div className="search">
                        <div className="search-wrap">
                            <div className="input-box input-placeholder">
                                    <label>
                                        <i className="icon-search"></i>
                                    </label>   
                                    <input type="text" onKeyUp={keySearch} onChange={keySearch} placeholder={language.info[0]} />
                                    <i className="ico-clear" style={{'display': 'none;'}}>清除</i>                                 
                            </div>
                            <a className="cancle" onClick={this.gotoBack.bind()} >{language.info[1]}</a>
                        </div>
                    </div>

                    <div className="search-full">
                        <div className="search-scroll">
                            {searchMovieList}
                            {searchCinemaList}
                            <div className={"search-no " + ((noMovieResult && noCinemaResult) ? "" : "cached")}>
                               <p>{isFisrtReload ? language.info[3] : language.info[2]}</p>
                            </div>
                            {_searchHistory}
                        </div>
                    </div>

                </div>
            )
        },
        /**/
        getInitialState: function(){
            return {
                model: null,
                isHistory: true,
                searchHistorys: localStorage.getItem('data_searchHistory')
            }
        },
        shouldComponentUpdate: function(nextProps, nextState) {
            let open = nextProps.open,
                _el = document.getElementsByClassName('_search')[0];
            if(open){
                _el.className = "movie-detail _search open";
                return true;
            }else{
                _el.className = "movie-detail _search";
                return false;
            }
            
        },
        fetchData: function(_params){
            var self = this;
            if(!_params){
                _params = params;
            }
            // 已搜索
            isFisrtReload = false;
            DataCenter.SearchModel.getData(_params, function(res){
                console.log('SearchModel is ready:');
                console.log(res);
                var _value = inputEl ? inputEl.value : '';
                if (_value != '') {
                    self.setState({
                        model: res
                    })
                    self.initIScroll();
                }
            },function(err){
                console.log(err);
            })

        },

        gotoBack: function(){
            if(inputEl) inputEl.value = '';
            this.setState({
                model: null,
                isHistory: true
            })
            this.props.backCallback(false);
        },

        keySearch: function(evt){
            evt.stopPropagation();
            evt.preventDefault();
            
            var _el = evt.currentTarget;
            inputEl = _el;
            var currKey = 0, evt = evt || event;
                currKey = evt.keyCode || evt.which || evt.charCode;
            var _value = _el.value;

            if (_value != "") {
                params.name = _value;
                this.fetchData();
                this.setState({
                    isHistory: false
                })
            }else{
                this.setState({
                    model: null,
                    isHistory: true
                })
                
            }
            window.event.returnValue = false;
        },
        getLiList: function(mos, type, language){
            var name = type == "movie" ? language.movie.movieName : language.cinema.cinemaName;
            var paramsName = params.name;
            var List = mos.map((obj, k) => {
                if(!obj[name]) return;
                var _names = obj[name].split(paramsName),
                    _len = _names.length;
                var nameList = _names.map((item, i) => {
                    if(i >= _len -1){    
                        return ( <span>{item}</span> );
                    }else{
                        return ( <span>{item}<em>{paramsName}</em></span> );
                    }
                });

                var _movieName = ( <span className="search-nowrap">{nameList}</span> );

                // var _id = type == "movie" ? "movieName" : obj['cinemaId'];
                return (
                    <li onClick={this.handleClick.bind(
                                null,
                                obj['cinemaId'] || obj['movieId'],
                                obj[name],
                                type
                            )}
                    >
                        <div>{_movieName}</div>
                        
                        <div>{obj.releaseYear || obj.productTickets}</div>
                    </li>
                )
            });
            return List;
        },
        /**/
        handleClick: function(id, name, type){
            // block movieName = "其它"
            //历史记录
            this.setLocalStorageSearchHistory(id, name, type);
            if(inputEl) inputEl.value = '';

            this.setState({
                model: null,
                isHistory: true
            })
            if(name == '其它' && id == 0){
                return;
            }
            if(this.props.onItemClick && type == 'movie'){
                this.props.onItemClick(id, name);
            }else if(this.props.onCinemaItemClick && type == "cinema"){
                this.props.onCinemaItemClick(id, name)
            }

        },

        initIScroll: function(){
            this.searchScroll && this.searchScroll.refresh();
            if(!this.searchScroll){
                var _container = document.getElementsByClassName('search-full')[0];
                _container.style.height = document.body.clientHeight - 44 + 'px';

                this.searchScroll = new IScroll('.search-full', {
                    mouseWheel: true,
                    bindToWrapper: true,
                    preventDefault:  Util.iScrollClick(),
                    tap: Util.iScrollClick(),
                    click: Util.iScrollClick(),
                });
            }

            // this.movieScroll.on("scroll", this.doSomething);
        },

        setLocalStorageSearchHistory: function(id, name, type){
            var concat_arr = localStorage.getItem('data_searchHistory'),
                arr = [];
            if(concat_arr){
                concat_arr = JSON.parse(concat_arr);
                for(var i = 0; i < concat_arr.length; i++){
                    if(concat_arr[i].id == id){
                        concat_arr.splice(i, 1);
                    }
                }
                arr = [{id: id,name: name,type: type}].concat(concat_arr);
            }else{
                arr = [{id: id,name: name,type: type}];
            }
            if(arr.length > 8){
                concat_arr.pop();
            }

            localStorage.setItem('data_searchHistory', JSON.stringify(arr));
        },

        getLocalStorageSearchHistory: function(id, name, type){
            var concat_arr = localStorage.getItem('data_searchHistory'),
                html = '', List = '';
            if(concat_arr && concat_arr != ''){

                concat_arr = JSON.parse(concat_arr);
                // this.setState({
                //     searchHistorys: concat_arr
                // })
                List = concat_arr.map((obj, k) => {
                    return (
                        <li onClick={this.handleClick.bind(
                                null,
                                obj['id'],
                                obj['name'],
                                obj['type']
                            )}
                        ><i className="icon-duration"></i>{obj['name']} <i className="ico-close"></i></li>
                    )
                })

                
                return (
                    <div className={ "search-history " + (this.state.isHistory ? '' : 'cached') }>
                        <h4>{language.info[5]}</h4>
                        <ul>
                            {List}
                        </ul>
                        <a onClick={this.clearSearchHistory.bind()}>{language.info[4]}</a>
                    </div>
                )
            }
            return ''
        },

        clearSearchHistory: function(){
            localStorage.setItem('data_searchHistory', '');
            this.setState({
                searchHistorys: ''
            })
            
        }
        

     })

     return Search;
 })
