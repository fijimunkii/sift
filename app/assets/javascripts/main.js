$(function() {

  function login(data) {
    return $.ajax({
      url: '/login',
      type: 'POST',
      data: data
    });
  }

  function logout() {
    $.cookie('user_id', '');
    $.cookie('email', '');
    return $.ajax({
      url: '/logout',
      type: 'GET'
    });
  }

  function getIdeas() {
    return $.ajax({
      url: '/users/' + $.cookie('user_id') + '/ideas',
      type: 'GET'
    });
  }

  function addIdea(data) {
    return $.ajax({
      url: '/users/' + $.cookie('user_id') + '/ideas',
      type: 'POST',
      data: data
    });
  }

  function afterLogin() {
    getIdeas().done(function(data) {
      console.log(data);
      $('#ideas').fadeIn();
      $('#idea-form').fadeIn();
      $('#profile-link').html($.cookie('email')).fadeIn();
    });
  }

  function afterLogout() {
    $('#logout').fadeOut(500, function() {
      $('#login').fadeIn(500);
    });

    $('#ideas').fadeOut(500, function() {
      $('#ideas').html('');
    });

    $('#idea-form').fadeOut(500);

    $('#profile-link').fadeOut(500, function() {
      $('#profile-link').html('');
    });
  }

  // create new session if non-existant
  var cookieId = $.cookie('user_id') || '';
  $.cookie('user_id', cookieId);

  var cookieEmail = $.cookie('email') || '';
  $.cookie('email', cookieEmail);

  // if no user_id in session, show login form
  if (!cookieId) {
    $('#login').fadeIn(500);
  } else {
    $('#logout').fadeIn(500, function() {
      afterLogin();
    });
  }

  $('#login').on('submit', function(e) {
    e.preventDefault();
    var email = $('#email-input').val(),
        password = $('#password-input').val(),
        loginData = { email: email, password: password };

    login(loginData).done(function(data) {
      console.log(data);
      $.cookie('user_id', data.user_id, { expires: 7 });
      $.cookie('email', data.email, { expires: 7 });
      $('#login').fadeOut(500, function() {
        $('#logout').fadeIn(500);
        afterLogin();
      });
    });
  });

  $('#logout').on('click', function(e) {
    e.preventDefault();
    logout().done(function(data) {
      afterLogout();
      console.log(data);
    });
  });

  $('#idea-form').on('submit', function(e) {
    e.preventDefault();
    var content = $('#idea-input').val(),
        ideaData = { idea: {
          content: content,
          user_id: $.cookie('user_id')
        } };

    addIdea(ideaData).done(function(data) {
      console.log(data);
      // $('#ideas').append
    });
  });



});
