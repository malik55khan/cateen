METHODS['notification'] = function(){
    let ajaxObj = {
        url:SERVER_API.getNotifications,
        tokenRequired:true,
        type:"GET"
    };
    $('#loader').show();
    chrome.runtime.sendMessage({cmd:"callajax",ajaxObj:ajaxObj},function(res){
        console.log(res);
        $('#loader').hide();
        if(res.isSuccess && res.result.code==200){
            createList(res.result.data);
        }else{
            if(res.result.status == 401){
                $.toast().error("Token has expired, Please login again",'Error!');
                $('.logout-button').click();
            }
            else{
                $.toast().error(res.result.message,'Error!');
            }
        }
    });
    function createList(data){
        var html="";
        $.each(data,function(i,elem){console.log(elem)
            html+=`<div id="noti-`+elem._id+`" class="notification-item"><i role='`+elem._id+`' class='delete-btn fa fa-trash pointer pull-right'></i>`+elem.message+`<br>Comment: `+elem.comment+`</div>`;
        });
        $('.notification-list').html(html);
        $('.delete-btn').click(function(){
            var id = $(this).attr('role');
            deleteRecord(id);
        });
    }
    function deleteRecord(id){
        let ajaxObj = {
            url:SERVER_API.updateNotification+"/"+id,
            tokenRequired:true,
            type:"POST",
            data:{isDeleted:true}
        };
        $('#loader').show();
        chrome.runtime.sendMessage({cmd:"callajax",ajaxObj:ajaxObj},function(res){
            console.log(res);
            $('#loader').hide();
            if(res.isSuccess && res.result.code==200){
                $('#noti-'+id).remove()
            }
        });
    }
}