
$('nav[nicescroll="true"]').niceScroll({
	 cursorcolor:"transparent",
	 cursoropacitymax:1,
	 touchbehavior:false,
	 cursorwidth:"5px",
	 cursorborder:"0",
	 cursorborderradius:"5px"
});

// 账户管理 点击查看大图
$('.apt li').each(function(e){
    $(this).on('click', function(){
        var index = $(this).index();
        $('.floating').addClass('floatingActive').show();
        $('.apt_big li').eq(index).show();
    });
});
// 账户管理 大图点击关闭
$('.apt_close').on('click', function(){
    $('.floating').hide();
    $('.apt_big li').hide();
});

/*
*判断是否是IE浏览器
*是IE浏览器显示默认复选框
*/
var lessThenIE9 = function () {
    var UA = navigator.userAgent,
        isIE = UA.indexOf('MSIE') > -1,
        v = isIE ? /\d+/.exec(UA.split(';')[1]) : 'no ie';
        return v < 9;
}();
if(lessThenIE9){
    $("label").removeClass('check-blue');
}

// 数据报表 tab切换
$('.tableInput > label').on('click', function() {
    var key = $(this).index();
    $('.tableChart').hide().eq(key).show();
});

// 数据中心 下拉菜单 ajax请求
