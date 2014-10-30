$(function () {

  $(window).on('resize', function () {
    centerModal();
  });


  $('#username').keyup(function() {
    $('#loginForm span.err3').hide();
    $('#loginForm span.err1').hide();
    $(this).removeClass('invalid');
  });

  $('#password').keyup(function() {
    $('#loginForm span.err1').hide();
    $('#loginForm span.err4').hide();
    $(this).removeClass('invalid');
  });

  $('.btnRegister').on('click', function () {
    if ($('.mainStream #register').length>0) return;
    //document.getElementById("registerForm").reset();
    showModal('#register');

  });

  $('.actionLogin').on('click', function () {
    if ($('.mainStream #login').length>0) return;
    document.getElementById("loginForm").reset();
    $('#loginForm .btnSubmit').html('Login');
    $(".pwd, .confirm, .strength").parents(".row").show();
    $("#register a.btnSubmit").removeClass("socialRegister");
    showModal('#login');
  });

  $('.closeModal,#bgModal').not('.redirectOnConfirm').on('click', function () {
    //window.location.replace('/');
    closeModal();
  });

  $('.redirectOnConfirm').on('click', function () {
    redirectToNext();
  });


  /* validation */

  function isValidEmailAddress(emailAddress) {
    // Issue ID: I-109386 - Change regular expression pattern for better validation on domain name (no space allowed)
    var pattern = new RegExp("(^[\\+_A-Za-z0-9-]+(\\.[\\+_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,}$))");
    return pattern.test(emailAddress);
  }


  function pwdStrength(pwd) {

    var result = 0;
    if ($.trim(pwd) == '') return 0;
    if (pwd.length < 7) return -2;
    if (pwd.length > 30) return -3;
    if (pwd.match("'")) return -4;

    if (pwd.match(/[a-z]/)) result++;
    if (pwd.match(/[A-Z]/)) result++;
    if (pwd.match(/\d/)) result++;
    if (pwd.match(/[\]\[\!\"\#\$\%\&\'\(\)\*\+\,\.\/\:\;\<\=\>\?\@\\\^\_\`\{\|\}\~\-]/)) result++;

    return result;

  }

  $('#registerForm input.pwd:password').on('keyup', function () {
    var input = $(this);

    $(this).closest('.row').find('.err1,.err2,.err3,.err4,.err5').hide();
    $(this).removeClass('invalid');

    var strength = pwdStrength($(this).val());

    $(".strength .field").removeClass("red").removeClass("green");
    var classname = "red";
    $(this).closest('.row').find('span.err3').hide();
    $(this).closest('.row').find('span.err4').hide();
    if (strength >= 3) {
      classname = "green";
      $(this).parents(".row").find("span.valid").css("display", "inline-block");
    } else {
      $(this).parents(".row").find("span.valid").hide();
    }

    $(".strength .field").each(function (i, e) {
      if (i < strength) {
        $(e).addClass(classname);
      }
    });
    //Bugfix I-109383: Wrong parameter was used to detect empty values
    if (strength == 0) {
        if ($.trim(input.val()) === input.val()) {
            input.closest('.row').find('.err1').show();
        } else {
            input.closest('.row').find('.err5').show();
        }
      input.addClass('invalid');
    } else if (strength >= 0 && strength < 3) {
      input.closest('.row').find('.err2').show();
      input.addClass('invalid');
    } else if (strength == -4) {
      input.closest('.row').find('.err3').show();
      input.addClass('invalid');
    } else if (strength < -1) {
      input.closest('.row').find('.err4').show();
      input.addClass('invalid');
    }
  });

  $('#registerForm input.confirm:password').on('keyup', function () {
    var input = $(this);
    input.removeClass('invalid');
    input.closest('.row').find('.err1,.err2').hide();
    if (input.val() == "") {
        input.closest('.row').find('.err1').show();
      input.addClass('invalid');
    } else if (input.val() != $('#registerForm input.pwd:password').val()) {
      input.closest('.row').find('.err2').show();
      input.addClass('invalid');
    }
  });

  $('#register form.register input.email:text').on('keyup', function () {
    var email;
    if (isValidEmailAddress(email=$(this).val())) {
      $(this).parents(".row").find("span.valid").css("display", "inline-block");
      $(this).closest('.row').find('input:text').removeClass('invalid');
      $(this).closest('.row').find('span.err1').hide();
      $(this).closest('.row').find('span.err2').hide();
      $(this).closest('.row').find('span.err3').hide();
      $(this).parents(".row").find("span.valid").hide();
    } else {
      $(this).closest('.row').find('input:text').addClass('invalid');
      $(this).closest('.row').find('span.err1').hide();
      $(this).closest('.row').find('span.err2').hide();
      $(this).closest('.row').find('span.err3').hide();
      $(this).parents(".row").find("span.valid").hide();
      if (email.length==0)
        $(this).closest('.row').find('span.err1').show();
      else
        $(this).closest('.row').find('span.err2').show();
    }
  });

  $('#register form.register input.name.lastName:text').on('keyup', function () {
    var text = $(this).val();
    //clear all error messages
    $(this).closest('.row').find('span.err1').hide();
    $(this).closest('.row').find('span.err2').hide();
    $(this).closest('.row').find('span.err3').hide();
    $(this).closest('.row').find('span.err4').hide();
    $(this).closest('.row').find('span.err5').hide();
    $(this).closest('.row').find('input:text').removeClass('invalid');
    if (text.length > 64) {
      $(this).parents(".row").find("span.valid").hide();
      $(this).addClass('invalid');
      $(this).parents(".row").find("span.err2").show();

    } else if (text != '' && !text.match(/^[a-zA-Z0-9. \-_']+$/)) {
        //Bugfix I-107905: show error on entry of invalid characters
		//Bugfix I-251: allow apostrophe in last name
        $(this).parents(".row").find("span.valid").hide();
        $(this).addClass('invalid');
        $(this).closest('.row').find('span.err3').show();
    } else if (text.match(/^[. \-_]+$/g)) {
        //show error if name consists of only valid punctuation
        $(this).parents(".row").find("span.valid").hide();
        $(this).addClass('invalid');
        $(this).parents(".row").find("span.err4").show();
    } else if (text.match(/(\s|\.|_|\-)\1{1,}/)) {
        //show error if name contains 2 or more of same valid special char in a row
        $(this).parents(".row").find("span.valid").hide();
        $(this).addClass('invalid');
        $(this).parents(".row").find("span.err5").show();
    }  else if (text.length == 0) {
        $(this).parents(".row").find("span.valid").hide();
        $(this).addClass('invalid');
        $(this).closest('.row').find('span.err1').show();
    } else if (text != '') {
      $(this).parents(".row").find("span.valid").css("display", "inline-block");
      $(this).closest('.row').find('input:text').removeClass('invalid');
      $(this).closest('.row').find('span.err1').hide();
      $(this).closest('.row').find('span.err2').hide();
      $(this).closest('.row').find('span.err3').hide();
      $(this).closest('.row').find('span.err4').hide();
      $(this).closest('.row').find('span.err5').hide();
    } else {
      $(this).parents(".row").find("span.valid").hide();
    }
  });

  $('#register form.register input.name.lastName:text').on('blur', function () {
      var text = $(this).val();
      //remove leading and trailing spaces from name if any exist
      if (text.match(/^\s+|\s+$/g)) {
          $(this).val($.trim(text));
          text = $(this).val();
      }
      //remove instances of multiple spaces and other whitespace characters inside name string
      $(this).val(text.replace(/\s{2,}/g, ' '));
      //check if input is empty, display error if so
      if ($(this).val().length === 0) {
          $(this).parents(".row").find("span.valid").hide();
          $(this).addClass('invalid');
          $(this).closest('.row').find('span.err2').hide();
          $(this).closest('.row').find('span.err3').hide();
          $(this).closest('.row').find('span.err4').hide();
          $(this).closest('.row').find('span.err5').hide();
          $(this).closest('.row').find('span.err1').show();
      }
  });
  $('#register form.register input.name.firstName:text').on('keyup', function () {
    var text = $(this).val();
    //clear all error messages
    $(this).closest('.row').find('span.err1').hide();
    $(this).closest('.row').find('span.err2').hide();
    $(this).closest('.row').find('span.err3').hide();
    $(this).closest('.row').find('span.err4').hide();
    $(this).closest('.row').find('span.err5').hide();
    $(this).closest('.row').find('input:text').removeClass('invalid');
    if (text.length > 64) {
      $(this).parents(".row").find("span.valid").hide();
      $(this).addClass('invalid');
      $(this).parents(".row").find("span.err2").show();

    } else if (text != '' && !text.match(/^[a-zA-Z0-9. \-_]+$/)) {
        //Bugfix I-107905: show error on entry of invalid characters
        $(this).parents(".row").find("span.valid").hide();
        $(this).addClass('invalid');
        $(this).closest('.row').find('span.err3').show();
    } else if (text.match(/^[. \-_]+$/g)) {
        //show error if name consists of only valid punctuation
        $(this).parents(".row").find("span.valid").hide();
        $(this).addClass('invalid');
        $(this).parents(".row").find("span.err4").show();
    } else if (text.match(/(\s|\.|_|\-)\1{1,}/)) {
        //show error if name contains 2 or more of same valid special char in a row
        $(this).parents(".row").find("span.valid").hide();
        $(this).addClass('invalid');
        $(this).parents(".row").find("span.err5").show();
    } else if (text.length == 0) {
        $(this).parents(".row").find("span.valid").hide();
        $(this).addClass('invalid');
        $(this).closest('.row').find('span.err1').show();
    } else if (text != '') {
      $(this).parents(".row").find("span.valid").css("display", "inline-block");
      $(this).closest('.row').find('input:text').removeClass('invalid');
      $(this).closest('.row').find('span.err1').hide();
      $(this).closest('.row').find('span.err2').hide();
      $(this).closest('.row').find('span.err3').hide();
      $(this).closest('.row').find('span.err4').hide();
      $(this).closest('.row').find('span.err5').hide();
    } else {
      $(this).parents(".row").find("span.valid").hide();
    }
  });
  $('#register form.register input.name.firstName:text').on('blur', function () {
      var text = $(this).val();
      //remove leading and trailing spaces from name if any exist
      if (text.match(/^\s+|\s+$/g)) {
          $(this).val($.trim(text));
          text = $(this).val();
      }
      //remove instances of multiple spaces and other whitespace characters inside name string
      $(this).val(text.replace(/\s{2,}/g, ' '));
      //check if input is empty, display error if so
      if ($(this).val().length === 0) {
          $(this).parents(".row").find("span.valid").hide();
          $(this).addClass('invalid');
          $(this).closest('.row').find('span.err2').hide();
          $(this).closest('.row').find('span.err3').hide();
          $(this).closest('.row').find('span.err4').hide();
          $(this).closest('.row').find('span.err5').hide();
          $(this).closest('.row').find('span.err1').show();
      }
  });

  $('#register form.register input.handle:text').on('keyup', function () {
    var invalid = false;
    handleChanged = true;
    $(this).parents(".row").find("span.valid").hide();
    $(this).closest('.row').find('span.err1').hide();
    $(this).closest('.row').find('span.err2').hide();
    $(this).closest('.row').find('span.err3').hide();
    $(this).closest('.row').find('span.err4').hide();
    $(this).closest('.row').find('span.err5').hide();
    $(this).closest('.row').find('span.err6').hide();
    $(this).closest('.row').find('span.err7').hide();
    var text = $(this).val();
    if (text.indexOf(' ') != -1) {
      // can't contain spaces
      $(this).closest('.row').find('span.err3').show();
      invalid = true;

    } else if (text.match(/^[\-\_\.\{\}\[\]]+$/)) {
      // can't consist solely of punctuation
      $(this).closest('.row').find('span.err4').show();
      invalid = true;

    } else if (!text.match(/^[\w\d\-\_\.\{\}\[\]]*$/)) {
      // must be all valid chars
      $(this).closest('.row').find('span.err5').show();
      invalid = true;
    } else if (text.toLowerCase().match(/^admin/)) {
      // can't start with 'admin'
      $(this).closest('.row').find('span.err6').show();
      invalid = true;
    } else if (text.length == 0) {
      $(this).closest('.row').find('span.err1').show();
      invalid = true;
    } else if (text.length == 1 || text.length > 15) {
      // must be between 2 and 15 chars long
      $(this).closest('.row').find('span.err7').show();
      invalid = true;
    }
    if (!invalid) {
      $('#register form.register input.handle:text').removeClass('invalid');
    } else {
      $('#register form.register input.handle:text').addClass('invalid');
    }
  });

  $('#register form.register input:checkbox').on('change', function () {
    if ($(this).prop('checked')) {
      $(this).parents(".row").find("span.valid").css("display", "inline-block");
      $(this).closest('.row').find('input:text').removeClass('invalid');
      $(this).closest('.row').find('span.err1').hide();
      $(this).closest('.row').find('span.err2').hide();
    } else {
      $(this).parents(".row").find("span.valid").hide();

	  // Issue ID: I-111588 - Show invalid error message when checkbox is not checked
	  $(this).closest('.row').find('.err1').show();
	  $(this).addClass('invalid');
    }
  });

  $('#register input:password').on('keyup', function () {
    var pwd = $('#register form.register input.pwd:password');
    var confirm = $('#register form.register input.confirm:password');
    //bugfix empty value checking without using trim
    var strength = pwdStrength(pwd.val());
    if (pwd.val() == confirm.val() && pwd.val() != '' && strength>0 ) {
      confirm.parents(".row").find("span.valid").css("display", "inline-block");
      confirm.removeClass('invalid');
      confirm.parents(".row").find('span.err1').hide();
      confirm.parents(".row").find('span.err2').hide();
    } else {
      confirm.parents(".row").find("span.valid").hide();
    }
  });


  $('select').on('change', function () {
    if ($(this).val() != "") {
      $(this).parents(".row").find("span.valid").css("display", "inline-block");
      $(this).closest('.row').find('.err1').hide();
      $(this).closest('.row').find('.err2').hide();
      $(this).closest('.row').find('.customSelect').removeClass('invalid');
    } else {
      $(this).parents(".row").find("span.valid").hide();

      // Issue ID: I-111588 - Show invalid error message when value is empty after being changed
      $(this).closest('.row').find('.err1').show();
      $(this).closest('.row').find('.customSelect').addClass('invalid');
    }
  });

  var emailIsFree = false;
  var emailValidationAttempted = false;
  var emailDeferred = $.Deferred();
  function validateEmail() {
    if (!isValidEmailAddress($('#register form.register input.email:text').val())) return;
    emailValidationAttempted = true;
    var email = $('#register form.register input.email:text').val();
    email = email.replace('+', '%2B');

    var showInvalid = function() {
      emailIsFree = false;
      var node = $('#register form.register input.email:text');
      $('input.email').closest('p.row').find('.err3').show();
      $('input.email').closest('p.row').find('input:text').addClass('invalid');
      $('input.email').closest('p.row').find('span.valid').hide();
      emailDeferred.resolve();
    }

    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: tcApiRUL + '/users/validateEmail?email=' + email + '&cb='+ Math.random(),
      success: function(data) {
        if (data.error || !data.available) {
          showInvalid();
        } else {
          emailIsFree = true;
          var node = $('#register form.register input.email:text');
          node.parents(".row").find("span.valid").css("display", "inline-block");
          node.closest('.row').find('input:text').removeClass('invalid');
          node.closest('.row').find('span.err1').hide();
          node.closest('.row').find('span.err2').hide();
          node.closest('.row').find('span.err3').hide();
          emailDeferred.resolve();
        }
      }
    }).fail(function() { showInvalid(); });
  }
  $('#register form.register input.email:text').blur(function() {
    validateEmail();
    emailDeferred = $.Deferred();
  });

  var handleIsFree = true;
  var handleValidationAttempted = false;
  var handleDeferred = $.Deferred();
  var handleChanged = false;
  function validateHandle() {
    handleChanged = false;
    handleValidationAttempted = true;
    var handle = $('#register form.register input.name.handle:text').val();

    var showInvalid = function() {
      handleIsFree = false;
      var node = $('#register form.register input.name.handle:text');
      $('input.handle').closest('.row').find('.err2').show();
      $('input.handle').closest('.row').find('input:text').addClass('invalid');
      $('input.handle').closest('.row').find('span.valid').hide();
      handleDeferred.resolve(); 
    }

    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: tcApiRUL + '/users/validate/' + handle + '?cb='+ Math.random(),
      success: function(data) {
        if (handleChanged) return;
        if (data.error || !data.valid) {
          showInvalid();
        } else {
          handleIsFree = true;
          var node = $('#register form.register input.name.handle:text');
          node.parents(".row").find("span.valid").css("display", "inline-block");
          node.closest('.row').find('input:text').removeClass('invalid');
          node.closest('.row').find('span.err1').hide();
          node.closest('.row').find('span.err2').hide();
          handleDeferred.resolve();
        }
      }
    }).fail(function() {
        if (handleChanged) return;
        showInvalid();
    });
  }
  $('#register form.register input.name.handle:text').blur(function() {
    if ($(this).val()=='' || $('input.handle').closest('.row').find('.err3,.err4,.err5,.err6,.err7').is(':visible')) return;
    validateHandle();
    handleDeferred = $.Deferred();
  });

  $('select.applyCustomSelect').customSelect();

  $('#register a.btnSubmit').on('click', function () {
    var isValid = true;
    if ($('#register form.register input.name.handle:text').val() != '' && !handleValidationAttempted && !$('input.handle').closest('.row').find('.err3,.err4,.err5,.err6').is(':visible')) validateHandle();
    if (!emailValidationAttempted) validateEmail();

    var frm = $('#register form.register');
    var invalidExceptions = $('input.handle,input.email').closest('.row').find('.invalid');
    $('.invalid', frm).not(invalidExceptions).removeClass('invalid');
    var handleErr = $('input.handle').closest('.row').find('.err2,.err3,.err4,.err5,.err6,.err7');
    $('.err1,.err2', frm).not(handleErr).hide();
    $('input:text', frm).each(function () {
      if ($.trim($(this).val()) == "") {
        $(this).closest('.row').find('.err1').show();
        $(this).closest('.row').find('input:text').addClass('invalid');
        isValid = false;
      }
    });
    $('input.firstName,input.lastName').each(function () {
      if ($(this).val().length > 64) {
        isValid = false;
        $(this).addClass('invalid');
        $(this).closest('.row').find('.err2').show();
      }
    });
    //stop submit if errors shown on first name/last name
    if ($('input.firstName').closest('.row').find('.err1,.err2,.err3,.err4,.err5,.err6').is(':visible')) {
        isValid = false;
        $('input.firstName').addClass('invalid');
    }
    if ($('input.lastName').closest('.row').find('.err1,.err2,.err3,.err4,.err5,.err6').is(':visible')) {
        isValid = false;
        $('input.lastName').addClass('invalid');
    }
    $('select', frm).each(function () {
      if ($.trim($(this).val()) == "") {
        $(this).closest('.row').find('.err1').show();
        $(this).closest('.row').find('.customSelect').addClass('invalid');
        isValid = false;
      }
    });

    $('input.email:text', frm).each(function () {
      if ($(this).closest('.row').find('.err1,.err2,.err3').is(':visible')) {
        isValid = false;
        return;
      }
        $(this).closest('.row').find('.err1').hide();
        $(this).closest('.row').find('.err2').hide();
      if ($.trim($(this).val()) == "") {
        $(this).closest('.row').find('.err1').show();
        $(this).closest('.row').find('input.email:text').addClass('invalid');
        isValid = false;
      }
      else if (!isValidEmailAddress($(this).val())) {
        $(this).closest('.row').find('.err2').show();
        $(this).closest('.row').find('input.email:text').addClass('invalid');
        isValid = false;
      }

    });
    if (!$(this).hasClass("socialRegister")) {
      $(this).closest('.row').find('.err1,.err2,.err3,.err4,.err5').hide();
      $('input.pwd:password', frm).each(function () {
          if ($.trim($(this).val()) == "") {
              if ($.trim($(this).val()) === $(this).val()) {
                $(this).closest('.row').find('.err1').show();
            } else {
                $(this).closest('.row').find('.err5').show();
            }
          $(this).closest('.row').find('input:password').addClass('invalid');
          isValid = false;
        } else if ($(".strength .field.red", frm).length > 0) {
          frm.find(".err2.red").show();
          $(this).closest('.row').find('.err2').show();
          $(this).closest('.row').find('input:password').addClass('invalid');
          isValid = false;
        } else if (pwdStrength($('input.pwd:password').val()) == -4) {
          frm.find(".err4.red").show();
          $(this).closest('.row').find('.err3').show();
          $(this).closest('.row').find('input:password').addClass('invalid');
          isValid = false;
        } else if (pwdStrength($('input.pwd:password').val()) < -1) {
          frm.find(".err4.red").show();
          $(this).closest('.row').find('.err4').show();
          $(this).closest('.row').find('input:password').addClass('invalid');
          isValid = false;
        }
        if ($('input.pwd:password', frm).val() != $('input.confirm:password', frm).val()) {
          $('input.confirm:password').closest('.row').find('.err2').show();
          $('input.confirm:password').closest('.row').find('input:password').addClass('invalid');
          isValid = false;
        }
        else if ($('input.confirm:password', frm).val() == "") {
          $('input.confirm:password').closest('.row').find('.err1').show();
          $('input.confirm:password').closest('.row').find('input:password').addClass('invalid');
          isValid = false;
        }
      });
    }
    $('.lSpace input:checkbox', frm).each(function () {
      if (!$(this).is(':checked')) {
        $(this).closest('.row').find('.err1').show();
        isValid = false;
      }
    });

    var handle = $('#register form.register input.name.handle:text').val();
    if (handle=='') {
      $('input.handle').closest('.row').find('.err1').show();
      $('input.handle').closest('.row').find('input:text').addClass('invalid');
      $('input.handle').closest('.row').find('span.valid').hide();
      isValid = false;
    }
    if ($('input.handle').closest('.row').find('.err3,.err4,.err5,.err6,.err7').is(':visible'))
      isValid = false;
    if (!isValid) return;

    handleDeferred.done(function() {

      if (handleChanged) return;

      if (!handleIsFree) {
        $('input.handle').closest('.row').find('.err2').show();
        $('input.handle').closest('.row').find('input:text').addClass('invalid');
        $('input.handle').closest('.row').find('span.valid').hide();
        isValid = false;
      }
      emailDeferred.done(function() {

        if (!emailIsFree) {
          $('input.email').closest('.row').find('.err3').show();
          $('input.email').closest('.row').find('input:text').addClass('invalid');
          $('input.email').closest('.row').find('span.valid').hide();
          isValid = false;
        }

        if (isValid && $('#register a.btnSubmit').html() == 'Sign Up') {
          $('#register a.btnSubmit').html('Please Wait');
          $('#register .btnSubmit').addClass('pleaseWait');
          // Issue ID: I-107903 - Disable all the fields on the registration form
          $('#register').find('input, select').prop('disabled', true);
          $('.customSelectInner').css('color', 'silver');
          $('#register a.btnSubmit').bind('click', false);
          var fields = {
            firstName: $('#registerForm input.firstName').val(),
            lastName: $('#registerForm input.lastName').val(),
            handle: $('#registerForm input.handle').val(),
            country: $('#registerForm select#selCountry').val(),
            email: $('#registerForm input.email').val(),
            curUrl: window.location.href
          };
          if ((typeof socialProviderId != 'undefined') && socialProviderId !== "") {
            fields.socialProviderId = socialProviderId;
            fields.socialUserId = socialUserId;
            fields.socialProvider = socialProvider;
            fields.socialUserName = socialUserName;
            fields.socialEmail = socialEmail;
            fields.socialEmailVerified = "t";
          } else {
            fields.password = $('#registerForm  input.pwd').val();
          }

          if (_kmq) 
            _kmq.push(['identify', fields.email]);
          
          $.post(ajaxUrl + '?action=post_register', fields, function (data) {
            if (data.code == "200") {
              var tcAction = getCookie('tcDelayChallengeAction');
              $('.modal').hide();
              $("#thanks h2").html('Thanks for Registering');
              $("#thanks p").html('We have sent you an email with activation instructions.<br>If you do not receive that email within 1 hour, please email <a href="mailto:support@topcoder.com">support@topcoder.com</a>');
              if (tcAction) {
                var tcDoAction = tcAction.split('|');
                if (tcDoAction[0] === 'register') {
                  //append challenge registration message
                  $("#thanks p").after("<div style='padding-bottom: 30px'>In order to register for the selected challenge, you must return to the <a href='/challenge-details/" + tcDoAction[1] + "/?type=" + challengeType + "'>challenge details page</a> after you have activated your account.</div>");
                  $('#thanks p').css({'padding-bottom': '10px'});
                }
              }
              showModal('#thanks');
              $('#registerForm .invalid').removeClass('invalid');
              $('#registerForm .valid').removeClass('valid');
              $('.err1,.err2', frm).hide();
              resetRegisterFields();
            }
            else {
              //$('.modal').hide();
              //$("#thanks h2").html('Error');
              //$("#thanks p").html(data.description);
              //showModal('#thanks');
              alert(data.description);

            }
            // Issue ID: I-107903 - re-enable all the fields on the registration form
            $('#register').find('input, select').prop('disabled', false);
            $('.customSelectInner').css('color', '#000000');
            $('#register a.btnSubmit').unbind('click', false);
            $('#register .btnSubmit').html('Sign Up');
          }, "json");
        }
      });
    });

  });

  $('#login a.btnSubmit').on('click', function () {
    var frm = $(this).closest('form.login');
    $('.invalid', frm).removeClass('invalid');
    $('.err1,.err2', frm).hide();
    var isValid = true;
    $('input:password', frm).each(function () {
    //fixed incorrect value checking
        if ($.trim($(this).val()) == "") {
            if ($.trim($(this).val()) === $(this).val()) {
              $(this).closest('.row').find('.err1').show();
          } else {
              $(this).closest('.row').find('.err5').show();
          }
        $(this).closest('.row').find('input:password').addClass('invalid');
        isValid = false;
      }
    });

    if (isValid) {
      $('#loginForm .btnSubmit').html('Please wait');
    }

    /*if(isValid)
     $('input:text',frm).each(function(){
     if($(this).val() != "OK"){
     $(this).closest('.row').find('.err1').show();
     $(this).closest('.row').find('input:text').addClass('invalid');
     $(this).closest('.row').parent().find('input:password').addClass('invalid');
     isValid = false;
     }
     });



     if(isValid){
     $('#loginForm .btnSubmit').html('Please Wait');
     $.post( ajaxUrl+'?action=post_login', { name: $('input.name').val(), password : $('input.pwd').val() },function( data ) {
     if ( data.name == 'OK' ){
     $('#navigation, .sidebarNav').removeClass('newUser');
     $('.btnRegWrap').hide();
     $('.btnAccWrap').show();
     $('.modal').hide();
     }
     else{
     $('#loginForm .err1').show();
     $('#loginForm .err2').hide();
     $('#loginForm .btnSubmit').html('Login');
     }

     }, "json");


     }
     */
  });

  /* hover style icons */
  $('.animeButton').each(function () {
    var $span = $(this).find('.animeButtonHover', this).css('opacity', 0);
    $(this).hover(function () {
      if (!$('html').is('.ie6, .ie7, .ie8'))$span.stop().fadeTo(500, 1);
      else $span.css('opacity', 1);
    }, function () {
      if (!$('html').is('.ie6, .ie7, .ie8'))$span.stop().fadeTo(500, 0);
      else $span.css('opacity', 0);
    });
  });

  $('.person label').each(function () {
    var $span = $(this).find('.animeManHover', this).css('opacity', 0);
    $(this).hover(function () {
      if (!$('html').is('.ie6, .ie7, .ie8'))$span.stop().fadeTo(500, 1);
      else $span.css('opacity', 1);
    }, function () {
      if (!$('html').is('.ie6, .ie7, .ie8'))$span.stop().fadeTo(500, 0);
      else $span.css('opacity', 0);
    });
  });

  $('.switch-to-register').click(function() {
    $('#login').hide();
    showModal('#register');
  });

  /*check if on registration complete page and add challenge detail link - currently only way to this since 
   *entire page content exists in WP database using generic template*/
  if ($('.thank-you').length) {
    var tcAction = getCookie('tcDelayChallengeAction');
    if (tcAction) {
      var tcActionValues = tcAction.split('|');
      if (typeof tcActionValues[2] !== 'undefined' && tcActionValues[0] === 'register' && tcActionValues[2] !== '') {
          //add link to challenge-details page for challenge new user tried to register for before making topcoder account
          $('.thank-you').append("<h4>Are you still interested in participating in the <br>&quot;" + decodeURIComponent(tcActionValues[2]) + "&quot; challenge? <br>If so, <a href='/challenge-details/register/" + tcActionValues[1] + "/'>go there now!</a></h4>");
        }
    }
  }
});

// modal
function showError(message) {
  $("#registerFailed .failedMessage").text(message);
  showModal("#registerFailed");
}

/**
 * show modal
 * selector - the jQuery selector of the popup
 */
function showModal(selector) {
  var modal = $(selector);
  $('#bgModal').show();
  modal.show();
  centerModal();
}

function centerModal(selector) {
  var modal = $('.modal:visible');
  if ($(window).width() >= 1003 || $('html').is('.ie6, .ie7, .ie8'))
    modal.css('margin', -modal.height() / 2 + 'px 0 0 ' + (-modal.width() / 2) + 'px');
  else {
    modal.css('margin', '0');
  }
}

function closeModal() {
  $('.modal,#bgModal').hide();
  resetRegisterFields();
  if (window.location.hash.match('access_token')) {
    window.history.pushState({}, 'Home', '/');
  }
  
  // Issue ID: I-111638 - reset login fields
  resetLoginFields();
  
  loginState = window.location.href;
  $('#registerForm span.socialUnavailableErrorMessage').hide();
}

function redirectToNext() {
  // go to next param if it exists
  var nextLoc = getParameterByName('next') || getHashParameterByName('state');
  if (nextLoc) {
    window.location.href = nextLoc;
  }
  else if (window.location.pathname == '/register/') {
    window.location.href = "/";
  }
  else {
    closeModal()
  }
}

// Resets the registration popup fields
function resetRegisterFields() {
  $("#registerForm input[type='text'], #registerForm input[type='password']").val("");
  $("#registerForm select").val($("#registerForm select option:first").val());
  $('#registerForm input.handle').trigger('keyup');
  $("#registerForm .customSelectInner").text($("#registerForm select option:first").text());
  $("#registerForm input[type='checkbox']").attr('checked', false);
  $(".pwd, .confirm, .strength").parents(".row").show();
  $("#registerForm a.btnSubmit").removeClass("socialRegister");
  $('#registerForm .invalid').removeClass('invalid');
  $('#registerForm .err1,.err2,.err3,.err4,.err5,.err6,.err7,.err8').hide();
  $('#registerForm span.strength span.field').removeClass('red').removeClass('green');
  $('#registerForm span.valid').hide();
  $('.socialUnavailableErrorMessage').hide();
}

// Issue ID: I-111638 - Resets the login popup fields
function resetLoginFields() {
  $("#loginForm input[type='text'], #registerForm input[type='password']").val("");
  $('#loginForm .invalid').removeClass('invalid');
  $('#loginForm .err1,.err3,.err4').hide();
}
