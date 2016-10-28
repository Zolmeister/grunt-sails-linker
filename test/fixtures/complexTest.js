'use strict';

var jsFilesToInject = [
   {
    src: 'test/fixtures/regularInject/*.js',
    environment: 'production',
    headers: {
      foo: 'bar'
    }
  },
  {
    src: 'test/fixtures/typeInject/*.js',
    type: 'script/babel'
  },
  'js/iammissing/**/*.js'
];

module.exports.jsFilesToInject = jsFilesToInject;