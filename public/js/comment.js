(function () {
    $('#btn_submit').on('click',function(){
        $.ajax({
            type:'post',
            data:{
                cid:$(this).data('id'),
                content:$('#txt_content').val()
            },
            url:'/api/comment/post',
            success:function (res) {
                $('#txt_content').val('');
                console.log(res);
                showContent(res.data);
            }
        })
    });
}());

function showContent(res) {
    var _html = "";
    for(var i=0; i<res.length;i++){

    }
}