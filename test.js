var firstForm = new Reformer({
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
      required: true,
      errorPlacement: 'after'
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


var customForm = new Reformer({
  fields: [
    {
      fieldContainer: 'specialField',
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

document.addEventListener('DOMContentLoaded', function () {
  firstForm.render({
    formEl: document.getElementById('myForm'),
    fieldContainer: document.getElementById('fields'),
  });

  customForm.render({
    formEl: document.getElementById('customForm')
  });

}, false);
