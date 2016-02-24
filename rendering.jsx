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
            </head>
            <body>
            <nav>
              <ul>
                <li style={{display: "inline-block"}}><a href="/">Home</a></li>
                <li style={{display: "inline-block"}}><a href="/login">Login</a></li>
                <li style={{display: "inline-block"}}><a href="/joinUs">Sign Up</a></li>
                <li style={{display: "inline-block"}}><a href="/postSomething">Write a Post</a></li>
              </ul>
            </nav>
            {data.children}
            <footer>
                <li style={{display: "inline-block"}}><a href="/">Home</a></li>
                <li style={{display: "inline-block"}}><a href="/login">Login</a></li>
                <li style={{display: "inline-block"}}><a href="/joinUs">Sign Up</a></li>
                <li style={{display: "inline-block"}}><a href="/postSomething">Write a Post</a></li>
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
  <div id="contents">

    <h1>List of contents</h1>
      <ul className="contents-list">
      
      {data.posts.map(function(item){
      
      return (
      <li className="content-item">
      <h2 className="content-item__title">{item.dataValues.voteScore/* ? item.dataValues.voteScore : "Cast the first vote!"*/}
        <a href={item.url}>{item.title}</a>
      </h2>
      <p>Created by {item.user.dataValues.username}</p>
      <div>
      
      <form action="/votePost" method="post">
      <input type="hidden" name="upVote" value="true"/>
      <input type="hidden" name="contentId" value={item.id}/>
      <button type="submit">upvote this</button>
      </form>
      <form action="/votePost" method="post">
       <input type="hidden" name="upVote" value="false"/>
       <input type="hidden" name="contentId" value={item.id}/>
      <button type="submit">downvote this</button>
      </form>
      </div>
      </li>
          )
          
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
        <h1>Login</h1>
        <form action="/login" method="post">
         <div><input type='text' name='username' placeholder='You again!'/></div>
         <div><input type='password' name='password' placeholder='Top secret'/></div>
         <div><button type='submit'>Come In!</button></div>
        </form>
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
        <h1>Join Us!</h1>
        <form action="/joinUs" method="post">
         <div><input type='text' name='username' placeholder="What's your handel?"/></div>
         <div><input type='password' name='password' placeholder='Top secret'/></div>
         <div><button type='submit'>Come In!</button></div>
        </form>
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
        <h1>Tell me what's on your mind</h1>
        <form action="/postSomething" method="post">
        <div><input type='text' name='url' placeholder="Enter the URL you'd like to share"/></div>
        <div><input type='text' name='title' placeholder="What would you like to call it?"/></div>
        <div><button type='submit'>Publish!</button></div>
        </form>
    </Layout>
        );
    return renderHtml(structure);
}

module.exports = {renderHtml: renderHtml, renderLogin: renderLogin, renderSignUp: renderSignUp, 
renderHomepage: renderHomepage, renderPost: renderPost, Layout:Layout};




