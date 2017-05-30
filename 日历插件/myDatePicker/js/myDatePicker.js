(function($) {
    var myDatePicker = {
        init: function(dom, opt) {
            this.$input = dom;
            this.settings = $.extend(true, {}, $.fn.myDatePicker.defaults, opt);
            this.selectDay = this.settings.select === 'day' ? true : false;
            this.__createDateTable();
            var curDate = new Date();
            if (this.selectDay) {
                if (this.settings.startDate) {
                    this.startDate = new Date(this.settings.startDate);
                }
                if (this.settings.endDate) {
                    this.endDate = new Date(this.settings.endDate);
                }
                //默认选中当天
                this.selectDate = this.__isValidDay(curDate) ? curDate : undefined;
            } else {
                this.selectDuration = [];
                this.selectDurationInorder = [];
            }

            this.__refreshDate(curDate.getFullYear(), curDate.getMonth());
            this.__initEvent();
            this.$datePickerDiv.hide();
        },
        __initEvent: function() {

            //窗口大小改变时，调整日历组件的位置
            $(window).on('resize', this.__setDatePickerLayout.bind(this));
            //输入框获得焦点时，日历显示
            var self = this;
            this.$input.on('focus', function(e) {
                this.value = '';
                self.$datePickerDiv.show();
            });
            //为向前，向后按钮添加点击事件
            this.$prev.on('click', this.__prev.bind(this));
            this.$next.on('click', this.__next.bind(this));
            //为表格添加点击事件

            this.$datePickerDiv.on('click', 'td', function(e) {
                var target = e.target;
                if (target.className === 'disable') {
                    return;
                } else {
                    var date = new Date(self.curYear, self.curMonth, target.innerHTML);
                    if (self.selectDay) {
                        self.setSelectDate(date);
                    } else {
                        self.__addToSelectDuration(date);
                    }
                }
            });
            //为确定，取消按钮添加事件
            this.$certain.on('click', this.__certainHandler.bind(this));
            this.$cancel.on('click', this.__cancelHandler.bind(this));
        },
        //将日期对象格式化为xxxx-xx-xx的字符串
        __formatDate: function(date) {
            if (!date) {
                return;
            }
            return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
        },
        __certainHandler: function(e) {
            if (this.selectDay) {
                if (!this.selectDate) {
                    alert('请选择日期');
                    return;
                }
                this.$input.val(this.__formatDate(this.selectDate));
                if (this.settings.daySelectedCallback) {
                    this.settings.daySelectedCallback.call(this, this.selectDate);
                }
            } else {
                if (this.selectDurationInorder.length < 2) {
                    alert('请选择时间段！');
                    return;
                }
                var minDate = this.selectDurationInorder[0],
                    maxDate = this.selectDurationInorder[1],
                    dateDiff = this.__dateDiff(maxDate, minDate);
                //console.log('dateDiff', dateDiff);
                if (this.settings.minDuration && dateDiff < this.settings.minDuration || this.settings.maxDuration && dateDiff > this.settings.maxDuration) {
                    alert('时间跨度不符合要求，最小跨度为' + this.settings.minDuration + ',最大跨度为' + this.settings.maxDuration + '!');
                    return;
                }

                this.$input.val(this.__formatDate(this.selectDurationInorder[0]) + '—' + this.__formatDate(this.selectDurationInorder[1]));
                if (this.settings.durationSelectCallback) {
                    this.settings.durationSelectCallback.call(this, this.selectDurationInorder[0], this.selectDurationInorder[1]);
                }

            }
            this.$datePickerDiv.hide();
        },
        __cancelHandler: function(e) {
            this.$input.val('');
            this.$datePickerDiv.hide();
        },
        __createDateTable: function() {
            var datePickerDiv = document.createElement('div');
            datePickerDiv.className = 'mydatepicker-wrapper';
            var str = '';
            //头部的日期选择区域
            str += '<div class="mydatepicker-title_wrapper"><span id="prev" class="mydatepicker-prev"><</span><span id="year">2017</span>年<span id="month">五</span>月<span id="next" class="mydatepicker-next">></span></div>';
            //表格
            str += '<table class="mydatepicker-table">';
            //表头
            str += '<tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>';
            //表格主体部分
            for (var i = 0; i < 6; i++) {
                str += '<tr>';
                for (j = 0; j < 7; j++) {
                    str += '<td></td>'
                }
                str += '</tr>';
            }
            str += '</table>';
            //如果是时间段选择，需要呈现“确定”,"取消按钮"
            str += '<div class="myDatePicker-btn_wrapper"><button class="myDatePicker-certain button" id="certain">确定</button><button class="myDatePicker-cancel button" id="cancel">取消</button></div>';
            datePickerDiv.innerHTML = str;
            document.body.appendChild(datePickerDiv);
            this.$datePickerDiv = $(datePickerDiv);
            this.__setDatePickerLayout();
            this.$tds = this.$datePickerDiv.find('td');
            this.$yearSpan = this.$datePickerDiv.find('#year');
            this.$monthSpan = this.$datePickerDiv.find('#month');
            this.$prev = this.$datePickerDiv.find('#prev');
            this.$next = this.$datePickerDiv.find('#next');
            this.$certain = this.$datePickerDiv.find('#certain');
            this.$cancel = this.$datePickerDiv.find('#cancel');
        },
        __setDatePickerLayout: function() {
            var position = this.$input.position();
            this.$datePickerDiv.css('top', position.top + this.$input.height() + 10);
            this.$datePickerDiv.css('left', position.left);
        },
        //获取所选择日期的接口
        getSelectDate: function() {
            if (this.selectDay) {
                return this.selectDate;
            }
        },
        //设定选择日期的接口
        setSelectDate: function(date) {
            this.selectDate = date;
            this.__refreshDate(date.getFullYear(), date.getMonth());
        },
        __addToSelectDuration: function(date) {
            //选择两个时期，构成一个事件段
            if (this.selectDuration.length >= 2) {
                this.selectDuration.shift();
            }
            this.selectDuration.push(date);
            var len = this.selectDuration.length;
            this.__refreshDate(this.selectDuration[len - 1].getFullYear(), this.selectDuration[len - 1].getMonth());
        },
        __markSelectDate: function(date) {
            if (!date) {
                return;
            }
            var selectYear = date.getFullYear(),
                selectMonth = date.getMonth(),
                selectDate = date.getDate();
            if (selectYear === this.curYear && selectMonth === this.curMonth) {
                var startIndex = this.__getFirstXingqi(this.curYear, this.curMonth);
                this.$tds[startIndex + selectDate - 1].className = 'select';
            }
        },
        //获取对应月第一天的星期
        __getFirstXingqi: function(year, month) {
            var date = new Date(year, month, 1);
            //星期,星期是从0开始索引，0对应周日
            return date.getDay();
        },
        //根据年，月刷新日期控件
        __refreshDate: function(year, month) {
            this.curYear = year;
            this.curMonth = month;
            var date = new Date(year, month, 1);
            //星期,星期是从0开始索引，0对应周日
            var xingqi = date.getDay();
            var curMonth_dayNum = this.__getMonthDayNum(date.getFullYear(), date.getMonth() + 1);
            var prevDate = this.__getPrevDate(year, month);
            var lastMonth_dayNum = this.__getMonthDayNum(prevDate.year, prevDate.month + 1);
            var index = xingqi;
            var tmpDate = new Date();
            for (var i = index - 1; i >= 0; i--) {
                this.$tds[i].innerHTML = lastMonth_dayNum - (i - index + 1);
                this.$tds[i].className = 'disable';
            }
            for (var i = index; i < index + curMonth_dayNum; i++) {
                this.$tds[i].innerHTML = i - index + 1;
                this.$tds[i].className = '';
                //还需要和日期的上限与下限进行比较
                tmpDate.setFullYear(this.curYear);
                tmpDate.setMonth(this.curMonth);
                tmpDate.setDate(i - index + 1);
                tmpDate.setHours(0);
                tmpDate.setMinutes(0);
                tmpDate.setSeconds(0);
                tmpDate.setMilliseconds(0);
                //tmpDate=new Date(this.curYear,this.curMonth,i-index+1);
                if (this.selectDay) {
                    if (!this.__isValidDay(tmpDate)) {
                        this.$tds[i].className = 'disable';
                    }
                } else {
                    if (this.__isInDuration(tmpDate)) {
                        this.$tds[i].className = 'induration';
                    }
                }

            }
            for (var i = index + curMonth_dayNum; i < 42; i++) {
                this.$tds[i].innerHTML = i - (index + curMonth_dayNum) + 1;
                this.$tds[i].className = 'disable';
            }

            this.$yearSpan.text(this.curYear);
            this.$monthSpan.text(this.curMonth + 1);
            if (this.selectDay) {
                this.__markSelectDate(this.selectDate);
            } else {
                this.__markSelectDate(this.selectDuration[0]);
                this.__markSelectDate(this.selectDuration[1]);
            }
        },
        __isValidDay: function(date) {
            if ((this.startDate && this.__compareDate(date, this.startDate) < 0) || (this.endDate && this.__compareDate(date, this.endDate) > 0)) {
                return false;
            }
            return true;
        },
        //时间段选择中，判断是否在选择区间
        __isInDuration: function(date) {
            if (this.selectDuration.length !== 2) {
                return false;
            }
            //按照时间早晚进行排序
            var minIndex = this.selectDuration[0] - this.selectDuration[1] < 0 ? 0 : 1;
            this.selectDurationInorder = [this.selectDuration[minIndex], this.selectDuration[1 - minIndex]];
            if (date - this.selectDurationInorder[0] >= 0 && date - this.selectDurationInorder[1] <= 0) {
                return true;
            }
            return false;
        },
        //计算两个日期相差的天数
        __dateDiff: function(date1, date2) {
            return Math.ceil(Math.abs((date1 - date2) / 1000 / 60 / 60 / 24)) + 1;
        },
        //点击向前的按钮
        __prev: function() {
            var date = this.__getPrevDate(this.curYear, this.curMonth);
            this.__refreshDate(date.year, date.month);
        },
        //点击向后的按钮
        __next: function() {
            var date = this.__getNextDate(this.curYear, this.curMonth);
            this.__refreshDate(date.year, date.month);
        },
        __resetTds: function() {
            this.$tds.each(function() {
                this.className = '';
            });
        },
        //判断是否是闰年
        __isLeapYear: function(year) {
            if (year % 400 == 0) {
                return true;
            }
            if (year % 4 == 0 && year % 100 != 0) {
                return true;
            }
            return false;
        },
        //获得year/month有多少天
        __getMonthDayNum: function(year, month) {
            var dayNum = 30;
            if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
                dayNum = 31;
            } else
            if (month == 2 && this.__isLeapYear(year)) {
                dayNum = 29;
            } else if (month == 2) {
                dayNum = 28;
            }
            return dayNum;
        },
        //比较两个日期的大小
        //如果返回值>0,说明date1对应的日期晚于date2
        //如果返回值=0，说明两个日期指向的是同一天
        //如果返回值<0,说明date1晚于date2
        __compareDate(date1, date2) {
            return date1 - date2;
        },
        __getPrevDate: function(year, month) {
            // console.log('before prev:' + 'year:' + year + ',month:' + month);
            var result;
            if (month > 0) {
                result = { 'year': year, 'month': month - 1 };
            } else {
                result = { 'year': year - 1, 'month': 11 };
            }

            // console.log('after prev:' + 'year:' + result.year + ',month:' + result.month);
            return result;
        },
        __getNextDate: function(year, month) {
            var result;
            if (month < 11) {
                result = { 'year': year, 'month': month + 1 };
            } else {
                result = { 'year': year + 1, 'month': 0 };
            }
            return result;
        }


    };
    $.fn.myDatePicker = function(opts) {
        var instance;
        this.each(function() {
            instance = $(this).data('myDatePicker');
            if (!instance) {
                instance = Object.create(myDatePicker);
                instance.init($(this), opts);
            }
        });
        return instance;
    };
    $.fn.myDatePicker.defaults = {
        select: 'day', //可选为day,duration,选择一天还是选择一个事件段，默认为一天
        minDuration: undefined, //时间段选择时，时间段选择的最小跨度
        maxDuration: undefined, //时间段选择时，时间段选择的最大跨度
        callback: null, //选订之后的回调函数
        startDate: undefined, //日期选择时，可选日期的上限，默认不设置上限
        endDate: undefined, //日期选择时，可选日期的下限，默认不设置下限
        daySelectedCallback: null, //select为day的时候，选定只有的回调函数
        durationSelectCallback: null, //select为duration的时候，选定之后的回调函数
    };
})(jQuery);
