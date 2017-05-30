# MyDatePicker.js
一个轻量级的jQuery日历插件
+ 支持日期选择
+ 支持时间段选择
+ 日期选择中，支持设定日期选择范围
+ 时间段选择中，支持设置时间段选择的最短跨度
+ 时间段选择中，支持设置时间段选择的最长跨度

[Demo](https://bobofangwei.github.io/UIcomponnets/日历插件/myDatePicker/demo/index.html)
## 用法介绍
### 一、文件依赖
MyTreeMenu.js依赖于
+ jQuery
+ 样式文件myDatePicker.css  

需要首先引入jQuery文件和对应的样式文件，代码如下：
```
<link rel="stylesheet" type="text/css" href="../css/myDatePicker.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="../js/myDatePicker.js"></script>
```
### 二、html代码结构
定义input控件
```
<input id="selectDate"></input>
```
### 三、初始化
```
var datePicker = $('#selectDate').myDatePicker();
```
初始化函数中可根据需要传入合适的初始化配置参数

### 四、配置项
+ `select`:日期控件的选择类型，'day'代表选择日期，'duration'代表选择一个时间段，默认为'day'

和日期选择有关的配置项为：
+ `startDate`:'xxxx-xx-xx'类型的字符串，如'2017-05-01',代表可选日期范围的开始日期，默认为undefined,即可从任意日期开始
+ `endDate`: 'xxxx-xx-xx'类型的字符串，如'2017-05-10',代表可选日期范围的结束日期，默认为undefined,即不设结束日期
+ `daySelectedCallback`:日期选定之后的回调函数，参数为date类型，代表当前选中的日期对象

和时间段选择有关的配置项为：
+ `minDuration`:数字类型，代表时间段选择允许的最小跨度，默认为undefined,即不限制最小跨度
+ `maxDuration`:数字类型，代表时间段选择允许的最大跨度，默认为undefined,即不限制最大跨度
+  `durationSelectCallback`:时间段选定之后的回调函数，参数startDate、endDate为date类型，前者代表选定的时间跨度的起始日期，后者代表选定的时间跨度的结束日期




