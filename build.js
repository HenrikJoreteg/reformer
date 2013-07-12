var templatizer = require('templatizer');
var bundle = require('browserify')();
var fs = require('fs');

// pass in the template directory and what you want to
// save the output file as. That's it!
templatizer(__dirname + '/templates', __dirname + '/templates.js');

bundle.add('./reformer.js');
bundle.bundle({standalone: 'Reformer'}, function (err, source) {
    if (err) console.error(err);
    fs.writeFileSync('reformer.bundle.js', source);
});
