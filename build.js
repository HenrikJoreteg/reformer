var jade = require('jade'),
    uglify = require('uglify-js'),
    _ = require('underscore'),
    fs = require('fs'),
    jadeRuntime,
    templatefunc,
    main;

function beautify(code) {
    var ast = uglify.parser.parse(code);
    return uglify.uglify.gen_code(ast, {beautify: true});
}

var jadeRuntime;

try {
    jadeRuntime = fs.readFileSync(__dirname + '/../jade/runtime.min.js');
} catch (e) {
    jadeRuntime = fs.readFileSync(__dirname + '/node_modules/jade/runtime.min.js');
}

templatefunc = beautify(jade.compile(fs.readFileSync(__dirname + '/src/template.jade'), {client: true, compileDebug: false, pretty: true}).toString());
main = fs.readFileSync(__dirname + '/src/main.js', 'utf-8').toString().replace("{{{templatefunc}}}", templatefunc);
main = main.replace("{{{jaderuntime}}}", jadeRuntime);

fs.writeFileSync('specform.js', main);


var ast = uglify.parser.parse(main),
    pro = uglify.uglify,
    minified;

ast = pro.ast_mangle(ast); // get a new AST with mangled names
ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
minified = pro.gen_code(ast); // build out the code

fs.writeFileSync('specform.min.js', minified);