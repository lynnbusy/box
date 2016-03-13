/**
 *  ComingFilmTable.jsx
 *  即将上映专用列表
 *  Created by gaojing on 16/03/08.
 */



define(['React', 'util', 'DataCenter'], function (React, Util, DataCenter) {
    

    // Component
    var comingMovieTable = React.createClass({
        displayName: 'comingMovieTable',

        getInitialState: function getInitialState() {
            return {
                model: null,
                params: {
                    "paging": {
                        "page": 1, // 分页查询的页码
                        "pageSize": 20 // 分页查询的每页显示数量
                    }
                }
            };
        },
        fetchData: function fetchData(_params) {
            var self = this;
            if (!_params) {
                _params = params;
            }
            DataCenter.ComingMovieModel.getData(_params, function (res) {
                console.log('BOModel is ready:');
                console.log(res);
                // re-render
                self.setState({
                    model: res
                });
            }, function (err) {
                console.log(err);
            });
        },
        componentDidUpdate: function componentDidUpdate() {
            this.fetchData(this.params);
        },
        render: function render() {
            var that = this,
                state = this.state,
                movie = state.model;
            var renderMovie = function renderMovie(item, i) {
                var moviePosterUrl = item.picutureUrl,
                    movieName = item.name,
                    movieInfor = item.productBasicInfo,
                    movieReleaseDate = item.productReleaseDate,
                    movieWantCount = item.productWantCount;
                var movieItem = React.createElement(
                    'li',
                    { className: 'movie-item' },
                    React.createElement(
                        'div',
                        { className: 'movie-poster' },
                        React.createElement('img', { src: moviePosterUrl })
                    ),
                    React.createElement(
                        'div',
                        { className: 'movie-infor' },
                        React.createElement(
                            'h1',
                            { className: 'movie-name' },
                            movieName
                        ),
                        React.createElement(
                            'p',
                            { className: 'movie-infor' },
                            movieInfor
                        ),
                        React.createElement(
                            'p',
                            { className: 'movie-date' },
                            movieReleaseDate
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'want-count' },
                        React.createElement(
                            'p',
                            null,
                            movieWantCount
                        )
                    )
                );
                return movieItem;
            };
            return React.createElement(
                'ul',
                { className: 'coming-movie' },
                movie.map(movieItem)
            );
        }
    });

    return comingMovieTable;
});