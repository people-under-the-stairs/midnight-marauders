var React          = require("react");
var ActionCreators = require("../actions/ActionCreators");

var TrendingThings = React.createClass({

    clickHandler: function(rating,_id) {
      var voter_id = this.props.user.facebook_id;
      var data     = {
        userImages     : null,
        trendingImages : this.props.trendingImages,
        image_id       : _id,
        voter_id       : voter_id,
        rating         : rating
      };
      ActionCreators.rate(data);
    },

    componentWillMount: function() {
      ActionCreators.fetchTrendingImages();
    },

    render: function() {
      var images     = this.props.trendingImages || [];
      var thumbsLogo = "/public/assets/images/thumbs-up.png";
      var that       = this;

      // create the HTML for all the images
      if (images.length > 0) {
        reverse_images = images.reverse();
        var imagesHTML = reverse_images.map(function(image, index) {
          var id       = Math.floor(Math.random()*1000);
          var count    = 1;
          var rating   = [];
          var hidden   = "";

          // create the trendi rating below each image
          while (count <= 5) {
            var rateClick = that.clickHandler.bind(null, count, image._id);
            if (image.rating < count) hidden = "inactive";
            rating.push(<img key={Math.random()} className={"rating " + hidden} src={thumbsLogo} onClick={rateClick} />);
            count +=1;
          }

          return (
            <div key={image.file.url} className="imageBox col-md-3 col-sm-4 col-lg-2 col-xs-6">
              <img src={image.file.url} className="image"/>
              <div className="thumbLogo">{rating}</div>
            </div>
          );
        });
      }

      return (
        <div>
          <hr id="line" />
          <h5 id="trendingThings">THINGS PEOPLE LIKE RIGHT NOW</h5>
          <div>
            {imagesHTML}
          </div>
        </div>
      );
    }
});



module.exports = TrendingThings;

