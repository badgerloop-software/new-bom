# My Badgerloop (apps.badgerloop.org) &nbsp; ![GitHub Logo](https://raw.githubusercontent.com/badgerloop-software/pod-dashboard/master/src/public/images/icon.png)
*Authors: Eric Udlis, Luke Houge*

The new Badgerloops apps site! This web app combines the BOM (bill of materials), website CRUD (create, read, update, and delete) app, and other useful links in one place, behind one sign-in which we use slack for authenticating.

## Platform/Technologies:
- [Node.js](https://nodejs.org/en/) (our javascript runtime)
- [Express](https://expressjs.com/) (our Node.js web application framework)
- [Handlebars.js](https://handlebarsjs.com) (Our Express.js templating engine)
- [Mongoose](https://mongoosejs.com/) (mongodb object modeling for node.js)
- [Multer](https://github.com/expressjs/multer) (middleware for handling uploading of files)
- [Passport](http://www.passportjs.org/) (authentication for Node.js- we use [passport-slack](https://github.com/mjpearson/passport-slack))

## Server Stack:
 - [Ubuntu Server 18.04.1 LTS](https://www.ubuntu.com/download/server)
 - [Apache HTTP Server](https://httpd.apache.org/download.cgi)
 - [Node.js](https://nodejs.org/en/about/)
 - [Mongo DB 4.0.5](https://www.mongodb.com/)

## Routes/Templating
 - 

## File Structure
``` 
├── README.md
├── app.js
├── config
│   ├── mongo.js
│   └── passport.js
├── controllers
│   ├── admin.js
│   ├── auth.js
│   ├── bom.js
│   ├── budgets.js
│   ├── crud.js
│   ├── events.js
│   ├── orders.js
│   ├── sponsors.js
│   ├── teamleads.js
│   └── utils.js
├── models
│   ├── budget.js
│   ├── order.js
│   ├── sponsor.js
│   ├── teamlead.js
│   └── user.js
├── package-lock.json
├── package.json
├── public
│   └── assets
│       ├── css
│       │   ├── main.css
│       │   ├── material-dashboard-rtl.css
│       │   ├── material-dashboard.css
│       │   └── material-dashboard.css.map
│       ├── js
│       │   ├── browser.default.js
│       │   ├── core
│       │   │   ├── bootstrap-material-design.min.js
│       │   │   ├── jquery.min.js
│       │   │   └── popper.min.js
│       │   ├── createBudget.js
│       │   ├── customHelpers.js
│       │   ├── handlebars.js
│       │   ├── material-dashboard.js
│       │   └── plugins
│       │       └── perfect-scrollbar.jquery.min.js
│       └── scss
│           └── material-dashboard.scss
├── uploads
│   ├── sponsors
│   └── teamleads
└── views
    ├── bom
    │   ├── adminDash.handlebars
    │   ├── createBudget.handlebars
    │   ├── editOrder.handlebars
    │   ├── makeOrder.handlebars
    │   ├── tableView.handlebars
    │   └── viewOrders.handlebars
    ├── calendar.handlebars
    ├── crud.handlebars
    ├── homePage.handlebars
    ├── layouts
    │   └── main.handlebars
    └── partials
        ├── account.handlebars
        ├── flash.handlebars
        └── teamsDropdown.handlebars
```

## Contributing
For details on contributing to the site, check out [CONTIRBUTING.md](https://github.com/badgerloop-software/BOM-Webapp/blob/master/CONTRIBUTING.md)
