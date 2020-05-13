import express from 'express';
import * as newsController from '../controllers/news.controller';
const multer = require('multer');
const uploadNews = multer({ dest: './uploads/news' });

let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();

let NewsRouter = express.Router();

NewsRouter.post('/news/create', newsController.news_create);
NewsRouter.get('/news/:id', newsController.news_details);
NewsRouter.get('/news/', newsController.news_list);
NewsRouter.post('/news/:id/update', newsController.news_update);
NewsRouter.post('/news/:id/delete', newsController.news_delete);
NewsRouter.post('/news/upload', uploadNews.single('newsImg'), (req, res) => {
    if (req.file) {
      console.log('Uploading file...');
      fs.rename('uploads/news/' + req.file.filename, process.env.IMAGES_FOLDER + '/' + req.file.originalname, function (err) {
        if (err) console.log('ERROR: ' + err);
      });
      // shell.mv('uploads/sponsors/' + req.file.filename', 'file2', 'dir/');
      var filename = req.file.originalname;
      let logs = new Logs(
        {
          time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
          name: req.user.name,
          action: "uploaded news image",
          field: "Image name: " + filename,
        }
      );
      logs.save(function (err) {
        if (err) {
          return next(err);
        }
      });
      req.flash('success', { msg: `News Image Uploaded! Name of File: ${filename}` });
      return res.redirect('/crud');
    } else {
      console.log('No File Uploaded');
      var filename = 'FILE NOT UPLOADED';
      req.flash('success', { msg: `News image upload failed!` });
      return res.redirect('/crud');
    }
  });
export default NewsRouter;