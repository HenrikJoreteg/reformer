var f = new FormBot({
  fields: [
    {
      name: 'first_name',
      label: 'First Name',
      placeholder: 'Something',
      required: true
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      tests: [
        {
          test: function (val) {
            return false;
          },
          message: 'this test will always fail'
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
