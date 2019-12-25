METHODS['adminSetting'] = function (params) {
    $('.content-body').css({ 'height': "540px" });
    var ajaxObj = {
        url: SERVER_API.getSettings,
        tokenRequired: true,
        type: "GET"
    };
    var isMenuCreated = false;
    $('#loader').show();
    chrome.runtime.sendMessage({ cmd: "callajax", ajaxObj: ajaxObj }, function (res) {
        if (res.isSuccess && res.result.code == 200 && res.result.data) {
            $('#UPI').val(res.result.data.UPI);
            $('#phone').val(res.result.data.phone);
            $('#price').val(res.result.data.price)
            $('#isButtonActive').attr('checked', res.result.data.isPaymentActive)
        }
        $('#loader').hide();
    });
    $('#file').change(function () {
        $('#loader').show();
        var data = new FormData();
        data.append('file', $('#file')[0].files[0]);
        $.ajax({
            url: SERVER_API.uploadQRCode,
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            method: 'POST',
            type: 'POST', // For jQuery < 1.9
            success: function(data){
                $('#loader').hide();
            },error: function(data){
                $('#loader').hide();
            }
        });
        
    });
    $('#settingForm').submit(function (e) {
        e.preventDefault();
        let data = {
            phone:$('#phone').val(),
            UPI:$('#UPI').val(),
            isPaymentActive:$('#isButtonActive').is(":checked"),
        }
        
        var ajaxObj = {
            url: SERVER_API.uploadSetting,
            tokenRequired: true,
            type: "POST",
            data:data
        };
       
        $('#loader').show();
        chrome.runtime.sendMessage({ cmd: "callajax", ajaxObj: ajaxObj }, function (res) {
            console.log('jhkhk',res);
            if (res.isSuccess && res.result.code == 200 && res.result.data) {
                SHARED_SERVICE.renderTemplate("", "adminHome");
                $.toast().success('Setting updated successfully','Success');
            }
            $('#loader').hide();
        });
    });
    $('#newPostForm #go-back-btn').click(function () {
        SHARED_SERVICE.renderTemplate("", "adminHome", params);
    });
    $('#intimateButton').click(function(){
        var ajaxObj = {
            url: SERVER_API.requestPayment,
            tokenRequired: true,
            type: "GET"
        };
       
        $('#loader').show();
        chrome.runtime.sendMessage({ cmd: "callajax", ajaxObj: ajaxObj }, function (res) {
            SHARED_SERVICE.renderTemplate("", "adminHome", params);
            $.toast().success('Intimation has been sent to all employees','Success');
            $('#loader').hide();
        });
    });
}