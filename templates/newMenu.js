METHODS['newMenu'] = function (params) {
    var ajaxObj = {
        url: SERVER_API.getMenu,
        tokenRequired: true,
        type: "GET"
    };
    var isMenuCreated = false;
    $('#loader').show();
    chrome.runtime.sendMessage({ cmd: "callajax", ajaxObj: ajaxObj }, function (res) {
        if (res.isSuccess && res.result.code == 200 && res.result.data) {
            $('#items').val(res.result.data.items);
            $('#todaysSpecial').val(res.result.data.todaysSpecial);
            $('#price').val(res.result.data.price)
            isMenuCreated = true;
            if(res.result.data.isFreezed){
                $('.submit-button').hide();
            }
            
        }
        $('#loader').hide();
    });
    $('#newPostForm').submit(function (e) {
        e.preventDefault();
        let data = {
            items: $('#items').val(),
            todaysSpecial: $('#todaysSpecial').val(),
            price:$('#price').val()
        }
        let url = SERVER_API.addMenu;
        if (isMenuCreated) {
            url = SERVER_API.updateMenu;
        }
        let ajaxObj = {
            url: url,
            data: data,
            tokenRequired: true,
            type: "POST"
        };
        $('#loader').show();
        chrome.runtime.sendMessage({ cmd: "callajax", ajaxObj: ajaxObj }, function (res) {
            $('#loader').hide();
            if (res.isSuccess && res.result.code == 200) {
                $.toast().success(res.result.msg, 'Success');
                SHARED_SERVICE.renderTemplate("", "adminHome");
            } else {
                $.toast().error(res.result.msg, 'Error!');
            }
        });
    });
    $('#newPostForm #go-back-btn').click(function () {
        SHARED_SERVICE.renderTemplate("", "adminHome", params);
    });
}