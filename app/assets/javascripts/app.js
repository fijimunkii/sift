var App = App || {};

App.register = function(data) {
  return $.ajax({
    url: '/users',
    type: 'POST',
    data: data
  });
}

App.login = function(data) {
  return $.ajax({
    url: '/login',
    type: 'POST',
    data: data
  });
}

App.logout = function() {
  $.cookie('user_id', '');
  $.cookie('email', '');
  return $.ajax({
    url: '/logout',
    type: 'GET'
  });
}

App.getIdeas = function() {
  return $.ajax({
    url: '/users/' + $.cookie('user_id') + '/ideas',
    type: 'GET'
  });
}

App.addIdea = function(data) {
  return $.ajax({
    url: '/users/' + $.cookie('user_id') + '/ideas',
    type: 'POST',
    data: data
  });
}

App.afterLogin = function() {
  // ajax server to get users ideas
  // load response into Backbone elements
  App.getIdeas().done(function(data) {
    for (var i=0; i<data.length; i++) {
      new Idea(data[i]);
    }

    // prepare user interface
    $('#idea-input').val('');
    $('#profile-link').html($.cookie('email'));

    // fade out splash page
    $('#intro').fadeOut(500);
    $('#login').fadeOut(500, function() {

      // load user interface
      $('#logout').fadeIn(500);
      $('#ideas').fadeIn(500);
      $('#idea-form').fadeIn(500);
      $('#profile-link').fadeIn(500, function() {

        // reset pre-login inputs
        $('#register-email').val('');
        $('#register-password').val('');
        $('#login-email').val('');
        $('#login-password').val('');
        $('#register-password-confirmation').val('');
      });
    });
  });
}

App.afterLogout = function() {

  // fade out to login
  $('#logout').fadeOut(500, function() {
    $('#login').fadeIn(500);
    $('#intro').fadeIn(500);
  });

  // clear the last session
  $('#ideas').fadeOut(500, function() {
    $('#ideas').html('');
  });

  $('#idea-form').fadeOut(500);

  $('#profile-link').fadeOut(500, function() {
    $('#profile-link').html('');
  });
}

App.listeners = function() {
  $('#register').on('submit', function(e) {
    e.preventDefault();
    // collect data for json post of new user
    var email = $('#register-email').val(),
        password = $('#register-password').val(),
        passwordConfirmation = $('#register-password-confirmation').val(),
        registerData = { user: { email: email, password: password, password_confirmation: passwordConfirmation } };

    // set jquery cookie with ajax response
    App.register(registerData).done(function(data) {
      $.cookie('user_id', data.id, { expires: 7 });
      $.cookie('email', data.email, { expires: 7 });
      App.afterLogin();
    });
  });

  $('#login').on('submit', function(e) {
    e.preventDefault();
    var email = $('#login-email').val(),
        password = $('#login-password').val(),
        loginData = { email: email, password: password };

    App.login(loginData).done(function(data) {
      $.cookie('user_id', data.user_id, { expires: 7 });
      $.cookie('email', data.email, { expires: 7 });
      App.afterLogin();
    });
  });

  $('#logout').on('click', function(e) {
    e.preventDefault();
    App.logout().done(function(data) {
      App.afterLogout();
    });
  });

  $('#idea-form').on('submit', function(e) {
    e.preventDefault();
    // format json post of new idea
    var content = $('#idea-input').val(),
        ideaData = { idea: {
          content: content,
          user_id: $.cookie('user_id')
        } };

    // send new idea to server
    App.addIdea(ideaData).done(function(data) {
      $('#idea-input').val('');
      // create Backbone element from response
      new Idea(data);
    });
  });

  function fnPreventBackspace(event){if (event.keyCode == 8) {return false;}}
  function fnPreventBackspacePropagation(event){if(event.keyCode == 8){event.stopPropagation();}return true;}
  $(document).on('keydown', function(e) {
    fnPreventBackspace(e);
    fnPreventBackspacePropagation(e);
    if (e.keyCode == 8) {
      e.preventDefault();
      var curVal = document.activeElement.value;
      document.activeElement.value = curVal.substr(0,curVal.length-1);
    } else {
      $('#idea-input').focus();
    }
  });

  $(document).on('keypress', function(e) {
    fnPreventBackspace(e);
    fnPreventBackspacePropagation(e);
  });

  // create new session if non-existant
  var cookieId = $.cookie('user_id') || '';
  $.cookie('user_id', cookieId);

  var cookieEmail = $.cookie('email') || '';
  $.cookie('email', cookieEmail);

  // if no user_id in session, show login form
  if (!cookieId) {
    App.afterLogout();
  } else {
    $('#logout').fadeIn(500, function() {
      App.afterLogin();
    });
  }

}
