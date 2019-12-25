METHODS['adminHome'] = function (params) {
    $('.content-body').css({ 'height': "454px" });
    $('#btn-add-update-menu').click(function () {
        SHARED_SERVICE.renderTemplate('', 'newMenu');
    });
    $('#setting').click(function () {
        SHARED_SERVICE.renderTemplate('', 'adminSetting');
    });
    $('.home-list #search-box').on('keyup', function () {
        var keyword = $(this).val().toLowerCase();
        $('.item-list .group-title').each(function () {
            var txt = $(this).text().toLowerCase();
            if (txt.indexOf(keyword) >= 0) {
                $(this).parent().parent('.item-list').show();
            } else $(this).parent().parent('.item-list').hide();

        });
    });

    let paymentObj = {
        url: SERVER_API.getAllPendingPayments,
        tokenRequired: true,
        type: "GET"
    };
    $('#loader').show();
    
    chrome.runtime.sendMessage({ cmd: "callajax", ajaxObj: paymentObj }, function (payment) {
        $('#loader').hide();
        if (payment.isSuccess && payment.result.code == 200) {
            let allOrders = {};
            $.each(payment.result.data,function(p,order){
                if(typeof allOrders[order.userId._id] == 'undefined'){
                    allOrders[order.userId._id] = [];
                }
                allOrders[order.userId._id].push(order);
            });
            createList(allOrders);
        }
    });
    function createList(allOrders){
        let html="";
        $.each(allOrders,function(i,allOrder){
            let amount = 0;
            $.each(allOrder,function(o,order){
                html+=`<tr><td>`+order.userId.name+`</td><td>`+order.userId.phone+`</td><td>`+order.comment+`</td><td>`+order.price+`</td><td><i id="`+order._id+`" class="fa fa-check pointer accept-order"></td><tr>`; 
            });
        });
        $('#tbody').html(html);
        $('.accept-order').click(function(){
            var id = $(this).attr('id');
            let obj = {
                html: "Are you sure to accept this payment. If it accepted then you can't update it again?",
                button: {
                    title: "Accept it",
                    type: 'button',
                    click: function (closeModal) {
                        updatePayment(id);
                        closeModal();
                    }
                },
                headingText: "Are you sure?",
                footerClass: "show",
                afterHtmlLoaded: function (closeModal) {
                }
            }
            SHARED_SERVICE.openModal(obj);
        });
    }
    function updatePayment(orderId){
        let ajaxObj = {
            url: SERVER_API.verifyPayments,
            tokenRequired: true,
            type: "POST",
            data:{orderId:orderId}
        };
        $('#loader').show();
        chrome.runtime.sendMessage({ cmd: "callajax", ajaxObj: ajaxObj }, function (order) {
            $('#loader').hide();
            console.log(order);
            if (order.isSuccess && order.result.code == 200) {
                SHARED_SERVICE.renderTemplate('', 'adminHome');
            }
        });
    }
    let ajaxObj = {
        url: SERVER_API.getMenu,
        tokenRequired: true,
        type: "GET"
    };
    $('#loader').show();
    chrome.runtime.sendMessage({ cmd: "callajax", ajaxObj: ajaxObj }, function (menu) {
        $('#loader').hide();
        console.log(menu);
        if (menu.isSuccess && menu.result.code == 200) {
            if(menu.result.data.isFreezed){
                $('#btn-freeze-menu').hide();
            }
            $('#btn-freeze-menu').click(function () {
                
                let ajaxObj = {
                    url: SERVER_API.freezeMenu,
                    tokenRequired: true,
                    type: "POST"
                };
                $('#loader').show();
                chrome.runtime.sendMessage({ cmd: "callajax", ajaxObj: ajaxObj }, function (res) {
                    $('#loader').hide();
                    if (res.isSuccess && res.result.code == 200) {
                        $('#btn-freeze-menu').hide();
                        $.toast().success("Menu has been freezed", "Success");
                    }
                });
            });
        }
    });



}