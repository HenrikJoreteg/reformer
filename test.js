document.addEventListener('DOMContentLoaded', function () {
  var form = new Reformer({
    formEl: document.getElementById('myForm'),
    fieldContainer: document.getElementById('fields'),
    fields: [
      {
        name: 'first_name',
        label: 'First Name',
        placeholder: 'Something',
        required: true
      },
      {
        name: 'last_name',
        label: 'Last Name',
        tests: [
          {
            test: function (val) {
              return false;
            },
            message: 'something will always go wrong'
          },
          {
            test: function (val) {
              return val && val.toString().length > 2;
            },
            message: 'Must be at least three characters.'
          }
        ],
        required: true
      },
      {
        name: 'description',
        label: 'Description',
        widget: 'textarea',
        tests: [
          {
            test: function (val) {
              return val && val.toString().length > 2;
            },
            message: 'Must be at least three characters.'
          }
        ],
        required: true
      }
    ],
    submit: function (vals) {
      console.log(vals);
    },
    error: function (vals) {
      console.log('error', vals);
    }
  });

  form.render();



  var customForm = new Reformer({
    formEl: document.getElementById('customForm'),
    fields: [
      {
        fieldContainer: document.getElementById('specialField'),
        name: 'specialThing',
        tests: [
          {
            message: "must be longer than 5 characters",
            test: function (val) {
              return val && val.length > 5;
            }
          }
        ]
      }
    ],
    submit: function (vals) {
      console.log('submit', vals)
    },
    error: function (vals) {
      console.log('err', vals);
    }
  });

  customForm.render();
}, false);
