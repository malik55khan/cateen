METHODS['userOrder'] = function () {
    var amount = 0;
    Common.getLocal('user', function (user) {
        let ajaxObj = {
            url: SERVER_API.getUserAllOrders+"/"+user.data._id,
            tokenRequired: true,
            type: "GET"
        };
        var Records = [];
        var Setting ={}
        $('#loader').show();
        chrome.runtime.sendMessage({ cmd: "callajax", ajaxObj: ajaxObj }, function (res) {
            $('#loader').hide();
            if (res.isSuccess && res.result.code == 200) {
                Records = res.result.data;
                createList(res.result.data);
            } else {
                if (res.result.status == 401) {
                    $.toast().error("Token has expired, Please login again", 'Error!');
                    $('.logout-button').click();
                }
                else {
                    $.toast().error(res.result.msg, 'Error!');
                }
            }
        });
        ajaxObj = {
            url: SERVER_API.getSettings,
            tokenRequired: true,
            type: "GET"
        };
        $('#loader').show();
        chrome.runtime.sendMessage({ cmd: "callajax", ajaxObj: ajaxObj }, function (res) {
            $('#loader').hide();
            if (res.isSuccess && res.result.code == 200 && res.result.data) {
                
                Setting = res.result.data;
                if(res.result.data.isPaymentActive){
                    $('#btn-pending-payment').show();
                }else{
                    $('#btn-pending-payment').hide();
                }
                $('#btn-pending-payment').click(function () {

                    let ajaxObj = {
                        url: SERVER_API.getSettings,
                        tokenRequired: true,
                        type: "GET"
                    };
                    $('#loader').show();
                    chrome.runtime.sendMessage({ cmd: "callajax", ajaxObj: ajaxObj }, function (setting) {
                        $('#loader').hide();
                        if (setting.isSuccess && setting.result.code == 200 && setting.result.data) {
                            
                            let html = "<img class='img-responsive' src='" + WEB_END_POINT + setting.result.data.QRImage + "'>";
                            html += "<br><p>UPI ID: " + setting.result.data.UPI + "</p>";
                            html += "<p>Phone Number: " + setting.result.data.phone + "</p>";
                            html += `<input id="payment-comment" type="text" class="form-control"><br><button type="button" class="md-button pull-right" id="btn-write-comment">Write Comment</button><div class="clearfix"></div>`;
                            let obj = {
                                html: html,
                                headingText: "Scan QR Code",
                                footerClass: "hide",
                                top: "-25%",
                                afterHtmlLoaded: function (closeModal) {
                                    $('#btn-write-comment').click(function () {
                                        let orderIds = [];
                                        console.log(Records);
                                        $.each(Records, function (i, elem) {
                                            orderIds.push(elem._id);
                                        });
                                        console.log('orderIds',orderIds);
                                        let data = {
                                            comment: $('#payment-comment').val(),
                                            userId: user.data._id,
                                            orderIds: orderIds,
                                            name:user.data.name,
                                            message:user.data.name+"("+user.data.phone+") has sent you payment comment related to Rs."+amount
                                        }
                                        let orderAjax = {
                                            url: SERVER_API.doUserPayment,
                                            tokenRequired: true,
                                            type: "POST",
                                            data:data
                                        }
                                        $('#loader').show();
                                        chrome.runtime.sendMessage({ cmd: "callajax", ajaxObj: orderAjax }, function (payment) {
                                            $('#loader').hide();
                                            if (payment.isSuccess && payment.result.code == 200) {
                                                closeModal();
                                            }
                                        });
                                    });
                                }
                            }
                            SHARED_SERVICE.openModal(obj);
                        }
                    });
        
                });
                
            }
        });
        
    });
    function createList(data) {
        var html = "";
        
        $.each(data, function (i, elem) {
            let status = elem.isAccepted ?  "Accepted":"Not Accepted";
            amount = amount + elem.price;
            html += `<div class="item-list">
            <div>
                <span >Date: `+elem.date+`</span>
                <span >Price: Rs.`+elem.price+`</span>
                <span >Status: `+status+`</span>
            </div>
            <div class="clearfix"></div>
            <p>Menu Items: `+elem.menuId.items+`</p>
            <p>Menu Special: `+elem.menuId.todaysSpecial+`</p>
        </div>`;
        });
        $('#totalAmount').html("Total: Rs. "+amount);
       
        $('.order-list').html(html);
    }
}