/**
 *  Nav Bar.jsx
 *  页面头部 Navigation Bar
 *
 *  @props  {Bool}      bigLogo         中间大 Logo
 *  @props  {Bool}      rightLogo       右侧 Logo
 *  @props  {String}    leftNav         左侧导航文字
 *  @props  {String}    title           标题文字
                            <i
                                className="icon-search"
                                onClick={this.props.clickSearch}>
                            </i>
<i className="icon-setting"></i>
 */



define(['React'], function(React){
    'use strict'

    var NavBar = React.createClass({

        render: function(){
            // let apps = this.state.apps,
            //     setting = '';
            // ios version > 1.1    android version > 1.2
            // if(apps.isApp && ((apps.type = 'iOS' && apps.version > 11) || (apps.type = 'Android' && apps.version > 12)) ){

            //     setting = (
            //         <i
            //             className="icon-setting"
            //             onClick={this.handleSetingClick}>
            //         </i>
            //     )
            // }
            var leftNav = this.props.leftNav &&
                <span
                    onClick={this.props.backCallback}
                    className="ico-back">
                    {this.props.leftNav}
                </span>

            var rightLogo = this.props.rightLogo &&
                <span className="rightLogo">
                    <img src = "icon/logo.png" />
                </span>

            var bigLogo = this.props.bigLogo &&
                <img className="bigLogo" src = "icon/logo.png" />

            var _title = ()=>{
              // just for Lynn's Box version
              if(this.props.bigLogo){
                  return (
                      <h1>
                          <b>{this.props.title}</b>
                          <a onClick={this.handleComingClick} className="coming-movie">{this.props.leftTitle}</a>
                          <i
                              className="icon-search"
                              onClick={this.handleClick}>
                          </i>
                      </h1>
                  )
              }

                if(this.props.bigLogo){
                    return (
                        <h1>
                            <a
                              href="/#/comingmovie"
                              className="coming-movie">

                              {this.props.leftTitle}</a>
                            {bigLogo}
                            <div className = "titleBox">
                                <b>{this.props.title}</b>
                                <i>piaofang.wepiao.com</i>
                            </div>
                            <i
                                className="icon-search"
                                onClick={this.handleClick}>
                            </i>
                        </h1>
                    )
                }else{
                    return <h1>{this.props.title}</h1>
                }
            }()

            return (
                <header>
                    {leftNav}
                    {/*rightLogo*/}
                    {_title}
                </header>
            )
        },
        // getInitialState: function(){
        //     return {
        //         apps: Util.compareVersion()
        //     }
        // },
        handleClick: function(){
            ga('send', 'event', '搜索', 'click', 'search' , 1);
            //Hawkeye - Wepiao FE Analytics Solution
            he && he('send', 'event', 'button', 'click', 'search', 1);
            this.props.clickSearch(true)
        },
        handleSetingClick: function(){
            this.props.clickSeting(true)
        },
        handleComingClick: function(){
            location.hash = "/comingmovie"
        }

     })

     return NavBar;
 })
