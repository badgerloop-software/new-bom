define([
  'CustomHelpers',
], function(Handlebars) {
  'use strict';

  Handlebars.registerHelper('ifCond', (val1, val2, options) => {
    if (val1 === val2) {
      return options.fn(this);
    }
    return options.inverse(this);
  })
  
});
