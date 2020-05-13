// /teamleads
import express from 'express';
import fs from 'fs';
import * as teamleadscontroller from '../controllers/teamleads.controllers';
import multer from 'multer';
const Logs = require('./models/log');
const uploadTeamlead = multer({ dest: './uploads/teamleads' });
let TeamLeadRouter = express.Router();

let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();

TeamLeadRouter.post('/create', teamleadscontroller.teamleads_create);
TeamLeadRouter.get('/:id', teamleadscontroller.teamleads_details);
TeamLeadRouter.get('/', teamleadscontroller.teamleads_list);
TeamLeadRouter.post('/:id/update', teamleadscontroller.teamleads_update);
TeamLeadRouter.post('/:id/delete', teamleadscontroller.teamleads_delete);
TeamLeadRouter.post('/teamleads/upload', uploadTeamlead.single('teamleadImg'), (req: any, res) => {
    if (req.file) {
      console.log('Uploading file...');
      fs.rename('uploads/teamleads/' + req.file.filename, process.env.IMAGES_FOLDER + '/teamleads/' + req.file.originalname, function (err) {
        if (err) console.log('ERROR: ' + err);
      });
      // shell.mv('uploads/sponsors/' + req.file.filename', 'file2', 'dir/');
      var filename = req.file.originalname;
      let logs = new Logs(
        {
          time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
          name: req.user.name,
          action: "uploaded teamlead image",
          field: "Image name: " + filename,
        }
      );
      logs.save(function (err, next) {
        if (err) {
          return next(err);
        }
      });
      req.flash('success', { msg: `Teamlead Image Uploaded! Name of File: ${filename}` });
      return res.redirect('/crud');
    } else {
      console.log('No File Uploaded');
      filename = 'FILE NOT UPLOADED';
      req.flash('success', { msg: `Teamlead image upload failed!` });
      return res.redirect('/crud');
    }
  });

export default TeamLeadRouter;