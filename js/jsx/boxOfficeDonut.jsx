/**
 *  boxOfficeDonut.jsx
 *  票房列表页环状图
 *
 *  @props  {String}    label       标签
 *  @props  {Number}    Value       值
 *  @props  {String}    color       颜色
 *  @return {Component} BoxOfficeDonut
 */


define([
    'React',
    'util'
], function(
    React,
    Util
) {

    class BoxOfficeDonut extends React.Component{
        render(){

            return (
                <li key={1}>
                    <div className={"circle-wrap "+this.getRotateClass(this.props.value)}>
                        <div className="hold hold1">
                            <div className="pie pie1 rotate"></div>
                        </div>
                        <div className="hold hold2">
                            <div className="pie pie2 rotate"></div>
                        </div>
                        <div className={"bg-circle " + this.props.color}></div>
                        <div className="text">{this.props.label}</div>
                    </div>
                    <p className="circle-data">{this.props.value}%</p>
                </li>
            )
        }
        shouldComponentUpdate(nextProps, nextState) {
            return nextProps.value != this.props.value;
        }
        getRotateClass(value){
            var _value = (Number(value)/10).toFixed(0);
            return "c"+String(_value)+"0"
        }
    }

    return BoxOfficeDonut;
})
