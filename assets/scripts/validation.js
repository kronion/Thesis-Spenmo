(function() {

  var username  = document.getElementsByName("username")[0];
  var password  = document.getElementsByName("password")[0];
  var firstname = document.getElementsByName("firstname")[0];
  var lastname  = document.getElementsByName("lastname")[0];
  var submit    = document.getElementsByName("submit")[0];

  var usernameValid  = false;
  var passwordValid  = false;
  var firstnameValid = false;
  var lastnameValid  = false;

  var verify = function() {
    if (usernameValid && passwordValid && firstnameValid && lastnameValid) {
      submit.disabled = false;
    }
    else submit.disabled = true;
  };



  username.oninput = function() {
    if (username.value.length > 0) {
      usernameValid = true;
    }
    else {
      usernameValid = false;
    }
    verify();
  };

  password.oninput = function() {
    if (password.value.length > 6) {
      passwordValid = true;
    }
    else {
      passwordValid = false;
    }
      verify();
  };

  firstname.oninput = function() {
    if (firstname.value.length > 0) {
      firstnameValid = true;
    }
    else {
      firstnameValid = false;
    }
    verify();
  };

  lastname.oninput = function() {
    if (lastname.value.length > 0) {
      lastnameValid = true;
    }
    else {
      lastnameValid = false;
    }
    verify();
  };
})();
