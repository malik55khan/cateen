METHODS['footer'] = function(){
    $('.footer-tab').click(function(){
        $('.footer-tab').removeClass('active');
        $(this).addClass('active');
        var id = $(this).attr('id');
        SHARED_SERVICE.renderTemplate('',id);
        
    });
    // SHARED_SERVICE.openModal(
    //     {
    //         top:'36%',
    //         height:"20%",
    //         button:{
    //             title:"Save Info",
    //             type:'submit',
    //             click:function(obj){obj()}
    //         }
    //     }
    //     );
    
}
