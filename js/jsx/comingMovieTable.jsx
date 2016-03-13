/**
 *  ComingFilmTable.jsx
 *  即将上映专用列表
 *  Created by gaojing on 16/03/08.
 */

define([
    'React',
    'util',
    'datacenter',
    'IScroll',
    'pullRefresh'
], function(
    React,
    Util,
    DataCenter,
    IScroll,
    PullRefresh
) {
    'use strict'
    // Component
    var ComingMovieTable = React.createClass({
        getInitialState: function(){
            return {
                model: [],
                language: null
            }
        },
        fetchData: function(_params){
            var self = this;
            DataCenter.ComingMovieModel.getData(_params, function(res){
                // re-render
                self.setState({
                    model: res.movies
                })
                self.initIScroll();
            },function(err){
                console.log(err);
            })
        },
        initIScroll: function(){
            var self = this;
            //init IScroll
            this.COScroll = new IScroll('.co-scroller', {
                mouseWheel: true,
                bindToWrapper: true,
                probeType: 3,
                preventDefault:  Util.iScrollClick(),
                tap: Util.iScrollClick(),
                click: Util.iScrollClick()
            });
            var pullRefresh = new PullRefresh.refresh({
                scroll: this.COScroll,
                model: DataCenter.ComingMovieModel,
                params: self.props.params,
                callback: function(res){
                    // re-render
                    self.setState({
                        model: res
                    })

                }
            });
            window.app_iScrolls[0] = this.COScroll;
        },
        componentDidMount: function(){
            var that = this,
                props = that.props,
                params = props.params,
                language = props.language;
            this.fetchData(params);
            this.setState({ language : language})

            
        },
        componentWillReceiveProps: function(nextProps) {
            var language = nextProps.language;
            this.fetchData(nextProps.params);
            this.setState({ language : language})
        },
        render: function(){
            var that = this,
                state = this.state,
                movie = state.model,
                language = state.language;
            if (!language) {
                language = that.props.language;
            }
            var renderMovie = function(item, i) {
                var moviePosterUrl = item.pictureUrl,
                    movieName = item[language.item_name],
                    movieInfor = item[language.item_basic],
                    movieReleaseDate = item[language.item_date],
                    movieWantCount = item[language.item_want],
                    movieItem = <li className="coming-item">
                                    <img className="coming-img" src={moviePosterUrl}/>
                                    <div className="coming-info">
                                        <h1>{movieName}</h1>
                                        <p>{movieInfor}</p>
                                        <p>{movieReleaseDate}</p>
                                    </div>
                                    <div className="coming-person">
                                        <p>{movieWantCount}</p>
                                    </div>
                                </li>
                return movieItem;
            };
            return (
                <div className="co-scroller contentView coming">
                    <ul className="scroller" >
                    {movie.map(renderMovie)}
                    </ul>
                </div>
            )
        }
    })

    return ComingMovieTable;
 })
