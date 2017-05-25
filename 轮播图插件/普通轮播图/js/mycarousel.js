(function($) {
    var MyCarousel = {
        setup: function($elem, options) {
            this.$elem = $elem;
            this.settings = $.extend(true, {}, $.fn.myCarousel.default, options);
            this.init();
        },
        //初始化dom元素
        init: function() {
            this.$elem.css('position', 'relative');
            this.$ul = this.$elem.find(this.settings.carouselListSelector);

            //经过测试发现，使用find,querySelectorAll获得的Nodelist是静态的
            //this.$lis = this.$elem.find(this.settings.carouselItemSelector);
            //this.lis=this.$elem[0].querySelectorAll(this.settings.carouselItemSelector);
            //getElementsByClassName获得的则是动态的NodeList
            //在本程序中，需要根据li的动态改变调整幻灯片列表的长度，因此需要其为动态的
            this.lis = this.$elem[0].getElementsByClassName(this.settings.carouselItemSelector.slice(1));

            //幻灯片滑动方向，默认为水平方向
            this.direction = this.settings.direction === 'horizontal' ? true : false;
            this.slideCount = this.getSlideCount();
            //当前幻灯片的索引，取值为0-slideCount
            this.curIndex = 0;

            //记录每次滑动要滑动的幻灯片个数
            //如果是左右滑动，那么就等于this.setting.moveSlideNum
            //但如果是点击导航导致的滑动，滑动的方向和滑动的距离是不确定的
            this.moveSlideNum = this.settings.moveSlideNum;
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
            //添加滑动结束的监听事件
            this.__initUlEvent();

            if (this.settings.navigation) {
                this.__initNavigation();
                this.__initNavigationEvent();
            }

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
            this.gotoSlide(this.settings.index);
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
                console.log('next');
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
                // 动画结束时，设置curIndex才有意义，别忘了这是个异步的过程
                // if (self.runningDirection === 'prev') {
                //     self.curIndex = self.curIndex - self.moveSlideNum >= 0 ? (self.curIndex - self.moveSlideNum) : (self.curIndex - self.moveSlideNum) % self.slideCount + self.slideCount;
                // } else {
                //     self.curIndex = (self.curIndex + self.moveSlideNum) % self.slideCount;

                // }
                //如果有导航的话，设置对应页面高亮
                // self.renderNav(self.curIndex);

                self.runningDirection = undefined;
                // self.moveSlideNum = self.settings.moveSlideNum;
                // console.log('curIndex', self.curIndex);
            });
        },
        __initNavigation: function() {
            var ol = document.createElement('ol');
            ol.className = this.settings.navigationSelector.slice(1);
            var str = '';
            for (var i = 0; i < this.slideCount; i++) {
                str += '<li data-index=' + i + '></li>'
            }
            ol.innerHTML = str;
            this.$elem.append(ol);
            this.$navBar = $(ol);
            this.$navIndicators = this.$navBar.find('li');
        },
        __initNavigationEvent: function() {
            var self = this;
            this.$navBar.on('click', 'li', function(e) {
                self.gotoSlide(e.target.dataset.index);
            });
        },
        __updateNav: function() {
            console.log('index', this.curIndex);
            if (this.settings.navigation) {
                this.$navIndicators.eq(this.curIndex).addClass('active').siblings().removeClass('active');
            }
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
                for (var i = 0; i < this.moveSlideNum; i++) {
                    var tmp = this.lis[i].cloneNode(true);
                    this.$ul.append(tmp);
                }
            } else {
                for (var i = 1, len = this.lis.length; i <= this.moveSlideNum; i++) {
                    var tmp = this.lis[len - 1].cloneNode(true);
                    this.$ul.prepend(tmp);
                }
            }

        },
        __removeNode: function() {
            if (this.runningDirection === 'next') {
                for (var i = 0; i < this.moveSlideNum; i++) {
                    this.$ul[0].removeChild(this.lis[0]);
                }
            } else {
                for (var i = 0; i < this.moveSlideNum; i++) {
                    this.$ul[0].removeChild(this.lis[this.lis.length - 1]);
                }
            }
        },
        //点击向前的箭头的事件处理函数
        prev: function() {
            if (this.runningDirection) {
                return;
            }
            this.moveSlideNum = this.settings.moveSlideNum;
            this.prevSlide();
            this.__updateIndex();
            this.__updateNav();
        },
        //点击向后的箭头的事件处理函数
        next: function() {
            if (this.runningDirection) {
                return;
            }
            this.moveSlideNum = this.settings.moveSlideNum;
            this.nextSlide();
            this.__updateIndex();
            this.__updateNav();
        },
        //获取向前，向后滑动后，要滑动到的幻灯片的索引
        __updateIndex: function() {
            if (this.runningDirection === 'prev') {
                this.curIndex = this.curIndex - this.moveSlideNum >= 0 ? (this.curIndex - this.moveSlideNum) : (this.curIndex - this.moveSlideNum) % this.slideCount + this.slideCount;
            } else {
                this.curIndex = (this.curIndex + this.moveSlideNum) % this.slideCount;

            }
        },
        //点击导航时的事件处理函数
        //index为目标幻灯片的索引， 其取值为0——slideCount-1
        gotoSlide: function(index) {
            if (this.runningDirection) {
                return;
            }
            console.log('gotoSlide:' + index);
            if (index > this.curIndex) {
                //如果目标索引大于当前索引
                //则向后滑动
                this.moveSlideNum = index - this.curIndex;
                this.nextSlide();
            } else if (index < this.curIndex) {
                //如果目标索引小于当前索引，则向前滑动
                this.moveSlideNum = this.curIndex - index;
                this.prevSlide();
            }
            this.curIndex = index;
            this.__updateNav();

        },
        //向前滑动this.moveSlideNum个幻灯片
        prevSlide: function() {
            //向前滑动，实现无缝切换的原理与向后滑动类似
            //复制最后showSlideNum个幻灯片，添加到ul的最前面
            //滑动结束之后，删除最后showSlideNum个幻灯片
            console.log('向前滑动' + this.moveSlideNum + '个幻灯片');
            //动画正在执行的时候，点击无效
            if (this.runningDirection) {
                return;
            }
            this.runningDirection = 'prev';
            this.__cloneAndAddNode(this.runningDirection);
            //在动画开始之前，先移动列表的位置
            if (this.direction) {
                this.$ul.css('transform', 'translateX(-' + this.moveSlideNum * this.itemWith + 'px)');
            } else {
                this.$ul.css('transform', 'translateY(-' + this.moveSlideNum * this.itemHeight + 'px)');
            }

            this.__setUlLength();
            this.$ul.css('transition', 'transform ' + this.settings.scrollSpeed + 'ms ' + this.settings.easing);
            if (this.direction) {
                this.$ul.css('transform', 'translateX(0)');
            } else {
                this.$ul.css('transform', 'translateY(0)');
            }


        },
        //向后滑动indexSpace个幻灯片
        nextSlide: function() {
            //为实现无缝切换，首先将moveSlideNum个幻灯片复制添加到列表尾部
            //滑动结束之后，再删除头部的moveSlideNum个幻灯片
            console.log('向后滑动' + this.moveSlideNum + '个幻灯片');
            if (this.runningDirection) {
                return;
            }
            this.runningDirection = 'next';
            this.__cloneAndAddNode(this.runningDirection);
            this.__setUlLength();
            //滑动,使用css3的transform实现
            this.$ul.css('transition', 'transform ' + this.settings.scrollSpeed + 'ms ' + this.settings.easing);
            if (this.direction) {
                this.$ul.css('transform', 'translateX(-' + this.moveSlideNum * this.itemWith + 'px)');
            } else {
                this.$ul.css('transform', 'translateY(-' + this.moveSlideNum * this.itemHeight + 'px)');
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
        navigation: false, //是否显示导航菜单，默认为true
        navigationSelector: '.carousel-nav',
        controls: true, //是否显示左右播放控制按钮，默认为false
        scrollSpeed: 500, //滚动速度，默认500ms
        easing: 'linear', //动画缓动动画，默认为ease
        direction: 'horizontal', //水平方向滑动还是竖直方向，可选的有['horizontal','vertical']
        showSlideNum: 1, //显示li的个数
        moveSlideNum: 1, //移动li的个数
        auto: false, //是否自动滚动，默认为false
        autoInterval: 2000, //当auto为ture时，设定自动播放动画的时间间隔，默认为2000ms
        slideSpace: 0, //每个幻灯片之间的距离间隔，默认为0，单位是px  
        index: 0,
    };
})(jQuery);
