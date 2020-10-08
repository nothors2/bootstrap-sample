function fn_initRMate(config){
    if(config.resize)
        setResizeHeightObjs(config.gridDiv);//
    if(config.gridDiv == undefined) {//필수
        console.error("gridDiv(grid Holder) undefined!!");
        return;
    }
    if(config.navBar != undefined && config.navBar.rowPerPage == undefined ) {
        config.navBar.rowPerPage = "200";
    }
    var cfg = {
        id:config.id||"grid",
        gridDiv:config.gridDiv,
        layoutStr:config.layoutStr,
        width:config.width||"100%",
        height:config.height||"100%",
        layoutComplete:config.layoutComplete,
        events:config.events,
        navBar:config.navBar,
    };
    var rMate = new RMate(cfg);
    rMate.init();
    return rMate;
}
function RMate(config) {
    this.gridApp = null;
    this.gridRoot = null;
    this.totalCount = null; //페이지바용
    this.config = config;
    this.init = function(){
        var jsVars = {
            rMateOnLoadCallFunction:this.gridReadyHandler
        }
        document.getElementById(this.config.gridDiv).rmateObj = this;//다른방법?
        rMateGridH5.create(this.config.id, this.config.gridDiv, jsVars, this.config.width, this.config.height);
    }
    this.gridReadyHandler = function(id) {

        gridApp = document.getElementById(id);  // 그리드를 포함하는 div 객체
        gridRoot = gridApp.getRoot();   // 데이터와 그리드를 포함하는 객체

        //gridApp.setData(gridData);

        var rmate = gridApp.parentElement.rmateObj;
        gridApp.setLayout(rmate.config.layoutStr);
        rmate.gridApp = gridApp;
        rmate.gridRoot = gridRoot;
        if(rmate.config.layoutComplete){
            gridRoot.addEventListener("itemDataChanged", rmate.itemDataChangedHandler);
            gridRoot.addEventListener("layoutComplete", rmate.config.layoutComplete,false);
            gridRoot.addEventListener("layoutComplete", function(){
                                                            rmate.setEvent(rmate);
                                                        }
                                      );
        }
    }
    this.setEvent = function( rmate) {
        dataGrid = rmate.gridRoot.getDataGrid();
        for(var i in rmate.config.events){
            var event = rmate.config.events[i];
            dataGrid.addEventListener(event.name, event.handler,false);
        }
    }
    this.setDataStart = function(){
        this.gridRoot.removeAll();
        this.gridRoot.addLoadingBar();
    }
    this.setDataEnd = function(data){
        this.gridRoot.removeLoadingBar();
        if(data){
            this.gridApp.setData(data.resultList);
            if(this.config.navBar){
                if(data.resultTotalCount) this.config.navBar.totalCount = data.resultTotalCount;
                else this.config.navBar.totalCount = data.resultList.length;
            }
        }
        if(this.config.navBar){
            if(this.config.navBar.currentPage == null) this.config.navBar.currentPage = 1;
            this.drawGridPagingBar(this.config.navBar,this.config.navBar.currentPage);
        }
        this.gridRoot.removeLoadingBar();
    }
    this.setDataTotalCount = function(totalCount){
        this.config.navBar.totalCount = totalCount;
    }
    this.gridMovePage = function(goPage) {
        this.config.navBar.selectFuntion(goPage);
        this.config.navBar.currentPage = goPage;
    }
    this.drawGridPagingBar = function(navCfg,currentPage) {
        //var gridRowsPerPage;	// 1페이지에서 보여줄 행 수
        var gridViewPageCount = 10;		// 페이지 네비게이션에서 보여줄 페이지의 수
        //var gridCurrentPage;	// 현재 페이지

        var gridStartTxt = "≪";
        var gridEndTxt = "≫";
        var gridPrevTxt = "◀";
        var gridNextTxt = "▶";
        var gridPageGapTxt = " ";	// 페이지 사이의 구분을 위한 문자 - 사용하지 않을 경우 공백을 넣습니다.

        var gridTotalPage = parseInt((navCfg.totalCount-1)/navCfg.rowPerPage + 1);
        var navBarDiv = document.getElementById(navCfg.barDiv);
        if (gridTotalPage == 0) {
            navBarDiv.innerHTML = "<span class='gridPagingDisable'>" + gridStartTxt + "</span> <span class='gridPagingDisable'>" + gridPrevTxt + "</span> <span class='gridPagingDisable'>" + gridNextTxt + "</span> <span class='gridPagingDisable'>" + gridEndTxt + "</span>";
            return;
        }

        var retStr = "";
        var prepage = parseInt((currentPage - 1)/gridViewPageCount) * gridViewPageCount;
        var nextpage = ((parseInt((currentPage - 1)/gridViewPageCount)) * gridViewPageCount) + gridViewPageCount + 1;

        var searchFunction = this.config.id + ".gridMovePage";
        // 맨앞으로
        retStr += "<span class=";
        if (currentPage > 1) {
            retStr += "'gridPagingMove'><a href='javascript:this."+searchFunction+"(1)'>" + gridStartTxt + "</a></span> ";
        } else {
            retStr += "'gridPagingDisable'>" + gridStartTxt + "</span> ";
        }
        // 앞으로
        retStr += "<span class=";
        if (currentPage > gridViewPageCount) {
            retStr += "'gridPagingMove'><a href='javascript:this."+searchFunction+"(" + prepage + ")'>" + gridPrevTxt + "</a></span>&nbsp; ";
        } else {
            retStr += "'gridPagingDisable'>" + gridPrevTxt + "</span>&nbsp; ";
        }

        for (var i = (1 + prepage); i < gridViewPageCount + 1 + prepage; i++) {
            if (currentPage == i) {
                retStr += "<span class='gridPagingCurrent'>";
                retStr += i;
                retStr += "</span>";
            } else {
                retStr += "<span>";
                retStr += "<a href='javascript:this."+searchFunction+"(" + i + ")'>" + i + "</a>";
                retStr += "</span>";
            }
            if (i >= gridTotalPage) {
                retStr += " ";
                break;
            }
            if (i == gridViewPageCount + prepage)
                retStr += " ";
            else
                retStr += gridPageGapTxt;
        }

        // 뒤로
        retStr += "&nbsp;<span class=";
        if (nextpage <= gridTotalPage) {
            retStr += "'gridPagingMove'><a href='javascript:this."+searchFunction+"(" + nextpage + ")'>" + gridNextTxt + "</a></span> ";
        } else {
            retStr += "'gridPagingDisable'>" + gridNextTxt + "</span> ";
        }

        // 맨뒤로
        retStr += "<span class=";
        if (currentPage != gridTotalPage) {
            retStr += "'gridPagingMove'><a href='javascript:this."+searchFunction+"(" + gridTotalPage + ")'>" + gridEndTxt + "</span>";
        } else {
            currentPage += "'gridPagingDisable'>" + gridEndTxt + "</span>";
        }
        navBarDiv.innerHTML = retStr;
    }
    this.itemDataChangedHandler = function(event) {
        var rid = event.rowIndex;
        var message = "itemDataChangedHandler " + event.type + " 이벤트 발생," + " rowIndex:" + rid + " columnIndex2:" + event.columnIndex;

        console.log(message);
        var rmate = document.getElementById(event.currentTarget.id).parentElement.rmateObj;
        var selectorColumn = rmate.gridRoot.getObjectById("selector");
        if(selectorColumn==undefined) return;
        var sArr = selectorColumn.getSelectedIndices();
        var idx = sArr.indexOf(rid);
        //var data = rmate.gridRoot.getItemAt(rid);
        if(idx>-1){
            //sArr.splice(idx,1);
        }else{
            sArr.push(rid);
        }
        //return;
        //sArr[event.rowIndex] = 1;
        selectorColumn.setSelectedIndices(sArr);

        var dataGrid = rmate.gridRoot.getDataGrid();
        //dataGrid.setEditedItemPosition(rid,event.columnIndex);

//        console.log(message);
        //alert("데이터 수정됨");
    }
}
