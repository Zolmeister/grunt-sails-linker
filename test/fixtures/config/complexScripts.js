'use strict';

var jsFilesToInject = [
  {
    src: 'test/fixtures/regularInject/*.js'
  },
  {
    src: 'test/fixtures/regularInject/*.js',
    attrName : 'foo',
    attrValue : 'bar'
  },
  {
    src: [
      'test/fixtures/typeInject/*.js',
      'test/fixtures/typeInject/*.js'
    ],
    attrName : 'type',
    attrValue : 'script/babel'
  },
  'js/iammissing/**/*.js'
];

module.exports.jsFilesToInject = jsFilesToInject;