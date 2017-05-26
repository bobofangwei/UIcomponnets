(function($) {
    var MyFullpage = {
        setup: function($elem, options) {
            this.$elem = $elem;
            this.settings = $.extend(true, {}, $.fn.MyFullPage.default, options);
            this.init();
        },
        //初始化dom结构，布局，分页并绑定事件
        init: function() {
            this.sections = this.$elem.find(this.settings.selectors.sections);
            this.section = this.$elem.find(this.settings.selectors.section);

            this.layoutDirection = this.settings.direction === 'vertical' ? true : false;
            this.sectionCount = this.getSectionCount();
            //当前所处的幻灯片索引，如果正在滑动，代表滑动结束之后的幻灯片索引
            //this.curIndex = (this.settings.index >= 0 && this.settings.index <= this.sectionCount - 1) ? this.settings.index : 0;
            this.prevIndex = 0;
            this.curIndex = 0;
            //记录每次滑动的方向,初始值为undefined,可选有down,up
            this.direction = undefined;
            this.isRunning = false;
            this.sections.css('transition', 'transform ' + this.settings.scrollingSpeed + 'ms '+this.settings.easing);

            //如果是横屏
            if (!this.layoutDirection) {
                this.__initLayout();
            }

            //导航元素
            if (this.settings.navigation) {
                this.__initNavigator();
                this.__updateNav();
            }
            this.__initEvent();

            if (this.settings.index > 0 && this.settings.index < this.sectionCount) {
                var self = this;
                setTimeout(function() {
                    self.moveTo(self.settings.index);
                }, 10);
                //this.moveTo(this.curIndex);
            }

        },
        __initEvent: function() {
            //监听滚轮事件
            var self = this;
            this.sections.on('transitionend', function(e) {
                self.isRunning = false;
                self.direction = undefined;
                if (self.settings.onLoad) {
                    self.settings.onLoad.call(self, self.curIndex);
                }
            });
            $(window).on('mousewheel', function(e) {
                var delta = e.originalEvent.wheelDelta || e.originalEvent.detail * (-40);
                // console.log('delata', delta);
                if (delta > 0) {
                    //up
                    self.moveSectionUp();
                } else {
                    //down
                    self.moveSectionDown();
                }
            });

            if (this.settings.keyboard) {
                //开启键盘控制
                $(window).on('keyup', function(e) {
                    if (e.which === 39 || e.which === 40) {
                        self.moveSectionDown();
                    } else if (e.which === 38 || e.which === 37) {
                        self.moveSectionUp();
                    }
                });
            }
        },
        //获取滑动页面数量
        getSectionCount: function() {
            return this.section.length;
        },
        moveSectionDown: function() {
            if (this.isRunning) {
                return;
            }
            this.prevIndex = this.curIndex;
            this.curIndex++;
            if (this.curIndex >= this.sectionCount) {
                this.curIndex = this.settings.loop ? 0 : this.sectionCount - 1;
            }
            if (this.prevIndex !== this.curIndex) {
                this.__scrollSlide();
            }
        },
        moveSectionUp: function() {
            if (this.isRunning) {
                return;
            }
            this.prevIndex = this.curIndex;
            this.curIndex--;
            if (this.curIndex < 0) {
                this.curIndex = this.settings.loop ? this.sectionCount - 1 : 0;
            }
            if (this.prevIndex !== this.curIndex) {
                this.__scrollSlide();
            }

        },
        moveTo: function(index) {
            if (this.isRunning) {
                return;
            }
            if (index < 0 || index >= this.sectionCount) {
                return;
            }
            this.prevIndex = this.curIndex;
            this.curIndex = index;

            if (this.prevIndex != this.curIndex) {
                this.__scrollSlide();
            }

        },
        __updateNav: function() {
            this.$navIndicators.eq(this.curIndex).addClass('active').siblings().removeClass('active');
        },
        //针对横屏的处理
        __initLayout: function() {
            this.sections.width(this.sectionCount * 100 + '%');
            var sectionWidth = (100 / this.sectionCount).toFixed(2) + '%';
            this.section.each(function() {
                $(this).width(sectionWidth).css('float', 'left');
            });
            if (!this.layoutDirection) {
                this.sections.addClass('sections-horizontal');
            }
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
            this.$navIndicators = this.$elem.find('.nav-item');
            var self = this;
            this.$navIndicators.on('click', function(e) {
                self.moveTo($(this).index());
            });
        },

        __scrollSlide: function() {
            this.isRunning = true;
            //滑动开始前的回调
            if (this.prevIndex <= this.curIndex) {
                this.direction = 'down';
            } else {
                this.direction = 'up';
            }
            if (this.settings.onLeave) {
                this.settings.onLeave.call(this, this.prevIndex, this.curIndex, this.direction);
            }
            if (this.settings.navigation) {
                this.__updateNav();
            }
            if (this.layoutDirection) {
                this.sections.css('transform', 'translateY(-' + this.curIndex * 100 + '%)');
            } else {
                var left = (this.curIndex * 100 / this.sectionCount).toFixed(2);
                this.sections.css('transform', 'translateX(-' + left + '%)');
            }
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
        easing: 'ease-in-out', //默认动画缓动函数
        scrollingSpeed: 700, //滚动速度，默认单位是毫秒
        loop: false, //是否循环滚动
        navigation: true, //是否显示分页
        keyboard: true, //是否键盘控制
        direction: 'vertical', //horizontal
        onLoad: null, //幻灯片加载完成的回调函数，参数为index
        onLeave: null //滑动动画开始前的回调函数，参数分别是prevIndex,index,direction
    };
})(jQuery);
