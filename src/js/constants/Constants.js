var keyMirror = require('react/lib/keyMirror');

module.exports = {

  ActionTypes: keyMirror({
    RATE                     : null,
    RECEIVED_USER            : null,
    RECEIVED_USER_IMAGES     : null,
    RECEIVED_TRENDING_IMAGES : null,
    RECEIVED_TRENDING_PEOPLE : null,
    RECEIVED_RATING          : null,
    RECEIVED_PUBLIC_PROFILE  : null,
    REMOVE_PUBLIC_USER       : null
  })

};
