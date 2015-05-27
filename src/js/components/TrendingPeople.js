var React          = require("react");
var ActionCreators = require('../actions/ActionCreators');

var TrendingPeople = React.createClass({

    componentWillMount: function(){
      ActionCreators.fetchTrendingPeople();
      $(document).ready(function(){
        $(".trendiPeopleImage").mouseenter(function(){
        });
      });
    },

    render: function() {
      var profile_url;
      var trendingPeople;
      var profile_image_url;
      if (this.props.trendingPeople.length > 0){
          trendingPeople = this.props.trendingPeople.map(function(ele, index) {
          profile_image_url = 'https://graph.facebook.com/' + ele.facebook_id + '/picture?width=300&height=300';
          profile_url = '/#/' + ele.facebook_id;
          return (
            <div className="col-md-2 col-sm-3 col-xs-6 peopleBox trendiPeopleImage">
             <a href={profile_url}><img src={profile_image_url} key={Math.random()} className="image" /></a>
            </div>
          );
        });

      }
        return(
          <div>
            <h5 id="trendingPeople"> TREND<strong>i</strong>NG PEOPLE </h5>
            {trendingPeople}
          </div>
        );
    }
});


module.exports = TrendingPeople;

