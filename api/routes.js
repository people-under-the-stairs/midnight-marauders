var handler = require("./handler.js")
var path = require("path");

module.exports = [
  {
    path: '/api/trending/images',
    method: 'GET',
    config: {
      auth: {
        strategy: 'session',
        mode: 'try'
      },
      handler: handler.trendingImages,
      plugins: {
        'hapi-auth-cookie': {
           reddirectTo: '/'
        }
      }
    }
  },

  {
    path: '/api/trending/people',
    method: 'GET',
    config: {
      auth: {
        strategy: 'session',
        mode: 'try'
      },
      handler: handler.trendingPeople,
      plugins: {
        'hapi-auth-cookie': {
           reddirectTo: '/'
        }
      }
    }
  },

  {
    path: '/api/user/images',
    method: 'POST',
    config: {
      payload: {
        output:'file',
        maxBytes:209715200,
        parse: true
      },
      auth: {
        strategy: 'session',
        mode: 'try'
      },
      handler: handler.image,
      plugins: {
        'hapi-auth-cookie': {
          reddirectTo: '/'
        }
      }
    }
  },

  {
    path: "/api/user/images",
    method: "GET",
    config: {
      auth: {
        strategy: "session",
        mode: "try"
      },
      handler: handler.image,
      plugins: {
        "hapi-auth-cookie": {
          reddirectTo: "/"
        }
      }
    }
  },

  {
    path: '/api/user',
    method: 'GET',
    config: {
      auth: {
        strategy: 'session',
        mode: 'try'
      },
      handler: handler.user,
      plugins: {
        'hapi-auth-cookie': {
           reddirectTo: '/'
          }
        }
     }
  },

  {
    path: "/api/rate",
    method: "POST",
    config: {
      auth: {
        strategy: "session",
        mode: "optional"
      },
      handler: handler.rate
    }
  },

  {
    path: "/public/{param*}",
    method: "GET",
    handler: {
      directory:{
        path: path.resolve(__dirname + '/../public'),
        index: true
      }
    }
  },

  {
    path: '/api/user/public/{userid}',
    method: ['GET','POST'],
    handler: handler.publicProfile
  },

  {
    path: '/',
    method: 'GET',
    config: {
      auth: {
        strategy: 'session',
        mode: 'try'
      },
      handler: handler.home,
      plugins: {
        'hapi-auth-cookie': {
          reddirectTo: '/'
       }
      }
    }
  },

  {
    method  : ['GET', 'POST'],
    path    : '/facebook',
    config  : {
    auth: 'facebook',
      handler: handler.facebook
    }
  },

  {
    path: '/logout',
    method: 'GET',
    config: {
      auth: {
        strategy: 'session',
        mode: 'try'
      },
      handler: handler.logout
    }
  }
]
