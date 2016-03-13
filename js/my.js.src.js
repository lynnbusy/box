/**
 *  My.jsx
 *  我的 页面
 */



define(['React'], function (React) {
    

    var NavBar = React.createClass({
        displayName: 'NavBar',

        render: function render() {
            var _this = this;

            var leftNav = this.props.leftNav && React.createElement(
                'span',
                {
                    onClick: this.props.backCallback,
                    className: 'ico-back' },
                this.props.leftNav
            );

            var rightLogo = this.props.rightLogo && React.createElement(
                'span',
                { className: 'rightLogo' },
                React.createElement('img', { src: 'icon/logo.png' })
            );

            var bigLogo = this.props.bigLogo && React.createElement('img', { className: 'bigLogo', src: 'icon/logo.png' });

            var _title = (function () {
                if (_this.props.bigLogo) {
                    return React.createElement(
                        'h1',
                        null,
                        bigLogo,
                        React.createElement(
                            'div',
                            { className: 'titleBox' },
                            React.createElement(
                                'b',
                                null,
                                _this.props.title
                            ),
                            React.createElement(
                                'i',
                                null,
                                'piaofang.wepiao.com'
                            )
                        ),
                        React.createElement('i', {
                            className: 'icon-search',
                            onClick: _this.handleClick })
                    );
                } else {
                    return React.createElement(
                        'h1',
                        null,
                        _this.props.title
                    );
                }
            })();

            return React.createElement(
                'header',
                null,
                leftNav,
                rightLogo,
                _title
            );
        },
        handleClick: function handleClick() {
            this.props.clickSearch(true);
        }
    });

    return NavBar;
});