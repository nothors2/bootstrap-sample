//화면 리사이즈시 변경되어야 할 object ids
var resizeHeightObjs = [];
var heightBottom = 0;

$(window).resize(function () {
    resizeHeight();
});

function setResizeHeightObjs () {
    for(var i = 0;i<arguments.length;i++){
        if(!resizeHeightObjs[arguments[i]])
            resizeHeightObjs.push(arguments[i]);
    }
    resizeHeight();
}
function resizeHeight () {
    for(var i=0;i<resizeHeightObjs.length;i++){
        try{
            var tabHeight = window.innerHeight - $("#"+resizeHeightObjs[i]).offset().top; //
            var btm = heightBottom;
            if(resizeHeightObjs.length > 1 && resizeHeightObjs[i] == "tabList") btm = 0;   //전체화면은 밑부분은 제외
            if($("#"+resizeHeightObjs[i]).offset().top == 0) continue;
            $("#"+resizeHeightObjs[i]).height(tabHeight -5 - 40 - btm); //message bar 제외
        }catch(e){
            console.log("Div 이름 확인 : "+resizeHeightObjs[i]);
        }
    }
}


//modal, vue alert, confirm ,select2 //vue 라이버러리 필요
var app_alert ;
$(document.body).ready(function () {
    Vue.component('select2', {
        props: ['options', 'value' ,'url','para'],
        template: '<select>\
                     <slot></slot>\
                   </select>',
        mounted: function () {
            var _url = this.url;
            if(_url.indexOf('/') == -1){
                _url = "/common/selectList.do/" + _url;
            }
            var vm = this;
            var _para = this.para;
            if(this.options){
                $(this.$el).select2({ data: this.options, closeOnSelect: true, allowClear: true  })
                           .val(this.value);
            }else{
                $(this.$el)
                    // init select2
                    //.select2({ data: this.options, closeOnSelect: true, allowClear: true  })
                    .select2({
                            placeholder: '선택',
                            //templateResult: formatState,
                            closeOnSelect: true,
                            allowClear: true,
                            minimumInputLength: 1,
                            ajax: {
                                url:_url,
                                type:"POST",
                                dataType: 'json',
                                contentType : "application/json; charset=UTF-8",
                                delay: 250,
                                data: function (params) {
                                          //var para = {};
                                          _para.q = params.term;
                                          var param = {
                                              map: _para
                                          };
                                          return JSON.stringify(param);
                                      },
                                processResults: function (data, params) {
                                    params.page = params.page || 1;
                                    var results = data.resultList.map(function(obj){
                                        obj.id = obj.id||obj.value;
                                        obj.text = obj.value + ' ' + obj.text;
                                        return obj;
                                    });
                                    return {
                                        results: results,
                                    };
                                },
                                cache: false
                            },
                    })
                    .val('1234')
                    .trigger('change')
                    // emit event on change.
                    .on('change', function () {
                        vm.$emit('input', this.value)
                        })
                    ;
           }
        },
        watch: {
            value: function (value) {
                // update value
                $(this.$el)
                    .val(value)
                    .trigger('change')
            },
            options: function (options) {
                // update options
                $(this.$el).empty().select2({ data: options })
            }
        },
        destroyed: function () {
            $(this.$el).off().select2('destroy')
        }
    });

    var vue_temp = '    \
        <div class="container" id="vuemodalalert"> \
            <!--<h5>vue test 동적 (Alert) 테스트 </h5>\
            <button id="show-modal" @click="showModal = true">Show Modal</button>-->\
            <modal-alert v-if="showModal" @close="showModal = false">\
                <h3 slot="header">{{headText}}</h3>\
                <h4 slot="body">{{message}}</h4>\
                <h5 slot="footer">\
                    <button v-if=\'showModalConfirm\' class="modal-default-button btn btn-primary" @click="rtnConfirm(\'Y\')">\
                        Yes\
                    </button>\
                    &nbsp;\
                    <button v-if=\'showModalConfirm\' class="modal-default-button btn btn-primary" @click="rtnConfirm(\'N\')">\
                        No\
                    </button>\
                    &nbsp;\
                    <button class="modal-default-button btn btn-primary" @click="showModal = false">\
                        Close\
                    </button>\
                </h4>\
            </modal-alert>\
        </div>';

    Vue.component('modal-alert', {
        template: ' \
        <transition name="modal">\
            <div class="modal-mask">\
                <div class="modal-wrapper">\
                    <div class="modal-container"> \
                        <div class="modal-header">\
                            <slot name="header">\
                                default header\
                            </slot>\
                        </div> \
                        <div class="modal-body">\
                            <slot name="body">\
                                default body\
                            </slot>\
                        </div> \
                        <div class="modal-footer">\
                            <slot name="footer"> \
                                <button class="modal-default-button" @click="$emit(\'close\')">\
                                    Close\
                                </button>\
                            </slot>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </transition> '
    })



    //$(vue_temp).appendTo('#appTest1');
    $(document.body).append(vue_temp);
    app_alert = new Vue({
        el: '#vuemodalalert',
        data: {
            showModal: false,
            headText: "Alert",
            message: "안녕하세요",
            showModalConfirm:''
        }
    })



    /*달력*/
    Vue.component('datepicker', {
    props: ['value'],
    template: '<input  :value="value"  style="text-align: center;"/>',
    mounted: function() {
      var self = this;
      $(this.$el).datepicker({
        dateFormat: "yy-mm-dd",
        prevText: '이전 달',
        nextText: '다음 달',
        monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        dayNames: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
        showMonthAfterYear: true,
        yearSuffix: '년',
        changeMonth: true,
        changeYear: true,
        //buttonImage: "images/calendar.gif",
        onSelect: function(d){
          //self.$emit('update-date',d);
          self.$emit('input',d);
          //self.value = d;
          //$(self.$el).value = d;
         // $(self.$el).val(d);
        }
      });
    },
    beforeDestroy: function(){$(this.$el).datepicker('hide').datepicker('destroy')}
    });
    /*달력(월)  <monthpicker v-model="date1" ></monthpicker>*/
    Vue.component('monthpicker', {
    props: ['value' ],
    template: '<input   :value="value" style="text-align: center;"/>',
    mounted: function () {
      var self = this;
      $(this.$el).monthpicker({
        pattern: 'yyyy-mm',// input태그에 표시될 형식
        startYear: 2000, // 시작연도
        finalYear: 2032, // 마지막연도 //
        monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'], // 화면에 보여줄 월이름
        openOnFocus: true, // focus시에 달력이 보일지 유무
        disableMonths: [], // 월 비활성화
      });
      $(this.$el).monthpicker().bind('monthpicker-click-month',function(e,month,year){
        var settings = $(self.$el).data('monthpicker').settings;
        var val = settings.selectedYear + '-' + (settings.selectedMonth<10?'0':'') + settings.selectedMonth;
        self.$emit('input', val);
      });
    },
    beforeDestroy: function () { $(this.$el).monthpicker('hide').monthpicker('destroy') }
    });

});

function fn_alert(msg,time){
    app_alert.message=msg;
    app_alert.showModal=true;
    var time
    var reset = function(){
        app_alert.showModal=false;
    }
    setTimeout(reset,3000);
}
function fn_confirm(msg,callback){
    return confirm(msg);
    // app_alert.message=msg;
    // app_alert.showModalConfirm=true;
    // app_alert.showModal=true;
    // app_alert.confirmCallBack = callback;
}


//vue 사용없이 ex) fn_setSelect2("#dept",{regn:'2'},"selectDeptList"); param.dept = $('#dept').val();
function fn_setSelect2(id,para,url) {
    if(url.indexOf('/') == -1){
        url = "/common/selectList.do/" + url;
    }
    $(id).select2({
        placeholder: '선택',
        //templateResult: formatState,
        closeOnSelect: true,
        allowClear: true,
        minimumInputLength: 1,
        ajax: {
            url:url,
            type:"POST",
            dataType: 'json',
            contentType : "application/json; charset=UTF-8",
            delay: 250,
            data: function (params) {
                      para.q = params.term;
                      var param = {
                          map: para
                      };
                      return JSON.stringify(param);
                  },
            processResults: function (data, params) {
                params.page = params.page || 1;
                var results = data.resultList.map(function(obj){
                    obj.id = obj.id||obj.value;
                    obj.text = obj.value + ' ' + obj.text;
                    return obj;
                });
                return {
                    results: results,
                };
            },
            cache: false
        },
    });
}

var app_code_popup;

$(document.body).ready(function () {
    var vue_temp2 = '    \
        <div   id="vuemodalpopup"> \
            <modal-alert v-if="showModal" @close="showModal = false">\
                <h3 slot="header">{{headText}}</h3>\
                <div slot="body">\
                    <select2 name="popupSelectCode" id="popupSelectCode" class="form-control" v-model="keys.code"    :url="url" :para="para"  style="width:300px" >\
                    </select2>\
                </div>\
                <h5 slot="footer">\
                    <button class="modal-default-button btn btn-primary" @click="selectCode()">\
                        선택\
                    </button>\
                    &nbsp;\
                    <button class="modal-default-button btn btn-primary" @click="showModal = false">\
                        닫기\
                    </button>\
                </h4>\
            </modal-alert>\
        </div>';
    $(document.body).append(vue_temp2);
    app_code_popup = new Vue({
        el: '#vuemodalpopup',
        data: {
            keys:{
                code:''
            },
            para:{
            },
            url:'selectDeptList',
            showModal: false,
            headText: "Code Search",
            message: "안녕하세요",
            callBack:function(){}
        },
        methods:{
            selectCode:function(){
                var data = $('#popupSelectCode').select2('data')[0];
                if(!data) return;
                //console.log(data);
                this.callBack(data);
                this.showModal = false;
            }
        }
    })
});

/* 동적 콤보 inner팝업 호출) 예)
            fn_getCodePopup({comp:'1'},'selectDeptList',
                function(data){
                    console.log("call data",data);
                },"조직 검색"
            );
*/
function fn_getCodePopup(param,url,callBack,title){
    if(title) app_code_popup.headText = title;
    app_code_popup.para=param;
    app_code_popup.url=url;
    app_code_popup.showModal=true;
    app_code_popup.callBack = callBack;
}

