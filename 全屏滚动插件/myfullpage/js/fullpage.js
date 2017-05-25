(function($) {
    var MyFullpage = {
        setup: function($elem, options) {
            this.$elem = $elem;
            this.settings = $.extend(true, $.fn.MyFullPage.default, options);
            this.init();
        },
        //初始化dom结构，布局，分页并绑定事件
        init: function() {
            this.sections = this.$elem.find(this.settings.selectors.sections);
            this.section = this.$elem.find(this.settings.selectors.section);

            this.direction = this.settings.direction === 'vertical' ? true : false;
            this.sectionCount = this.getSectionCount();
            this.curIndex = (this.settings.index >= 0 && this.settings.index <= this.pageCount - 1) ? this.settings.index : 0;

            this.isRunning = false;

            //如果是横屏
            if (!this.direction) {
                this.__initLayout();
            }

            //导航元素
            if (this.settings.navigation) {
                this.__initNavigator();
            }
            this.__initEvent();

        },
        __initEvent: function() {
            //监听滚轮事件
            $(window).on('mousewheel', function(e, delta) {
                if(delta>0){
                    //up
                    this.moveSectionUp();
                }else{
                    //down
                    this.moveSectionDown();
                }
            });
             
            if (this.settings.keyboard) {
                //开启键盘控制

            }
        },
        //获取滑动页面数量
        getSectionCount: function() {
            return this.section.length;
        },
        //获取滑动的高度（vertical）/宽度(horizontal)
        sectionLength: function() {
            return this.direction === 'vertical' ? this.$elem.height() : this.$elem.width();
        },
        moveSectionDown: function() {
            if (this.isRunning) {
                return;
            }
            this.$sections.
        },
        moveSectionUp: function() {
            if(this.isRunning){
                return;
            }
        },
        moveTo: function(section) {

        },
        //
        afterLoad: function(index) {

        },
        onLeave: function(index, nextIndex, direction) {

        },
        //针对横屏的处理
        __initLayout: function() {
            this.sections.width(this.pageCount * 100 + '%');
            var sectionWidth = (100 / this.pageCount).toFixed(2) + '%';
            this.section.each(function() {
                $(this).width(sectionWidth).css('float', 'left');
            });
        },
        //添加导航控件
        __initNavigator: function() {
            var navTabs = document.createElement('ul'),
                str = '';
            navTabs.className = this.settings.selectors.navTabs;
            for (var i = 0; i < this.sectionCount; i++) {
                str += '<li class="nav-item"></li>'
            }
            navTabs.innerHTML = str;
            this.$elem.append(navTabs);
            this.navTabs = this.$elem.find('.nav-item');
        },
        __navActive: function() {
            this.navTabs.eq()
        }

    };
    $.fn.MyFullPage = function(options) {
        return this.each(function() {
            var me = $(this),
                instance = me.data('MyFullpage');
            //单例模式
            if (!instance) {
                //instance=new MyFullPage(me,options);
                instance = Object.create(MyFullpage);
                instance.setup(me, options);
                me.data('MyFullPage', instance);
            }
        });
    };
    $.fn.MyFullPage.default = {
        selectors: {
            sections: '.sections',
            section: '.section',
            navTabs: 'nav-tabs',
            active: '.active'
        },
        index: 0, //默认索引从0开始
        easing: 'ease', //默认动画缓动函数
        scrollingSpeed: 700, //滚动速度，默认单位是毫秒
        loop: false, //是否循环滚动
        navigation: true, //是否显示分页
        keyboard: true, //是否键盘控制
        direction: 'vertical', //horizontal
        callback: '', //屏幕滑动之后的回调
    };
})(jQuery);
