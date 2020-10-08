
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