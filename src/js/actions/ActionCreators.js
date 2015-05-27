var Constants     = require('../constants/Constants');
var ActionTypes   = Constants.ActionTypes;
var AppDispatcher = require('../dispatcher/Dispatcher');
var APIUtils      = require('../utils/APIUtils');

module.exports = {

  rate: function(data){
    //optimistic update
    AppDispatcher.dispatch({
      type: ActionTypes.RATE,
      data: data
    });

    // database update
    APIUtils.rate(data);

    },

  fetchUser: function(){
    APIUtils.fetchUser();
  },

  removePublicUser: function(){
    AppDispatcher.dispatch({
      type: ActionTypes.REMOVE_PUBLIC_USER
    });
  },

  fetchUserImages: function(){
    APIUtils.fetchUserImages();
  },

  fetchTrendingImages: function(){
    APIUtils.fetchTrendingImages();
  },

  saveImage: function(data){
    APIUtils.saveImage(data);
  },

  fetchPublicUser: function(id){
    APIUtils.fetchPublicUser(id);
  },

  fetchTrendingPeople: function(){
    APIUtils.fetchTrendingPeople();
  }

};
