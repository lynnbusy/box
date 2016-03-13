/**
 *  BoxOfficeTable.jsx
 *  首页票房专用列表
 *
 */

define([
    'React',
    'util',
    'boxOfficeDonut'
], function(
    React,
    Util,
    BoxOfficeDonut
) {
    'use strict'

    // Component
    var BoxOfficeTable = React.createClass({
        render: function(){
            let language = this.props.language;
            if(this.props.movieList){
                var _movieItems = this.props.movieList.map((movie, i) => {
                    var _showday = this.getShowDaysFilter(movie.showDays);
                    var _champion = '';
                    if(i === 0){
                        _champion = "ico-champion";
                    }else if(i === 1){
                        _champion = "ico-second";
                    }else if(i === 2){
                        _champion = "ico-third";
                    }
                    var boxOfficeObj = Util.getHundredMillion(parseFloat(movie[language.item_tr.tr2_field]), language.units, movie[language.item_tr.tr2_field]);
                    var totalBoxOfficeObj = Util.getHundredMillion(parseFloat(movie[language.item_tr.tr3_field]), language.item_tr.units, movie[language.item_tr.tr3_field]);

                    var _info =
                        ", " +
                        totalBoxOfficeObj.num +
                        totalBoxOfficeObj.units;

                    return (
                        <dt key={i}
                            onClick={this.handleClick.bind(null, movie.movieId, movie[language.item_tr.tr1_field])}
                        >
            				<section className="movie-info">
            					<p> <i className={_champion}></i>
            						{movie[language.item_tr.tr1_field]}
            					</p>
            					<h2>
                                    {boxOfficeObj.num} <small>{boxOfficeObj.units}</small>
            					</h2>
            					<p className="p-info">
                                    {_showday}
                                    {_info}
                                </p>
            				</section>
            				<section className="circle-info">
            					<ul>
                                    <BoxOfficeDonut
                                        value = {movie.productBoxOfficeRate}
                                        label = {language.item_title.th1}
                                        color = "yellow"
                                    />
                                    <BoxOfficeDonut
                                        value = {movie.productScheduleRate}
                                        label = {language.item_title.th2}
                                        color = "green"
                                    />
                                    <BoxOfficeDonut
                                        value = {movie.productTicketSeatRate}
                                        label = {language.item_title.th3}
                                        color = "blue"
                                    />
            					</ul>
            				</section>
            			</dt>
                    )
                })
            }else{
                var _movieItems =  (
                    <dt>
                        <section className="movie-info">
                            <p>
                                加载中...
                            </p>
                        </section>
                    </dt>
                )
            }
            return (
                <div className="total-rank">
                    <dl>
                        {_movieItems}
                    </dl>
                </div>
            )
        },
        handleClick: function(id, name){
            if(this.props.onMovieItemClick){
                this.props.onMovieItemClick(id, name);
            }

        },
        shouldComponentUpdate: function(nextProps, nextState) {
            return nextProps.movieList != this.props.movieList;
        },
        getDefaultProps: function(){
            //return window.language.item_tr;
            // return {
            //     tr1_field: "movieName",
            //     tr2_field: "productBoxOffice",
            //     tr3_field: "productTotalBoxOffice",
            // }
        },
        getShowDaysFilter: function(_showday){
            let language = this.props.language,
                _replace = String.format(language.days, _showday);
            if(_showday == 1) return <em style={{"color": "red"}}>{language.premiere}</em>
            else if(_showday > 1) return <em>{_replace}</em>
            else if (_showday == 0) return <em>{language.midnight}</em>
            else if (_showday < 0) return <em>{language.limitedRelease}</em>
        }
    })

    return BoxOfficeTable;
 })
