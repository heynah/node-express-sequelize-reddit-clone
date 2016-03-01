var React = require('react');
var ReactDOMServer = require('react-dom/server');

function renderHtml(jsxStructure) {
    var outputHtml = ReactDOMServer.renderToStaticMarkup(jsxStructure);

    return '<!doctype html>' + outputHtml;
}

function Layout(data) {
    console.log(data.loggedInUser)
    var pageNav = {};
    var navBot = {};
    if (data.loggedInUser) {
        pageNav =
            <ul className="navLinks_chPa">
            <li className="navLink_ch animate"><a href="/">Home</a></li>
            <li className="navLink_ch animate"><a href="/postSomething">Write a Post</a></li>
            <li className="navLink_ch animate"><a href="/bye">Logout</a></li>
            </ul>;
        navBot =
            <ul className="pageBot_pa">
            <li className="navLink_ch" style={{width: 115}}><a href="/">Home</a></li>
            <li className="navLink_ch" style={{width: 115}}><a href="/postSomething">Write a Post</a></li>
            <li className="navLink_ch" style={{width: 115}}><a href="/bye">Logout</a></li>
            </ul>;

    }
    else {
        pageNav =
            <ul className="navLinks_chPa">
            <li className="navLink_ch animate"><a href="/">Home</a></li>
            <li className="navLink_ch animate"><a href="/login">Login</a></li>
            <li className="navLink_ch animate"><a href="/joinUs">Sign Up</a></li>
            </ul>;
        navBot =
            <ul className="pageBot_pa">
            <li className="navLink_ch" style={{width: 85}}><a href="/">Home</a></li>
            <li className="navLink_ch" style={{width: 85}}><a href="/login">Login</a></li>
            <li className="navLink_ch" style={{width: 85}}><a href="/joinUs">Sign Up</a></li>
            </ul>;


    }
    return (
        <html>
            <head>
                <link rel="stylesheet" type="text/css" href="/files/css/app.css" />
                <title>{data.title}</title>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"/>
                <link href='https://fonts.googleapis.com/css?family=PT+Sans' rel='stylesheet' type='text/css'/>
                <link href="/files/css/linkPreview.css" rel="stylesheet" type="text/css"/>
                <meta charSet = "utf-8"/>
            </head>
            <body>
            
            <header className="pageTop_pa">
                <div className="navTop_ch"><span className="fa fa-bullhorn fa-4x"></span><i className="fa fa-wifi fa-2x"></i></div>
                <nav className="navTop_chPa">
                {pageNav}
                </nav>
            </header>
            {data.children}
            <footer className="pageBot_pa">
                {navBot}
            </footer>
            <div className="gitFoot"><a href="https://github.com/heynah"><i className="fa fa-github-square fa-2x"></i></a></div>
            <script src="https://code.jquery.com/jquery-1.12.1.js"></script> {/*force https*/}
            <script src="/files/js/jquery-live-preview.js"></script>
            <script src="/files/js/app-compiled.js"></script>
            
            </body>
        </html>
    );
}

/*<h3><a href="https://project-reddit-clone-heynah.c9users.io/login">Login</a> /  <a href="https://project-reddit-clone-heynah.c9users.io/joinUs">Sign-Up</a></h3>
<h2><a href="https://project-reddit-clone-heynah.c9users.io/postSomething">Add a New Post! </a></h2>*/
function renderHomepage(data) {
    var structure = (
        <Layout title="Top Posts!" loggedInUser={data.user}>
        {data.error ? <div>{data.error}</div> : null}
  <div className="homepageBody">

      <h1 className="postsTitle_ch">List of contents</h1>
      <ul className="contentsList_paCh">
      
          {data.posts.map(function(item){
          
          return (
          <li>
              <div className="voter_paCh">
                  <h2 className="voteScore_ch">{item.dataValues.voteScore/* ? item.dataValues.voteScore : "Cast the first vote!"*/}
                  </h2>
                  <div className="voteButtons_paCh">
                  <form action="/votePost" method="post">
                      <input type="hidden" name="upVote" value="true"/>
                      <input type="hidden" name="contentId" value={item.id}/>
                      <button type="submit"><i className="fa fa-caret-square-o-up fa-2x"></i></button>
                  </form>
                  <form action="/votePost" method="post">
                       <input type="hidden" name="upVote" value="false"/>
                       <input type="hidden" name="contentId" value={item.id}/>
                       <button type="submit"><i className="fa fa-caret-square-o-down fa-2x"></i></button>
                  </form>
                  </div>
              </div>
              <article className="contentGuts_paCh">
                  <h2>
                    <a target="_blank" className="livepreview" href={item.url}>{item.title}</a>
                  </h2>
                  <p>Blame: {item.user.dataValues.username}</p>
              </article>
          </li>
              );
          })}
     </ul>
 </div>
     </Layout>
    );

    return renderHtml(structure);
}

function renderLogin(data) {
    // create the HTML structure with interpolations
    var error = decodeURIComponent(data.error);
    console.log(error);
    var structure = (
        <Layout title="Bienvenue!" loggedInUser={data.user}>
        {data.error ? <div>{error}</div> : null}
        <div className="loginBody">
            <h1 className="loginTitle_ch">Login</h1>
            <form className= "loginForm_ch" action="/login" method="post">
                 <div><input type='text' name='username' placeholder='You again!' size="25"/></div>
                 <div><input type='password' name='password' placeholder='Top secret' size="25"/></div>
                 <div><button type='submit'>Come In!</button></div>
            </form>
        </div>
        {/* ul>(li>img[src=http://placekitten.com/g/200/200])*5 emmet notation*/}
      </Layout>
    );

    // return the html
    return renderHtml(structure);
}

function renderSignUp(data) {
    // create the HTML structure with interpolations
    var error = decodeURIComponent(data.error)
    var structure = (
        <Layout title ="Bienvenue!" loggedInUser={data.user}>
          {error.data && <div>{error}</div>}      
        <div className="joinBody">
            <h1 className="joinTitle_ch">Join Us!</h1>
            <form className= "loginForm_ch" action="/joinUs" method="post">
                 <div><input type='text' name='username' placeholder="What's your handle?" size="25"/></div>
                 <div><input type='password' name='password' placeholder='Top secret' size="25"/></div>
                 <div><button type='submit'>Come In!</button></div>
            </form>
        </div>
    </Layout>
    );

    // return the html
    var html = renderHtml(structure);

    return html;
}

function renderPost(data) {
    var structure = (
        <Layout title="Say What?!" loggedInUser={data.user}>
        {data.error ? <div>{data.error}</div> : null}
        <div className="postBody">
            <h1 className="postTitle_ch">Tell me what's on your mind</h1>
            <form className="postForm_ch" action="/postSomething" method="post">
                <div><input type='text' name='url' placeholder="Enter the URL you'd like to share" size="30"/></div>
                <div><input type='text' name='title' placeholder="What would you like to call it?" size="30"/></div>
                <div><button type='submit'>Publish!</button></div>
            </form> 
        </div>
    </Layout>
    );
    return renderHtml(structure);
}

function renderCommentForm(data) {
    var structure = (
        <Layout title="Say What?!" loggedInUser={data.user}>
        {data.error ? <div>{data.error}</div> : null}
        <div className="postBody">
            <h1 className="postTitle_ch">Set that other user straight!</h1>
            <form className="postForm_ch" action="/content/:id" method="post">
                <div><input type= 'textarea' name="comment" rows="10" cols="50" maxlength="1000" minlength="2">Write something here</input></div>
                <div><button type='submit'>Publish!</button></div>
            </form> 
        </div>
    </Layout>
    );
    return renderHtml(structure);
}

function renderCommentPage(data) { //really is my 'findOne' ("post")
    var structure = (
        <Layout title="Blah blah blah!" loggedInUser={data.user}>
        {data.error ? <div>{data.error}</div> : null}
          <div className="homepageBody">
        
              <h1 className="postsTitle_ch">Let the people speak:</h1>
              <div className="contentItem_paCh">
                  <div className="voter_paCh">
                      <h2 className="voteScore_ch">{data.dataValues.voteScore}{/* ? item.dataValues.voteScore : "Cast the first vote!"*/}</h2>
                      <div className="voteButtons_paCh">
                          <form action="/votePost" method="post">
                              <input type="hidden" name="upVote" value="true"/>
                              <input type="hidden" name="contentId" value={data.id}/>
                              <button type="submit"><i className="fa fa-caret-square-o-up fa-2x"></i></button>
                          </form>
                          <form action="/votePost" method="post">
                               <input type="hidden" name="upVote" value="false"/>
                               <input type="hidden" name="contentId" value={data.id}/>
                               <button type="submit"><i className="fa fa-caret-square-o-down fa-2x"></i></button>
                          </form>
                      </div>
                  </div>
                  <article className="contentGuts_paCh">
                      <h2><a target="_blank" className="livepreview" href={data.url}>{data.title}</a></h2>
                      <p>Blame: {data.user.dataValues.username}</p>
                  </article>
              </div>
              <div id= "commentary" className= "contentItem_paCh"> it's a div </div>
         </div>
     </Layout>
    );

    return renderHtml(structure);
}

module.exports = {
    renderHtml: renderHtml,
    renderLogin: renderLogin,
    renderSignUp: renderSignUp,
    renderHomepage: renderHomepage,
    renderPost: renderPost,
    Layout: Layout,
    renderCommentForm: renderCommentForm,
    renderCommentPage: renderCommentPage
};
