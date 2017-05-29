# MyTreeMenu.js
一个轻量级的jQuery树状菜单插件，
+ 支持静态构建菜单树，也支持动态构建
+ 可配置树中节点的插入和删除
+ 初始化中可配置节点的展开/折叠状态等  

[Demo](https://bobofangwei.github.io/UIcomponnets/树形组件插件/myTreeMenu/demo/index.html)
## 用法介绍
### 一、文件依赖
MyTreeMenu.js依赖于
+ jQuery
+ 相关样式文件myTreeMenu.css   
需要首先引入jQuery文件和对应的样式文件，代码如下：
```
<link rel="stylesheet" type="text/css" href="../css/myTreeMenu.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="../js/myTreeMenu.js"></script>
```
### 二、html代码结构
定义一个包围树形菜单根节点的父元素
```
<div id="tree-wrapper"></div>
```
### 三、初始化
支持两种初始化方法  
1. 静态构建  
在初始化函数中传入数据参数，可以实现菜单树的静态构建，当然后续还可以通过调用接口增加/删除对应节点  
示例[Domo](https://bobofangwei.github.io/UIcomponnets/树形组件插件/myTreeMenu/demo/index.html)中的树形菜单，如果使用静态构建的话，代码如下：
```
    var data = [{
        name: '前端技能栈',
        nodes: [{
            name: '浏览器底层',
            nodes: [{
                name: 'javascript CORE'
            }, {
                name: 'javscript BOM'
            }, {
                name: 'javascript DOM'
            }]
        }, {
            name: '框架层',
            nodes: [{
                name: 'jQuery',
                href: 'http://jquery.com/',
                spread: true,
                nodes: [{
                    name: 'DOM封装'
                }, {
                    name: 'Class封装'
                }]
            }]
        }, {
            name: '框架组件',
            spread: false,
            nodes: [{
                name: '日历组件'
            }, {
                name: '树形菜单组件'
            }]
        }]
    }, {
        name: '那些大牛们',
        spread: true,
        nodes: [{
            name: '尤雨溪'
        }, {
            name: '阮一峰',
            href: 'http://www.ruanyifeng.com/blog/',
        }]
    }];
    var root = $('#tree-wrapper').myTreeMenu(data);
```
2. 动态构建  
初始化时参数为空，通过后续调用对应接口完成树状菜单的构建  
示例[Domo](https://bobofangwei.github.io/UIcomponnets/树形组件插件/myTreeMenu/demo/index.html)中的树形菜单，如果使用动态构建的话，代码如下：
```
var root=$('#tree-wrapper').myTreeMenu();
root.addChild({name:'前端技能栈'}).addChild({name:'那些大牛们'});
root.childs[0].addChild({name:'浏览器底层'}).addChild({name:'框架层'}).addChild({name:'框架组件'});
root.childs[0].childs[0].addChild({name:'javascript CORE'}).addChild({name:'javascript BOM'}).addChild({name:'javscript:DOM'});
root.childs[0].childs[1].addChild({name:'jQuery','href':'http://jquery.com/'});
root.childs[0].childs[1].childs[0].addChild({name:'DOM封装'}).addChild({name:'Class封装'});
root.childs[0].childs[2].addChild({name:'日历组件'}).addChild({name:'树形菜单组件'}).folder();
root.childs[1].addChild({name:'尤雨溪'}).addChild({name:'阮一峰'}).spread();
```

### 四、配置项
每一个树节点使用一个对象来描述，对象的相关属性如下所示：
+ `name`:必须，节点名称，默认为''
+ `href`:该节点指向的链接，默认为'#'
+ `spread`:该属性只对非叶子节点定义，表示当该节点具有子元素的时候，初始化是展开还是折叠，默认为true，代表展开
+ `operate`:是否开启对当前节点的添加/删除操作，默认为true

整棵树使用一个数组来描述，此时可以为每个非叶子节点的节点对象，添加属性：
+ `nodes`:描述该节点孩子节点的数组，默认为null

### 五、实现心得
+ 掌握"树"这种数据结构的广度优先遍历和深度优先遍历，这一点在静态构建树的代码中有体现，掌握"二叉树"的先序、中序、后序遍历
+ 利用childs和parent属性构建节点之间的联系