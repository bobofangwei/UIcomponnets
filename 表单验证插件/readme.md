# MyValidator.js
一个轻量级的jQuery表单验证插件  
1. 给表单元素绑定验证类型
2. 给表单元素绑定自定义提示信息
2. 支持常见的验证类型，并支持自定义正则表达式验证
3. 可以给表单下的任一元素绑定表单提交或重置方法
4. 可以对表单下的某一块区域或具体表单元素单独进行验证
5. 可以在表单开始验证前和表单验证通过后，提交表单之前绑定事件
7. 可设置表单元素失去焦点时逐条验证，或者表单提交时一次性验证
8. 可以配置显示所有的验证信息或仅显示首条验证信息


[Demo](https://bobofangwei.github.io/UIcomponnets/表单验证插件/myValidator/demo/index.html)
## 用法介绍
### 一、文件依赖
依赖于jQuery,需要首先引入jQuery文件
```
 <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
```
### 二、html代码结构
定义待验证的表单
```
 <form action="" id="myForm" class="my-form"></form>
```
### 三、初始化
1. 定义对应的验证规则配置项，以Demo为例：
```
  var opts = {
        btnReset: '#resetBtn',
        tipType: 1,
        enableBlurValid: true,
        showAllErrorMsg: true,
        beforeSubmit: function($form, validResult) {
            if (!validResult) {
                console.log('验证不通过！');
                alert('验证不通过！');
            }
        },
        strategies: [{
            selector: '#username',
            rules: [{
                rule: 'required',
                errorMsg: '名称不能为空'
            }, {
                rule: 'minLength',
                args: [4],
                errorMsg: '名称长度不能小于4'
            }, {
                rule: 'maxLength',
                args: [16],
                errorMsg: '名称长度不能大于16'
            }],
            correctMsg: '名称可用',
            tipMsg: '必填，名称长度为4到16个字符',

        }, {
            selector: '#password',
            rules: [{
                rule: 'required',
                errorMsg: '密码不能为空'
            }, ],
            correctMsg: '密码可用',
            tipMsg: '请输入密码',

        }, {
            selector: '#passwordAgain',
            rules: [{
                rule: 'same',
                args: ['#password'],
                errorMsg: '两次密码输入不一致'
            }, ],
            correctMsg: '两次密码输入一致',
            tipMsg: '再次输入密码',

        }, {
            selector: '#email',
            rules: [{
                rule: 'email',
                errorMsg: '邮箱格式不正确'
            }, {
                rule: 'custom',
                args: [/.*@163.com$/],
                errorMsg: '需要为163邮箱'
            }],
            correctMsg: '邮箱格式正确',
            tipMsg: '请输入邮箱',

        }, {
            selector: '#phoneNum',
            rules: [{
                rule: 'phoneNum',
                errorMsg: '电话号码格式不正确'
            }, ],
            correctMsg: '电话号码格式正确',
            tipMsg: '请输入电话号码',
        }]
    };

```
2. 调用初始化函数
```
$('#myForm').myValidator(opts);
```
### 四、配置项
+ `btnSubmit`:表单提交按钮的selector，如果通过点击type=submit的按钮触发，该选项无需设置
+ `btnReset`:表单重置按钮的selector,如果通过点击type=reset的按钮触发，则该选项无需设置
+ `beforeCheck`:表单提交时，验证之前的回调函数，参数curForm代表当前待验证的表单
+ `beforeSubmit`:表单提交时，验证之后触发的回调函数，参数curForm代表当前待验证表单，passed代表表单验证是否通过
+ `tipMsg`：字段获取焦点时的提示信息，默认为“请输入信息”
+ `errorMsg`:字段验证不通过时的出错信息，默认为'输入信息有误'
+ `correctMsg`:验证正确时的提示信息，默认为'输入正确'
+ `enableBlurValid`:对每一个待验证字段，是否开启失去焦点时进行验证的功能，默认为true，即字段失去焦点时验证，为false时代表点击提交时，进行一次性验证
+ `showAllErrorMsg`:表单提交验证时，是否显示所有错误信息。为true代表全部显示，false代表仅显示首条错误信息，默认为true
+ `strategies`:数组类型，定义针对当前表单各个标段元素的验证规则，一个标段元素的验证规则对应数组中的一个对象，可以包含以下配置项：
    + `selector`:表单元素对应的选择字符串
    + `correctMsg`:当前表单元素验证通过的提示信息，如不设置，则选用在配置项根节点下设置的默认通过提示信息，否则覆盖
    + `tipMsg`:当前表单元素获得焦点时的提示信息，如不设置，则选用在配置项根节点下设置的默认通过提示信息，否则覆盖
    + `rules`:数组类型，定义对当前表单元素的验证规则，对一个表单元素可以定义多条验证规则，每一条验证规则对应数组中的一个对象，可以包含以下属性：
        + `rule`:规则名称，支持'requried'(非空验证),'minLength'(输入最小长度)，'maxLength'(输入最大长度)，'email'(邮件格式)，'phoneNum'(电话号码格式)，'same':和其他字段保持一致，以及'custom'（任意自定义正则表达式验证）
        + `args`:数组类型，根据rule的不同，设置不同的值，如rule为'minLength'、'maxLength'是，args数组中的值为数值类型，代表长度阈值；rule为'same',args数组中的值代表和需和当前字段保持一致的其他字段的选择字符串；rule为'custom'时,args数组中的值则是用于自定义验证的正则表达式
        + `errorMsg`:当前验证规则验证失败的提示信息，如不设置，则选用在配置项根节点下设置的默认错误提示信息，否则覆盖

### 实现心得
表单验证插件的代码实现中运用了相关设计模式，如：
1. 策略模式，为集中管理各种验证策略，定义了strategies对象
2. 命令模式，为了将命令下达与命令执行的时机解耦，运用了命令模式，将对每一个字段的验证操作封装成了FormField对象



