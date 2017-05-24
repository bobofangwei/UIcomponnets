(function($) {
    var MyCarousel = {
        setup: function($elem, options) {
            this.$elem = $elem;
            this.settings = $.extend(true, {}, $.fn.myCarousel.default, options);
            this.init();
        },
        //初始化dom元素
        init: function() {
            this.$ul = this.$elem.find(this.settings.carouselListSelector);

            //经过测试发现，使用find,querySelectorAll获得的Nodelist是静态的
            //this.$lis = this.$elem.find(this.settings.carouselItemSelector);
            //this.lis=this.$elem[0].querySelectorAll(this.settings.carouselItemSelector);
            //getElementsByTagName获得的则是动态的NodeList
            //在本程序中，需要根据li的动态改变调整幻灯片列表的长度，因此需要其为动态的
            this.lis = this.$elem[0].getElementsByTagName('li');

            //幻灯片滑动方向，默认为水平方向
            this.direction = this.settings.direction === 'horizontal' ? true : false;
            this.slideCount = this.getSlideCount();

            //三个取值
            //undefined：代表动画未在执行
            //prev:代表向前的动画正在执行
            //next：代表向后的动画正在执行
            this.runningDirection = undefined;

            this.__initLayout();

            if (this.settings.controls) {
                //显示控制按钮
                this.__initControls();
                //初始化控制按键中的响应事件
                this.__initControlEvent();
            }
            this.__initUlEvent();

            if (this.settings.auto) {
                this.__autoPlay();
                var self = this;
                //如果鼠标位于ul上方的时候，关闭计时器，停止滚动
                this.$ul.on('mouseover', function(e) {
                    clearInterval(self.timer);
                });
                this.$ul.on('mouseout', function(e) {
                    self.__autoPlay();
                });
            }
        },
        __initLayout: function() {
            // console.log('transition', this.$ul.css('transition'));
            if (this.direction) {
                //横屏
                this.$elem.addClass('carousel-horizontal');
                var singleWith = ((this.$elem.width() - this.settings.slideSpace * (this.settings.showSlideNum - 1)) / this.settings.showSlideNum).toFixed(2);
                for (var i = 0, len = this.lis.length; i < len; i++) {
                    this.lis[i].style.width = singleWith + 'px';
                    this.lis[i].style.height = '100%';
                    this.lis[i].style.marginRight = this.settings.slideSpace + 'px';
                }
                //默认间隔为10px
                this.itemWith = (+singleWith) + this.settings.slideSpace;
                this.$ul.width(this.itemWith * this.slideCount);
                this.$ul.height('100%');
            } else {
                //竖屏
                this.$elem.addClass('carousel-vertical');
                var singleHeight = ((this.$elem.height() - this.settings.slideSpace * (this.settings.showSlideNum - 1)) / this.settings.showSlideNum).toFixed(2);
                for (var i = 0, len = this.lis.length; i < len; i++) {
                    this.lis[i].style.height = singleHeight + 'px';
                    this.lis[i].style.width = '100%';
                    this.lis[i].style.marginBottom = this.settings.slideSpace + 'px';
                }
                this.itemHeight = this.lis[0].clientHeight + this.settings.slideSpace;
                this.$ul.height(this.itemHeight * this.slideCount);
            }
        },

        __initControls: function() {
            this.$elem.css('position', 'relative');
            var prevControl = document.createElement('a');
            prevControl.innerHTML = '&lsaquo;';
            var nextControl = document.createElement('a');
            nextControl.innerHTML = '&rsaquo;';
            this.$elem.append(prevControl);
            this.$elem.append(nextControl);
            this.$prevControl = $(prevControl);
            this.$nextControl = $(nextControl);
            this.$prevControl.addClass(this.settings.carouselControlSelector.slice(1) + ' prev');
            this.$nextControl.addClass(this.settings.carouselControlSelector.slice(1) + ' next');
        },
        __initControlEvent: function() {
            var self = this;
            this.$prevControl.on('click', function(e) {
                console.log('prev');
                self.prev();
            });
            this.$nextControl.on('click', function(e) {
                // console.log('next');
                self.next();
            });
        },
        __initUlEvent: function() {
            var self = this;
            this.$ul.on('transitionend', function(e) {
                console.log('end');
                self.$ul.css('transition', 'none');
                self.__removeNode(self.runningDirection);
                self.__setUlLength();
                self.$ul.css('transform', 'translateX(0)');
                self.runningDirection = undefined;
            });
        },
        __autoPlay: function() {
            var self = this;
            this.timer = setInterval(function() {
                self.next();
            }, this.settings.autoInterval);
        },
        //无缝切换时，重置ul的长度/高度
        __setUlLength: function() {
            if (this.direction) {
                this.$ul.width(this.itemWith * this.lis.length);
            } else {
                this.$ul.height(this.itemHeight * this.lis.length);
            }
        },
        __cloneAndAddNode: function(direction) {
            if (direction === 'next') {
                //向前滑动
                for (var i = 0; i < this.settings.moveSlideNum; i++) {
                    var tmp = this.lis[i].cloneNode(true);
                    this.$ul.append(tmp);
                }
            } else {
                for (var i = 1, len = this.lis.length; i <= this.settings.moveSlideNum; i++) {
                    var tmp = this.lis[len - 1].cloneNode(true);
                    this.$ul.prepend(tmp);
                }
            }

        },
        __removeNode: function() {
            if (this.runningDirection === 'next') {
                for (var i = 0; i < this.settings.moveSlideNum; i++) {
                    this.$ul[0].removeChild(this.lis[0]);
                }
            } else {
                for (var i = 0; i < this.settings.moveSlideNum; i++) {
                    this.$ul[0].removeChild(this.lis[this.lis.length - 1]);
                }
            }
        },
        prev: function() {
            //向前滑动，实现无缝切换的原理与向后滑动类似
            //复制最后showSlideNum个幻灯片，添加到ul的最前面
            //滑动结束之后，删除最后showSlideNum个幻灯片

            //动画正在执行的时候，点击无效
            if (this.runningDirection) {
                return;
            }
            this.runningDirection = 'prev';
            this.__cloneAndAddNode(this.runningDirection);
            //在动画开始之前，先移动列表的位置
            if (this.direction) {
                this.$ul.css('transform', 'translateX(-' + this.settings.moveSlideNum * this.itemWith + 'px)');
            } else {
                this.$ul.css('transform', 'translateY(-' + this.settings.moveSlideNum * this.itemHeight + 'px)');
            }

            this.__setUlLength();
            this.$ul.css('transition', 'transform ' + this.settings.scrollSpeed + 'ms ' + this.settings.easing);
            if (this.direction) {
                this.$ul.css('transform', 'translateX(0)');
            } else {
                this.$ul.css('transform', 'translateY(0)');
            }

        },
        next: function() {
            //为实现无缝切换，首先将moveSlideNum个幻灯片复制添加到列表尾部
            //滑动结束之后，再删除头部的moveSlideNum个幻灯片
            console.log('next');
            if (this.runningDirection) {
                return;
            }
            this.runningDirection = 'next';
            this.__cloneAndAddNode(this.runningDirection);
            this.__setUlLength();
            //滑动,使用css3的transform实现
            this.$ul.css('transition', 'transform ' + this.settings.scrollSpeed + 'ms ' + this.settings.easing);
            if (this.direction) {
                this.$ul.css('transform', 'translateX(-' + this.settings.moveSlideNum * this.itemWith + 'px)');
            } else {
                this.$ul.css('transform', 'translateY(-' + this.settings.moveSlideNum * this.itemHeight + 'px)');
            }

        },
        getSlideCount: function() {
            return this.lis.length;
        }
    };
    $.fn.myCarousel = function(options) {
        return $(this).each(function() {
            var $this = $(this);
            instance = $this.data('mycarousel');
            if (!instance) {
                instance = Object.create(MyCarousel);
                instance.setup($this, options);
                $this.data('mycarousel', instance);
            }
        });
    };
    $.fn.myCarousel.default = {
        carouselListSelector: '.carousel-list', //导航元素选择器
        carouselItemSelector: '.carousel-item',
        carouselControlSelector: '.carousel-control', //左右控制器按钮
        navigation: true, //是否显示导航菜单，默认为true
        controls: true, //是否显示左右播放控制按钮，默认为false
        scrollSpeed: 500, //滚动速度，默认500ms
        easing: 'linear', //动画缓动动画，默认为ease
        direction: 'horizontal', //水平方向滑动还是竖直方向，可选的有['horizontal','vertical']
        index: 0, //初始的时候显示第几屏，默认为0
        showSlideNum: 1, //显示li的个数
        moveSlideNum: 1, //移动li的个数
        auto: false, //是否自动滚动，默认为false
        autoInterval: 2000, //当auto为ture时，设定自动播放动画的时间间隔，默认为2000ms
        slideSpace: 0, //每个幻灯片之间的距离间隔，默认为0，单位是px        
    };
})(jQuery);
