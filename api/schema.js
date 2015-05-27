var mongoose    = require('mongoose');
var crate       = require('mongoose-crate');
var S3          = require('mongoose-crate-s3');
var config      = require('./config');
var path        = require("path");
var ImageMagick = require("mongoose-crate-imagemagick");

var userSchema = new mongoose.Schema({
  username    : String,
  email       : String,
  avgRating   : Number,
  timesRated  : Number,
  facebook_id : String
});


var imgSchema = new mongoose.Schema({
  link        : String,
  rating      : Number,
  raters      : [String],
  facebook_id : String,
  beenRated   : Boolean
});

var User = mongoose.model('User', userSchema);

imgSchema.plugin(crate, {
  storage  : new S3({
    key    : config.s3.key,
    secret : config.s3.secret,
    bucket : config.s3.bucket,
    acl    : config.s3.acl, // defaults to public-read
    region : config.s3.region, // defaults to us-standard
    path: function(attachment) { // where the file is stored in the bucket - defaults to this function
      return '/' + path.basename(attachment.path);
    }
  }),
  fields: {
    file: {}
  }
});

var Img = mongoose.model('Img', imgSchema);

module.exports = {
  User : User,
  Img  : Img
};
