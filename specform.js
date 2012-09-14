/* global ich:true */
(function () {
  var jade=function(exports){Array.isArray||(Array.isArray=function(arr){return"[object Array]"==Object.prototype.toString.call(arr)}),Object.keys||(Object.keys=function(obj){var arr=[];for(var key in obj)obj.hasOwnProperty(key)&&arr.push(key);return arr}),exports.merge=function merge(a,b){var ac=a["class"],bc=b["class"];if(ac||bc)ac=ac||[],bc=bc||[],Array.isArray(ac)||(ac=[ac]),Array.isArray(bc)||(bc=[bc]),ac=ac.filter(nulls),bc=bc.filter(nulls),a["class"]=ac.concat(bc).join(" ");for(var key in b)key!="class"&&(a[key]=b[key]);return a};function nulls(val){return val!=null}return exports.attrs=function attrs(obj,escaped){var buf=[],terse=obj.terse;delete obj.terse;var keys=Object.keys(obj),len=keys.length;if(len){buf.push("");for(var i=0;i<len;++i){var key=keys[i],val=obj[key];"boolean"==typeof val||null==val?val&&(terse?buf.push(key):buf.push(key+'="'+key+'"')):0==key.indexOf("data")&&"string"!=typeof val?buf.push(key+"='"+JSON.stringify(val)+"'"):"class"==key&&Array.isArray(val)?buf.push(key+'="'+exports.escape(val.join(" "))+'"'):escaped&&escaped[key]?buf.push(key+'="'+exports.escape(val)+'"'):buf.push(key+'="'+val+'"')}}return buf.join(" ")},exports.escape=function escape(html){return String(html).replace(/&(?!(\w+|\#\d+);)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},exports.rethrow=function rethrow(err,filename,lineno){if(!filename)throw err;var context=3,str=require("fs").readFileSync(filename,"utf8"),lines=str.split("\n"),start=Math.max(lineno-context,0),end=Math.min(lines.length,lineno+context),context=lines.slice(start,end).map(function(line,i){var curr=i+start+1;return(curr==lineno?"  > ":"    ")+curr+"| "+line}).join("\n");throw err.path=filename,err.message=(filename||"Jade")+":"+lineno+"\n"+context+"\n\n"+err.message,err},exports}({});

  var template = function anonymous(locals, attrs, escape, rethrow, merge) {
    attrs = attrs || jade.attrs;
    escape = escape || jade.escape;
    rethrow = rethrow || jade.rethrow;
    merge = merge || jade.merge;
    var buf = [];
    with (locals || {}) {
        var interp;
        var __indent = [];
        var ifDef = function(thing) {
            return typeof thing !== "undefined" ? thing : "";
        };
        buf.push("\n<form");
        buf.push(attrs({
            id: ifDef(id) + "_form"
        }, {
            id: true
        }));
        buf.push(">");
        (function() {
            if ("number" == typeof fields.length) {
                for (var $index = 0, $l = fields.length; $index < $l; $index++) {
                    var field = fields[$index];
                    var fieldId = typeof field.id !== "undefined" ? field.id : field.name;
                    buf.push("\n  <div");
                    buf.push(attrs({
                        id: fieldId + "_parent",
                        "class": "fieldContainer" + " " + "clearfix"
                    }, {
                        id: true
                    }));
                    buf.push(">");
                    (function() {
                        if ("number" == typeof field.errors.length) {
                            for (var $index = 0, $l = field.errors.length; $index < $l; $index++) {
                                var error = field.errors[$index];
                                buf.push('<span class="error">');
                                var __val__ = error;
                                buf.push(null == __val__ ? "" : __val__);
                                buf.push("</span>");
                            }
                        } else {
                            for (var $index in field.errors) {
                                var error = field.errors[$index];
                                buf.push('<span class="error">');
                                var __val__ = error;
                                buf.push(null == __val__ ? "" : __val__);
                                buf.push("</span>");
                            }
                        }
                    }).call(this);
                    if (field.label) {
                        buf.push("\n    <label");
                        buf.push(attrs({
                            "for": fieldId
                        }, {
                            "for": true
                        }));
                        buf.push(">");
                        var __val__ = field.label;
                        buf.push(escape(null == __val__ ? "" : __val__));
                        buf.push("</label>");
                    }
                    if (field.textarea) {
                        buf.push("\n    <textarea");
                        buf.push(attrs({
                            id: fieldId
                        }, {
                            id: true
                        }));
                        buf.push("></textarea>");
                    }
                    if (field.input) {
                        buf.push("\n    <input");
                        buf.push(attrs({
                            id: fieldId,
                            min: ifDef(field.min),
                            max: typeof field.max !== "undefined" ? max : null,
                            step: typeof field.step !== "undefined" ? step : null,
                            placeholder: field.placeholder,
                            type: field.type,
                            name: field.name,
                            value: field.value
                        }, {
                            id: true,
                            min: true,
                            max: true,
                            step: true,
                            placeholder: true,
                            type: true,
                            name: true,
                            value: true
                        }));
                        buf.push("/>");
                    }
                    if (field.select) {
                        buf.push("\n    <select");
                        buf.push(attrs({
                            id: fieldId,
                            name: field.name,
                            "class": field.class
                        }, {
                            id: true,
                            name: true,
                            "class": true
                        }));
                        buf.push(">");
                        (function() {
                            if ("number" == typeof field.options.length) {
                                for (var $index = 0, $l = field.options.length; $index < $l; $index++) {
                                    var option = field.options[$index];
                                    buf.push("\n      <option");
                                    buf.push(attrs({
                                        value: option.val
                                    }, {
                                        value: true
                                    }));
                                    buf.push(">");
                                    var __val__ = option.text;
                                    buf.push(escape(null == __val__ ? "" : __val__));
                                    buf.push("</option>");
                                }
                            } else {
                                for (var $index in field.options) {
                                    var option = field.options[$index];
                                    buf.push("\n      <option");
                                    buf.push(attrs({
                                        value: option.val
                                    }, {
                                        value: true
                                    }));
                                    buf.push(">");
                                    var __val__ = option.text;
                                    buf.push(escape(null == __val__ ? "" : __val__));
                                    buf.push("</option>");
                                }
                            }
                        }).call(this);
                        buf.push("\n    </select>");
                    }
                    if (field.helptext) {
                        buf.push("\n    <p");
                        buf.push(attrs({
                            id: fieldId + "_helptext",
                            "class": "helptext"
                        }, {
                            id: true
                        }));
                        buf.push("></p>");
                    }
                    buf.push("\n  </div>");
                }
            } else {
                for (var $index in fields) {
                    var field = fields[$index];
                    var fieldId = typeof field.id !== "undefined" ? field.id : field.name;
                    buf.push("\n  <div");
                    buf.push(attrs({
                        id: fieldId + "_parent",
                        "class": "fieldContainer" + " " + "clearfix"
                    }, {
                        id: true
                    }));
                    buf.push(">");
                    (function() {
                        if ("number" == typeof field.errors.length) {
                            for (var $index = 0, $l = field.errors.length; $index < $l; $index++) {
                                var error = field.errors[$index];
                                buf.push('<span class="error">');
                                var __val__ = error;
                                buf.push(null == __val__ ? "" : __val__);
                                buf.push("</span>");
                            }
                        } else {
                            for (var $index in field.errors) {
                                var error = field.errors[$index];
                                buf.push('<span class="error">');
                                var __val__ = error;
                                buf.push(null == __val__ ? "" : __val__);
                                buf.push("</span>");
                            }
                        }
                    }).call(this);
                    if (field.label) {
                        buf.push("\n    <label");
                        buf.push(attrs({
                            "for": fieldId
                        }, {
                            "for": true
                        }));
                        buf.push(">");
                        var __val__ = field.label;
                        buf.push(escape(null == __val__ ? "" : __val__));
                        buf.push("</label>");
                    }
                    if (field.textarea) {
                        buf.push("\n    <textarea");
                        buf.push(attrs({
                            id: fieldId
                        }, {
                            id: true
                        }));
                        buf.push("></textarea>");
                    }
                    if (field.input) {
                        buf.push("\n    <input");
                        buf.push(attrs({
                            id: fieldId,
                            min: ifDef(field.min),
                            max: typeof field.max !== "undefined" ? max : null,
                            step: typeof field.step !== "undefined" ? step : null,
                            placeholder: field.placeholder,
                            type: field.type,
                            name: field.name,
                            value: field.value
                        }, {
                            id: true,
                            min: true,
                            max: true,
                            step: true,
                            placeholder: true,
                            type: true,
                            name: true,
                            value: true
                        }));
                        buf.push("/>");
                    }
                    if (field.select) {
                        buf.push("\n    <select");
                        buf.push(attrs({
                            id: fieldId,
                            name: field.name,
                            "class": field.class
                        }, {
                            id: true,
                            name: true,
                            "class": true
                        }));
                        buf.push(">");
                        (function() {
                            if ("number" == typeof field.options.length) {
                                for (var $index = 0, $l = field.options.length; $index < $l; $index++) {
                                    var option = field.options[$index];
                                    buf.push("\n      <option");
                                    buf.push(attrs({
                                        value: option.val
                                    }, {
                                        value: true
                                    }));
                                    buf.push(">");
                                    var __val__ = option.text;
                                    buf.push(escape(null == __val__ ? "" : __val__));
                                    buf.push("</option>");
                                }
                            } else {
                                for (var $index in field.options) {
                                    var option = field.options[$index];
                                    buf.push("\n      <option");
                                    buf.push(attrs({
                                        value: option.val
                                    }, {
                                        value: true
                                    }));
                                    buf.push(">");
                                    var __val__ = option.text;
                                    buf.push(escape(null == __val__ ? "" : __val__));
                                    buf.push("</option>");
                                }
                            }
                        }).call(this);
                        buf.push("\n    </select>");
                    }
                    if (field.helptext) {
                        buf.push("\n    <p");
                        buf.push(attrs({
                            id: fieldId + "_helptext",
                            "class": "helptext"
                        }, {
                            id: true
                        }));
                        buf.push("></p>");
                    }
                    buf.push("\n  </div>");
                }
            }
        }).call(this);
        buf.push('\n  <div class="clearfix"></div>\n  <button type="submit" class="submit">');
        var __val__ = typeof submitText !== "undefined" ? submitText : "Submit";
        buf.push(escape(null == __val__ ? "" : __val__));
        buf.push('</button>\n  <button type="reset" class="cancel">');
        var __val__ = typeof cancelText !== "undefined" ? cancelText : "Cancel";
        buf.push(escape(null == __val__ ? "" : __val__));
        buf.push("</button>\n</form>");
    }
    return buf.join("");
}

  var FormBot = function (spec) {
    var f = function () {}, // empty func
      item;
      
    this.settings = {
      error: f,
      submit: f,
      reqMessage: 'This field is required',
      html5Validation: true
    };
    
    this.fields = spec.fields;
    this.id = spec.id;
    this.submitText = spec.submitText;
    this.initialData = spec.data || {};
    delete spec.fields;
    
    // apply options
    for (item in spec) {
      this.settings[item] = spec[item];
    }
    
    // apply field options
    this.fields.forEach(function (field) {
      var def = {
          errors: [],
          type: 'text',
          tests: [],
          textarea: field.widget === 'textarea',
          select: field.widget === 'select' && field.hasOwnProperty('options'),
          input: field.hasOwnProperty('widget') ? field.widget === 'input' : true,
          trim: true
        },
        item;
      for (item in def) {
        if (!field.hasOwnProperty(item)) field[item] = def[item];
      } 
      
      // set our value if we've got one
      if (spec.data && spec.data.hasOwnProperty(field.name)) {
        field.value = field.initial = spec.data[field.name];
      } else {
        field.value = field.initial = '';
      }
      
    });
  };
  
  FormBot.prototype.render = function () {
    var self = this;
    if (!this.dom) {
      this.dom = this.domify(template(this));
      this.dom.addEventListener('submit', function (e) {
        e.preventDefault(); // stop submit, always
      }, true);
      this.dom.addEventListener('input', function (e) {
        self.handleInputChange.apply(self, arguments);
      }, true);
      this.dom.addEventListener('blur', function (e) {
        self.handleInputChange.apply(self, arguments);
      }, true);
      this.dom.addEventListener('change', function (e) {
        self.handleInputChange.apply(self, arguments);
      }, true);
      this.dom.addEventListener('invalid', function (e) {
        e.preventDefault();
      }, true);
    } else {
      this.dom.innerHTML = this.domify(template(this)).innerHTML;
    }
    this.storeDomRef();
    this.fields.forEach(function (field) {
        if (field.type === 'select' && field.value) {
            field.inputEl.value = field.value + '';
        }
    });
    
    this.addButtonHandlers();
    return this.dom;
  };
  
  FormBot.prototype.addButtonHandlers = function () {
    var self = this,
      buttons = this.dom.getElementsByTagName('button', this.dom),
      i = 0,
      l = buttons.length;
    
    for (; i < l; i++) {
      buttons[i].addEventListener('click', function (e) {
        var cls = e.target.className,
          handler;
        if (self.submitRe.test(cls)) {
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
  
  FormBot.prototype.handleSubmit = function (e) {
    var self = this;
    if (self.settings.preSubmit) self.settings.preSubmit.call(self);
    this.validate(function (valid) {
      if (valid) {
        var data = self.data();
        self.settings.submit(data, self.diffData(data));
      } else {
        self.settings.error(self);
      }  
      self.render();
    });
  };
  
  FormBot.prototype.data = function () {
    var results = {};
    this.fields.forEach(function (field) {
      // trim if setting and available for brower and value type
      results[field.name] = (field.trim && field.value.trim) ? field.value.trim() : field.value;
    });
    if (this.settings.clean) {
      results = this.settings.clean(results);
    }
    return results;
  };
  
  FormBot.prototype.diffData = function (newData) {
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
  
  // this way we just store the value in memory away from the dom
  // then we can re-render whenever we want, without losing the value
  FormBot.prototype.handleInputChange =  function (e) {
    var target = e.target,
        type = target.field.type;
    target.field.value = function () {
      if (['range', 'number'].indexOf(type) !== -1) {
          return target.valueAsNumber;
      } else if (type === 'date') {
          return target.valueAsDate;
      } else {
          return target.value;
      }
    }();
  };
  
  FormBot.prototype.clearAll = function () {
    this.fields.forEach(function (field) {
      field.inputEl.value = '';
      field.errors = [];
    });
    return true;
  };
  
  FormBot.prototype.validate = function (cb) {
    var self = this,
      isValid = true;
    
    // async loop for each field
    this.asyncForEach(this.fields, function (field, fieldLoopCb) {
      var tests = field.tests instanceof Array ? field.tests : [field.tests];
      field.errors = []; // clear errors
      if (field.required && (!field.value || field.value.length === 0)) {
        isValid = false;
        field.errors.push(field.reqMessage || self.settings.reqMessage);
      }
      
      // html5 error message handling
      if (self.settings.html5Validation && field.inputEl.validationMessage) {
        isValid = false;
        field.errors.push(field.inputEl.validationMessage);
      }
      
      // async loop for each test
      self.asyncForEach(tests, function (test, loopCb) {
        var passed = false;
        // if we're ignoring same values.. carry on
        if (test.ignoreSame && field.value === field.initial) {
          loopCb(null);
        } else {
          if (test.async) {
            test.test.call(self, field.value, self, function (passed) {
              if (!passed) {
                isValid = false;
                field.errors.push(test.message);
              }
              loopCb(null, passed);
            });
          } else {
            passed = test.test.call(self, field.value, self);
            if (!passed) {
              isValid = false;
              field.errors.push(test.message); 
            }
            loopCb(null, passed);
          }
        }
      }, fieldLoopCb);
    }, function () {
      cb(isValid);
    });
  };
  
  FormBot.prototype.storeDomRef = function () {
    var self = this;
    this.fields.forEach(function (field) {
      field.inputEl = self.dom.querySelector('[name="'+ field.name +'"]');
      field.inputEl.field = field;
      field.labelEl = self.dom.querySelector('label[for="'+ field.id +'"]');
    });
  };
  
  FormBot.prototype.domify = function (str) {
    var div = document.createElement('div');
    div.innerHTML = str;
    return div.querySelector('form');
  };
  
  // from caolan's async.js lib
  // async.forEach method
  FormBot.prototype.asyncForEach = function (arr, iterator, cb) {
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
  };
  
  FormBot.prototype.submitRe = /(^|\s)submit(\s|$)/;
  FormBot.prototype.cancelRe = /(^|\s)cancel(\s|$)/;
  
  window.FormBot = FormBot;
})(window);