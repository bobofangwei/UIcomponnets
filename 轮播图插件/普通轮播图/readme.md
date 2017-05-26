# MyCarousel.js
一个轻量级的JQuery幻灯片播放插件   
1. 支持水平/竖直幻灯片播放
2. 丰富的配置项
3. 基于css3实现动画效果

[Demo](https://bobofangwei.github.io/UIcomponnets/%E5%85%A8%E5%B1%8F%E6%BB%9A%E5%8A%A8%E6%8F%92%E4%BB%B6/myfullpage/demo/index.html)

## 用法介绍
### 依赖文件
参照示例，使用MyCarousel.js需要首先引入一下文件
+ jQuery
+ Css 文件`mycarousel.css`

引用方法如下：  
```
<link rel="stylesheet" type="text/css" href="./css/mycarousel.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script type="text/javascript" src="./js/mycarousel.js"></script>
```
### HTML代码结构
每一页幻灯片元素需要定义类.carousel-item  
所有幻灯片元素的父元素需要定义类:.carousel-list
示例代码如下：
```
    <div class="carousel" id="carouselVertical">
        <ul class="carousel-list">
            <li class="carousel-item item1">1</li>
            <li class="carousel-item item2">2</li>
            <li class="carousel-item item3">3</li>
        </ul>
    </div>
```
### 初始化
初始化调用的代码如下：
```
    var a=$('#carouselHorizontal').myCarousel({
        slideSpace: 10,
        showSlideNum: 3,
        moveSlideNum: 1,
        controls: true,
    });
```
可根据需要传递对应的配置项为参数

### 配置项
* `direction`: 幻灯片方向，可选有horizontal(水平幻灯片)、vertical(垂直幻灯片)
* `showSlideNum`: 每一屏显示幻灯片的数目,默认为1
* `moveSlideNum`:每一次动画滑动幻灯片的数目，默认为1  
* `auto`: 是否开启幻灯片自动播放，默认为false 
* `autoInterval`:开启自动播放时，两帧动画之间的间隔，默认为2000，单位是ms
* `scrollSpeed`:幻灯片速度，默认500，单位是毫秒  
* `easing`: 幻灯片滑动的缓动函数，默认为linear  
* `controls`: 是否显示播放控制元素，默认为true  
* `slideSpace`: 相邻两个幻灯片的间隔，多用于当一屏显示多个幻灯片时，默认值为0，单位是px  
* `navigation`: 是否显示导航的圆点，默认为false，建议在showSlideNum为1的时候可以考虑设置其为true    
* `index`:页面加载完成后，活动的幻灯片，默认为0，即第一张



## 待改进之处
鉴于本插件注重实现逻辑，未过多重视浏览器兼容性，存在以下问题：
- 本插件动画实现基于css3的transition和transform,在低版本浏览器中需要考虑添加浏览器前缀  
- 鉴于部分代码基于jQuery实现，可以考虑对此进行修正，使其可以独立于jQuery运行（实现这点其实并不麻烦）







