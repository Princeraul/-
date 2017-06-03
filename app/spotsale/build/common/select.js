//模拟select 用于数据中心
$('.dropdown').on('click', function(e){
    var show = $(this).find('h3'),
        nodeUl = $(this).children('.mutliSelect').children();

    e.stopPropagation();
    $('.dropdown h3').not(show).removeClass('active');
    $('.dropdown .mutliSelect ul').not(nodeUl).hide();
    show.toggleClass('active');
    nodeUl.slideToggle(400);
    nodeUl.on('click', 'li', function(e){

        e.stopPropagation();
        show.text($(this).text());
        nodeUl.slideUp();
        show.toggleClass('active');
    });
    $(document).on('click', function(){
        $('.dropdown h3').removeClass('active');
        nodeUl.slideUp();
    });
});
