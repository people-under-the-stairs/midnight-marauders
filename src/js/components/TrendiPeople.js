var React        = require("react");
var Router       = require('react-router'); // or var Router = ReactRouter; in browsers
var DefaultRoute = Router.DefaultRoute;
var Link         = Router.Link;
var RouteHandler = Router.RouteHandler;
var Route        = Router.Route;

//var ActionCreators = require('../actions/ActionCreators');
var Store          = require('../stores/Store');
var Profile        = require('./Profile');
var Trending       = require('./Trending');
var Upload         = require('./Upload');
var User           = require('./User');
var ActionCreators = require('../actions/ActionCreators');

function getStateFromStore(){

  var rating          = Store.getRating();
  var user            = Store.getUser();
  var trendingPeople  = Store.getTrendingPeople();
  var looks           = Store.getLooks();
  var userImages      = Store.getUserImages();
  var trendingImages  = Store.getTrendingImages();
  var publicProfile   = Store.getPublicProfile();

  return {
    rating          : rating,
    user            : user,
    trendingPeople  : trendingPeople,
    looks           : looks,
    userImages      : userImages,
    trendingImages  : trendingImages,
    publicProfile   : publicProfile
  };
}

var TrendiPeople = React.createClass({

  getInitialState: function(){
    return getStateFromStore();
  },

  componentWillMount: function(){
    // console.log('componentDidMount');
    Store.addChangeListener(this._onChange);
    ActionCreators.fetchUser();
  },

  componentWillUnmount: function(){
        Store.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    this.setState(getStateFromStore());
  },


  render: function(){

    // display login or logout if the user is logged in or out
    if (this.state.user) {
      menu =  <ul className="nav nav-tabs nav-justified">
            <li><Link to="home" className="menu_text" >HOME</Link></li>
            <li><Link to="profile" className="menu_text" id="profilenav">MY WARDROBE</Link></li>
            <li><Link to="trending" className="menu_text">TRENDING</Link></li>
            <li><a href="/logout" className="menu_text">LOG OUT</a></li>
          </ul>;

    } else {
      menu =  <ul className="nav nav-tabs nav-justified">
            <li><Link to="home" className="menu_text" >Home</Link></li>
            <li><a href="/facebook" className="menu_text">Login</a></li>
          </ul>;
    }
    // // display login or logout if the user is logged in or out

    var rating = this.state.rating;
    if (this.state.user) {
    return(
    <div>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
              <div id="topBox">
              <Link to="home"><img src="/public/assets/images/trendi.png" id="logo"/></Link>
                <div id="social_icons">
                <div className="fb-share-button" data-href="https://trendipeople1.herokuapp.com" data-layout="button">
                </div>

                <a href="https://twitter.com/share" className="twitter-share-button" data-url="http://trendipeople.com" data-text="Check out the latest fashion trends at trendipeople.com" data-hashtags="trendipeople">Tweet</a>
              </div>
            </div>
            <nav className="navbar navbar-default">
            <div className="container-fluid">
                <div>
                {menu}
              </div>
            </div>
            </nav>
          </div>
        </div>

      <RouteHandler rating={this.state.rating}
            publicProfile={this.state.publicProfile}
            userImages={this.state.userImages}
            user={this.state.user}
            trendingPeople={this.state.trendingPeople}
            trends={this.state.trends}
            looks={this.state.looks}
            categories={this.state.categories}
            trendingImages={this.state.trendingImages} />
    </div>
  </div>
    );
    } else {
      return(
        <div id="homepagecontainer">
          <ul className="nav nav-tabs nav-justified">
            <li><a href="/facebook">Login</a></li>
          </ul>
            <div>
            <img src="../../public/assets/images/fashion.jpg" id="homepageImage" />
            </div>
            <div className="col-md-12">
              <div id="centreBox" className="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-8 col-xs-offset-2">
                <img src="../../public/assets/images/trendi.png" id="landingTrendi" />
                <span id="landingText">The fashion industry promotes a distorted image of beauty. At TRENDiPEOPLE we believe everyone is a unique and beautiful individual regardless of body shape, size, colour or where they come from. TRENDiPEOPLE is a place to discover real time trending fashion from around the world. Discover, share your fashion photos and in so doing you might just kick-start a global fashion trend.</span>
              </div>
          </div>
        </div>
      );
    }
  }
});



var routes = (
  <Route name="home" path="/" handler={TrendiPeople} >
    <Route name="upload" handler={Upload} />
    <Route name="profile" handler={Profile} />
    <Route name="trending" handler={Trending} />
    <Route name=":user" handler={User} />
    <DefaultRoute handler={Trending} />
  </Route>
);

// Add Router.HistoryLocation to remove the urgy hash from the URL, but then the dynamic urls dont work...
Router.run(routes, function(Handler){
    React.render(<Handler/>, document.body);
});

module.exports = TrendiPeople;
