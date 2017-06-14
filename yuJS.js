(function (g,$,undefined) {
    //yuJS是一个全局方法库//实现了对当前项目的零耦合
    //jsonParse 一个全局parse方法

    //domReady 当前页面全部加载完执行参数中方法
    //screenWidth 获取当前屏幕可视区宽度
    //setEmFun 针对手机端设置rem或者em的基础值

    //deleteEmptyNode 删除节点中空子节点、注释子节点、换行或者空格子节点
    //appendChilds 给父元素添加多个子元素
    //prevNode 取当前元素上一个节点
    //nextNode 取当前节点下一个节点
    //ancestorNode获取祖先元素
    //nodeDescendant 只有第一个参数：获取某个元素下所有子元素，返回数组 存在第二个参数：获取某个元素下符合条件的子元素
    //childIndex 当前元素是父元素的第几个元素

    //addClass 元素添加某个class
    //minusClass 元素减去某个class
    //getDomCss 取节点某个属性
    //setOpacity 设置元素透明度
    //addTransition元素添加transition属性
    //rotate旋转元素
    //show 使用css3 transition实现展开动作
    //showN是对show做了改进
    //hide 使用css3 transition实现收缩动作
    //fadein元素淡入淡出
    //fadeout元素淡入淡出

    //ajax$ 实现对ajax的封装
    //getQueryString 获取当前url的后缀参数//调用方法不传参数则以数组形式取出所有后缀//调用参数为number类型（索引值）则根据索引取后缀/string则根据名称返回

    //scroll 元素添加滚动事件
    //pause延时方法
    //isArray是否是数组
    //setCookie添加cookie，默认有效期365天
    //delCookie删除coolie
    //isArray 是否是数组
    var yuJS={
        jsonParse : g.JSON && JSON.parse ? JSON.parse : eval,
     /////////////////////////////////////////////////////////////页面样式,页面运算相关
        domReady:function(funList){
            var isReady=false;
            var readyList= [].concat(funList);
            var timer;

            var onDOMReady=function(){
                for(var i=0;i< readyList.length;i++)
                {
                    readyList[i].apply(g);
                }
                readyList = null;
            }

            var bindReady = function(evt)
            {
                if(isReady) return;
                isReady=true;
                onDOMReady.call(g);
                if($.removeEventListener)
                {
                    $.removeEventListener("DOMContentLoaded", bindReady, false);
                }
                else if($.attachEvent)
                {
                    $.detachEvent("onreadystatechange", bindReady);
                    if(g == g.top){
                        clearInterval(timer);//事件发生后清除定时器
                        timer = null;
                    }
                }
            };

            if($.addEventListener){
                $.addEventListener("DOMContentLoaded", bindReady, false);
            }
            else if($.attachEvent)//非最顶级父窗口

            {
                $.attachEvent("onreadystatechange", function(){
                    if((/loaded|complete/).test($.readyState))
                        bindReady();
                });

                if(g == g.top)
                {
                    timer = setInterval(function(){
                        try
                        {
                            isReady||g.g.doScroll('left');//在IE下用能否执行doScroll判断 dom是否加载完毕
                        }
                        catch(e)
                        {
                            return;
                        }
                        bindReady();
                    },5);
                }
            }
        },
        screenWidth:function (dom) {
            dom=dom||$;
            return dom.body.offsetWidth;
        },
        setEmFun:function (options) {
            var options = options?options:{};
            if(!options.setEm)return;
            var param=options.setEm;
            var dom=param.dom?param.dom:$;
            if(!dom.body)return;
            var UIWidth=param.UIWidth?param.UIWidth:1080;
            var unitMatrix=param.unitMatrix?param.unitMatrix:100;
            this.actualPx =  this.screenWidth(dom)*unitMatrix / UIWidth;
            dom.documentElement.style.fontSize = this.actualPx + "px";
        },
     ////////////////////////////////////////////////////////////////////元素节点的运算
        deleteEmptyNode:function (elem){
            var newElem=elem;
            var elem_child = newElem.childNodes;
            for(var i=0; i<elem_child.length;i++){
                if(elem_child[i].nodeName == "#text" && !/\s/.test(elem_child.nodeValue)|| elem_child[i].nodeName == "#comment") {
                    newElem.removeChild(elem_child[i]);
                    i--;
                }
            }
            return newElem;
        },
        appendChilds:function (father,sonList) {
            var list=sonList||[];
            for(var i in list){0
                father.appendChild(list[i]);
            }
        },
        prevNode:function (elem) {
            var $parent=yuJS.deleteEmptyNode(elem.parentNode);
            var thisIndex=yuJS.childIndex(elem);
            return thisIndex-1>=0 && $parent.childNodes[thisIndex-1];
        },
        nextNode:function (elem) {
            var newElem;
            var getNext=function (elem) {
                var sonElem=elem.nextSibling;
                if(sonElem.nodeName == "#text" || sonElem.nodeName == "#comment"){
                    sonElem=getNext(sonElem);
                }
                return sonElem;
            }
            newElem=getNext(elem);
            return newElem;
        },
        ancestorNode:function (elem,upward) {
            upward=parseInt(upward);
            if(upward){
                var $ancestor=elem;
                while(upward){
                    $ancestor=$ancestor.parentNode;
                    upward--;
                }
                return $ancestor;
            }
            return null;
        },
        nodeDescendant:function (elem,selector) {
            if(!elem)return;
            //取所有子元素
            var arr=[];
            var done=function(node){
                if(node.children && node.children.length){
                    var childrenNodes=node.children;
                    for(var i=0,l=childrenNodes.length;i<l;i++){
                        arr.push(childrenNodes[i]);
                        done(childrenNodes[i]);
                    }
                }
                else return;
            };
            done(elem);
            if(!selector) return arr;
            //存在参数selector,则取符合条件的元素
            //根据选择器第一个字符判断是什么类型的选择器,然后匹配元素并返回匹配元素
            var matchNodes=[];
            switch (selector.charAt(0)){
                case '.':
                    for(var i=0,l=arr.length;i<l;i++){
                        var className=arr[i].getAttribute('class');
                        if(className && className.match(selector.substr(1,selector.length-1))){
                            matchNodes.push(arr[i]);
                        }
                    }
                    if(matchNodes[0])return matchNodes;
                    break;
                case '#':
                    for(var i=0,l=arr.length;i<l;i++){
                        var idName=arr[i].getAttribute('id');
                        if(idName && idName.match(selector.substr(1,selector.length-1))){
                            matchNodes.push(arr[i]);
                            break;
                        }
                    }
                    if(matchNodes[0])return matchNodes[0];
                    break;
                case '[':
                    for(var i=0,l=arr.length;i<l;i++){
                        var attribute=arr[i].getAttribute((selector.substr(1,selector.length-1)).substr(0,selector.length-2));
                        if(attribute||attribute===''){
                            matchNodes.push(arr[i]);
                        }
                    }
                    if(matchNodes[0])return matchNodes;
                    break;
                default:break;
            }
        },
        childIndex:function (elem) {
            if(!(elem instanceof HTMLElement))return;
            var index=null;
            var  childList=this.deleteEmptyNode(elem.parentNode).childNodes;
            for(var i in childList){
                if(childList[i]===elem)index=i;
            }
            return index;
        },
     /////////////////////////////////////////////////////////////////////元素样式操作
        addClass:function (ele,newClass) {
            if(ele.className.match(newClass))return;
            ele.className+=(" "+newClass);
        },
        minusClass:function (ele,className) {
            if(!ele.className.match(className))return;
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            ele.className = ele.className.replace(reg, ' ');
        },
        getDomCss:function(elem,name){
            if(elem.nodeName=='#text')return '0';
            if(elem.currentStyle) {
                return elem.currentStyle[name];
            }
            else {
                var oS=elem.style[name];
                //样式如果值为0时，重新设置为auto//如该元素style.height=0px（子元素有高度），此时如不赋值auto取出的该元素内容部分高度为0
                if(parseFloat(oS)===0)elem.style[name]='auto';
                var style = document.defaultView.getComputedStyle(elem,null);
                if(style[name]){
                    var retStr=style[name];
                    //如重新设置了样式，则还原
                    if(parseFloat(oS)===0)elem.style[name]=oS;
                    return retStr;
                }
                style=elem[name];
                //如重新设置了样式，则还原
                if(parseFloat(oS)===0)elem.style[name]=oS;
                if(style) return style;
                else return '0';
            }
        },
        setOpacity:function(ele, opacity) {
            if (ele.style.opacity != undefined) {
                ///兼容FF和GG和新版本IE
                ele.style.opacity = opacity / 100;
            } else {
                ///兼容老版本ie
                ele.style.filter = "alpha(opacity=" + opacity + ")";
            }
        },
        addTransition:function (ele,attr,duration,timing) {
            var style=(ele && ele.style)||ele;
            if(!!ele && !attr){
                style.transition='';
                style.webkitTransition='';
                style.oTransition='';
                style.mozTransition='';
                return;
            }
            timing=timing||'ease-in-out';
            duration=duration||'500ms';
            attr=attr||'all';
            style.transition=attr+' '+duration +' '+timing ;
            style.webkitTransition=attr+' '+duration +' '+timing;
            style.oTransition=attr+' '+duration+' '+timing;
            style.mozTransition=attr+' '+duration+' '+timing;
        },
        //DEMO
        // $$.rotate(elem,{
        //     deg:0
        // });
        rotate:function (elem,options) {
            if(!elem || elem.style==undefined || !options)return;
            var style=elem.style;
            var duration=parseInt(options.duration ||300)+'ms';
            var timing=options.timing||'ease';
            style.transition='transform '+duration +' '+timing ;
            style.webkitTransition='transform '+duration +' '+timing ;
            style.oTransition='transform '+duration +' '+timing ;
            style.mozTransition='transform '+duration +' '+timing ;
            style.transform='rotate('+options.deg+'deg)';
            style.transformOrigin=options.origin||'center center';
        },
        //     $$.show DEMO
        //     $$.show(elem,{
        //       opacity:'',
        //       height:''/'const'
        //     },timingStyle)
        show:function (elem,attObj,timingStyle) {
            if(!elem)return;
            var style=elem.style;
            var parentOH='';
            var parentOverflow='';
            if (elem && !timingStyle ) {
                style.display = 'block';
                return;
            }
            if(!attObj)return;
            if(attObj.opacity!=undefined){
               // yuJS.addTransition(style);
                style.transition='' ;
                style.webkitTransition='';
                style.oTransition='';
                style.mozTransition='';
                if (style.opacity != undefined) {
                    style.opacity = 0;
                } else {
                    style.filter = "alpha(opacity=0)";
                }
            }
            timingStyle=timingStyle||'ease';
            var getHeight=function (ele) {
                    var  h = yuJS.getDomCss(ele,'height').replace('px','');
                    var getSonHTotal=function (father) {
                        var height=0;
                        var childNodesList=father.childNodes;
                        if(!childNodesList)return false;
                        for(var i=0;i<childNodesList.length;i++){
                            var $this=childNodesList[i];
                            var getCSS=yuJS.getDomCss;
                            var tempH=getCSS($this,'height');
                            var thisChildH=getCSS($this,'display')=='none'?0:
                                ((getCSS($this,'float')=='left'||getCSS($this,'float')=='right') && i!=0?0:
                                    tempH=='auto'?'auto': parseFloat(tempH.replace('px','')));
                            if(thisChildH=='auto'||(!thisChildH && thisChildH!=0)){
                                thisChildH=getCSS($this,'offsetHeight');
                                if(thisChildH=='0'||thisChildH=='auto'||thisChildH==0){
                                    var newSon=getSonHTotal(childNodesList[i]);
                                    if(newSon)thisChildH=newSon;
                                    else{
                                        if(!thisChildH && thisChildH!=0)thisChildH=0;
                                        var minH=parseFloat(yuJS.getDomCss(childNodesList[i],'minHeight').replace('px',''));
                                        if(minH)thisChildH=minH;
                                    }
                                }
                            }
                            height+=thisChildH;
                        }
                        return height;
                    };
                    if(h=='auto'||h==0){
                        h=getSonHTotal(ele);
                    }
                    return h;
                };
            var isNum=typeof(timingStyle)==='number';
            var isNumStr=parseInt(timingStyle)>0;
            if(elem.parentNode){
                var $parent=elem.parentNode;
                var PS=$parent.style;
                var POH=$parent.offsetHeight;
                parentOH=attObj.height==='const'?POH+'px':PS.height;
                parentOverflow=this.getDomCss($parent,'overflow');
                PS.height=$parent.offsetHeight+'px';
                //PS.overflow = 'hidden';
                style.display='block';
            }
            var oHeight;
            var oPaddingT=this.getDomCss(elem,'paddingTop');
            var oPaddingB=this.getDomCss(elem,'paddingBottom');
            var oMarginT=this.getDomCss(elem,'marginTop');
            var oMarginB=this.getDomCss(elem,'marginBottom');
            var sonMarginT=(function () {
                elem=yuJS.deleteEmptyNode(elem);
                var childList=elem.childNodes;
                var total=0;
                total+=parseFloat(yuJS.getDomCss(childList[0],'marginTop')) ;
                if(total>0)return total+'px';
                //一下是遍历所有子元素取第一个有Margin的元素，该方法弃用
                // for(var i=0,l=childList.length;i<l;i++){
                //     total+=parseFloat(yuJS.getDomCss(childList[i],'marginTop')) ;
                //     //只取一个存在margin的子元素，之后存在margin如果计算，需要判断是否和当前在同一行，同一行的margin不因计算
                //     if(total>0)return total+'px';
                // }
                return '0px';
            })();
            if(attObj.height!=undefined){
                oHeight=getHeight(elem);
                if(parseFloat(oPaddingT)){style.paddingTop='0';}
                if(parseFloat(oPaddingB)){style.paddingBottom='0';}
                if(parseFloat(oMarginT)){style.marginTop=0;}
                if(parseFloat(oMarginB)){style.marginBottom=0;}
                style.height = 0+'px';
                style.overflow='hidden';
            }
            var duration=isNum?timingStyle+'ms':isNumStr?parseInt(timingStyle)+'ms':'300ms';
            var timing=(!isNum && !isNumStr && (timingStyle==='linear'||timingStyle.match('ease')))?timingStyle:'ease-in-out';
            style.transition='all '+duration +' '+timing ;
            style.webkitTransition='all '+duration +' '+timing;
            style.oTransition='all '+duration+' '+timing;
            style.mozTransition='all '+duration+' '+timing;
            style.overflow='all';
            setTimeout(function () {
                if(elem.parentNode){
                    elem.parentNode.style.height=parentOH||'auto';
                    elem.parentNode.style.overflow =parentOverflow|| 'visible';
                }
                var totalH=style.height =parseFloat(oHeight)+parseFloat(oPaddingT)+parseFloat(oPaddingB)+'px';
                if(parseFloat(oPaddingT)){
                    style.height=parseFloat(style.height)-parseFloat(oPaddingT)+'px';
                    style.paddingTop=oPaddingT;
                }
                if(parseFloat(oPaddingB)){
                    style.height=parseFloat(style.height)-parseFloat(oPaddingB)+'px';
                    style.paddingBottom=oPaddingB;
                }
                if(parseFloat(oMarginT)){style.marginTop=oMarginT;}
                if(parseFloat(oMarginB)){style.marginBottom=oMarginB;}
                //style.height =parseFloat(oHeight)+parseFloat(sonMarginT)+'px';
                setTimeout(function () {
                    style.height='auto';
                },parseInt(duration)*1.5-50);
                setTimeout(function () {
                    yuJS.setOpacity(elem,attObj && attObj.opacity && attObj.opacity.end||'100');
                },parseInt(duration)/6);
            },-1);
        },
        showN:function (elem,attObj,timingStyle) {
            if(!elem||!attObj)return;
            elem.style.visibility='visible';
            if($$.getDomCss(elem,'display'))elem.style.display='block';
            var style=elem.style;
            if(attObj.opacity!=undefined){
                // yuJS.addTransition(style);
                style.transition='' ;
                style.webkitTransition='';
                style.oTransition='';
                style.mozTransition='';
                if (style.opacity != undefined) {
                    style.opacity = 0;
                } else {
                    style.filter = "alpha(opacity=0)";
                }
            }
            timingStyle=timingStyle||'ease-in-out';
            var getHeight=function (ele) {
                //boder-box下计算高度content+padding+border
                var  h = yuJS.getDomCss(ele,'height').replace('px','');
                var getSonHTotal=function (father) {
                    var height=0;
                    var childNodesList=father.childNodes;
                    if(!childNodesList)return 0;
                    for(var i=0;i<childNodesList.length;i++){
                        var $this=childNodesList[i];
                        var thisH=getHeight($this);
                        height+=parseFloat(thisH);
                    }
                    return height;
                };
                h=parseFloat(h);
                if(!h){
                    h=getSonHTotal(ele);
                }
                return h;
            };
            var isNum=typeof(timingStyle)==='number';
            var isNumStr=parseInt(timingStyle)>0;
            var oHeight;
            if(attObj.height!=undefined){
                oHeight=getHeight(elem);
                style.height = 0+'px';
                style.overflow='hidden';
            }
            var duration=isNum?timingStyle+'ms':isNumStr?parseInt(timingStyle)+'ms':'300ms';
            var timing=(!isNum && !isNumStr && (timingStyle==='linear'||timingStyle.match('ease')))?timingStyle:'ease-in-out';
            style.transition='height '+duration +' '+timing ;
            style.webkitTransition='height '+duration +' '+timing;
            style.oTransition='height '+duration+' '+timing;
            style.mozTransition='height '+duration+' '+timing;
            setTimeout(function () {
                if(attObj.height!=undefined){
                    style.height =parseFloat(oHeight)+'px';
                }
                if(attObj.opacity!=undefined){
                    yuJS.setOpacity(elem, attObj.opacity.end||'100');
                }
            },-1);
        },
        hide:function (elem,attObj,timingStyle) {
            if(!elem)return;
            var style=elem.style;
            var parentOH='';
            var parentOverflow='';
            if (elem && !timingStyle ) {
                style.display = 'none';
                return;
            }
            if(!attObj)return;
            if(attObj.opacity!=undefined){
                style.transition='' ;
                style.webkitTransition='';
                style.oTransition='';
                style.mozTransition='';
                if (style.opacity != undefined) {
                    style.opacity = 1;
                } else {
                    style.filter = "alpha(opacity=100)";
                }
            }
            timingStyle=timingStyle||'ease-in-out';
            var isNum=typeof(timingStyle)==='number';
            var isNumStr=parseInt(timingStyle)>0;
            var oHeight;
            var oPaddingT;
            var oPaddingB;
            if(attObj.height!=undefined){
                oHeight=this.getDomCss(elem,'height').replace('px','');
                if(oHeight)style.height=oHeight+'px';
                oPaddingT=this.getDomCss(elem,'paddingTop');
                oPaddingB=this.getDomCss(elem,'paddingBottom');
            }
            var duration=isNum?timingStyle+'ms':isNumStr?parseInt(timingStyle)+'ms':'300ms';
            var timing=(!isNum && !isNumStr && (timingStyle==='linear'||timingStyle.match('ease')))?timingStyle:'ease-in-out';
            style.transition='all '+duration +' '+timing ;
            style.webkitTransition='all '+duration +' '+timing;
            style.oTransition='all '+duration+' '+timing;
            style.mozTransition='all '+duration+' '+timing;
            style.overflow='hidden';
            setTimeout(function () {
                style.paddingTop='0px';
                style.paddingBottom='0px';
                style.height ='0px';
                yuJS.setOpacity(elem,attObj && attObj.opacity && attObj.opacity.end||'0');
                setTimeout(function () {
                    style.display='none';
                    style.paddingTop=oPaddingT;
                    style.paddingBottom=oPaddingB;
                    style.height =oHeight;
                    yuJS.setOpacity(elem,'100');
                },parseInt(duration));
            },-1);
        },
        fadein:function(ele, opacity, time,funBack) {
            if (ele) {
                var v  = ele.style.filter.replace("alpha(opacity=", "").replace(")", "") || ele.style.opacity;
                v < 1 && (v = v * 100);
                if(v>opacity) return;
                var oldV=v;

                var count = 2;
                var timer = null;
                timer = setInterval(function() {
                    if (v < opacity) {
                        v += count;
                        $$ && $$.setOpacity(ele, v>opacity?opacity:v);
                    } else {
                        clearInterval(timer);
                        funBack && funBack();
                    }
                }, time/Math.floor((opacity-oldV)/count));
            }
        },
        fadeout:function(ele, opacity, time) {
            if (ele) {
                var v = ele.style.filter.replace("alpha(opacity=", "").replace(")", "") || ele.style.opacity || 100;
                v <= 1 && (v = v * 100);
                if(v<opacity) return;
                var oldV=v;

                var count =2;
                var avg = (100 - opacity) / count;
                var timer = null;
                timer = setInterval(function() {
                    if (v  > opacity) {
                        v -= count;
                        $$ && $$.setOpacity(ele, v<opacity?opacity:v);
                    } else {
                        clearInterval(timer);
                    }
                }, time/Math.floor((oldV-opacity)/count));
            }
        },
     ////////////////////////////////////////////////////////////////////其他公共方法
        ajax$:function ajax(opt) {
            opt = opt || {};
            opt.method = opt.method.toUpperCase() || 'POST';
            opt.url = opt.url || '';
            opt.async = opt.async || true;
            opt.data = opt.data || null;
            opt.success = opt.success || function () {};
            var xmlHttp = null;
            if (XMLHttpRequest) {
                xmlHttp = new XMLHttpRequest();
            }
            else {
                xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
            }
            var params = [];
            for (var key in opt.data){
                params.push(key + '=' + opt.data[key]);
            }
            var postData = params.join('&');
            if (opt.method.toUpperCase() === 'POST') {
                xmlHttp.open(opt.method, opt.url, opt.async);
                xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
                xmlHttp.send(postData);
            }
            else if (opt.method.toUpperCase() === 'GET') {
                xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
                xmlHttp.send(null);
            }
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    opt.success(xmlHttp.responseText);
                }
            };
        },
        getQueryString:function (str) {
            if(!str){
                var result = location.search.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+","g"));
                for(var i = 0; i < result.length; i++){
                    result[i] = result[i].substring(1);
                }
                return result;
            }
            if(typeof(str)==='string'){
                var result = location.search.match(new RegExp("[\?\&]" + str+ "=([^\&]+)","i"));
                if(result == null || result.length < 1){
                    return "";
                }
                return result[1];
            }
            if(typeof(str)==='number'){
                var queryStringList = this.getQueryString();
                if (str >= queryStringList.length){
                    return "";
                }
                var result = queryStringList[str];
                var startIndex = result.indexOf("=") + 1;
                result = result.substring(startIndex);
                return result;
            }
        },
        //@param obj parse//parse.$box监听元素//parse.dir XY方向//parse.posType移动元素相关参数//parse.pre是否阻止其他事件
        //@param obj  parse.posType【posType.type=='01'表示first-child;  posType.maxX 水平最大移动值 ; posType.minX 水平最小移动值 】
        //v0.1 只支持marginLeft作为参数来移动元素.后期拓展
        scroll:function (parse) {
            if(!parse.$box)return;
            //定义动画时间和频率以及每次移动幅度
            var totalTime=1000;
            var frequency=50;
            var step=null;
            //touchXS:X方向touch的开始位置;touchY：Y方向...
            var touchXS,touchYS,touchXE,touchYE,moveX,moveY,startTime,endTime,moveTime,speedX,$pos;
            //禁用滑动区域touchmove事件以备重新定义
            parse.prevent && parse.$box.addEventListener('touchmove',function () {
                event.preventDefault();
            },false);
            //根据各参数做相应移动
            //elem 移动区域; posObj 移动元素相关参数,sx X方向移动速度,mx X方向移动距离,sy SPEED_Y,my MOVE_Y
            var moveChooseEle=function (elem,posObj,sx,mx,sy,my) {
                //计算移动
                var moveElem=function ($pos,obj,sx,mx) {
                    var posStyle=$pos && $pos.style;
                    if(!posStyle)return
                    //获取当前margin的单位rem/px/em
                    var unitSource=posStyle.marginLeft||posStyle.left||posStyle.paddingLeft;
                    if(!unitSource)return;
                    //获取尺寸单位
                    var unit=unitSource.match('rem')?'rem':(unitSource.match('px')?'px':(unitSource.match('em')?'em':'px'));
                    //rem&em时换算像素为rem
                    if(unit=='rem'||unit=='em'){
                        //rem或者em需要计算比例，转mx(mx以px为单位需要转为rem/em为单位)
                        mx=mx/$$.actualPx;
                        //alert(mx);
                    }
                    if(sx && !sy){
                        //sx低于0.5则实际滑动多少是多少，大于3则滑动到最后
                        var absSx=Math.abs(sx);
                        absSx=absSx>3?3:absSx<0.5?0.5:absSx;
                        //可以滑动的最大距离
                        var range=obj.maxX-obj.minX;
                        //当前移动的距离
                        var changeMargin=absSx<=0.5?mx:absSx<=3?range*sx/3:sx*range/absSx;
                        //alert(changeMargin+'######'+range+'='+obj.maxX+'-'+obj.minX);
                        var process=function (style,change,oldM) {
                            if(!step)step=change/frequency;
                            //原来的margin值
                            var oldMargin=oldM || posStyle.marginLeft;
                            //oldMargin取数值部分
                            oldMargin=parseFloat(oldMargin);
                            var newMargin=oldMargin+change;
                            yuJS.addTransition(style,'all','500ms','ease-in-out');
                            if(newMargin<obj.minX){style.marginLeft=obj.minX+unit;return;}
                            if(newMargin>obj.maxX){style.marginLeft=obj.maxX+unit;return;}
                            style.marginLeft=newMargin+unit;
                            //使用JS一帧一帧移动，该方法被弃用，改为CSS3的动画实现
                            // var newMargin=oldMargin+(sx>=0?step:-step);
                            // setTimeout(function () {
                            //     if(newMargin<obj.minX){posStyle.marginLeft=obj.minX+unit;return;}
                            //     if(newMargin>obj.maxX){posStyle.marginLeft=obj.maxX+unit;return;}
                            //     posStyle.marginLeft=newMargin+unit;
                            //     change-=step;
                            //     change=change<0?0:change;
                            //     if(change>0)process($pos,change,newMargin+unit);
                            // },totalTime/frequency);
                        };
                        process(posStyle,changeMargin);
                    }
                };
                switch (posObj.type){
                    //01表示移动参考点是$box的第一个元素
                    case'01':
                        //参考点元素
                        $pos=$$.deleteEmptyNode(elem).firstChild;
                        //计算移动
                        moveElem($pos,posObj,sx,mx);
                        break;
                    default:break;
                }
            };
            //根据X方向计算整个滑动，directionX是计算方法的入口函数
            var directionX=function(){
                //x方向计算依赖X方向起始和结束位置，没有则退出
                if(!touchXS || !touchXE)return;
                //移动距离
                moveX=touchXE-touchXS;
                //移动时间
                moveTime=endTime-startTime;
                //移动速度
                speedX=moveX/moveTime;
                //根据各参数做相应移动
                moveChooseEle(parse.$box,parse.posType,speedX,moveX);
            };
            parse.$box.addEventListener('touchstart',function (e) {
                //没有触点跳出
                var targetTouches=e.targetTouches;
                if(targetTouches.length<=0)return;
                //touch起始时间
                startTime=new Date().getTime();
                var targetTouch=targetTouches[0];
                //touchXS:X方向touch的开始位置;touchY：Y方向...
                touchXS=targetTouch.clientX;
                touchYS=targetTouch.clientY;
            },false);
            parse.$box.addEventListener('touchend',function (e) {
                var changedTouche=e.changedTouches;
                if(changedTouche.length<=0)return;
                //获取touch结束时间
                endTime=new Date().getTime();
                var targetTouch=changedTouche[0];
                //touchXE:X方向touch的结束位置;touchYE：Y方向...
                touchXE=targetTouch.clientX;
                touchYE=targetTouch.clientY;
                switch (parse.direction){
                    //'x'表示根据X方向来计算滑动
                    case 'x':directionX();break;
                }
            },false);
        },
        pause:function (numberMillis) {
            var now = new Date();
            var exitTime = now.getTime() + numberMillis;
            while (true) {
                now = new Date();
                if (now.getTime() > exitTime)
                    return;
            }
        },
        isArray:function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },
        setCookie:function (name, value) {
            var Days = 365;
            var minutes = 60;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + encodeURI(value) + ";expires=" + exp.toGMTString() + "; path=/";
        },
        getCookie:function (name) {
            //"(^| )"+ name + "=([^;]*)(;|$)")==>开始或者任意开头+name+非‘;’+‘;’或结束
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

            if (arr = document.cookie.match(reg))
                return decodeURI(arr[2]);
            else
                return null;
        },
        delCookie:function (name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = yuJS.getCookie(name);
            if (cval != null){
                document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + "; path=/";
            }
        },
        newGuid:function () {
            var guid = "";
            for (var i = 1; i <= 32; i++){
                var n = Math.floor(Math.random()*16.0).toString(16);
                guid +=   n;
                if((i==8)||(i==12)||(i==16)||(i==20))
                    guid += "-";
            }
            return guid;
        }
    };
    g.$$=g.yuJS=g.commonFun=yuJS;
    //给String类添加trim方法
    if(!String.prototype.trim){
        String.prototype.trim=function(){
            return this.replace(/(^\s*)|(\s*$)/g, "");
        }
    }
})(window,document);
