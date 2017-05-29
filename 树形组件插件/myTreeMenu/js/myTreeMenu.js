(function($) {
    var TreeNode = {
        //包围根节点的div与包围二级菜单的li类似
        //只不过根节点没有i,a,div.operate等元素，自然也不需要为其增添toggle，add,delete等事件
        //同时根节点的spread一定为true
        //同时根节点的左右就是调用addChild方法，不需要为其增添相关事件
        __initTreeNode: function(dom) {
            this.$dom = dom;
            this.childs = [];
            this.$childListDom = null;
            this.parent = null;

        },
        buildTree: function(root, data) {
            this.initRoot(root);
            this.addChilds(data);
            return this;
        },
        initRoot: function(dom) {
            this.__initTreeNode(dom);
            this.toSpread = true;
            return this;
        },
        initDataNode: function(dom, opts) {
            this.__initTreeNode(dom);
            this.settings = $.extend(true, {}, $.fn.myTreeMenu.defaults, opts);
            this.$arrowDom = this.$dom.find('.arrow');
            this.$operateDom = this.$dom.find('.operate');
            this.toSpread = this.settings.spread;
            this.__initEvent();
        },
        __initEvent: function() {
            this.$dom.on('click', this.__clickHandler.bind(this));
            if (this.settings.operate) {
                //因为需要进入/离开子元素的时候也能触发，因此使用mouseover/mouseout，而非mouseenter/mouseleave
                this.$dom.on('mouseover', this.__mouseoverHandler.bind(this));
                this.$dom.on('mouseout', this.__mouseoutHandler.bind(this));
            }
        },
        __clickHandler: function(e) {
            // console.log(e);
            var target = e.target,
                name = target.nodeName.toLowerCase();
            // console.log('click', name);
            if (this.settings.operate) {
                //添加操作相关的时间
                if (name === 'span') {
                    if (target.className === 'add') {
                        var textArr = window.prompt('请输入节点链接和内容，使用逗号分隔开').split(',')
                        if (!textArr) {
                            return;
                        }
                        this.addChild({ href: textArr[0], name: textArr[1] });

                    } else if (target.className === 'delete') {
                        this.removeNode(this);
                    }
                }

            }
            if (name === 'li' || name === 'i' || name === 'a') {
                this.toggle();
            }
            e.stopPropagation();

        },
        __mouseoverHandler: function(e) {
            // console.log('mouseover', this.$dom.find('a')[0].innerHTML);
            this.$operateDom.show();
            e.stopPropagation();
        },
        __mouseoutHandler: function(e) {
            // console.log('mouseout', this.$dom.find('a')[0].innerHTML);
            this.$operateDom.hide();
            e.stopPropagation();
        },
        toggle: function() {
            if (!this.isFolder()) {
                return;
            }
            if (this.isSpread()) {
                this.folder();
            } else {
                this.spread();
            }
            return this;
        },
        isLeaf: function() {
            return this.childs.length <= 0;
        },
        isFolder: function() {
            return this.childs.length > 0;
        },
        //判断是否处于展开状态
        isSpread: function() {
            return !this.$childListDom.is(':hidden');
        },
        //折叠元素
        folder: function() {
            this.$childListDom.hide();
            this.renderArrow('right');
            return this;
        },
        //开启元素
        spread: function() {
            this.$childListDom.show();
            this.renderArrow('down');
            return this;
        },
        addChild: function(opts) {
            // console.log('opts', opts);
            var li;
            if (this.isLeaf()) {
                var ul = document.createElement('ul');
                ul.className = 'treemenu_list';
                this.$dom.append(ul);
                this.$childListDom = $(ul);
            }
            var li = document.createElement('li');
            li.className = "treemenu_item";
            var href = opts.href || $.fn.myTreeMenu.defaults.href;
            li.innerHTML = '<i class="arrow"></i><a href="' + href + '">' + opts.name + '</a> <span class = "operate" > <span class = "add" >+</span><span class="delete">×</span > </span>';
            this.$childListDom.append(li);
            var treeNode = Object.create(TreeNode);
            treeNode.initDataNode($(li), opts);
            treeNode.parent = this;
            this.childs.push(treeNode);
            if (this.toSpread) {
                this.spread();
            } else {
                this.folder();
            }

            return this;
        },
        addChilds: function(childData) {
            //采用树的广序遍历
            for (var i = 0, len = childData.length; i < len; i++) {
                if (!childData[i]) {
                    return;
                }
                this.addChild(childData[i]);
                if (childData[i].nodes && childData[i].nodes.length > 0) {
                    console.log('递归');
                    this.childs[i].addChilds(childData[i].nodes);
                }
            }
        },
        removeNode: function(treeNode) {
            treeNode.$dom.remove();
            for (var i = 0; i < this.parent.childs.length; i++) {
                if (treeNode.parent.childs[i] === treeNode) {
                    treeNode.parent.childs.splice(i, 1);
                    break;
                }
            }
            //如果删除的是最后一个节点
            if (treeNode.parent.isLeaf()) {
                treeNode.parent.$childListDom.remove();
                treeNode.parent.renderArrow();
                // this.parent = null;
            }
            //this = null;
        },
        //绘制按钮
        renderArrow: function(direction) {
            if (!this.$arrowDom) {
                return;
            }
            if (direction === 'down') {
                this.$arrowDom.removeClass('right_arrow').addClass('down_arrow');
            } else if (direction === 'right') {
                this.$arrowDom.removeClass('down_arrow').addClass('right_arrow');
            } else {
                this.$arrowDom.removeClass('down_arrow').removeClass('right_arrow');
            }
            return this;
        }

    };

    $.fn.myTreeMenu = function(data) {
        var instance;
        instance = this.data('myTreeMenu');
        if (!instance) {
            instance = Object.create(TreeNode);
            if (data) {
                instance.buildTree(this, data);
            } else {
                instance.initRoot(this);
            }
            instance.initRoot(this);
            this.data('myTreeMenu', instance);
        }
        return instance;
    };
    $.fn.myTreeMenu.defaults = {
        operate: true, //是否开启对节点的删除、添加的操作面板
        name: '',
        spread: true, //是否处于展开状态，该属性对叶子节点设置无效
        href: '#',
    };
})(jQuery);
