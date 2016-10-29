'use strict';

var jsFilesToInject = [
   {
    src: 'test/fixtures/regularInject/*.js'
  },
  {
    src: [
      'test/fixtures/typeInject/*.js',
      'test/fixtures/typeInject/*.js'
    ],
    type: 'script/babel'
  },
  'js/iammissing/**/*.js'
];

module.exports.jsFilesToInject = jsFilesToInject;