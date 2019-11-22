// I started this, then I realized this needs to be on a development server before I can interact with the API.
// TODO Later

const url = require('url');

exports.getEvent = (req, res, next) => {
  let q = url.parse(req.url, true).query;
  res.setHeader(200, {'content-type': 'text/plain'});
  res.send(q.challenge);
}
