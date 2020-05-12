const request = require('request');
const User = require('../models/user');
// &redirect_uri=${redirectURI}

exports.getAuth = (req, res) => {
  res.render('mainPage', {
    login: true,
  });
}

exports.getAuthRedirect = (req, res) => {
  let options = {
    uri: `https://slack.com/api/oauth.access?code=${req.query.code}&client_id=${clientID}&client_secret=${clientSecret}`,
    method: 'GET'
  };
  request(options, (err, response, body) => {
    let JSONresponse = JSON.parse(body);
    if(!JSONresponse.ok) {
      console.log(JSONresponse);
      res.send('Error encountered: \n' + JSON.stringify(JSONresponse)).status(200).end();
    } else {
      console.log(JSONresponse);
      res.send('Success!');
    }
  })
}

exports.getLogout = (req, res) => {
  req.logout();
  req.flash('success', {
    msg: 'Successfully Logged Out'
  });
  res.redirect('/');
};


