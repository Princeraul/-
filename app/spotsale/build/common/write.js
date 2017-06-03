// ajax 全局变量
var isSend = false;

//  隐藏浮层
function hide_floating() {
    $('.floating').removeClass('floatingActive');
}
//显示浮层
function show_floating() {
    $('.floating').addClass('floatingActive');
}

// 检测input[type='text']是否填写
function emptyInput(my) {
    $(my).each(function() {
        return $(this).val() == '' ? ($(this).addClass('input-error').attr('placeholder', '请填写此字段'), flag = 0, !1) : ($(this).removeClass('input-error'), flag = 1, 1);
    });
    return flag;
}
// 检测input[type='text']是否填写
function emptySelect(my) {
    $(my).each(function() {
        if ($(this).css('visibility') != 'hidden') {
            var index = $(this).children('option:selected').text();
            return index == '请选择' ? ($(this).addClass('input-error'), flag = 0, !1) : ($(this).removeClass('input-error'), flag = 1, 1);
        }
    });
    return flag;
}
// 监听键盘，只允许输入数字和小数点
function keypress(my) {
    $(my).keypress(function(event) {
        var keyCode = event.which;
        if (keyCode >= 48 && keyCode <= 57) {
            return true;
        } else {
            return false;
        }
    });
}

// 警告提示信息狂
function alertInfo(text, url) {
    show_floating();
    $('.floatSubox').removeClass('dNone');
    $('.floatSubox a').click(function() {
        $('.floatSubox').addClass('dNone');
        hide_floating();
    });
    if (typeof(time) != 'undefined' || typeof(url) != 'undefined') {
        var t = 3;
        $('.floatSubox_tit-cot').text(text + t + '秒后将跳转');
        $('.btnRed').attr('href', url);
        setInterval(function() {
            if (t > 0) {
                t--;
            } else {
                location.href = url;
            }
            $('.floatSubox_tit-cot').text(text + t + '秒后将跳转');
        }, 1000);
    } else {
        $('.floatSubox_tit-cot').text(text);
    }
}
// 发布任务错误提示
function writeError(code) {
    switch (code) {
        case -1: alertInfo('操作失败');break;

        case -1000: alertInfo('任务名称填写错误！');break;

        case -1100: alertInfo('单价填写错误');break;

        case -2000: alertInfo('二维码订单错误！');break;

        case -2100: alertInfo('行业填写错误！');break;

        case -2200: alertInfo('品牌填写错误！');break;

        case -3000: alertInfo('扫码流程错误！');break;

        case -3100: alertInfo('非必填属性填写错误！');break;

        case -4000: alertInfo('活动时间错误！');break;

        case -5000: alertInfo('活动类型错误！');break;

        case -6000: alertInfo('项目名称错误！');break;

        case -7000: alertInfo('礼品设置错误！');break;

        case -7100: alertInfo('礼品设置错误！');break;

        case -7200: alertInfo('礼品设置错误！');break;

        case -7300: alertInfo('礼品设置错误！');break;

        case -7300: alertInfo('礼品设置错误！'); break;

        case -8000: alertInfo('生产标号填写错误！'); break;

        case -8100: alertInfo('生产批次号填写错误！'); break;

        case -8200: alertInfo('生产许可号填写错误！');break;

    }
}

function closeBtn(my) {
    $('.floatSubox').addClass('dNone');
    hide_floating();
}

// 验证添加工厂信息
function addFactory(my, func) {
    var input = emptyInput($('#addFactory_form input[type=text]'));
    var select = emptySelect($('#addFactory_form select'));
    // 将新添加的工程信息插入到最后一个节点
    func = function(value) {
        var val = $('#factory_name').val();
        var index = $('select[name="factory_id"] option:last').attr('index') - 1;
        $('select[name="factory_id"] option:last').before('<option value=' + value + '>' + val + '</option>');
    };
    if (!input || !select) return;
    $.ajax({
        type: "post",
        url: COMMON.GOODSWRITE_URL,
        data: $('#addFactory_form').serialize(),
        success: function(msg) {
            if (msg.status) {
                func(msg.info.data);
                // 最大索引值
                var maxindex = $('select[name="factory_id"]').find("option:last").index();
                $('select[name="factory_id"]').prop('selectedIndex', maxindex - 1);
                hide_floating();
                $('.floatBox').addClass('dNone');
            } else {
                $('.Factoryerr').remove();
                var html = "<li class='Factoryerr'><span class='subTitle'></span><span style='text-align:left; color: red'>工厂信息错误</span></li>";
                $('.floatBox-btn').before(html);
            }
        }
    });
}
// 验证添加品牌
function addbrand(my, func) {
    var input = emptyInput($('#brand_form input[type=text]'));
    func = function(value) {
        var val = $('#brand_name').val();
        var index = $('select[name="brand_id"] option:last').attr('index') - 1;
        $('select[name="brand_id"] option:last').before('<option value=' + value + '>' + val + '</option>');
    };
    if (!input) return;
    $.ajax({
        type: 'post',
        url: COMMON.GOODSWRITE_URL,
        data: $('#brand_form').serialize(),
        success: function(msg) {
            if (msg.status) {
                func(msg.info.data);
                var maxindex = $('select[name="brand_id"]').find("option:last").index();
                $('select[name="brand_id"]').prop('selectedIndex', maxindex - 1);
                hide_floating();
                $('.floatBox').addClass('dNone');
            } else {
                $('.Factoryerr').remove();
                var html = "<li class='Factoryerr'><span class='subTitle'></span><span style='text-align:left; color: red'>品牌信息错误</span></li>";
                $('.floatBox-btn').before(html);
            }
        }
    });
}

//city() 复制 view Business/Door/register
function city(my, type) {
    projectValidation.isCategory('select[data-name="isCity"]');
    if ($(my).val() === 0) return;
    if (type == 2) return;
    var slt = $(my.parentNode).children('select');
    $(slt[2]).removeClass('InlineBlock').addClass('dNone');
    $.ajax({
        type: "post",
        url: COMMON.GOODSWRITE_URL,
        data: 'city=1&id=' + $(my).val(),
        success: function(msg) {
            var html = '';
            for (var i in msg.info.data) {
                html += '<option value="' + msg.info.data[i].id + '">' + msg.info.data[i].name + '</option>';
            }
            switch (type) {
                case 0:
                    $(slt[1]).html('<option value="0">请选择</option>');
                    $(slt[1]).append(html);
                    break;
                case 1:
                    $(slt[2]).html('<option value="0">请选择</option>');
                    var len = msg.info.data.length;
                    if (len !== 0) {
                        $(slt[2]).removeClass('dNone').addClass('InlineBlock');
                        $(slt[2]).append(html);
                    }
                    break;
            }
        }
    });
}

// 验证是否整除
function intDivision(my) {
    $(my).each(function() {
        var val = $(this).val();
        var rem = val % 100;
        keypress($(this));

        if (val === '' || rem) {
            $(this).addClass('input-error').next('span').removeClass('dNone');
            flag = 0;
            return false;
        } else {
            data += this.name + '=' + this.value + '&';
            $(this).removeClass('input-error').next('span').addClass('dNone');
            flag = 1;
        }
    });
    return flag;
}

function removeNode(element) {
    var len = $(element).parent().parent().find('li').length;
    if (len == 1) {
        alertInfo('亲，抱歉，至少保留一项');
    } else {
        $(element).parent().remove();
    }
}

function add(id, type) {
    var first_div = $('#' + id).children('div:last'),
        lenp = $('#' + id).find('div').length;
    $(':input').removeClass('input-error');
    var new_div = first_div.clone(true);
    switch (type) {
        case 0:
            var inputNode = first_div.find('input');
            new_div.find(':input').each(function(i) {
                $(this).val('');
            });
            inputNode.each(function() {
                var val = $(this).val();
                return val === '' ? ($(this).addClass('input-error'), flag = 0, !1) : ($(this).removeClass('input-error'), flag = 1, 1);
            });
            if (lenp >= cont) {
                show_floating();
                $('.floatSubox').removeClass('dNone');
                $('.floatSubox a').click(function() {
                    $('.floatSubox').addClass('dNone');
                    hide_floating();
                });
            } else {
                if (flag) {
                    first_div.parent('div').append(new_div).find('input').removeClass('input-error');
                }
            }
            break;
        case 1:
            if (bolck()) {
                new_div.find(':input[type=text]').each(function() {
                    $(this).val('');
                });
                if (lenp >= cont) {
                    alertInfo('已经达到最大添加产销地数');
                } else {
                    $('.floatSubox').addClass('dNone');
                    new_div.insertAfter(first_div);
                    new_div.find('input[type="number"]').val('');
                }
            } else {
                show_floating();
                $('.floatSubox').removeClass('dNone');
                $('.floatSubox_tit-cot').text('请正确填写所有信息');
            }
            break;
        case 2:
            var input = emptyInput('#gift input');
            var select = emptySelect('#gift select');
            var giftLen = $('#' + id).find('table tbody tr').length;

            var lastElement = $('#' + id).find('table tbody tr:last');
            var createElement = lastElement.clone(true);

            // 当奖项设置满10项时，提示最大条目限制
            if (giftLen >= cont) {
                show_floating();
                $('.floatSubox').removeClass('dNone');
                $('.floatSubox a').click(function() {
                    $('.floatSubox').addClass('dNone');
                    hide_floating();
                });
            } else {
                if (input && select) {
                    var N = ['一等奖', '二等奖', '三等奖', '四等奖', '五等奖', '六等奖', '七等奖', '八等奖', '九等奖', '十等奖'];
                    createElement.insertAfter(lastElement);
                    createElement.find('input[type=text]:not(:first)').each(function() {
                        $(this).val('');
                        createElement.find('td:eq(2) .stateInput, input[name="gift_price[]"]').remove();
                    });
                    createElement.find('td:eq(0) input').val(N[giftLen]);
                    createElement.find('td:eq(1) select').prop('selectedIndex', 0);
                    createElement.find('td:eq(2) input').attr('placeholder', '#中奖数量');
                }
            }
    }
}

function WriteBeforeSend(obj, text) {
    $(obj).css('cursor', 'not-allowed').attr('disabled', true).text(text?text:'正在提交中...');
}

function WriteComplete(obj, text) {
    $(obj).css('cursor', 'pointer').attr('disabled', false).text(text?text:'确认提交');
    isSend = false;
}


// remove or ok tips
function goosListsRemove(obj, id) {
    var text = $.trim($(obj).text());
    $.ajax({
        type: "get",
        url: COMMON.GOODLISTSREMOVE_URL,
        data: 'id=' + id,
        success: function(msg) {
            if (msg.status) {
                alertInfo(text + '成功', COMMON.GOODLISTS_URL);
            } else {
                alertInfo(text + '失败');
            }
        }
    });
}
