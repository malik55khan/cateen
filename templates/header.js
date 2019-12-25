METHODS['header'] = function () {
    $('#top-header .back').hide();
    $('#top-header i.fa-close').click(function () {
        window.close();
    });
    $('#top-header .logout-button').click(function () {
        $('.login-button').show();
        $('.logout-button').hide();
        let user = {
            isLoggedIn: false,
            data: []
        }
        Common.setLocal({ user: user },function(){
            SHARED_SERVICE.renderTemplate('', 'login');
        });
        
    });
}