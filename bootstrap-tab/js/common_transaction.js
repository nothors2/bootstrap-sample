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
 