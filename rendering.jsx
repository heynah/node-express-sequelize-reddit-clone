var React = require('react');
var ReactDOMServer = require('react-dom/server');
function renderHtml(jsxStructure) {
  var outputHtml = ReactDOMServer.renderToStaticMarkup(jsxStructure);

  return '<!doctype html>' + outputHtml;
}
function Layout(data) {
    return (
        <html>
            <head>
                <link rel="stylesheet" type="text/css" href="app.css" />
                <title>{data.title}</title>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"/>
                <link href='https://fonts.googleapis.com/css?family=PT+Sans' rel='stylesheet' type='text/css'/>
            </head>
            <body>
            <header className="pageTop_pa">
                <div className="navTop_ch"><span className="fa fa-bullhorn fa-4x"></span><i className="fa fa-wifi fa-2x"></i></div>
                <nav className="navTop_chPa">
                  <ul className="navLinks_chPa">
                    <li className="navLink_ch animate"><a href="/">Home</a></li>
                    <li className="navLink_ch animate"><a href="/login">Login</a></li>
                    <li className="navLink_ch animate"><a href="/joinUs">Sign Up</a></li>
                    <li className="navLink_ch animate"><a href="/postSomething">Write a Post</a></li>
                  </ul>
                </nav>
            </header>
            {data.children}
            <footer className="pageBot_pa">
                <li className="navLink_ch"><a href="/">Home</a></li>
                <li className="navLink_ch"><a href="/login">Login</a></li>
                <li className="navLink_ch"><a href="/joinUs">Sign Up</a></li>
                <li className="navLink_ch"><a href="/postSomething">Write a Post</a></li>
            </footer>
            </body>
        </html>
        );
}

    /*<h3><a href="https://project-reddit-clone-heynah.c9users.io/login">Login</a> /  <a href="https://project-reddit-clone-heynah.c9users.io/joinUs">Sign-Up</a></h3>
    <h2><a href="https://project-reddit-clone-heynah.c9users.io/postSomething">Add a New Post! </a></h2>*/
function renderHomepage(data){
  var structure = (
    <Layout title="Top Posts!">
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
                    <a href={item.url}>{item.title}</a>
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
  var structure = (
    <Layout title="Bienvenue!">
        {data.error ? <div>{data.error}</div> : null}
        <div className="loginBody">
            <h1 className="loginTitle_ch">Login</h1>
            <form className= "loginForm_ch" action="/login" method="post">
                 <div><input type='text' name='username' placeholder='You again!' size="25"/></div>
                 <div><input type='password' name='password' placeholder='Top secret' size="25"/></div>
                 <div><button type='submit'>Come In!</button></div>
            </form>
        </div>    
      </Layout>
  );

  // return the html
  return renderHtml(structure);
}

function renderSignUp(data) {
  // create the HTML structure with interpolations
  var structure = (
    <Layout title ="Bienvenue!">
          {data.error && <div>{data.error}</div>}      
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
    var structure =(
    <Layout title="Say What?!">
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

module.exports = {renderHtml: renderHtml, renderLogin: renderLogin, renderSignUp: renderSignUp, 
renderHomepage: renderHomepage, renderPost: renderPost, Layout:Layout};




