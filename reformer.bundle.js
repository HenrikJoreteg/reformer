(function(e){if("function"==typeof bootstrap)bootstrap("reformer",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeReformer=e}else"undefined"!=typeof window?window.Reformer=e():global.Reformer=e()})(function(){var define,ses,bootstrap,module,exports;
return (function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
// nothing to see here... no file methods for the browser

},{}],2:[function(require,module,exports){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Wrap map from jquery.
 */

var map = {
  option: [1, '<select multiple="multiple">', '</select>'],
  optgroup: [1, '<select multiple="multiple">', '</select>'],
  legend: [1, '<fieldset>', '</fieldset>'],
  thead: [1, '<table>', '</table>'],
  tbody: [1, '<table>', '</table>'],
  tfoot: [1, '<table>', '</table>'],
  colgroup: [1, '<table>', '</table>'],
  caption: [1, '<table>', '</table>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  th: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  _default: [0, '', '']
};

/**
 * Parse `html` and return the children.
 *
 * @param {String} html
 * @return {Array}
 * @api private
 */

function parse(html) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) throw new Error('No elements were generated.');
  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = document.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = document.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  var els = el.children;
  if (1 == els.length) {
    return el.removeChild(els[0]);
  }

  var fragment = document.createDocumentFragment();
  while (els.length) {
    fragment.appendChild(el.removeChild(els[0]));
  }

  return fragment;
}

},{}],3:[function(require,module,exports){
var templates = require('./templates');
var domify = require('domify');


// from caolan's async.js lib
// async.forEach method
function asyncForEach(arr, iterator, cb) {
    if (!arr.length) return cb();
    var completed = 0;
    arr.forEach(function (x) {
        iterator(x, function (err) {
            if (err) {
                cb(err);
                cb = function () {};
            } else {
                completed += 1;
                if (completed === arr.length) {
                    cb();
                }
            }
        });
    });
}

// shim/helper for trimming values
function trim(val) {
    if (!val || !val.trim) return '';
    return val.trim();
}


function Reformer(spec) {
    var self = this;
    var f = function () {}; // empty func
    var item;

    this.settings = {
        error: f,
        submit: f,
        reqMessage: 'This field is required',
        html5Validation: true
    };

    this.fieldDefinition = spec.fields;
    this.fields = [];
    this.id = spec.id;
    this.formEl = spec.formEl;
    this.fieldContainer = spec.fieldContainer;
    this.submitText = spec.submitText;
    this.initialData = spec.data || {};
    delete spec.fields;

    // apply options
    for (item in spec) {
        this.settings[item] = spec[item];
    }

    // apply field options
    this.fieldDefinition.forEach(function (field) {
        field.parent = self;
        self.fields.push(new Field(field));
    });
};

Reformer.prototype.render = function () {
    var self = this;

    if (!this.rendered) {
        this.formEl.addEventListener('submit', function (e) {
            e.preventDefault(); // stop submit, always
        }, true);

        this.addButtonHandlers();
    }

    // track that we've rendered
    this.rendered = true;

    this.fields.forEach(function (field) {
        field.render();
    });

    return this.formEl;
};

Reformer.prototype.addButtonHandlers = function () {
    var self = this;
    var buttons = this.formEl.getElementsByTagName('button', this.dom);
    var i = 0;
    var l = buttons.length;

    for (; i < l; i++) {
        buttons[i].addEventListener('click', function (e) {
            var cls = e.target.className;
            var handler;

            if (self.submitRe.test(cls) || e.target.type === 'submit') {
                self.handleSubmit();
                e.stopPropagation();
                return false;
            } else {
                handler = self.settings[cls];
                if (handler) {
                    e.preventDefault();
                    e.stopPropagation();
                    handler();
                    return false;
                }
            }
            // fall through
        }, true);
    }
};

Reformer.prototype.handleSubmit = function (e) {
    var self = this;
    if (self.settings.preSubmit) self.settings.preSubmit.call(self);
    this.validate(function (valid) {
        self.render();
        if (valid) {
            var data = self.data();
            self.settings.submit(data, self.diffData(data));
        } else {
            self.settings.error(self);
        }
    });
};

Reformer.prototype.data = function () {
    var results = {};
    this.fields.forEach(function (field) {
        // trim if setting and available for brower and value type
        results[field.name] = field.trim ? trim(field.value) : field.value;
    });
    if (this.settings.clean) {
        results = this.settings.clean(results);
    }
    return results;
};

Reformer.prototype.diffData = function (newData) {
    var orig = this.initialData,
        diff = {},
        changed;
    for (var key in newData) {
        if (newData[key] !== orig[key]) {
                changed = true;
                diff[key] = newData[key];
        }
    }
    return changed ? diff : undefined;
};


Reformer.prototype.clearAll = function () {
    this.fields.forEach(function (field) {
        field.inputEl.value = '';
        field.errors = [];
    });
    return true;
};

Reformer.prototype.validate = function (cb) {
    var self = this,
        isValid = true;

    // async loop for each field
    asyncForEach(this.fields, function (field, fieldLoopCb) {
        field.validate(function (valid) {
            if (!valid) {
                isValid = false;
            }
            fieldLoopCb();
        });
    }, function () {
        cb(isValid);
    });
};

Reformer.prototype.submitRe = /(^|\s)submit(\s|$)/;


function Field(opts) {
    var item;
    var parentData = opts.parent.initialData;

    this.errors = [];
    this.type = 'text';
    this.tests = [];
    this.textarea = opts.widget === 'textarea';
    this.select = opts.widget === 'select' && opts.hasOwnProperty('options');
    this.input = opts.hasOwnProperty('widget') ? opts.widget === 'input' : true;
    this.trim = true;

    for (item in opts) {
        this[item] = opts[item];
    }

    // make sure we've always got an id
    this.id = opts.id || opts.name;
    if (!this.id) throw new Error('All fields need either a name or id attribute');

    // make sure container is an element if passed
    this.containerEl = function () {
        var type = typeof opts.containerEl;
        if (type === 'string') {
            return document.getElementById(opts.containerEl);
        } else if (type === 'object') {
            return opts.containerEl;
        }
    }();

    this.containerId = this.containerEl && this.containerEl.id || (this.id + '_parent');

    // set our value if we've got one
    if (parentData && parentData.hasOwnProperty(this.name)) {
        this.value = this.initial = parentData[this.name];
    } else {
        this.value = this.initial = '';
    }
}

Field.prototype.render = function () {
    var newEl = domify(templates.field({field: this}));
    var parentNode;

    // handles first render if not passed a container
    if (!this.fieldContainer) {
        this.fieldContainer = newEl;
        this.parent.fieldContainer.appendChild(newEl);
    } else {
        // replaces current with whatever
        parentNode = this.fieldContainer.parentNode;
        parentNode.replaceChild(newEl, this.fieldContainer);
        this.fieldContainer = newEl;
    }

    // store some references
    this.inputEl = this.fieldContainer.querySelector('[name="'+ this.name +'"]');
    this.labelEl = this.fieldContainer.querySelector('label[for="'+ this.id +'"]');
    this.inputEl.value = (this.value || '') + '';

    this.registerHandlers();

    this.rendered = true;
};

Field.prototype.registerHandlers = function () {
    var self = this;
    this.inputEl.addEventListener('input', function (e) {
        self.handleInputChange.apply(self, arguments);
    }, true);
    this.inputEl.addEventListener('blur', function (e) {
        self.handleInputChange.apply(self, arguments);
    }, true);
    this.inputEl.addEventListener('change', function (e) {
        self.handleInputChange.apply(self, arguments);
    }, true);
    this.inputEl.addEventListener('invalid', function (e) {
        e.preventDefault();
    }, true);
};

Field.prototype.handleInputChange = function (e) {
    var inputEl = this.inputEl;
    var type = this.type;
    this.value = function () {
        if (['range', 'number'].indexOf(type) !== -1) {
            return inputEl.valueAsNumber;
        } else if (type === 'date') {
            return inputEl.valueAsDate;
        } else {
            return inputEl.value;
        }
    }();
};

Field.prototype.validate = function (cb) {
    var self = this;
    var tests = this.tests instanceof Array ? this.tests : [this.tests];
    var isValid = true;

    this.errors = []; // clear errors
    if (this.required && (!this.value || this.value.length === 0)) {
        isValid = false;
        this.errors.push(this.reqMessage || this.parent.settings.reqMessage);
    }

    // html5 error message handling
    if (this.parent.settings.html5Validation && this.inputEl.validationMessage) {
        isValid = false;
        this.errors.push(this.inputEl.validationMessage);
    }

    // async loop for each test
    asyncForEach(tests, function (test, loopCb) {
        var passed = false;
        // if we're ignoring same values.. carry on
        if (test.ignoreSame && self.value === self.initial) {
            loopCb(null);
        } else {
            if (test.async) {
                test.test.call(self, self.value, self, function (passed) {
                    if (!passed) {
                        isValid = false;
                        self.errors.push(test.message);
                    }
                    loopCb(null, passed);
                });
            } else {
                passed = test.test.call(self, self.value, self);
                if (!passed) {
                    isValid = false;
                    self.errors.push(test.message);
                }
                loopCb(null, passed);
            }
        }
    }, function () {
        cb(isValid);
    });
};

// simplifies turning potential values into stuff we want
// in the template
Field.prototype.get = function (name, altReturn) {
    var alt = altReturn || null;
    if (typeof this[name] === 'undefined') {
        return alt;
    } else {
        return this[name];
    }
};

module.exports = Reformer;

},{"./templates":4,"domify":2}],4:[function(require,module,exports){
(function () {
var root = this, exports = {};

// The jade runtime:
var jade=function(exports){Array.isArray||(Array.isArray=function(arr){return"[object Array]"==Object.prototype.toString.call(arr)}),Object.keys||(Object.keys=function(obj){var arr=[];for(var key in obj)obj.hasOwnProperty(key)&&arr.push(key);return arr}),exports.merge=function merge(a,b){var ac=a["class"],bc=b["class"];if(ac||bc)ac=ac||[],bc=bc||[],Array.isArray(ac)||(ac=[ac]),Array.isArray(bc)||(bc=[bc]),ac=ac.filter(nulls),bc=bc.filter(nulls),a["class"]=ac.concat(bc).join(" ");for(var key in b)key!="class"&&(a[key]=b[key]);return a};function nulls(val){return val!=null}return exports.attrs=function attrs(obj,escaped){var buf=[],terse=obj.terse;delete obj.terse;var keys=Object.keys(obj),len=keys.length;if(len){buf.push("");for(var i=0;i<len;++i){var key=keys[i],val=obj[key];"boolean"==typeof val||null==val?val&&(terse?buf.push(key):buf.push(key+'="'+key+'"')):0==key.indexOf("data")&&"string"!=typeof val?buf.push(key+"='"+JSON.stringify(val)+"'"):"class"==key&&Array.isArray(val)?buf.push(key+'="'+exports.escape(val.join(" "))+'"'):escaped&&escaped[key]?buf.push(key+'="'+exports.escape(val)+'"'):buf.push(key+'="'+val+'"')}}return buf.join(" ")},exports.escape=function escape(html){return String(html).replace(/&(?!(\w+|\#\d+);)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},exports.rethrow=function rethrow(err,filename,lineno){if(!filename)throw err;var context=3,str=require("fs").readFileSync(filename,"utf8"),lines=str.split("\n"),start=Math.max(lineno-context,0),end=Math.min(lines.length,lineno+context),context=lines.slice(start,end).map(function(line,i){var curr=i+start+1;return(curr==lineno?"  > ":"    ")+curr+"| "+line}).join("\n");throw err.path=filename,err.message=(filename||"Jade")+":"+lineno+"\n"+context+"\n\n"+err.message,err},exports}({});

// create our folder objects

// field.jade compiled template
exports.field = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push("<div" + jade.attrs({
            id: field.containerId,
            "class": "fieldContainer clearfix" + (field.errors.length ? " error" : "")
        }, {
            id: true,
            "class": true
        }) + ">");
        (function() {
            var $$obj = field.errors;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var error = $$obj[$index];
                    buf.push('<span class="error">' + (null == (jade.interp = error) ? "" : jade.interp) + "</span>");
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    if ($$obj.hasOwnProperty($index)) {
                        var error = $$obj[$index];
                        buf.push('<span class="error">' + (null == (jade.interp = error) ? "" : jade.interp) + "</span>");
                    }
                }
            }
        }).call(this);
        if (field.label) {
            buf.push("<label" + jade.attrs({
                "for": field.id
            }, {
                "for": true
            }) + ">" + jade.escape(null == (jade.interp = field.label) ? "" : jade.interp) + "</label>");
        }
        if (field.textarea) {
            buf.push("<textarea" + jade.attrs({
                id: field.id,
                name: field.name,
                placeholder: field.placeholder
            }, {
                id: true,
                name: true,
                placeholder: true
            }) + "></textarea>");
        }
        if (field.input) {
            buf.push("<input" + jade.attrs({
                id: field.id,
                min: field.get("min"),
                max: field.get("max"),
                step: field.get("step"),
                placeholder: field.get("placeholder"),
                type: field.type,
                name: field.name
            }, {
                id: true,
                min: true,
                max: true,
                step: true,
                placeholder: true,
                type: true,
                name: true
            }) + "/>");
        }
        if (field.select) {
            buf.push("<select" + jade.attrs({
                id: field.id,
                name: field.name,
                "class": field.class
            }, {
                id: true,
                name: true,
                "class": true
            }) + ">");
            (function() {
                var $$obj = field.options;
                if ("number" == typeof $$obj.length) {
                    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                        var option = $$obj[$index];
                        buf.push("<option" + jade.attrs({
                            value: option.val
                        }, {
                            value: true
                        }) + ">" + jade.escape(null == (jade.interp = option.text) ? "" : jade.interp) + "</option>");
                    }
                } else {
                    var $$l = 0;
                    for (var $index in $$obj) {
                        $$l++;
                        if ($$obj.hasOwnProperty($index)) {
                            var option = $$obj[$index];
                            buf.push("<option" + jade.attrs({
                                value: option.val
                            }, {
                                value: true
                            }) + ">" + jade.escape(null == (jade.interp = option.text) ? "" : jade.interp) + "</option>");
                        }
                    }
                }
            }).call(this);
            buf.push("</select>");
        }
        if (field.helpText) {
            buf.push("<p" + jade.attrs({
                id: field.id + "_helpText",
                "class": "helpText"
            }, {
                id: true
            }) + ">" + jade.escape(null == (jade.interp = field.helpText) ? "" : jade.interp) + "</p>");
        }
        buf.push("</div>");
    }
    return buf.join("");
};


// attach to window or export with commonJS
if (typeof module !== "undefined") {
    module.exports = exports;
} else if (typeof define === "function" && define.amd) {
    define(exports);
} else {
    root.templatizer = exports;
}

})();
},{"fs":1}]},{},[3])(3)
});
;