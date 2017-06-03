// 发布活动状态全局编辑变量
var statusFlag;
var overlapHtml = '';

var publishItem = {
    addProjectFloat: function(obj) {
        var $thisValue = obj.val(),
            $thisLastValue = obj.find('option:last').val(),
            $thisIndex = obj.attr('data-index');

            if($thisValue === $thisLastValue){
            show_floating();
            $('.floatBox').eq($thisIndex).removeClass('dNone').find('input[type=text]').val('');
        }
    },
    closeProjectFloat: function(obj) {
        var thisCloseName = obj.attr('close-name');
        hide_floating();
        $('.floatBox').addClass('dNone');
        $(thisCloseName).prop('selectedIndex', 0);
    },
    addProperty: function(obj) {
        var parentElement = $(obj).parent().parent(),
            $thisElement = parentElement.find('li[data-event=addProperty]:last'),
            cloneElement = $thisElement.clone();
            // 清空克隆value
            cloneElement.find(':input').each(function() {
                $(this).val('');
            });
        parentElement.find('div').append(cloneElement);
    },
    removeItem: function(obj, id) {
        var text = $.trim($(obj).text());
        $.ajax({
            type: "get",
            url: COMMON.GOODLISTSREMOVE_URL,
            data: 'item_id=' + id,
            success: function(msg) {
                if (msg.status) {
                    alertInfo(text + '成功', COMMON.GOODLISTS_URL);
                } else {
                    alertInfo(text + '失败');
                }
            }
        });
    },
    generate: function(obj, id){
        var text = $.trim($(obj).text());
        $.ajax({
            type: "get",
            url: COMMON.GOODGENRATE_URL,
            data: 'id=' + id,
            success: function(msg) {
                if (msg.status) {
                    alertInfo(text + '成功', COMMON.GOODLISTS_URL);
                } else {
                    alertInfo(text + '失败');
                }
            }
        });
    },
    review: function(obj, id) {
        var text = $.trim($(obj).text());
        $.ajax({
            type: "get",
            url: COMMON.GOODREVIEW_URL,
            data: 'item_id=' + id + '&pass=1',
            success: function(msg) {
                if (msg.status) {
                    alertInfo(text + '成功', COMMON.GOODLISTS_URL);
                } else {
                    alertInfo(text + '失败');
                }
            }
        });
    },
    notReview: function(obj, id) {
        var text = $.trim($(obj).text());
        $.ajax({
            type: "get",
            url: COMMON.GOODNOTREVIEW_URL,
            data: 'item_id=' + id + '&pass=0',
            success: function(msg) {
                if (msg.status) {
                    alertInfo(text + '成功', COMMON.GOODLISTS_URL);
                } else {
                    alertInfo(text + '失败');
                }
            }
        });
    },
    trace: function(ele) {
        if (ele.checked) {
            $('#trace-info :input').each(function(index) {
                switch (index) {
                    case 0:
                        $(this).attr('name', 'production_number');
                        break;
                    case 1:
                        $(this).attr('name', 'production_type');
                        break;
                    case 2:
                        $(this).attr('name', 'production_deny');
                        break;
                }
            });
            $('#trace-info').fadeIn();
        } else {
            $('#trace-info :input').each(function() {
                $(this).attr('name', null);
            });
            $('#trace-info').fadeOut();
        }
    },
    selectCommodity: function(obj) {
        var html, attrType;
        $('#must_attr').html('');
        html = '<h3 class="boxtitle"><font class="c-winered">*&nbsp;</font>商品属性<h3/>'

        projectValidation.isCategory('select[name="goods_id"]');
        if(obj.prop('selectedIndex') === 0) {
            $('#must_attr').html('');
            return false;
        }
        attrType = $.parseJSON(obj.find('option:selected').attr('data-type'));

        for(var i in attrType) {
            html += '<li>';
            html += '<lable class="patitle">' + attrType[i].name + '：</label>';
            html += '<input class="input-default" data-name="isProEmpty" disabled value="' + attrType[i].value + '"/>';
        }

        $('#must_attr').append(html);
        publishItem.selectQrcodeOrder(obj.find('option:selected').val());
    },
    selectQrcodeOrder: function(val) {
        var html;
        $('#qrcode_order').html('');
        html = '<h3 class="boxtitle"><font class="c-winered">*&nbsp;</font>选择绑定二维码</h3>';

        $.ajax({
            type: "get",
            url: COMMON.QRCODEORDER_URL,
            data: 'goods_id='+val,
            success: function(msg) {
                if(msg.info.data) {
                    var backdata = msg.info.data;
                    html += '<table class="table">';
                    html += '<thead><tr>';
                    html += '<th width="10%">#</th>';
                    html += '<th width="30%">订单号</th>';
                    html += '<th width="30%">数量</th>';
                    html += '<th width="30%">防窜货地址</th>';
                    html += '</tr><thead><tbody>';
                    for(var i in backdata){
                        var overlapAddress = '';
                        if(backdata[i]['address']) {
                            overlapAddress = backdata[i]['address'].join('、');
                        }else{
                            overlapAddress = '<font class="c-red">未开启窜货</font>';
                        }

                        html += '<tr>';
                        html += '<td><input class="m0" type="checkbox" name="qrcode_order_id[]" value="' + backdata[i]['id'] +'"/></td>';
                        html += '<td>'+backdata[i]['number'] +'</td>';
                        html += '<td>' + backdata[i]['num'] +'</td>';
                        html += '<td>' + overlapAddress + '</td>';
                        html += '<td>' + backdata[i]['num'] + '</td>';
                        html += '</tr>';
                    }
                    html += '</tbody></table>';
                    $('#qrcode_order').append(html);

                }else {
                    html += '<li class="c-winered qrcodeList">'
                    html += '<label class="patitle mr5">很抱歉，该商品未绑定二维码哦！</label>';
                    html += '<br><a href="'+ COMMON.QRCODEINDEX_URL + '" class="btnCyan">';
                    html += '立即绑定</a></li>';
                    $('#qrcode_order').append(html);
                }
            }
        });
    },
    // 是否勾选活动
    isGamesON: function(ele) {
        if (ele.checked) {
            $('#gift').fadeIn();
            $('#create_time_start').attr('name', 'start_time');
            $('#create_time_end').attr('name', 'end_time');
        }else {
            $('#gift').fadeOut();
            $('#create_time_start').attr('name', null);
            $('#create_time_end').attr('name', null);
        }
    },
    // 是否开启串货功能
    isOverlapON: function(ele) {
        // 保存防窜货元素
        if(overlapHtml === '') {
            overlapHtml = $('#overlap').html();
        }
        if(ele.checked) {
            $('#overlap').fadeIn().html(overlapHtml);
        }else {
            $('#overlap').fadeOut().html('');
        }
    },
    // 添加活动奖项
    addGames: function(eleId) {
        // 最大添加奖品数量
        var errorTips;
        var count = 10;
        var len = $(eleId).find('table tbody tr').length;
        var lastElement = $(eleId).find('table tbody tr:last');
        var createElement = lastElement.clone(true);
        var N = ['一等奖', '二等奖', '三等奖', '四等奖', '五等奖', '六等奖', '七等奖', '八等奖', '九等奖', '十等奖'];

        // 判断上一个活动是否正确填写
        $(eleId).find('table select, table input[type="text"]').each(function() {
            if($(this).is('select')) {
                $(this).on('change', function() {
                    projectValidation.isCategory($(this));
                });
                projectValidation.isCategory($(this));
            }else {
                projectValidation.isProEmpty($(this));
            }
        });

        errorTips = $('#gift .table .input-error').length;
        if(errorTips) return false;

        if(len >= count) {
            alertInfo('已经超过奖品最大限制啦!');
            return false;
        }

        createElement.insertAfter(lastElement);
        createElement.find('input[type=text]:not(:first)').each(function() {
            $(this).val('');
            createElement.find('td:eq(2) .stateInput, input[name="gift_price[]"]').remove();
        });
        createElement.find('td:eq(0) input').val(N[len]);
        createElement.find('td:eq(1) select').prop('selectedIndex', 0);
        createElement.find('td:eq(2) input').attr('placeholder', '#中奖数量');
    }
};

var projectValidation = {
    show: function(obj) {
        $(obj).addClass('input-error');
    },
    hide: function(obj) {
        $(obj).removeClass('input-error');
    },
    // 判断是否为空
    isProEmpty: function(obj) {
        if ($(obj).val() === '') {
            projectValidation.show(obj);
        } else {
            projectValidation.hide(obj);
        }
    },
    // 选择select
    isCategory: function(obj) {
        if($(obj).prop('selectedIndex') === 0) {
            projectValidation.show(obj);
        } else {
            projectValidation.hide(obj);
        }
    },
    //时间空间验证
    isTime: function(obj) {
        if($(obj).val() === '') {
            projectValidation.show(obj);
        } else {
            projectValidation.hide(obj);
        }
    },
    // 活动开启验证是否正确填写
    isGamesONCheck: function() {
        if($('#isGamesON').prop('checked')){
            // 活动时间
            $('input[data-name="isTime"]').each(function(){
                projectValidation.isTime($(this));
            });
            // 活动奖项设置提交验证
            $('#gift table select, #gift table input[type="text"]').each(function() {
                if($(this).is('select')) {
                    $(this).on('change', function() {
                        projectValidation.isCategory($(this));
                    });
                    projectValidation.isCategory($(this));
                }else {
                    $(this).on('blur', function() {
                        projectValidation.isProEmpty($(this));
                    });
                    projectValidation.isProEmpty($(this));
                }
            });
        }else {
            $('#gift input, #gift table select').each(function(){
                $(this).removeClass('input-error');
            });
        }
    },
    isTraceCheck: function() {
        if($('#traceCheck').prop('checked')) {
            $('#trace-info').find('input').each(function() {
                projectValidation.isProEmpty($(this));
            });
        }else {
            $('#trace-info').find('input').each(function() {
                $(this).removeClass('input-error');
            });
        }
    },
    // 活动编辑disabled
    isEditDisabled: function(){
        if(statusFlag === '1') {
            $(':input:not(#create_time_start,#create_time_end)').each(function(){
                if($(this).attr('name') === 'gift_num[]') {
                    $(this).attr('disabled', null);
                }else if($(this).attr('name') === 'qrcode_order_id[]'){
                    if($(this).prop('checked')){
                        $(this).attr('disabled', true);
                    }
                }else {
                    $(this).attr('disabled', true);
                }
            });
        }
    }
};

$(function(){
    // 监听光标事件
    $('input[data-name="isProEmpty"]').blur(function(){
        projectValidation.isProEmpty(this);
    });

    $('select[data-name="isCategory"]').change(function(){
        projectValidation.isCategory(this);
    });

    // 添加工厂and 添加品牌
    $('select[data-event="addPrject"]').on('change', function() {
        publishItem.addProjectFloat($(this));
    });
    // 添加工厂 and 添加品牌 取消按钮 设置索引值为0
    $('.closeProject').on('click', function() {
        publishItem.closeProjectFloat($(this));
    });
    // 添加商品属性
    $('.addProperty').on('click', function() {
        publishItem.addProperty($(this));
    });
    // 添加放窜货
    $('#overlap').on('click', '.addOverlap', function() {
        publishItem.addProperty($(this));
    });
    // 绑定商品二维码
    $('select[data-event="selectCommodity"]').on('change', function() {
        publishItem.selectCommodity($(this));
    });

    // 提交
    $('.checkProjectBtn').on('click', function() {
        var alertText = $(this).attr('data-text');
        // 先客户端验证
        $('input[data-name="isProEmpty"]').trigger('blur');
        $('select[data-name="isCategory"]').trigger('change');
        $('input[data-name="isTime"]').on('blur', function() {
            projectValidation.isTime($(this));
        });
        projectValidation.isCategory('select[data-name="isCity"]');
        // 是否选择关联商品
        projectValidation.isCategory('select[name="goods_id"]');
        // 活动开启则验证，不开启则不验证
        projectValidation.isGamesONCheck();
        // 防伪溯源开启则验证，不开启则不验证
        projectValidation.isTraceCheck();
        var flagLen = $('.input-error').length;
        if(flagLen > 0) {
            alertInfo('请填写完整的内容');
            return false;
        }
        // 清除所有disabled
        $(':input').each(function(){
            $(this).attr('disabled', null);
        });

        if (!isSend) {
            isSend = true;
            $.ajax({
                type: "post",
                url: COMMON.GOODSCHECK_URL,
                data: $('#fm1').serialize(),
                beforeSend: function() {
                    WriteBeforeSend('.btnBlue');
                    projectValidation.isEditDisabled();
                },
                complete: function() {
                    WriteComplete('.btnBlue');
                    projectValidation.isEditDisabled();
                },
                success: function(msg) {
                    if (msg.status) {
                        alertInfo(alertText?alertText:'发布成功', COMMON.WRITEINDEX_URL);
                    } else {
                        writeError(msg.info.code);
                    }
                    projectValidation.isEditDisabled();
                }
            });
        }
    });
});
