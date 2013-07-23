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
        html5Validation: true,
        errorPlacement: 'before'
    };

    this.fieldDefinition = spec.fields;
    this.fields = [];
    this.id = spec.id;
    this.formEl = spec.formEl;
    this.fieldContainer = spec.fieldContainer;
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
}

Reformer.prototype.render = function (opts) {
    var self = this;
    var options = opts || {};

    if (options.formEl) this.formEl = options.formEl;
    if (options.fieldContainer) this.fieldContainer = options.fieldContainer;

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
            self.settings.submit.call(self, data, self.diffData(data));
        } else {
            self.settings.error.call(self);
        }
    });
};

Reformer.prototype.data = function () {
    var results = {};
    this.fields.forEach(function (field) {
        // trim if setting and available for brower and value type
        results[field.name] = field.data();
    });
    if (this.settings.clean) {
        results = this.settings.clean(results);
    }
    return results;
};

Reformer.prototype.errors = function () {
    var results = {};
    this.fields.forEach(function (field) {
        if (field.errors.length) results[field.name] = field.errors;
    });
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

// quick way to populate form for testing
Reformer.prototype.loadDummyData = function () {
    this.fields.forEach(function (field) {
        if (field.dummy && !field.value) field.setValue(field.dummy);
    });
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

Reformer.prototype.getField = function (name) {
    var found;
    this.fields.some(function (field) {
        if (field.name === name || field.id === name) {
            found = field;
            return true;
        }
    });
    return found;
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
    this.errorPlacement = opts.errorPlacement || opts.parent.settings.errorPlacement;
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
        this.setValue(parentData[this.name]);
    } else {
        this.setValue('');
    }

    this.initial = this.value;
}

Field.prototype.render = function () {
    var newEl = domify(templates.field({field: this}));
    var parentNode;

    // if we got a string go find that id
    if (typeof this.fieldContainer === 'string') {
        this.fieldContainer = this.parent.formEl.querySelector('#' + this.fieldContainer);
    }

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

    // call our setup function on first render
    if (!this.rendered && this.setup) {
        this.setup();
    }

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

Field.prototype.setValue = function (val) {
    if (this.inputEl) this.inputEl.value = val;
    this.value = val;
};

Field.prototype.data = function () {
    if (this.clean) {
        return this.clean(this.value);
    } else if (this.trim) {
        return trim(this.value);
    } else {
        return this.value;
    }
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
