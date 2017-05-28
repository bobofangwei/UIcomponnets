(function($) {
    var MyPager = {
        setup: function(elem, opts) {
            this.$elem = elem;
            this.$elem.addClass('page-wrapper');
            this.settings = $.extend(true, {}, $.fn.myPager.defaults,opts);
            this.gotoPage(1);
            this.__initEvent();
        },
        //跳转到第几页
        gotoPage: function(page) {
            this.$elem.empty();
            this.curPage = page;
            var fragment = document.createDocumentFragment();
            var half = Math.ceil((+this.settings.showPageCount) / 2);
            //处理首页
            //1.开启首页显示
            //2.当前页>half
            if (this.settings.showEdge && this.curPage > half) {
                this.__appendLink(fragment, '1', this.settings.homePage);
            }
            //处理上一页
            //当前页不是第一页
            if (this.curPage > 1) {
                this.__appendLink(fragment, (this.curPage - 1), this.settings.prevContent);
            }
            //处理中间页
            if (this.curPage <= half) {
                //此时显示前showPageCount页
                this.__appendLinks(fragment, 1, this.settings.showPageCount);
            } else if (this.curPage > this.settings.allPageCount - half) {
                //显示最后showPageCount页
                this.__appendLinks(fragment, this.settings.allPageCount - this.settings.showPageCount + 1, this.settings.allPageCount);
            } else {
                //显示this.curPage-half+1页到this.curPage+half-2
                this.__appendLinks(fragment, this.curPage - half + 1, this.curPage + half - 1);
            }


            //处理下一页
            if (this.curPage < this.settings.allPageCount) {
                this.__appendLink(fragment, (this.curPage + 1), this.settings.nextContent);
            }
            //处理尾页
            if (this.settings.showEdge && this.curPage <= this.settings.allPageCount - half) {
                this.__appendLink(fragment, this.settings.allPageCount, this.settings.endPage);
            }

            this.$elem.append(fragment);
            if (this.settings.callback) {
                this.settings.callback.call(this, this.curPage, this.settings.allPageCount);
            }
        },
        getPageCount: function() {
            return this.settings.pageCount;
        },
        setPageCount: function(count) {
            this.settings.pageCount = count;
        },
        getCurrent: function() {
            return this.curPage;
        },
        __appendLink: function(dom, index, content) {
            var a = document.createElement('a');
            a.index = index;
            a.innerHTML = content;
            dom.append(a);
        },
        __appendLinks: function(dom, startIndex, endIndex) {
            for (var i = startIndex; i <= endIndex; i++) {
                var a = document.createElement('a');
                a.index = i;
                a.innerHTML = i;
                if (i === this.curPage) {
                    a.className = 'active';
                }
                dom.append(a);
            }
        },
        __initEvent: function() {
            var self = this;
            this.$elem.on('click', function(e) {
                var target = e.target;
                if (target.nodeName.toLowerCase() === 'a') {
                    self.gotoPage(target.index);
                }
            });
        }
    };
    $.fn.myPager = function(opts) {
        var instance;
        this.each(function() {
            instance = $(this).data('myPager');
            if (!instance) {
                instance = Object.create(MyPager);
                instance.setup($(this), opts);
                $(this).data('myPager', instance);
            }
            return instance;
        });
    };
    $.fn.myPager.defaults = {
        showPageCount: 9, //显示分页按钮数，默认值为9
        allPageCount: 15,
        prevContent: '上一页', //上一页节点内容
        nextContent: '下一页', //下一页节点内容
        showEdge: true, //是否显示首页和末页，默认为true
        homePage: '首页',
        endPage: '尾页',
        callback: null //回调函数，参数curPage代表当前页,totalPage代表总页数
    };
})(jQuery);
