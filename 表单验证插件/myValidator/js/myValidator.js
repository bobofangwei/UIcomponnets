(function($) {

    var FormField = {
        //openValid为true，代表开启focus，blur时候的认证
        init: function(opts, enableBlurValid) {
            this.$dom = $(opts.selector);
            this.__initTipDom();
            //this.$tip = this.$dom.find('.tip');
            this.rules = opts.rules;
            this.correctMsg = opts.correctMsg || $.fn.myValidator.defaults.correctMsg;
            this.tipMsg = opts.tipMsg || $.fn.myValidator.defaults.tipMsg;
            this.$dom.on('focus', this.__focusHandler.bind(this));
            if (enableBlurValid) {
                this.$dom.on('blur', this.valid.bind(this));
            }
        },
        //根据配置的规则进行验证，通过返回true，不通过返回false
        valid: function() {
            for (var i = 0, len = this.rules.length; i < len; i++) {
                var curRule = this.rules[i],
                    args = curRule.args && curRule.args.slice() || [], //使用slice复制数组，防止对原数组修改
                    result;
                args.unshift(this.$dom.val());
                args.push(curRule.errorMsg || $.fn.myValidator.defaults.errorMsg);
                if (result = $.fn.myValidator.strategies[curRule.rule].apply(this.$dom, args)) {
                    this.__showErrorMsg(result);
                    return false;
                }
            }
            this.__showCorrectMsg(this.correctMsg);
            return true;
        },
        __focusHandler: function(e) {
            this.__showTipMsg(this.tipMsg);
        },
        __initTipDom: function() {
            this.$tip = $('<span class="tip"></span>');
            this.$dom.after(this.$tip);
        },
        __showErrorMsg: function(errorMsg) {
            this.$dom.addClass('error').removeClass('correct');
            this.$tip.removeClass('correct').addClass('error');
            this.$tip.text(errorMsg);
        },
        __showCorrectMsg: function(correctMsg) {
            this.$dom.addClass('correct').removeClass('error');
            this.$tip.removeClass('error').addClass('correct');
            this.$tip.text(correctMsg);
        },
        __showTipMsg: function(tipMsg) {
            this.$dom.removeClass('correct').removeClass('error');
            this.$tip.removeClass('error').removeClass('correct');
            this.$tip.html(tipMsg);
        },
        reset: function() {
            this.$dom.removeClass('correct').removeClass('error');
            this.$tip.removeClass('error').removeClass('correct');
            this.$dom.val('');
        }
    };
    var MyValidator = {
        init: function(form, opts) {
            this.$form = form;
            this.opts = opts;
            this.strategies = opts.strategies;
            this.$btnSubmit = $(opts.btnSubmit);
            this.$btnReset = $(opts.btnReset);
            this.showAllErrorMsg = opts.showAllErrorMsg || $.fn.myValidator.defaults.showAllErrorMsg;
            if (opts.tipType === 1) {
                this.$form.addClass('style1');
            } else {
                this.$form.addClass('style2');
            }
            var enableBlurValid = opts.enableBlurValid == undefined ? $.fn.myValidator.defaults.enableBlurValid : opts.enableBlurValid;
            this.validFields = [];
            this.__initFields(enableBlurValid);
            this.__initEvent();
        },
        __initFields: function(enableBlurValid) {
            for (var i = 0, len = this.strategies.length; i < len; i++) {
                var field = Object.create(FormField);
                field.init(this.strategies[i], enableBlurValid);
                this.validFields.push(field);
            }
        },
        __initEvent: function() {
            this.$form.on('submit', this.submitForm.bind(this));
            this.$form.on('reset', this.resetForm.bind(this));
            if (this.$btnSubmit) {
                //以submit()的方式手动触发，不会触发表单的'submit'事件
                this.$btnSubmit.on('click', this.submitForm.bind(this));
            }
            if (this.$btnReset) {
                this.$btnReset.on('click', this.resetForm.bind(this));
            }

        },
        valid: function() {
            var result = true;
            for (var i = 0, len = this.validFields.length; i < len; i++) {
                var tmp = this.validFields[i].valid();
                result = result === false ? false : tmp;
                //判断是否显示所有的错误信息，还是只显示第一条
                if (!result && !this.opts.showAllErrorMsg) {
                    return result;
                }
            }
            return result;
        },
        submitForm: function(e) {
            //提交时，验证前的回调
            if (this.opts.beforeCheck) {
                this.opts.beforeCheck.call(this.$form, this.$form);
            }
            var validResult = this.valid();
            //验证之后，提交之前的回调
            if (this.opts.beforeSubmit) {
                this.opts.beforeSubmit.call(this.$form, this.$form, validResult);
            }
            if (validResult) {
                //提交表单
                this.$form.submit();
            }
            //如果是点击type=submit的按钮触发，需要阻止其默认事件
            e.preventDefault();
        },
        resetForm: function(e) {
            for (var i = 0, len = this.validFields.length; i < len; i++) {
                this.validFields[i].reset();
            }
            e.preventDefault();
        },
    };
    $.fn.myValidator = function(opts) {
        var instance;
        this.each(function() {
            instance = $(this).data('myValidator');
            if (!instance) {
                instance = Object.create(MyValidator);
                instance.init($(this), opts);
                $(this).data('myValidator', instance);
            }
        });
        return instance;
    };
    $.fn.myValidator.defaults = {
        btnSubmit: '', //表单提交按钮的selector，如果通过点击type=submit的按钮触发，则不需要指定该项
        btnReset: '', //表单重置按钮的selector,如果通过点击type=reset的按钮触发，则不需要指定该项
        tipType: 1, //提示信息显示类型，为1代表提示信息在下方显示，2代表在右侧显示
        beforeCheck: function(curForm) {}, //表单提交时，验证之前的回调函数，参数curForm代表当前待验证的表单
        beforeSubmit: function(curForm, passed) {}, //表单提交时，验证之后触发的回调函数，参数curForm代表当前待验证表单，passed代表表单验证是否通过
        tipMsg: '请输入信息！', //字段获取焦点
        errorMsg: '输入信息有误！', //验证有误时默认的提示信息
        correctMsg: '输入正确!,', //验证正确时的提示信息
        enableBlurValid: true, //是否开启当焦点离开表单字段时，加以验证，否则在表单提交前一次性验证
        showAllErrorMsg: true, //表单验证时是否显示所有的错误信息，默认为true，否则仅显示第一条错误信息
    };
    //定义各种验证规则
    $.fn.myValidator.strategies = {
        required: function(value, errorMsg) {
            if (!value) {
                return errorMsg;
            }
        },

        minLength: function(value, minLen, errorMsg) {

            if (!value || value.length < minLen) {
                return errorMsg;
            }

        },
        maxLength: function(value, maxLen, errorMsg) {

            if (!value || value.length > maxLen) {
                return errorMsg;
            }

        },

        email: function(value, errorMsg) {

            if (!value || !/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/.test(value)) {
                return errorMsg;
            }

        },
        phoneNum: function(value, errorMsg) {

            if (!value || !/^1[3|4|5|8][0-9]\d{4,8}$/.test(value)) {
                return errorMsg;
            }
        },
        same: function(value, selector, errorMsg) {

            if (!value || value !== document.querySelector(selector).value) {
                return errorMsg;
            }
        },
        custom: function(value, reg, errorMsg) {
            if (!value || !reg.test(value)) {
                return errorMsg;
            }
        }
    };
})(jQuery);
