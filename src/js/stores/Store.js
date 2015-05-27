var Dispatcher   = require('../dispatcher/Dispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants    = require('../constants/Constants');
var ActionTypes  = Constants.ActionTypes;
var assign       = require('object-assign');
var CHANGE_EVENT = "change";

var rating = 0;
var _user = null;
var trendingPeople = [
];

var trendingImages = null;
var publicProfile = {};
var userImages = [];

var Store = assign({}, EventEmitter.prototype, {

  emitChange: function(){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback){
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback){
    this.removeListener(CHANGE_EVENT, callback);
  },

  getRating: function(){
    return rating;
  },

  getUser: function(){
    return _user;
  },

  getTrendingPeople: function(){
    return trendingPeople;
  },

  getTrends: function(){
    return trends;
  },

  getLooks: function(){
    // return looks;
  },

  getCategories: function(){
    return categories;
  },

  getTrendingImages: function(){
    return trendingImages;
  },

  getUserImages: function(){
    return userImages;
  },

  getPublicProfile: function(){
    return publicProfile;
  },

});

Dispatcher.register(function(action){

  switch (action.type) {

    case ActionTypes.RATE:
      var images = action.data.publicProfileImages || action.data.trendingImages;
      var id = action.data.image_id;
      var voter_id = action.data.voter_id;
      newImages = images.map(function(image){

          //find correct image
          if (image._id.toString() == id.toString()){

            // if you've already voted on this image, just return the object without changes
            if (image.raters.indexOf(voter_id) > -1 ) {
              return image;
            }
            else {
              var new_rating_count = image.raters.length + 1;
              var all_ratings_ever = (image.raters.length*image.rating) + action.data.rating;
              var new_average_rating = all_ratings_ever / new_rating_count;
              image.rating = new_average_rating;
              image.raters.push(action.data.voter_id);
              return image;
            }
          }
          else{
            return image;
          }
      });

      if (action.data.trendingImages) {
        trendingImages = newImages;
      } else if (action.data.userImages) {
        userImages = newImages;
      }
      Store.emitChange();
      break;

    case ActionTypes.RECEIVED_USER:
      userImages = action.userData.images;
      _user = action.userData.user;
      Store.emitChange();
      break;

    case ActionTypes.RECEIVED_USER_IMAGES:
      userImages = action.images;
      Store.emitChange();
      break;

    case ActionTypes.RECEIVED_IMAGE:
      _user = action.user;
      Store.emitChange();
      break;

    case ActionTypes.RECEIVED_TRENDING_IMAGES:
      trendingImages = action.images;
      Store.emitChange();
      break;

    case ActionTypes.RECEIVED_PUBLIC_PROFILE:
      publicProfile = action.data;
      Store.emitChange();
      break;

    case ActionTypes.RECEIVED_TRENDING_PEOPLE:
      trendingPeople = action.people;
      Store.emitChange();
      break;
    case ActionTypes.REMOVE_PUBLIC_USER:
      publicProfile = {};
      console.log('publicProfile is: ', publicProfile);
      Store.emitChange();
  }


});

module.exports = Store;
