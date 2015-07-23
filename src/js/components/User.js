var React          = require('react');
var ActionCreators = require('../actions/ActionCreators');


var User = React.createClass({

  componentWillMount: function(){
    var id = this.props.params.user;
    ActionCreators.fetchPublicUser(id);
  },

  componentWillUnmount: function(){
    ActionCreators.removePublicUser();
  },

    clickHandler: function(rating,_id) {

      //check if the user is logged in
      if (this.props.user !== null){
          var voter_id = this.props.user.facebook_id;
          var data = {
            publicProfileImages : this.props.publicProfile.images,
            trendingImages      : null,
            image_id            : _id,
            voter_id            : voter_id,
            rating              : rating
          };
          ActionCreators.rate(data);
      }

    },


  render: function(){

    var username          = "";
    var images            = [];
    var profile_image_url = "";
    var facebook_id       = "";
    var avgRating;
    var numOfImgs;

    // check that publicProfile is populated from the AJAX reply. Or else, it triggers an error
    if (this.props.publicProfile.user !== undefined){
      username          = this.props.publicProfile.user.username;
      images            = this.props.publicProfile.images;
      facebook_id       = this.props.publicProfile.user.facebook_id;
      profile_image_url = 'https://graph.facebook.com/' + facebook_id + '/picture?width=300&height=300';
      avgRating         = (this.props.publicProfile.user.avgRating).toFixed(1);
      numOfImgs         = images.length;
    }

      var publicProfile = this.props.publicProfile.images || [];
      var trendiLogo    = "/public/assets/images/thumbs-up.png";
      var that          = this;

      // create the HTML for all the images
      if (images.length > 0){
      var imagesHTML = images.map(function(image, index) {

      var count  = 1;
      var rating = [];
      var hidden = "";

      // create the trendi rating below each image
      while (count<=5){
              var rateClick = that.clickHandler.bind(null, count, image._id);
        if (image.rating < count) hidden = "inactive";
        rating.push(<img key={Math.random()} className={"rating " + hidden} src={trendiLogo} onClick={rateClick} />);
        count +=1;
        }

      return (
        <div key={image.file.url} className="imageBox col-md-3 col-sm-4 col-lg-2 col-xs-6">
        <img src={image.file.url} className="image"/>
        <div className="ratingLogo">{rating}</div>

        </div>
      );
      });
    }
return (
      <div>
        <div className="profileContainer container">
          <div className="row">
          <div className="publicProfileRow col-md-8 col-md-offset-2">
                <div id="profileCard">
                  <div>
                    <img src={profile_image_url} id="profilePic" className="image"/>
                    <div className="infoBar">
                      <p id="userName">{username}</p>
                      <div className="shareStats"><p>Average Rating: <span className="profile_score">{avgRating}</span> Images shared: <span className="profile_score">{numOfImgs}</span></p>
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

module.exports = User;
