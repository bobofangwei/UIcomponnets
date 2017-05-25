# mycarousel.js实现原理剖析
下面以水平轮播图为例，说明轮播图实现中的重点
## jQuery插件编写
``` javascript
(function($){
  $.fn[插件名]=function(){
    //...
  }  
})(jQuery);
```
在本例中，结合jQuery的data模块来实现单例模式：
```
(function($) {
    //...
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
    //...
})(jQuery);
```

## html结构
html代码结构如下：
```
    <div class="carousel" id="carouselHorizontal">
        <ul class="carousel-list">
            <li class="carousel-item item1">1</li>
            <li class="carousel-item item2">2</li>
            <li class="carousel-item item3">3</li>
            <li class="carousel-item item4">4</li>
            <li class="carousel-item item5">5</li>
        </ul>
    </div>
```
1. 外层div宽度固定
2. 单独每个幻灯片li的宽度根据每一屏显示幻灯片的数目，各个幻灯片之间的间隔，使用js计算,如果是水平幻灯片，使每个幻灯片左浮动
3. 幻灯片列表ul的宽度，根据每个幻灯片的宽度，以及幻灯片的个数进行计算  

上述相关计算的js代码如下：  
```
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
```
## 无缝切换效果实现
所谓无缝切换，是指当幻灯片划转到最后一屏(第一屏)时，再次滑动能够按照原来的滑动方向切换到第一屏(最后一屏)，不发生突变
-  向后滑动无缝切换的实现
    1. 将当前滑动列表ul最前面moveSlideNum个幻灯片li复制，并添加到幻灯片的尾部
    2. 改变幻灯片列表ul的left取值；如果利用css3实现的话，为ul添加transiton属性，并设置transform为translateX(-moveSliceNum*itemWidth)的值
    3. 将ul最前面moveSlideNum个幻灯片对应的li删除（之前已经复制）
    4. 动画结束后，将ul的left置为0；如果是css3实现，监听transitionend事件，需要将ul的transition置为none,translateX置为0  
    **总而言之，向后滑动，是先复制添加li，然后ul的x坐标从0到负值的动画过程，动画结束之后再删除已复制的元素。**
-  向前滑动无缝切换的实现
    1. 将当前滑动列表ul最后面moveSlideNum个幻灯片li复制，并添加到幻灯片的前面
    2. 在滑动动画开始前，改变幻灯片列表ul的left取值；如果利用css3实现的话，设置ul的translateX为-moveSliceNum*itemWidth
    3. 通过动画过程是的ul的left变为0，如果使用css3实现，那么为ul添加transiton属性，并设置transform为translateX(0)
    4. 将ul最后面moveSlideNum个幻灯片对应的li删除（之前已经复制）
    5. 动画结束后，将ul的left置为0；如果是css3实现，需要将ul的transition置为none,translateX置为0  
    **总而言之，向前滑动，是先复制添加li，然后ul的x坐标从负值到0的动画过程，动画结束之后再删除已复制的元素。**  


具体实现代码请参考[源代码](https://github.com/bobofangwei/UIcomponnets/blob/master/%E8%BD%AE%E6%92%AD%E5%9B%BE/%E6%99%AE%E9%80%9A%E8%BD%AE%E6%92%AD%E5%9B%BE/js/mycarousel.js)

