const CRYPTO = require('crypto');
const VENDOR = require('../models/vendor');
const CIPHER_TECHNIQUE = process.env.CIPHER;
const SECRET_WORD = process.env.SECRET_WORD;

exports.getListVendors = (req, res) => {
  if (!req.user || !(req.user.isAdmin || req.user.isFSC)) {
    req.flash('errors', {msg: 'You are unauthorized to access that'});
    return res.redirect('back');
  }
  vendorsList = VENDOR.find({}, (err, list) => {
    if (err) throw new Error(err);
    res.render('listVendors', {
      user: req.user,
      vendors: list,
      activeVendor: true
    });   
  });
}

exports.postAddVendor = (req, res) => {
  let originalPassword = req.body.password;
  const CIPHER = CRYPTO.createCipheriv(String(CIPHER_TECHNIQUE), `${SECRET_WORD}`,"");
  let encrypted = CIPHER.update(originalPassword,'utf8', 'base64');
  encrypted += CIPHER.final('base64');
  let vendor = new VENDOR({
    name: req.body.name,
    username: req.body.username,
    password: encrypted
  });
  vendor.save((err, doc) => {
    if (err) throw err;
    req.flash('success', {msg: 'Vendor Credentials Stored'});
    res.redirect('/vendors/list');
  });
}

exports.getPassword = (req, res) => {
 VENDOR.findById(req.query.q, (err, doc) => {
   if (err) throw err;
   let hashedPass = doc.password;
   let decipher = CRYPTO.createDecipheriv(String(CIPHER_TECHNIQUE), `${SECRET_WORD}`, "");
   let decryptedPass = decipher.update(hashedPass, 'base64', 'utf8');
   console.log(decryptedPass);
   decryptedPass += decipher.final('utf8');
   VENDOR.find({}, (err, list) => {
     if (err) throw err;
     return res.render('listVendors', {
       user: req.user,
       vendors: list,
       showPass: decryptedPass,
       activeVendor: true
     });
   });
 });

}

exports.getDeleteVendor = (req, res) => {
  const ID = req.query.q;
  VENDOR.findOneAndDelete({'_id': ID}, (err, doc) => {
    if (err) {
      req.flash('errors', {msg: 'Error encountered'});
      return res.redirect('back');
    }
    req.flash('success', {msg: 'Credentials Deleted'});
    return res.redirect('/vendors/list');
    });
}

exports.postEditVendor = (req, res) => {
  const ID = req.body.mongoID;
  const NEW_NAME = req.body.name;
  const NEW_USERNAME = req.body.username;
  const NEW_PASSWORD = req.body.password;
  const CIPHER = CRYPTO.createCipheriv(String(CIPHER_TECHNIQUE), `${SECRET_WORD}`,"");
  let newEncrypted = CIPHER.update(NEW_PASSWORD,'utf8', 'base64');
  newEncrypted += CIPHER.final('base64');
  let update = {
    "name": NEW_NAME,
    "username": NEW_USERNAME,
    "password": newEncrypted
  }
  if (!NEW_PASSWORD) {
    update = {
      "name": NEW_NAME,
      "username": NEW_USERNAME
    }
  }
  VENDOR.findByIdAndUpdate(ID, update, (err, doc) => {
    if (err) throw err;
    console.log(`New Doc =`);
    console.log(doc);
    req.flash('success',{msg: 'Vendor Updated'});
    return res.redirect('/vendors/list');
  });
}
