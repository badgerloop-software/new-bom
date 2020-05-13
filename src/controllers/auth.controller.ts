import request from 'request';
const User = require('../models/user');
const {CLIENT_ID, CLIENT_SECRET} = process.env;


export const getAuth = (req, res) => {
  res.render('mainPage', {
    login: true,
  });
};

export const getAuthRedirect = (req, res) => {
  let options = {
    uri: `https://slack.com/api/oauth.access?code=${req.query.code}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    method: 'GET'
  };
  request(options, (err: Error, _response, body) => {
    if (err) throw err;
    let JSONresponse = JSON.parse(body);
    if(!JSONresponse.ok) {
      console.log(JSONresponse);
      res.send('Error encountered: \n' + JSON.stringify(JSONresponse)).status(200).end();
    } else {
      console.log(JSONresponse);
      res.send('Success!');
    }
  })
};

export const getLogout = (req, res) => {
  req.logout();
  req.flash('success', {
    msg: 'Successfully Logged Out'
  });
  res.redirect('/');
};


