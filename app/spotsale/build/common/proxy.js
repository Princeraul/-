var Validation = {
    show: function(obj) {
        $(obj).siblings('.help-block').addClass('error-flag').css('opacity', 1);
    },
    hide: function(obj) {
        $(obj).siblings('.help-block').removeClass('error-flag').css('opacity', 0);
    },
    isEmpty: function(obj) {
        if ($(obj).val() === '') {
            Validation.show(obj);
        } else {
            Validation.hide(obj);
        }
    },
    // 验证手机号
    isTelphone: function(obj) {
        if (!$(obj).val().match(/^1[3|4|5|7|8]\d{9}$/)) {
            Validation.show(obj);
        } else {
            Validation.hide(obj);
        }
    },
    // 验证身份证
    isCard: function(obj) {
        if (!$(obj).val().match(/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/)) {
            Validation.show(obj);
        } else {
            Validation.hide(obj);
        }
    },
    // 验资姓名
    isName: function(obj) {
        if (!$(obj).val().match(/^[\u4e00-\u9fa5 ]{2,20}$/)) {
            Validation.show(obj);
        } else {
            Validation.hide(obj);
        }
    },
    // 组织机构
    isTextrue: function(obj) {
        if (!$(obj).val().match(/^[a-zA-Z0-9]{8}-[a-zA-Z0-9]$/)) {
            Validation.show(obj);
        } else {
            Validation.hide(obj);
        }
    },
    // 选择select
    isCategory: function(obj) {
        $(obj).find('select').each(function() {
            if ($(this).prop('selectedIndex') === 0) {
                $(obj).find('.help-block').addClass('error-flag').css('opacity', '1');
                return false;
            } else {
                $(obj).find('.help-block').removeClass('error-flag').css('opacity', '0');
            }
        });
    },
    // 时间
    isTime: function(obj) {
        if ($(obj).val() === '') {
            Validation.show(obj);
        } else {
            Validation.hide(obj);
        }
    }
};

/**
 * 检测用户名是否存在 fn
 */

function checkUserName(obj) {
    var username = $("input[name='username']").val();
    if (!username.match(/(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,16}$/)) {
        $("#check_user_error").removeClass().addClass('c-red error-flag').text("用户名必须字母或者数字或者符号的组合，且不能少于6位");
        return false;
    }

    WriteBeforeSend($(obj), '用户名检测中...');
    if (!isSend) {
        isSend = true;
        $.post(COMMON.PROXYCHECKUSER_URL, 'username=' + username, function(backdata) {
            if (backdata.code === 0) {
                $("input[name='id']").val(backdata.user.id);
                if (backdata.user.id === 0) {
                    $("#check_user_error").removeClass().addClass('c-cyan').text("用户名可以使用，将创建此用户，初始密码：nb123456");
                } else {
                    if (backdata.iscompany) {
                        $("#check_user_error").removeClass().addClass('c-red error-flag').text("该用户已经关联企业，不能创建");
                    } else {
                        $("#check_user_error").removeClass().addClass('c-red error-flag').text("该用户存在，不能关联此用户");
                    }
                }
            } else {
                alertInfo(backdata.msg);
            }
            WriteComplete('.check_user_exist', '检测用户名是否存在');
        }, "json");
    }
}

// 合同作废
$(".bt_delete").on("click",function(){
    $.post(COMMON.PROXYDELECT_URL, 'id='+ $(this).attr('data-value'),function(backdata){
        alertInfo(backdata.msg, COMMON.PROXYINDEX_URL);
    },"json");
});
/**
 * 文件上传
 */
function createFileUploader(btdom, uploadProgress, uploadSuccess, uploadError) {

    var w = isNaN($(btdom).attr("compress_width")) ? null : $(btdom).attr("compress_width");
    var h = isNaN($(btdom).attr("compress_height")) ? null : $(btdom).attr("compress_height");
    var action = $(btdom).attr("action");
    if (w) {
        action += "&w=" + w;
    }
    if (h) {
        action += "&h=" + h;
    }
    // 初始化Web Uploader
    var cp = {
        width: w,
        height: h,
        // 图片质量，只有type为`image/jpeg`的时候才有效。
        quality: isNaN($(btdom).attr("compress_quality")) ? 100 : $(btdom).attr("compress_quality"),
        // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
        allowMagnify: $(btdom).attr("compress_magnify") == 1 ? true : false,
        // 是否允许裁剪。
        crop: $(btdom).attr("compress_crop") == 1 ? true : false,
        // 是否保留头部meta信息。
        preserveHeaders: true,
        // 如果发现压缩后文件大小比原来还大，则使用原来图片
        // 此属性可能会影响图片自动纠正功能
        noCompressIfLarger: false,
        // 单位字节，如果图片大小小于此值，不会采用压缩。
        compressSize: 0
    };

    var uploader = WebUploader.create({
        // 选完文件后，是否自动上传。
        auto: true,
        duplicate: true,
        // swf文件路径
        swf: '../js/libs/Uploader.swf',
        // 文件接收服务端。
        server: action,
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: {
            id: btdom,
            multiple: false
        },
        // 只允许选择图片文件。
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        },
        compress: cp,
        sendAsBinary: false
    });
    // 文件上传过程中创建进度条实时显示。
    uploader.on('uploadProgress', function(file, percentage) {
        if (typeof uploadProgress === "function") {
            uploadProgress(percentage);
        }
    });
    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on('uploadSuccess', function(file, response) {
        if (typeof uploadSuccess === "function") {
            uploadSuccess(response);
        }
    });
    // 文件上传失败，显示上传出错。
    uploader.on('uploadError', function(file, reason) {
        if (typeof uploadError === "function") {
            uploadError(response);
        }
    });

    return uploader;
}

$(document).ready(function() {
    /**
     * 文件上传
     */
    $(".bt_img_uploader").each(function() {
        var dom = this;
        createFileUploader(dom, function() {}, function(backdata) {
            if (parseInt(backdata.code) === 0) {
                var name = $(dom).attr("name");
                $(dom).parent().parent().find("img[name='" + name + "']").attr("src", backdata.file.path);
                $(dom).parent().parent().find("input[name='" + name + "']").val(backdata.file.id);
            } else {
                alert(backdata.msg);
            }
        }, function(reason) {
            alert(reason);
        });
    });


    $('input[name="company_name"], input[name="company_address"], input[data-name="isEmpty"]').blur(function() {
        Validation.isEmpty(this);
    });

    $('input[name="link_phone"], input[name="corporation_telphone"]').blur(function() {
        Validation.isTelphone(this);
    });

    $('input[name="corporation_card"]').blur(function() {
        Validation.isCard(this);
    });

    $('input[name="corporation_name"], input[name="link_name"]').blur(function() {
        Validation.isName(this);
    });

    $('input[name="company_organize"]').blur(function() {
        Validation.isTextrue(this);
    });

    // 提交
    $(".bt_submit").click(function() {
        $('input[name="company_name"], input[name="company_address"], input[data-name="isEmpty"]').trigger('blur');
        $('input[name="link_phone"], input[name="corporation_telphone"]').trigger('blur');
        $('input[name="corporation_card"]').trigger('blur');
        $('input[name="corporation_name"], input[name="link_name"]').trigger('blur');
        $('input[name="company_organize"]').trigger('blur');
        $(".check_user_exist").trigger('blur');

        Validation.isCategory('#proxytype');
        Validation.isTime('input[data-name="isTime"]');
        var flagLen = $('.error-flag').length;

        if (flagLen > 0) {
            alertInfo('请填写完整的信息');
            return false;
        }

        WriteBeforeSend($(this));
        if (!isSend) {
            isSend = true;
            $.post($('form').attr("action"), $('form').serialize(), function(backdata) {
                if(backdata.code < 0) {
                    alertInfo(backdata.msg);
                }else {
                    alertInfo(backdata.msg, COMMON.PROXYINDEX_URL);
                }
                isSend = false;
                WriteComplete('.bt_submit');
            }, "json");
        }

    });
    // 取消
    $(".bt_cancel").click(function() {
        if (history.length > 1) {
            history.back();
        }
    });

    var postdata = {
        kid: 3504,
        pid: 0,
    };
    var posturl = COMMON.PROXYLINKAGE_URL;
    $("select[name='type1']").load(posturl, postdata);

    $("select[name='type1']").on("change", function() {
        var postdata = {
            kid: 3504,
            pid: $(this).val()
        };
        $('#proxytype').find('.help-block').removeClass('error-flag').css('opacity', '0');
        $("select[name='type2']").empty().load(posturl, postdata);
        $("select[name='type3']").empty();
    });
    $("select[name='type2']").on("change", function() {
        var postdata = {
            kid: 3504,
            pid: $(this).val()
        };
        $("select[name='type3']").empty().load(posturl, postdata);
        $('#proxytype').find('.help-block').removeClass('error-flag').css('opacity', '0');
    });

    // 检测用户名是否存在
    $(".check_user_exist").on("click", function() {
        checkUserName('.check_user_exist');
    });
    $('input[name="username"]').on('blur', function() {
        setTimeout(function(){
            $(".check_user_exist").trigger('click');
        },0);
    });

    // 重置密码
    $("#bt_reset_pwd").on("click", function() {
        if (confirm("确认重置密码")) {
            $.post(COMMON.PROXYRESRT_URL, 'id=' + $("input[name='id']").val(), function(backdata) {
                alert(backdata.msg);
            }, "json");
        }
    });

    // 角色赋值id
    $("#groupBox").on("change","input[name='group_id']",function() {
        var groups_ids = "";
        $("input[name='group_id']:checked").each(function() {
            groups_ids += $(this).val() + ",";
        });
        $("input[name='groups']").val(groups_ids);
    });

    // 代理修改密码
    $('.affirm').on('click', function() {
        var flag = true;
        if($('input:eq(0)').val() === ''){
            $('.errTip').slideDown().find('span').text('请填写原始密码');
            flag = false;
            return false;
        }else if($('input[name="password"]').val() !== $('input[name="repassword"]').val()) {
            $('.errTip').slideDown().find('span').text('新密码和确认新密码两次输入不一致');
            flag = false;
            return false;
        }else if($('input[name="verify"]').val() === ''){
            $('.errTip').slideDown().find('span').text('请填写验证码');
            flag = false
            return false;
        }
        if (flag) {
            $.ajax({
                type: "post",
                url: COMMON.PASSWORD_URL,
                data: $('#PasswordForm').serialize(),
                dataType: 'json',
                success: function(backdata) {
                    if (!backdata.code) {
                    	alertInfo('密码修改成功');
                    	$('input').each(function(){
                    		$('input').val('');
                    	});
                    } else {
                        alertInfo(backdata.msg);
                    }
                }
            });
        }
    });
});
