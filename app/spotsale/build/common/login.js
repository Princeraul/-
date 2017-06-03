var loginFlag = false;
// login提交btn添加中
function ajaxSubLoading(obj) {
    var value = $(obj).html();
    $(obj).html('' + value + '中...');
}

// login提交btn去掉’中‘
function ajaxSubHide(obj) {
    $(obj).html('登录');
    loginFlag = false;
}

function shake(o) {
    var $panel = $('.' + o);
    for (var i = 5; i >= 0; i--) {
        $panel.animate({'margin-left': -i}, 10 * i);
        $panel.animate({ 'margin-left': i}, 10 * i);
    }
}

function LoginSubmit(){
    var inputNode = $('#loginForm').find('input');

    var user = inputNode.eq(0),
        psw = inputNode.eq(1);
    var userValue = user.val(),
        pswValue = psw.val();

    if(!loginFlag){
        loginFlag = true;
        if (userValue === '') {
            $('.form_field').removeClass('shake');
            user.parent().addClass('shake');
            shake('shake');
            return false;

        } else if (pswValue === '') {
            $('.form_field').removeClass('shake');
            psw.parent().addClass('shake');
            shake('shake');
            return false;
        }
        $.ajax({
            type: 'post',
            url: COMMON.LOGIN_URL,
            data: $('#loginForm').serialize(),
            dataType: 'json',
            beforeSend: function(e) {
                ajaxSubLoading('#login-button');
                $('#login-button').attr({disabled: 'disabled' });
            },
            complete: function(){
                ajaxSubHide('#login-button');
                $('#login-button').attr({disabled: null });
            },
            success: function(objMsg) {
                ajaxSubHide('#login-button');
                $('#login-button').attr({disabled: null });

                var sCode = objMsg.info.code,
                    sReturn = objMsg.status;

                if (sReturn === 0) {
                    switch (sCode) {
                        case -999:
                            console.log('验证码错误');
                            break;
                        case -1300:
                            $('.form_field').removeClass('shake');
                            user.parent().addClass('shake');
                            shake('shake');
                            break;
                        case -2100:
                            $('.form_field').removeClass('shake');
                            psw.parent().addClass('shake');
                            shake('shake');
                            break;
                    }

                } else if (sReturn == 1) {
                    location.href = objMsg.url;
                }
            }
        });
    }
}

// 提交
$('#login-button').on('click',function(){LoginSubmit()});
$(document).keyup(function(event){
  if(event.keyCode == 13){
    $('#login-button').trigger('click');
  }
})
