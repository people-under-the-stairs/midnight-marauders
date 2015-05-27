var React          = require("react");
var TrendingPeople = require("./TrendingPeople");
var TrendingLooks  = require("./TrendingLooks");

var Trending = React.createClass({
  render: function(){
    return (
      <div>
        <div className="trendingPeople col-md-12 row">
          <TrendingPeople user={this.props.user} trendingPeople={this.props.trendingPeople} rating={this.props.rating} />
        </div>
        <div className="trendingLooks">
          <TrendingLooks user={this.props.user} looks={this.props.looks} trendingImages={this.props.trendingImages} />
        </div>
      </div>
      );
  }
});

module.exports = Trending;
