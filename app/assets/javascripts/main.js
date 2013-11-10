$(function() {

  function register(data) {
    return $.ajax({
      url: '/users',
      type: 'POST',
      data: data
    });
  }

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
      var $ideas = $('#ideas');
      for (var i=0; i<data.length; i++) {
        var $idea = $('<div>');
        $idea.addClass('idea');
        $idea.html(data[i].content + '<i class=\'fa-trash-o\'></i>');
        $ideas.prepend($idea);
      }
      $('#idea-input').val('');
      $('#profile-link').html($.cookie('email'));
      $('#intro').fadeOut(500);
      $('#login').fadeOut(500, function() {
        $('#logout').fadeIn(500);
        $('#ideas').fadeIn(500);
        $('#idea-form').fadeIn(500);
        $('#profile-link').fadeIn(500, function() {
          $('#register-email').val('');
          $('#register-password').val('');
          $('#login-email').val('');
          $('#login-password').val('');
          $('#register-password-confirmation').val('');
        });
      });
    });
  }

  function afterLogout() {
    $('#logout').fadeOut(500, function() {
      $('#login').fadeIn(500);
      $('#intro').fadeIn(500);
    });

    $('#ideas').fadeOut(500, function() {
      $('#ideas').html('');
    });

    $('#idea-form').fadeOut(500);

    $('#profile-link').fadeOut(500, function() {
      $('#profile-link').html('');
    });
  }

  $('#register').on('submit', function(e) {
    e.preventDefault();
    var email = $('#register-email').val(),
        password = $('#register-password').val(),
        passwordConfirmation = $('#register-password-confirmation').val(),
        registerData = { user: { email: email, password: password, password_confirmation: passwordConfirmation } };

    register(registerData).done(function(data) {
      $.cookie('user_id', data.id, { expires: 7 });
      $.cookie('email', data.email, { expires: 7 });
      afterLogin();
    });
  })

  $('#login').on('submit', function(e) {
    e.preventDefault();
    var email = $('#login-email').val(),
        password = $('#login-password').val(),
        loginData = { email: email, password: password };

    login(loginData).done(function(data) {
      $.cookie('user_id', data.user_id, { expires: 7 });
      $.cookie('email', data.email, { expires: 7 });
      afterLogin();
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
      $('#idea-input').val('');

      var $ideas = $('#ideas'),
          $idea = $('<div>');
      $idea.addClass('idea');
      $idea.html(data.content + '<i class=\'fa-trash-o\'></i>');
      $ideas.prepend($idea);
    });
  });

  $(document.body).on('mouseover', '.idea', function(e) {
    $(this).addClass('hover');
    // .find('i').show();
  }).on('mouseout', '.idea', function(e) {
    $(this).removeClass('hover');
    // .find('i').hide();
  });

  function fnPreventBackspace(event){if (event.keyCode == 8) {return false;}}
  function fnPreventBackspacePropagation(event){if(event.keyCode == 8){event.stopPropagation();}return true;}
  $(document).on('keydown', function(e) {
    fnPreventBackspace(e);
    fnPreventBackspacePropagation(e);
    if (e.keyCode == 8) {
      e.preventDefault();
      $('#idea-input').val(function(index, value) {
        return value.substr(0,value.length-1);
      });
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
    afterLogout();
  } else {
    $('#logout').fadeIn(500, function() {
      afterLogin();
    });
  }

}); // $.ready
