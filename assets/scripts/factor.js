'use strict';
(function() {

  var key    = document.getElementsByName('key')[0],
      submit = document.getElementsByName('submit')[0];

  key.oninput = function() {
    if (key.value.length > 0) {
      submit.disabled = false;
    }
    else {
      submit.disabled = true;
    }
  };
})();
