# MyFullpage.js
一个轻量级的jQuery全屏滚动插件
1. 支持水平/竖直全屏滚动
2. 可进行相关配置
3. 基于css3实现动画效果  

[Demo](https://bobofangwei.github.io/UIcomponnets/%E8%BD%AE%E6%92%AD%E5%9B%BE%E6%8F%92%E4%BB%B6/%E6%99%AE%E9%80%9A%E8%BD%AE%E6%92%AD%E5%9B%BE/demo/MyCarousel.html)

## 用法介绍
### 一、文件依赖
Mycarousel依赖于jQuery，使用前需要首先引入如下文件：
+ jQuery
+ css文件`myfullpage.css`

引用方法如下：
```
    <link rel="stylesheet" type="text/css" href="../css/myfullpage.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="../js/myfullpage.js"></script>
```
### 二、HTML代码结构
每一屏需要定义类.section  
包围所有屏的父元素需要定义.sections  
示例代码如下：
```
    <div id="container">
        <div class="sections">
            <div class="section section1"></div>
            <div class="section section2"></div>
            <div class="section section3"></div>
            <div class="section section4"></div>
        </div>
    </div>
```
### 三、初始化
初始化调用的代码如下：
```
    $('#container').MyFullPage();
```
可根据需要传递具体的配置项
### 四、配置项
* `direction`:全屏滑动方向，可选有vertical、horizontal,默认为vertical
*  `index`:页面初次加载呈现第几屏，默认为0
*  `easing`:屏幕滑动的缓动函数，默认为ease-in-out
*  `scrollingSpeed`:滑动动画速度，默认为700ms
*  `loop`:是否循环滑动，默认为false
*  `navigation`:是否呈现导航，默认为true
*  `keyboard`:是否开启键盘方向键控制，默认为true
*  `onLoad`:每一屏幻灯片滑动加载完成的回调函数，参数为index，代表当前幻灯片的索引
*  `onLeave`:滑动切换发生时的回调函数，参数分别为prevIndex，index，direction(选项有down，up)

### 五、方法
+ `getSectionCount()`:一共有多少个section
+ `moveSectionDown()`:向后滑动一屏
+ `moveSectionUp()`:向前滑动一屏
+ `moveTo(index)`:滑动到第index屏

### 六、待改进之处
1. 基于css3的transition实现滑动动画，未过多的考虑兼容性问题；
2. 可考虑独立于jQuery进行实现

### 七、实现过程中的心得
1. 滑动原理类似于上一个无缝切换轮播的滑动效果，而且因为不需要考虑无缝切换效果，实际实现方法要更简单一些；
2. 考虑是全屏滑动，在实现中大量使用到了百分比布局，关于百分比在布局中的应用，参见[扩展阅读](http://www.cnblogs.com/bobodeboke/p/6907160.html)
