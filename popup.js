$(function () {
    $('.login-button').hide();
    $('.logout-button').hide();
    $('.home-panel').hide();
    $('.splash-screen').show();
    setTimeout(init, 200);

    function init() {
        $('.splash-screen').fadeOut(300, function () { $('.home-panel').fadeIn(300); });
        SHARED_SERVICE.renderTemplate('#header', 'header');
        Common.getLocal('user', function (user) {
            if (typeof user !== 'undefined' && user.isLoggedIn) {
                $('.login-button').hide();
                $('.logout-button').show();
                setPages(user);
            } else {
                $('.login-button').show();
                $('.logout-button').hide();
                SHARED_SERVICE.renderTemplate('', 'login');
            }
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

});
