/**
 *  Movie data.jsx
 *  电影资料 
 *
 */

define([
    'React',
    'navBar',
    'segmented',
    'movieSchedule',
    'movieBoxOffice',
    'util',
    'datacenter',
    'IScroll',
    'share'
], function(
    React,
    NavBar,
    Segmented,
    MovieSchedule,
    MovieBoxOffice,
    Util,
    DataCenter,
    IScroll,
    Share
) {
    'use strict'
    window.React = React;
    // Component
    var MovieData = React.createClass({
        render: function(){
            let _movie = this.props.movie,
                _production = '',
                _distribution = '';

            if(_movie.production && _movie.production != ''){
                _production = (
                    <li>
                        <p>出品公司：</p>
                        <p>{_movie.production}</p>
                    </li>
                )
            }
            //
            if(_movie.distribution && _movie.distribution != ''){
                _distribution = (
                    <li>
                        <p>出品公司：</p>
                        <p>{_movie.distribution}</p>
                    </li>
                )
            }
            //
            return (
                <section className={"_moviedata " + (this.props.active?"active":"cached")}  >
                    <div className="contentView withSegmented mdbo-scroller">
                        <ul className="scroller movdetail-data">
                            <li>
                                <p>导演：{_movie.director}</p>
                                <p>主演：{_movie.starring}</p>
                                <p>剧情：</p>
                                <p>{_movie.detail}</p>
                            </li>
                            {_production}
                            {_distribution}
                        </ul>
                    </div>
                </section>
            )
        },
        /**/
        getInitialState: function(){
            return {
                
            }
        },
        getDefaultProps: function(){
            return {
                movieName: "影片资料"
            }
        },
        componentWillReceiveProps: function(nextProps){
            let self = this;
            setTimeout(function(){
                self.props.movieScrollRefresh();
            }, 400)
            
        }

    })

    return MovieData;
 })


