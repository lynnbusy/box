/**
 *  feedbackBlock.jsx
 *  反馈块
 *
 */


define([
    'React',
    'util'
], function(
    React,
    Util
) {

    class FeedbackBlock extends React.Component{
        render(){
            let language = window._language;
            return (
                <div
                    className="feedback"
                    onClick={this.handleClick}
                >
                    <h3>
                      {
                        /*language.Feedback.feedbackBlock.h3*/
                      }
                      Lynn's Box
                    </h3>
                    <p>
                      Data Visualization Product Prototype by Lynn
                      {
                        /*language.Feedback.feedbackBlock.p*/
                      }
                    </p>
                </div>
            )
        }
        handleClick(){
            // so there will be nothing happened;
            return;

            ga('send', 'event', '在线反馈', 'click', 'feedback' , 1);
            //Hawkeye - Wepiao FE Analytics Solution
            he && he('send', 'event', 'button', 'click', 'feedback', 1);
            location.hash = "/feedback"
        }
    }
    return FeedbackBlock;
})
