METHODS['employeeHome'] = function (params) {
    $('.content-body').css({ 'height': "454px" });
    var USER = "";
    $('#btn-cancel-menu').hide();
    var MyOrder = "";
    Common.getLocal('user', function (user) {
        $('#welcome-user').html("Welcome " + user.data.name);
        USER = user.data;
        let orderObj = {
            url: SERVER_API.getTodayOrder + "/" + USER._id,
            tokenRequired: true,
            type: "GET"
        };

        $('#loader').show();
        chrome.runtime.sendMessage({ cmd: "callajax", ajaxObj: orderObj }, function (res) {
            $('#loader').hide();
            if (res.isSuccess && res.result.code == 200) {
                console.log('res.result.data', res.result.data);
                MyOrder = res.result.data;
                if (res.result.data.isAccepted) {
                    $('#btn-add-update-menu').hide();
                    $('#btn-cancel-menu').hide();
                    if (!res.result.data.isFreezed) {
                        $('#btn-cancel-menu').show();
                    }
                } else {
                    $('#btn-add-update-menu').show();
                    $('#btn-cancel-menu').hide();
                }
            }
        });
        let ajaxObj = {
            url: SERVER_API.getMenu,
            tokenRequired: true,
            type: "GET"
        };
        $('#loader').show();
        chrome.runtime.sendMessage({ cmd: "callajax", ajaxObj: ajaxObj }, function (res) {
            $('#loader').hide();
            if (res.isSuccess && res.result.code == 200 && res.result.data) {
                createList(res.result.data);
            } else {
                menuNotCreated();
                if (res.result.status == 401) {
                    $.toast().error("Token has expired, Please login again", 'Error!');
                    $('.logout-button').click();
                }
                else {
                    //$.toast().error(res.result.msg, 'Error!');
                }
            }
        });

    });





    function menuNotCreated() {
        let html = "<center><p><b>Menu is not added yet!</b></p><center>";
        $('.home-list #items-info').html(html);
        $('#btn-add-update-menu').hide();
    }
    function createList(menu) {
        var html = `
        <p><b>Items </b>: `+ menu.items + `</p>`;
        if (menu.todaysSpecial) {
            html += `<p><b>Special Items </b>: ` + menu.todaysSpecial + `</p>`;
        } else {
            html += `<p><b>Special Items </b>: None</p>`;
        }
        $('.home-list #items-info').html(html);

        $('#btn-add-update-menu').click(function () {
            update(menu, html, true);
        });
        $('#btn-cancel-menu').click(function () {
            update(menu, html, false);
        });
    }
    var update = function (menu, html, status) {
        let prefix = "";
        if (status) prefix = ""; else prefix = "not"
        let obj = {
            html: html,
            button: {
                title: "Yes I " + prefix + " agree",
                type: 'button',
                click: function (closeModal) {
                    updateMyOrder(menu, status);
                    closeModal();
                }
            },
            headingText: "Are you " + prefix + " agree with this menu?",
            footerClass: "show",
            afterHtmlLoaded: function (closeModal) {
            }
        }
        SHARED_SERVICE.openModal(obj);
    }
    var updateMyOrder = function (menu, status) {
        var data = {
            userId: USER._id,
            menuId: menu._id,
            isAccepted: status,
            isLiable: status,
            price: menu.price
        }
        let ajaxObj = {
            url: SERVER_API.addOrder,
            tokenRequired: true,
            data: data,
            type: "POST"
        };
        $('#loader').show();
        chrome.runtime.sendMessage({ cmd: "callajax", ajaxObj: ajaxObj }, function (res) {
            $('#loader').hide();
            console.log(res);
            if (res.isSuccess && res.result.code == 200) {
                SHARED_SERVICE.renderTemplate('', 'employeeHome');
            }
        });
    }
}