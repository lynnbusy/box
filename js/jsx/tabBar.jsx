/**
 *  Tab Bar.jsx
 *  页面顶部 Tab Bar
    <div className={ _current==4?"current":"" }
         onClick={_onClick.bind(null, 4)}>
        <i className={"icon-my " +  (_current==4?"current":"")}></i>我的
    </div>

 *
 */

 define(['React', 'util'], function(React, Util){
     'use strict'

     var TabBar = React.createClass({
        render: function(){
            var _current = this.props.current;
            var _onClick = this.props.onTabClick;
            let isNewRank = localStorage.getItem('new_rank'),
                iRankhtml = <i className={"icon-rank " +  (_current==3?"current":"")} ></i>,
                language = this.props.language;
            // if(!isNewRank){
            //     iRankhtml = <i className={"icon-rank " +  (_current==3?"current":"")}  data-title=""></i>;;
            // }
            let apps = this.state.apps,
                setting = '';
            // ios version > 1.1    android version > 1.2

            if(apps.isApp && ((apps.type == 'iOS' && apps.version > 1.1) || (apps.type == 'Android' && apps.version > 1.2)) ){

                setting = (
                    <div className={ _current==4?"current":"" }
                         onClick={this.handleSetingClick}>
                        <i className={"icon-my " +  (_current==4?"current":"")}></i>{language.mine.title}
                    </div>
                )
            }

            return (
                 <footer>
                    <div className={ _current==0?"current":""}
                        onClick={_onClick.bind(null, 0)}>
                        <i className={"icon-boxoffice "+(_current==1?"current":"")}></i>{language.boxoffice.title}
                    </div>
                    <div className={ _current==1?"current":""}
                         onClick={_onClick.bind(null, 1)}>
                        <i className={"icon-schedule "+ (_current==0?"current":"")}></i>{language.schedule.title}
                    </div>
                    {/*
                      <div className={ _current==2?"current":"" }
                           onClick={_onClick.bind(null, 2)}>
                          <i className={"icon-cenima " +  (_current==2?"current":"")}></i>{language.cinema.title}
                      </div>
                    */}
                    <div className={ _current==3?"current":"" }
                         onClick={_onClick.bind(null, 3)}>
                        {iRankhtml}{language.rank.title}
                    </div>
                    {setting}
                </footer>
            )
        },
        getInitialState: function(){
            return {
                apps: Util.compareVersion()
            }
        },
        handleSetingClick: function(){
            //this.props.callbackSeting(true)
            location.hash = "/mine";
        }
    })


    return TabBar;
 })
