METHODS['userList'] = function () {
    $('.content-body').css({ 'height': "540px" });
    let ajaxObj = {
        url: SERVER_API.getAllUsers,
        tokenRequired:true,
        method: "GET",
    }
    $('#loader').show();
    chrome.runtime.sendMessage({cmd:"callajax",ajaxObj:ajaxObj},function(res){
        $('#loader').hide();
        console.log(res)
        if(res.isSuccess && res.result.code==200){
            createList(res.result.data);
        }else{
            $.toast().error(res.result.message,'Error!');
        }
    });
    function createList(users){
        let html="";
        $.each(users,function(i,user){
            let amount = 0;
            $.each(user.userOrder,function(o,order){
                if(!order.paymentVerified)
                amount+=order.price
            })
            html+=`<tr>
                <td>`+user.name+`</td><td>`+user.phone+`</td><td>`+amount+`</td>
            <tr>`;
        });
        $('#tbody').html(html);
    }
}