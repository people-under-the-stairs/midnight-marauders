var Request = require('superagent');
var ServerActionCreators = require('../actions/ServerActionCreators');

module.exports = {

  rate: function(data){
    Request.post('/api/rate')
      .send(data)
      .end(function(err,res){
        // console.log('AJAX response rate: ', res);
        ServerActionCreators.receivedRating(res.body);
      });
  },

  fetchUser: function(){
    Request.get('/api/user')
      .end(function(err,res){
        // console.log('AJAX response fetchUser: ', res);
        ServerActionCreators.receivedUser(res.body);
      });
  },

  fetchUserImages: function(id){
    Request.get('/api/user/images')
      .end(function(err,res){
        // console.log('AJAX response fetchUserImages: ', res);
        ServerActionCreators.receivedUserImages(res.body);
      });
  },

  fetchTrendingImages: function(){
    Request.get('/api/trending/images')
      .end(function(err,res){
        // console.log('AJAX response fetchTrendingImages: ', res);
        ServerActionCreators.receivedTrendingImages(res.body);
      });
  },

  fetchPublicUser: function(id){
    var data = {
      id: id
    };
    // console.log('fetchPublicUser in APIUTils, id: ', id);
    var url = '/api/user/public/' + id;
    Request.post(url)
      .send(data)
      .end(function(err,res){
        // console.log('AJAX response fetchPublicUser: ', res);
        ServerActionCreators.receivedPublicProfile(res.body);
      });
  },

  fetchTrendingPeople: function(){
    Request.get('/api/trending/people')
      .end(function(err,res){
        // console.log('AJAX response fetchTrendingPeople: ', res);
        ServerActionCreators.receivedTrendingPeople(res.body);
      });
  },


  saveImage: function(data){

    $.ajax({
      url: '/api/user/images',
      type: 'POST',
        xhr: function() {  // Custom XMLHttpRequest
          var myXhr = $.ajaxSettings.xhr();
            if(myXhr.upload){
              console.log(myXhr.upload);
            }
            return myXhr;
          },
        data  : data,
        cache       : false,
        contentType : false,
        processData : false
    }, "json");
  }
};



