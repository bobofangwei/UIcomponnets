# MyPager.js
一个轻量级的jQuery分页插件，支持相关配置项  
[Demo](https://bobofangwei.github.io/UIcomponnets/%E5%85%A8%E5%B1%8F%E6%BB%9A%E5%8A%A8%E6%8F%92%E4%BB%B6/myfullpage/demo/index.html)
## 用法介绍
### 一、文件依赖
MyPager依赖于jQuery,需要首先引入jQuery文件
```
 <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
```
### 二、html代码结构
定义一个包围分页插件的父元素
```
<div id="page-wrapper"></div>
```
### 三、初始化
初始化调用代码如下：
```
    $('#page-wrapper').myPager({
        showPageCount:9,
        allPageCount:15,        
    });
```
### 四、配置项
+ `showPageCount`:显示的分页数，默认为9
+ `allPageCount`:一共 有多少个分页，要求allPageCount大于showPageCount
+ `prevContent`:上一页按钮显示文本，默认为‘上一页’
+ `nextContent`:下一页按钮显示文本，默认为“下一页”
+ `showEdge`：是否显示首页和末页，默认为true
+ `homePage`:首页按钮显示文本，默认为"首页"
+ `endPage`:最后一页按钮的显示文本，默认为“尾页”
+ `callback`:每一次翻页的回调函数，参数curPge代表当前页，参数totalPage代表总页数