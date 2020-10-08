var token_header = "X-CSRF-TOKEN";

$(document.body).ready(function () {
    $.ajaxSetup({headers:{'X-CSRF-TOKEN':$("#_csrf").attr("content")}});
});
function fn_transaction(func,url,data,define_callback){
    if($.isFunction(data)){
        define_callback = data;
        data = {};
    }
    //var _token = '';
    //if(token!==undefined) _token = token;
    $.ajax({
        type : 'POST',
        contentType : "application/json; charset=UTF-8",
        url : url,
        //beforeSend : function(xhr) {
            //xhr.setRequestHeader(token_header, _token);
            //xhr.setRequestHeader("AJAX", true);
        //},
        //async : (async ? async : true),
        data : JSON.stringify(data),
        dataType : "json",
        success : function(data,status) {
            define_callback(func,data,status); 
        },
        error : function(e) {
            if(e.responseText){
                var rtn = $.parseJSON(e.responseText);
                if(rtn.error.message) {
                    alert(rtn.error.message)
                    console.error(rtr.error.code);
                    console.error(rtr.error.message);
                }
            }else{
                console.error(e);
            }
        },
        done : function(e) {
        }
    });          
}
function fn_codeData(param,mapId,define_callback){
    fn_setCombo(param,mapId,define_callback);
}
function fn_setCombo(param,mapId,define_callback){
    var jsonData = {
        map: param
    };
    if($.isFunction(mapId)){
        define_callback = mapId;
        mapId = 'selectCodeList';
    }
    if(mapId == undefined) mapId = 'selectCodeList'; //코드 테이블
    fn_transaction('combosearch',"/common/selectList.do/"+mapId,jsonData,
        function(func,data, status){
            if(data.error){
                alert(data.error.message);
            }else{
                define_callback(data.resultList);
            }
        }
    );
}

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
