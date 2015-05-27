var mongoose = require('mongoose');
var Path     = require('path');
var index    = Path.resolve(__dirname + '/../public/index.html');
var crate    = require('mongoose-crate');
var S3       = require('mongoose-crate-s3');

var config = require('./config');
var Schema = mongoose.Schema;

var User = require('./schema').User;
var Img  = require('./schema').Img;

// mongolab mongoose connection
mongoose.connect(config.db.dburl);
var db = mongoose.connection;

db.once('open', function(callback){
  console.log('db connected');
});

var logout = function(request,reply){
  if (request.auth.isAuthenticated) {
        console.log('is authenticated, so logging out!');
        request.auth.session.clear();
        reply.redirect('/');
    } else {
        reply.redirect('/');
    }
};

var home = function(request,reply){
  if (request.auth.isAuthenticated){

    var email = request.auth.credentials.email;
    var username = request.auth.credentials.username;
    var facebook_id = request.auth.credentials.auth_id;

    User.findOne({email: email}, function(err,user){
        if (err){
            throw err;
        }

        if (user){
        reply.file(index);
        }

        else {
        var new_user = new User();
                new_user.email = email;
                new_user.username = username;
                new_user.facebook_id = facebook_id;
                new_user.avgRating = 0;
                new_user.timesRated = 0;
                new_user.save( function(err){
                    if (err){
                        console.log('error when saving new member');
                        throw error;
                    }
                    console.log('registration successful');
                    reply.file(index);
                });

        }

    });

  } else {
    console.log('not authenticated');
    reply.file(index);
  }
};

var user = function(request,reply){
    // if user is authenticated
  if (request.auth.isAuthenticated){
      var email = request.auth.credentials.email;
      var id = request.auth.credentials.auth_id;

      // query the db for the user
    User.findOne({email: email}, function(err,user){

        if (err){
            console.log(err);
            throw err;
        }

          // if the user is registered
      if (user){

        Img.find({facebook_id: id}, function(err,images){
          if (err){
                console.log(err);
                    throw err;
            }
            var profile = {
              user: user,
              images: images
            };
            if (images){
              reply(profile);
            }
            else if (!images){
              console.log('no user images');
              reply(profile);
            }
          });

          // if the user isn't registered
      } else if (!user){
        console.log('couldnt find user');
      }

    });

    // if the user isn't authenticated
  } else {
    reply('youre not authenticated');
  }
};

var publicProfile = function(request,reply){

  var id = request.payload.id;

  User.findOne({facebook_id: id}, function(err,user){
      if (err){
            console.log(err);
            throw err;
        }
          // if the user is registered
      if (user){
        Img.find({facebook_id: id}, function(err,images){
          if (err){
                console.log(err);
                    throw err;
            }
            var publicProfile = {
              user: user,
              images: images
            };
            if (images){
              reply(publicProfile);
            }
            else if (!images){
              console.log('no user images');
              reply(publicProfile);
            }
          });
          // if the user isn't registered
      } else if (!user){
        console.log('couldnt find user');
        reply('couldnt find user');
      }

  });

};


var trendingImages = function(request,reply){
  if (request.auth.isAuthenticated){

    // fetch all images in db
    Img.find({},function(err,images){
      if (err){
          throw err;
        }

        if (images){


          // filter through the images, and only return those with >2 in rating
          trending_images = images.filter(function(image){
            return image.rating > 0;
          });

          reply(trending_images);
        }

        else if (!images){
          console.log('no images');
          reply([]);
        }
    });
  }
};

var trendingPeople = function(request,reply){
  User.find({}, function(err,users){
      if (err){
          throw err;
        }

        if (users){
          reply(users);
        }
        else if (!users){
          reply([]);
        }
  });
};


var image = function(request,reply){
  if (request.auth.isAuthenticated){

    // if the user is adding a new image
    if (request.raw.req.method === 'POST'){

      if (request.payload.image_link.filename === "" || Number(request.payload.image_link.bytes) === 0) {
        reply.redirect("/#/profile");
      } else {

        // declare some useful variables
        var id = request.params.id;
        var email = request.auth.credentials.email;
        var facebook_id = request.auth.credentials.auth_id;
        var payload = request.payload;

        var path = payload.image_link.path;

        // create a new image to save in db
        var new_image = new Img();
        var number = Math.floor(Math.random()*10);
        new_image.link = path;
        new_image.rating = 0;
        new_image.raters = [facebook_id];
        new_image.facebook_id = facebook_id;

        // save img
        new_image.attach("file", {path: path}, function(err) {
        // console.log("new_image small url: ", new_image.file.small.url);
          if (err) console.log(err);
          console.log("image attached to s3");

              new_image.save( function(err){
                  if (err){
                      console.log('error when saving new image to mongolabs');
                      throw error;
                  }
                  reply.redirect("/#/profile");
              });
            });
        }
    }

    // find all images from this user
    else if (request.raw.req.method === 'GET'){

      var facebook_id = request.auth.credentials.auth_id;
      Img.find({facebook_id: facebook_id}, function(err,images){
        if (err){
          throw err;
        }

        if (images){
          reply(images);
        }
        else if (!images){
          console.log('no user images');
          reply([]);
        }
      });
    }

    } else {
      reply('not authenticated');
  }
};


var facebook = function (request, reply) {
    var creds = request.auth.credentials;

    var profile = {
        username    : creds.profile.displayName,
        auth_method : 'facebook',
        auth_id     : creds.profile.raw.id,
        email       : creds.profile.email
    };

    request.auth.session.set(profile);
    reply.redirect('/#/trending');
};

var rate = function(request, reply) {
  var payload = request.payload;
  var voter_id = payload.voter_id;
  var rating = payload.rating;

  Img.findOne({_id: payload.image_id}, function(err,image){
    var voters = image.raters;
    var previous_rating = image.rating;
    if(voters.indexOf(voter_id) > -1){

      reply(payload);

    } else {
        var new_rating_count;
      if (!image.beenRated) {
        new_rating_count = 1;
        image.beenRated = true;
      } else if (image.beenRated) {
        new_rating_count += 1;
      }
      var all_ratings_ever = (voters.length * previous_rating) + rating;
      var new_average_rating = all_ratings_ever / new_rating_count;

      image.rating = new_average_rating;
      image.raters.push(voter_id);
      image.markModified('rating');
      image.markModified('raters');
      image.markModified("beenRated");

            image.save(function(err){
                if (err){
                console.log('Error is : ', err);
                }
            });

      var facebook_id = image.facebook_id;

      User.findOne({facebook_id: facebook_id}, function(err, user) {
        var totalRating = user.timesRated * user.avgRating;
        var newTotalRating = totalRating += image.rating;
        user.timesRated += 1;
        user.avgRating = newTotalRating/user.timesRated;

        user.markModified("avgRating");
        user.markModified("timesRated");

        user.save(function(err) {
          if (err) {
            console.log("error updating user avg rating: ", err);
          }
        });
      });

            console.log('db updated!');
            reply(payload);
      }
    });
};


var profiles = function(request,reply){
  var userid = request.params.userid;
  User.findOne({facebook_id: userid}, function(err,user){
    reply(user);
  });
};

module.exports = {
  facebook      : facebook,
  home          : home,
  logout        : logout,
  image         : image,
  user          : user,
  rate          : rate,
  trendingImages: trendingImages,
  trendingPeople:trendingPeople,
  profiles      : profiles,
  publicProfile : publicProfile
};
