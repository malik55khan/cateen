METHODS['register'] = function () {
    $('.content-body').css({ 'height': "485px" });
    $('#subscriptionForm').submit(function (e) {
        e.preventDefault();
        var formData = new FormData($('#subscriptionForm')[0]);
        var outputLog = {}, iterator = formData.entries(), end = false;
        while (end == false) {
            var item = iterator.next();
            if (item.value != undefined) {
                outputLog[item.value[0]] = item.value[1];
            } else if (item.done == true) {
                end = true;
            }
        }
        console.log(outputLog);
        if ($.doValidate(this)) {
            //var regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            let ajaxObj = {
                url: SERVER_API.register,
                data: outputLog,
                method: "POST",
            }
            $('#loader').show();
            chrome.runtime.sendMessage({cmd:"callajax",ajaxObj:ajaxObj},function(res){
                $('#loader').hide();
                console.log(res)
                if(res.isSuccess && res.result.code==200){
                    $.toast().success(res.result.message,'Success!');
                    SHARED_SERVICE.renderTemplate("","login");
                }else{
                    $.toast().error(res.result.message,'Error!');
                }
            });

        }
    });
}