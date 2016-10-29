/*
 * grunt-scriptlinker
 * https://github.com/scott-laursen/grunt-scriptlinker
 *
 * Copyright (c) 2013 scott-laursen
 * Copyright (c) 2013 Zoli Kahan
 * Copyright (c) 2014 Mike McNeil
 * Licensed under the MIT license.
 */


var util = require('util');
var glob = require('glob');

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
		
		// Iterate over all specified file groups.
		this.files.forEach(function (f) {
			var scripts = [],
				i = 0,
				page = '',
				newPage = '',
				start = -1,
				end = -1; 
			f.csrc = [];
				
			// Create string tags
			for(i; i < f.orig.src.length; i++) {
				var source = f.orig.src[i];
				var srcFile = [];
				var type = 'text/javascript';
				var sourceFile;
				if (typeof source === 'string') {
					sourceFile = source;
					srcFile = grunt.file.glob.sync(source)
				} else {
					sourceFile = source.src
					srcFile = grunt.file.glob.sync(source.src)
					type = (source.type === undefined) ? type : source.type;
				}
				if(srcFile.length === 0) {
					grunt.log.warn('Source file "' + sourceFile + '" not found.')
					continue;
				} 
				srcFile.map((src) => {
					scripts.push({
						'src' : src,
						'type' : type 
					});	
				})
			}

			// Create script tags
			scripts = scripts.map((script) => {
				var filepath = script.src;
				if (options.inline) {
					var contents = grunt.file.read(filepath);
					return util.format(options.fileTmpl, contents, script.type);
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
						var t= util.format(options.fileTmpl, filepath, script.type);
						return util.format(options.fileTmpl, filepath, script.type);
					}
			});

			// Insert into html
			grunt.file.expand({}, f.dest).forEach(function(dest){
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
