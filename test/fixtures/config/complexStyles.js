'use strict';

var cssFilesToInject = [
  {
    src: 'test/fixtures/stylesheets/bar.css'
  },
  {
    src: 'test/fixtures/stylesheets/foo.css',
    attrName : 'foo',
    attrValue : 'bar'
  },
  {
    src: [
      'test/fixtures/stylesheets/foo.css',
      'test/fixtures/stylesheets/bar.css'
    ],
    attrName : 'bar',
    attrValue : 'foo'
  }
];

module.exports.cssFilesToInject = cssFilesToInject;