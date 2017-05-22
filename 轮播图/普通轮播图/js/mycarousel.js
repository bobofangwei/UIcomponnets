(function($) {
    var MyCarousel = {
        setup: function($elem, options) {
            this.$elem = $elem;
            this.settings = $.extend(true, $.fn.myCarousel.default, options);
            this.init();
        },
        //初始化dom元素
        init: function() {
            this.$ul = this.$elem.find(this.settings.carouselListSelector);
            this.$lis = this.$elem.find(this.settings.carouselItemSelector);
            this.direction = this.settings.direction === 'horizontal' ? true : false;
            this.slideCount = this.getSlideCount();
            this.isRunning=false;

            this.__initLayout();

            if (this.controls) {
                //显示控制按钮
                this.__initControls();
            }
        },
        __initLayout: function() {
            if (this.direction) {
                //横屏
                //默认间隔为10px
                this.itemWith = this.$lis[0].clientWidth + this.settings.slideSpace;
                this.$ul.width(this.itemWith * this.slideCount);
                this.$lis.each(function(){
                    $(this).css('float','left');
                });
            } else {
                //竖屏
                this.itemHeight = this.$lis[0].clientHeight + this.settings.slideSpace;
                this.$ul.height(this.itemHeight * this.slideCount);
            }
        },

        __initControls: function() {},
        prev: function() {},
        next: function() {},
        getSlideCount: function() {
            return this.$lis.length;
        }
    };
    $.fn.myCarousel = function(options) {
        return this.each(function() {
            var $this = $(this);
            var instance = $this.data('mycarousel');
            if (!instance) {
                instance = Object.create(MyCarousel);
                MyCarousel.setup($this, options);
                $this.data('mycarousel', instance);
            }
        });
    };
    $.fn.myCarousel.default = {
        carouselListSelector: '.carousel-list', //导航元素选择器
        carouselItemSelector: '.carousel-item',
        carouselControlSelector: '.carousel-control', //左右控制器按钮
        navigation: true, //是否显示导航菜单，默认为true
        controls: false, //是否显示左右播放按钮，默认为false
        scrollSpeed: 500, //滚动速度，默认500ms
        easing: 'ease', //动画缓动动画，默认为ease
        direction: 'horizontal', //水平方向滑动还是竖直方向，可选的有['horizontal','vertical']
        index: 0, //初始的时候显示第几屏，默认为0
        showSlideNum: 1, //显示li的个数
        moveSlideNum: 1, //移动li的个数
        auto: false, //是否自动滚动，默认为false
        slideSpace: 0, //每个slide之间的间隔，默认为0，单位是px
    };
})(jQuery);
