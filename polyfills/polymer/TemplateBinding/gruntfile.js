// Copyright 2013 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

module.exports = function(grunt) {

  grunt.registerMultiTask('wrap', 'Wraps source files with strict IIFE',
      function() {
    var data = this.data;
    var path = require('path');
    var dest = grunt.template.process(data.dest);
    var files = grunt.file.expandFiles(this.file.src);
    var header = '(function() {\n\'use strict\';\n';
    var footer = '\n}).call(this);\n';

    var result = '';
    files.forEach(function(f) {
      result += grunt.file.read(f) + '\n';
    });

    grunt.file.write(dest, header + result + footer);
  });

  grunt.initConfig({
    karma: {
      options: {
        configFile: 'conf/karma.conf.js',
        keepalive: true
      },
      buildbot: {
        reporters: ['crbot'],
        logLevel: 'OFF'
      },
      TemplateBinding: {
      }
    },
    wrap: {
      modules: {
        src: grunt.file.readJSON('build.json'),
        dest: 'src/mdv.combined.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default', 'wrap');
  grunt.registerTask('test', ['karma:TemplateBinding']);
  grunt.registerTask('test-buildbot', ['karma:buildbot']);
};
