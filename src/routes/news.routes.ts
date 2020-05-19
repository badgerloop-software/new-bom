// /news
import {Request, Response, Router} from 'express';
import {newsController} from '../controllers/';
import fs from 'fs';
import multer from 'multer'
const uploadNews = multer({ dest: './uploads/news' });
import Logs from '../models/Log.model';

let NewsRouter = Router();

NewsRouter.post('/create', newsController.createNews);
NewsRouter.get('/:id', newsController.getNewsDetails);
NewsRouter.get('/', newsController.listNews);
NewsRouter.post('/:id/update', newsController.updateNewsArticle);
NewsRouter.post('/:id/delete', newsController.deleteNewsArticle);
NewsRouter.post('/upload', uploadNews.single('newsImg'), (req: Request, res: Response) => {
    if (req.file) {
      console.log('Uploading file...');
      fs.rename('uploads/news/' + req.file.filename, process.env.IMAGES_FOLDER + '/' + req.file.originalname, function (err) {
        if (err) console.log('ERROR: ' + err);
      });
      var filename = req.file.originalname;
      Logs.createLog(req.user.name, "uploaded news image", "Image name: " + filename);
      req.flash('success', `News Image Uploaded! Name of File: ${filename}`);
      return res.redirect('/crud');
    } else {
      console.log('No File Uploaded');
      filename = 'FILE NOT UPLOADED';
      req.flash('success', `News image upload failed!`);
      return res.redirect('/crud');
    }
  });
export default NewsRouter;