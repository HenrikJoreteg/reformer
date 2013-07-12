var templatizer = require('templatizer');
var bundle = require('browserify')();
var fs = require('fs');
var uglify = require('uglify-js');
var config = require('./package.json');

// pass in the template directory and what you want to
// save the output file as. That's it!
templatizer(__dirname + '/templates', __dirname + '/templates.js');

bundle.add('./reformer.js');
bundle.bundle({standalone: 'Reformer'}, function (err, source) {
    var fileName = 'dist/reformer.' + config.version + '.bundle.js';
    if (err) console.error(err);
    fs.writeFileSync(fileName, source);
    fs.writeFileSync('dist/reformer.' + config.version + '.min.js', uglify.minify(fileName).code);
});
