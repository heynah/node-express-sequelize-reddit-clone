/*var $ = require('jquery');


$(document).ready(function() {
   var $button = $('<botton> Load Comments</button>');
   $('.commentButton').append($button);
    
})*/
var fakeComments = [
    {
        id: 'a',
        comment: 'limsum flip some',
        says: 'Fat-Albert'
    },
    {
        id: 'b',
        comment: 'some dum young one',
        says: 'Fat-Albert'
    },
    {
        id: 'c',
        comment: 'burger merger further',
        says: 'Fat-Albert'
    },
    ];
    
var React = require('react');
var ReactDOM = require("react-dom");
var f = require("isomorphic-fetch");

function serialize(data) {
    return Object.keys(data).map(function (keyName) {
        return encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName])
    }).join('&');
}

var CommentBox = React.createClass({
    getInitialState: function() {
        return {
            displayed: false,
            comments: [],
            loading : false
        };
     },
     
     
     loadComments: function () {
         var that = this;
        this.setState( {
            displayed: true,
        });
        
        var contentId = window.location.pathname.split('/')[2];
        f('/comment/' + contentId).then(
            function(comments) {
                return comments.json();
            }
        ).then(
            function(comments) {
               that.setState({
                   comments: comments
               }) 
            }
        )
     },
     
     sendComment: function (e) {
        e.preventDefault();

        var comment = this.refs.textInput.value;
        var id = this.refs.contentInput.value;

        //var f = require('isomorphic-fetch');

        var that = this; // why are we doing this??? IF YOU DO NOT KNOW PLEASE ASK!!

        f('/createComment', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: serialize({commentText: comment, contentId: id}), // this encodes to text=hello+world&contentId=123
            method: 'POST',
            credentials: 'same-origin' // this will send our cookies
        }).then(
            function(r) {
                // r is the response from the server as a JSON string

                return r.json(); // this parses the response as JSON to an object
            }
        ).then(
            function(result) {
                // result is the response from the server as an actual object
                that.refs.textInput.value='';
                // here we can finally add the new comment!!

                // WHY ARE WE USING that INSTEAD OF this???
                that.state.comments.unshift({
                    id: result.id,
                    comment: result.comment,
                    says: result.says
                });

                // calling this.setState will make React re-render the component
                that.setState({
                    comments: that.state.comments
                });
            }
        );
    },
     render: function () {
        if (this.state.displayed) {
            var contentId = window.location.pathname.split('/')[2];

            var commentList = this.state.comments.map(
                function(comment) {
                    return (
                        <li key={comment.id}>
                            <p>{comment.comment}</p>
                            <p>So says: {comment.says}</p>
                        </li>
                    )
                }
            )

            return (
                <div>
                    <form onSubmit={this.sendComment}>
                        <input ref="contentInput" type="hidden" name="contentId" value={contentId} />
                        <textarea ref="textInput" name="commentText"></textarea>
                        <button type="submit">Go!</button>
                    </form>
                    <ul className="comments-list">
                        {commentList}
                    </ul>
                </div>
            );
        }
        else {
            return (
                <div>
                    <button onClick={this.loadComments}>Load Comments</button>
                </div>
            );            
        }
    }
 
    
})

ReactDOM.render(<CommentBox/>, document.getElementById('commentary'));
/*document.querySelector('#testing')*/


/*$(document).ready(function() { 
  $(".livepreview").livePreview(
    //   {
    // trigger: 'hover',
    // viewWidth: 300,  
    // viewHeight: 200,  
    // targetWidth: 1000,  
    // targetHeight: 800,  
    // scale: '0.5', 
    // offset: 50,
    // position: 'left'
    // }
);
});*/

