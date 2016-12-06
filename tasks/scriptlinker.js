/*
 * grunt-scriptlinker
 * https://github.com/scott-laursen/grunt-scriptlinker
 *
 * Copyright (c) 2013 scott-laursen
 * Copyright (c) 2013 Zoli Kahan
 * Copyright (c) 2014 Mike McNeil
 * Licensed under the MIT license.
 */

const util = require('util');
const glob = require('glob');
const _ = require('lodash');

module.exports = function(grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks
	grunt.registerMultiTask('sails-linker', 'Autoinsert script tags in an html file.', function() {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			startTag: '<!--SCRIPTS-->',
			endTag: '<!--SCRIPTS END-->',
			fileTmpl: '<script src="%s"></script>',
			appRoot: '',
			relative: false,
			inline: false
		});
		/** hold script src and html attributes */ 
		var scripts = [];

		/**
		 * Iterate over the given config objects 
		 * to build scripts[]
		 */
		this.createScriptTags = function(files) {
			files.forEach((file) => {
				if(_.isString(file)) {
					this.addStringScriptTags(file);
					return;
				} else if(_.isString(file.src)) {
					this.addStringScriptTags(file.src, file.attrName, file.attrValue);
					return;
				}
				if(_.isArray(file) || _.isArray(file.src)) {
					this.addArrayScriptTags(file);
					return;
				}
			});
		}
		
		/** 
 		*	Adds script tags when src is an array
		* 	e.g 
		* 	{
		*		src: [
		*			'path/to/abc.js',
		*			'another/path/xyz.js'
		*		],
		*		attrName : 'type',
		*		attrValue : 'text/javascript'
		*	}
		*/
		this.addArrayScriptTags = function(source) {
			source.src.map((src) => {
				var file = grunt.file.glob.sync(src);
				if(file.length === 0) {
					grunt.log.warn('Source file "' + src + '" not found.');
					return;
				}
				if(source.attrName === undefined) {
					var defaultTypes = this.getDefaultValuesByFileType(file[0]);
					source.attrName = defaultTypes.attrName;
					source.attrValue = defaultTypes.attrValue;
				}
				file.map((src) => {
					scripts.push({
						'src' : src,
						'attrName' : source.attrName,
						'attrValue' : source.attrValue 
					});	
				});
			});	
		}

		/** 
 		*	Adds regular string like script tags
		* 	e.g 
		* 	'path/to/my.js',
		*	attrName : 'foo',
    	*	attrValue : 'bar'
		*/
		this.addStringScriptTags = function(source, attrName, attrValue){
			var file = grunt.file.glob.sync(source);
			var defaultTypes = {};
			if(file.length === 0) {
				grunt.log.warn('Source file "' + source + '" not found.')
				return;
			}
			if(attrName === undefined || attrValue === undefined) {
				defaultTypes = this.getDefaultValuesByFileType(file[0]);	
			} else {
				defaultTypes.attrName = attrName;
				defaultTypes.attrValue = attrValue;
			}
			file.map((src) => {
				scripts.push({
					'src' : src,
					'attrName' : defaultTypes.attrName,
					'attrValue' : defaultTypes.attrValue
				});	
			});
		}
		
		/**
		*  Gets defauls html attributes depending on the file type
		*/
		this.getDefaultValuesByFileType = function(fileName) {
			var retval = {};
			var type = fileName.substr(fileName.lastIndexOf('.') + 1); 
			retval.attrName = 'type';
			if(type === 'js') {
				retval.attrValue = "text/javascript";
				return retval;
			} 
			if(type === 'css') {
				retval.attrValue = "text/css";
				return retval;
			}
		}

		// Iterate over all specified file groups.
		this.files.forEach((f) => {
			var	i = 0,
				page = '',
				newPage = '',
				start = -1,
				end = -1; 
			f.csrc = [];	
			this.createScriptTags(f.orig.src);

			// Create script tags
			scripts = scripts.map((script) => {
				var filepath = script.src;
				if (options.inline) {
					var contents = grunt.file.read(filepath);
					return util.format(options.fileTmpl, contents, script.attrName, script.attrValue);
				}
				filepath = filepath.replace(options.appRoot, '');
				// If "relative" option is set, remove initial forward slash from file path
				if (options.relative) {
					filepath = filepath.replace(/^\//,'');
				}
				filepath = (options.prefix || '') + filepath;
				if (options.fileRef) {
					return options.fileRef(filepath);
				} else {
					var t= util.format(options.fileTmpl, filepath, script.attrName, script.attrValue);
					return util.format(options.fileTmpl, filepath, script.attrName, script.attrValue);
				}
			});

			// Insert into html
			grunt.file.expand({}, f.dest).forEach((dest) =>{
				page = grunt.file.read(dest);
				start = page.indexOf(options.startTag);
				end = page.indexOf(options.endTag, start);
				if (start === -1 || end === -1 || start >= end) {
					return;
				} else {
					var padding ='';
					var ind = start - 1;
					while(/[^\S\n]/.test(page.charAt(ind))){
						padding += page.charAt(ind);
						ind -= 1;
					}
					newPage = page.substr(0, start + options.startTag.length) + grunt.util.linefeed + padding + scripts.join(grunt.util.linefeed + padding) + grunt.util.linefeed + padding + page.substr(end);
					grunt.file.write(dest, newPage);
					grunt.log.writeln('File "' + dest + '" updated.');
				}
			});
		});
	});

};
