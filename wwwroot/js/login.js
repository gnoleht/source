
$.ajaxSetup({
    contentType: "application/json",
    dataType: "json"
});

if ($.cookie('LANG') == null || $.cookie('LANG') == undefined) {
    $.cookie('LANG', 'vn', { expires: 1000, path: '/' });
}

var keyLang = $.cookie("LANG");

$.getScript('translations/translation_' + keyLang + '.js', function () {
    $('#title').html(translation.TITLE);

    $('#lang-label').text(translation.LANGUAGE);

    $('#lang-img').attr('src', translation.SRC);

    $('#userid').text(translation.USER_ID);

    //$('#password').text(translation.PASSWORD);
    $('#username').attr('placeholder', translation.USER_ID);
    $('#password').attr('placeholder', translation.PASSWORD);
    $('#abc').prepend('<option value="" disabled selected>' + translation.ROLE + '</option >');
    $('#forget').html(translation.FORGET + '<span>' + translation.PASSWORD + '</span>');

    $('#btnlogin').text(translation.LOG_IN);

    //$('#pass-forgot').text(translation.PASSWORD_FORGOT);

    $('#lang-' + keyLang).addClass('active');

    $(document).ready(function ($) {
        // Reveal Login form
        setTimeout(function () { $(".fade-in-effect").addClass('in'); }, 0);

        // Validation and Ajax action
        $("form#login").validate({
            rules: {
                username: {
                    required: true
                },

                password: {
                    required: true
                }
            },

            messages: {
                username: {
                    required: translation.REQUIRED_USER_NAME //"Please enter your username."
                },

                password: {
                    required: translation.REQUIRED_PASSWORD //"Please enter your password." //+ 
                }
            },

            // Form Processing via AJAX
            submitHandler: function (form) {
                var opts = {
                    "UserId": $(form).find('#username').val(),
                    "Password": $(form).find('#password').val(),
                    "ConnectionName": $(form).find('#database').val(),
                    "BuId": ""
                };
                $.ajax({
                    url: "api/login/dologin",
                    type: 'POST',
                    data: JSON.stringify(opts),
                    success: function (respone) {
                        if (respone.isError == false) {
                            if (respone.data.option)
                                $.cookie('USER_OPT', JSON.stringify(respone.data.option));

                            $.cookie('CONNECTION_NAME', opts.ConnectionName);
                            $.cookie('TOKEN', respone.data.tokenId, { expires: 1000, path: '/' });
                            localStorage.setItem('USERINFO', JSON.stringify(respone.data));

                            var redirectUrl = getUrlVars()["url"];

                            if (redirectUrl != null && redirectUrl != "") {
                                var uri = decodeURIComponent(redirectUrl);
                                $(location).prop('href', decodeURIComponent(uri));
                            }
                            else
                                $(location).prop('href', "/");
                        }
                        else {
                            $(".errors-container .alert").slideUp('fast');
                            $(".errors-container").html('<div class="alert alert-danger">\
												<button type="button" class="close" data-dismiss="alert">\
													<span aria-hidden="true">&times;</span>\
													<span class="sr-only">Close</span>\
												</button>\ <span id="error">\
												' + translation[respone.message] + '</span>\
											</div>');
                            $(".errors-container .alert").hide().slideDown();
                            $(form).find('#password').select();
                        }
                    }
                });
            }
        });

        // Set Form focus
        $("form#login .form-group:has(.form-control):first .form-control").focus();

    });

    $.ajax({
        url: 'api/login/getDatabase',
        type: 'POST',
        success: function (respone) {
            if (respone.isError == false) {
                var options = '';
                for (var i = 0; i < respone.data.length; i++) {
                    options += '<option value="' + respone.data[i] + '">' + respone.data[i] + '</option>';
                }
                $("select#database").html(options);
            }
            else {
                console.log(respone.exception);
            }
        }
    });

});

function language(key) {
    if (key != keyLang) {
        $.cookie('LANG', key, { expires: 1000, path: '/' });
        var currentUrl = window.location.href;
        window.location.href = currentUrl;
    }
}
