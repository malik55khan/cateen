METHODS['login'] = function () {
    $('.content-body').css({ 'height': "540px" });
    Common.getLocal('savedLoginInfo', function (savedLoginInfo) {
        if (typeof savedLoginInfo !== 'undefined') {
            $('#loginForm').find('#email').val(savedLoginInfo.email);
            $('#loginForm').find('#password').val(savedLoginInfo.password)
        }
    });
    $('.footer-bar').hide();
    $('#loginForm').submit(function (e) {
        $('.error-msg').hide().html('')
        e.preventDefault();
        if ($.doValidate(this)) {
            let data = {
                email: $(this).find('#email').val(),
                password: $(this).find('#password').val(),
            }
            let ajaxObj = {
                url: SERVER_API.login,
                data: data,
                type: "POST"
            };
            $('#loader').show();
            chrome.runtime.sendMessage({ cmd: "callajax", ajaxObj: ajaxObj }, function (res) {
                $('#loader').hide();
                if (res.isSuccess && res.result.code == 200) {
                    let user = {
                        isLoggedIn: true,
                        data: res.result.data
                    }
                    Common.setLocal({ user: user });
                    chrome.runtime.sendMessage({ cmd: "socketUserRegistration", data: user.data }, function (res) {

                    });
                    //
                    $('.login-button').hide();
                    $('.logout-button').show();
                    setPages(user);
                    if ($('#remember-me').is(":checked")) {
                        Common.setLocal({ 'savedLoginInfo': data });
                    } else {
                        Common.setLocal({ 'savedLoginInfo': { email: "", password: "" } });
                    }
                } else {
                    $('.error-msg').show().html(res.result.message)
                }
            });

        } else {

        }

    });
    $('.login-button').click(() => {
        chrome.runtime.sendMessage({ cmd: "authenticate" }, function (data) {
            if (data.isLoggedIn) {
                $('.login-button').hide();
                $('.logout-button').show();
                setPages(data);
            }
        });
        //setTimeout(window.close,1000);
    });
    $('#remember-me').click(function () {
        let data = {
            email: $('#loginForm').find('#email').val(),
            password: $('#loginForm').find('#password').val()
        }
    });
    $('.register-now').click(function () {

        SHARED_SERVICE.renderTemplate("", "register");

    });
    var setPages = function (user) {
        if (typeof user !== 'undefined' && user.isLoggedIn) {
            if (user.data.userType == 2) {
                SHARED_SERVICE.renderTemplate('', 'employeeHome');
                SHARED_SERVICE.renderTemplate('#footer', 'footer');
            }
            else {
                SHARED_SERVICE.renderTemplate('', 'adminHome');
                SHARED_SERVICE.renderTemplate('#footer', 'adminFooter');
            }
        }

    }
}
