'use strict';

function SearchVague(eleID, url, backcode) {
    // 模糊匹配list容器
    this.url = url;
    this.backcode = backcode;
    this.inputId = $(eleID).find('input[name="business_uid"]');
    this.appendUL = $(eleID).find('.appendUL');
    // 文本域模糊搜索框
    this.input = $(eleID).find('.searchVagueInput');
}

SearchVague.prototype.getContent = function() {
	var self = this;
    this.input.on('keyup', function() {
        var inputValue = $.trim($(self.input).val());
        if(inputValue === '') {
            self.appendUL.hide().html('');
            return false;
        }
		$.post(self.url, 'company_name='+$(this).val()+'&only_son=1', function(backdata) {
			html = '';
            for(var i in backdata.companys) {
                company = backdata.companys[i];
                html += "<li class='item' data-id=" + company.id + ">" + company.company_name + "</li>";
            }

	        // 匹配到显示对应数据
	        if (html !== "") {
	    		self.appendUL.show().html(html);
	    	} else {
	    		html = "<li style='margin: 5px;'>对不起，没有匹配到数据</li>";
	    		self.appendUL.show().html(html);
	    	}
		});
    });

	// 调用 mouseenter click事件
	this.getFocus();
	this.getCon();
	this.keyDown();
};

SearchVague.prototype.getCapital = function() {
	var self = this;
    this.input.on('keyup', function() {
        var inputValue = $.trim($(self.input).val());
        if(inputValue === '') {
            self.appendUL.hide().html('');
            return false;
        }
		$.post(self.url, 'company_name='+$(this).val(), function(backdata) {
			html = '';
            for(var i in backdata.companys) {
                company = backdata.companys[i];
                html += "<li class='item'";
                html += " data-id=" + company.id;
                html += " data-company-address=" + company.company_address;
                html += " data-company-organize=" + company.company_organize;
                html += " data-link-name=" + company.link_name;
                html += " data-link-phone=" + company.link_phone + ">" + company.company_name;
                html += "</li>"
            }

	        // 匹配到显示对应数据
	        if (html !== "") {
	    		self.appendUL.show().html(html);
	    	} else {
	    		html = "<li style='margin: 5px;'>对不起，没有匹配到数据</li>";
	    		self.appendUL.show().html(html);
	    	}
		});
    });

	// 调用 mouseenter click事件
	this.getFocus();
	this.getCon();
	this.keyDown();
};

// 事件委托给appendul 绑定item mouseover 事件
SearchVague.prototype.getFocus = function() {
	this.appendUL.on('mouseenter', '.item', function() {
		$(".item").removeClass("itemhover");
		$(this).addClass("itemhover");
	});
    this.appendUL.on('mouseleave', '.item', function() {
		$(this).removeClass("itemhover");
	});
};


// 事件委托给appendul 绑定item  click事件
SearchVague.prototype.getCon = function() {
	var self = this;
	this.appendUL.on('click', '.item', function() {
		var value = $(this).text();
		self.input.val(value);

        self.appendEle(self, $(this));
		self.appendUL.hide().html("");
	});
};

// 赋值
SearchVague.prototype.appendEle = function(obj, ele) {
    if(obj.backcode === 1) {
        $("#groupBox").load(COMMON.PROXYJOBSEARCHCHILD_URL, {id: ele.attr('data-id')});

    } else if(obj.backcode === 2) {
        $('#addCapital').fadeIn();
        $('#ret_company_address').val(ele.attr('data-company-address'));
        $('#ret_company_organize').val(ele.attr('data-company-organize'));
        $('#ret_link_name').val(ele.attr('data-link-name'));
        $('#ret_link_phone').val(ele.attr('data-link-phone'));
    }
    obj.inputId.val(ele.attr('data-id'));
};

// 键盘‘上’
SearchVague.prototype.movePrev = function() {
	this.input.blur();
	var index = $('.itemhover').prevAll().length;
	if (index === 0) {
        $(".item").removeClass('itemhover').eq($(".item").length - 1).addClass('itemhover');
    } else {
        $(".item").removeClass('itemhover').eq(index - 1).addClass('itemhover');
    }
};

SearchVague.prototype.moveNext = function () {
    var index = this.appendUL.find('.itemhover').prevAll().length;

    if (index === $(".item").length - 1) {
        $(".item").removeClass('itemhover').eq(0).addClass('itemhover');
    } else {
        $(".item").removeClass('itemhover').eq(index + 1).addClass('itemhover');
    }
};

SearchVague.prototype.dojob = function () {
    var self = this;
    var $this = this.appendUL.find('.itemhover');

	if(this.appendUL.is(':hidden')) {
		return false;
	}
    this.input.blur();
    var value = this.appendUL.find('.itemhover').text();
    this.appendUL.parent().find('.searchVagueInput').val(value);

    this.appendEle(self, $this);

    this.appendUL.hide().html("");
};

// 监听键盘执行对应事件
SearchVague.prototype.keyDown = function() {
	var self = this;
	var $append = this.appendUL;
	$(document).on('keydown', function(e) {
		e = e || window.event;
		var keyCode = e.which ? e.which : e.keycode;
		switch (keyCode) {
			case 38:
				if($.trim($append.html()) === '') {
					return;
				}
				self.movePrev();
				break;

			case 40:
				if($.trim($append.html()) === '') {
					return;
				}
				self.input.blur();
				if($append.find('.item').hasClass('itemhover')) {
					self.moveNext();
				} else {
					$append.find('.item').removeClass('itemhover').eq(0).addClass('itemhover');
				}
				break;

			case 13:
				self.dojob();
		}
	});
};

// new SearchVague('#search2').getContent();
