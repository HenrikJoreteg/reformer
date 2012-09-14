var f = new Reformer({
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
    }
  ],
  submit: function (vals) {
    console.log(vals);
  },
  error: function (vals) {
    console.log('error', vals);
  }
});

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#something').appendChild(f.render());
}, false);
