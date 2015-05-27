var React          = require("react");
var ActionCreators = require('../actions/ActionCreators');
var Router         = require('react-router'); // or var Router = ReactRouter; in browsers
var Upload         = require("./Upload");
var Link           = Router.Link;

var Profile = React.createClass({

  componentWillMount: function(){
  },

  clickHandler: function() {
    $('#myModal').modal('show');
  },

  render: function(){

    var facebook_id       = "";
    var username          = "";
    var profile_image_url = "";
    var images            = [];
    var avgRating;
    var numOfImgs;

    // the users info is stored in this.props.user
    if (this.props.user !== null){
      username = this.props.user.username;
      facebook_id = this.props.user.facebook_id || "";
      profile_image_url = 'https://graph.facebook.com/' + facebook_id + '/picture?width=300&height=300';
      images = this.props.userImages || [];
      avgRating = (this.props.user.avgRating).toFixed(1);
      numOfImgs = images.length;

    }
    var trendiRating = this.props.rating;

      var trendiLogo = "/public/assets/images/logo-round.png";
      var that = this;

      // create the HTML for all the images
      if (images.length > 0){
            var imagesHTML = images.map(function(image, index){
            var count = 1;
            var rating = [];
            var hidden = "";

            // create the trendi rating below each image
            while (count<=5){
              if (image.rating < count) hidden = "inactive";
              rating.push(<img key={Math.random()} className={"rating " + hidden} src={trendiLogo} />);
              count +=1;
            }

          return (
             <div key={image.file.url} className="imageBox col-md-3 col-sm-4 col-lg-2 col-xs-6">
              <img src={image.file.url} className="image"/>
               <div className="ratingLogo">{rating}
               </div>
              </div>
            );
      });
    }

    return (
      <div>
        <div className="profileContainer container">
          <div className="row">
            <div className="profileRow col-md-8 col-md-offset-2">
                <div id="profileCard">
                  <div>
                    <img src={profile_image_url} id="profilePic" className="image"/>
                    <div className="infoBar">
                      <p id="userName">{username}</p>
                      <div className="trendiStats"><p>TrendiRating: <span className="profile_score">{avgRating}</span> Images shared: <span className="profile_score">{numOfImgs}</span></p>
                      </div>
                    <div id="upload">
                      <button type="button" className="btn" value="Share image" onClick={this.clickHandler} id="submitID">
                      Share image
                      </button>
                      <Upload />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      <div className="container">
        <div className="row">
          {imagesHTML}
        </div>
      </div>
    </div>
    );
  }
});

module.exports = Profile;
