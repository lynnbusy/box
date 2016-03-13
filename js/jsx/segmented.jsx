/**
 *  Segmented.jsx
 *  分段选择 Segmented Control
 *
 *  @props  {Number}    current     当前段
 *  @props  {Function}  onChange    回调
 *  @return {Component} Segmented
 */

 define(['React'], function(React){
     'use strict'

     var Segmented = React.createClass({
        render: function(){
            var _current = this.props.current;
            var _onChange = this.props.onChange;
            var _menus;
            var th3 = this.props.th3;
            var _item = '';

            if(th3){
                _item = (
                    <li className={ _current==2?"current":""}
                        onClick={_onChange.bind(null, 2)}>
                        <a>{this.props.th3}</a>
                    </li>
                )
            }

            return (
                <ul className="seg-wrapper N-s-arc equal-2 fixedUnderNav css-1px">
                    <li className={ _current==0?"current":"" }
                        onClick={_onChange.bind(null, 0)}>
                        <a>{this.props.th1}</a>
                    </li>
                    <li className={ _current==1?"current": this.props.th2 ? "" : "cached"}
                        onClick={_onChange.bind(null, 1)}>
                        <a>{this.props.th2}</a>
                    </li>
                    {_item}
                </ul>
            )
        }
        // shouldComponentUpdate: function(nextProps, nextState) {
        //     if(nextProps.active == "cached"){
        //         return false;
        //     }
        //     return true;
        // }
     })
     return Segmented;
 })
