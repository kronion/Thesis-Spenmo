'use strict';
(function() {

  var signup    = document.getElementById('signup'),
      username  = document.getElementsByName('username')[0],
      password  = document.getElementsByName('password')[0],
      firstname = document.getElementsByName('firstname')[0],
      lastname  = document.getElementsByName('lastname')[0],
      submit    = document.getElementsByName('submit')[0];

  var usernameValid  = false,
      passwordValid  = false,
      firstnameValid = false,
      lastnameValid  = false;

  var verify = function() {
    if (usernameValid && passwordValid && firstnameValid && lastnameValid) {
      submit.disabled = false;
    }
    else {
      submit.disabled = true;
    }
  };

  username.oninput = function() {
    sessionStorage.setItem('uname', username.value);
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
    sessionStorage.setItem('firstname', firstname.value);
    if (firstname.value.length > 0) {
      firstnameValid = true;
    }
    else {
      firstnameValid = false;
    }
    verify();
  };

  lastname.oninput = function() {
    sessionStorage.setItem('lastname', lastname.value);
    if (lastname.value.length > 0) {
      lastnameValid = true;
    }
    else {
      lastnameValid = false;
    }
    verify();
  };

  signup.onsubmit = function() {
    sessionStorage.clear();
  };

  if (sessionStorage.getItem('uname')) {
    username.value = sessionStorage.getItem('uname');
    username.oninput();
  }
  if (sessionStorage.getItem('firstname')) {
    firstname.value = sessionStorage.getItem('firstname');
    firstname.oninput();
  }
  if (sessionStorage.getItem('lastname')) {
    lastname.value = sessionStorage.getItem('lastname');
    lastname.oninput();
  }
})();
