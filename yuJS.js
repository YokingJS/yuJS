(function (g,$,undefined) {
    //commonFun是一个全局方法库//实现了对当前项目的零耦合
    //jsonParse 一个全局parse方法
    //screenWidth 获取当前屏幕可视区宽度
    //setEmFun 针对手机端设置rem或者em的基础值
    //deleteEmptyNode 删除节点中空子节点、注释子节点、换行或者空格子节点
    //nextNode 取当前节点下一个节点
    //childIndex 当前元素是父元素的第几个元素
    //getDomCss 取节点某个属性
    //show 使用css3 transition实现展开动作
    //hide 使用css3 transition实现收缩动作
    //domReady 当前页面全部加载完执行参数中方法
    //appendChilds 给父元素添加多个子元素
    //ajax$ 实现对ajax的封装
    //getQueryString 获取当前url的后缀参数//调用方法不传参数则以数组形式取出所有后缀//调用参数为number类型（索引值）则根据索引取后缀/string则根据名称返回
    //setOpacity 设置元素透明度
    //fadein元素淡入淡出
    //fadeout元素淡入淡出
    //rotate旋转元素
    //addClass 元素添加某个class
    //minusClass 元素减去某个class
    //scroll 元素添加滚动事件
    //pause延时方法
    var commonFun={
        jsonParse : g.JSON && JSON.parse ? JSON.parse : eval,
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
        childIndex:function (elem) {
            if(!(elem instanceof HTMLElement))return;
            var index=null;
            var  childList=this.deleteEmptyNode(elem.parentNode).childNodes;
            for(var i in childList){
                if(childList[i]===elem)index=i;
            }
            return index;
        },
        getDomCss:function(elem,name){
            if(elem.nodeName=='#text')return '0';
            if(elem.currentStyle) {
                return elem.currentStyle[name];
            }
            else {
                var style = document.defaultView.getComputedStyle(elem,null);
                if(style[name])return style[name];
                style=elem[name];
                if(style) return style;
                else return '0';
            }
        },
        JQShow:function (elem,directionH,HSpeed) {
            commonFun.show(elem,directionH,HSpeed);
        },
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
                    var  h = commonFun.getDomCss(ele,'height').replace('px','');
                    var getSonHTotal=function (father) {
                        var height=0;
                        var childNodesList=father.childNodes;
                        if(!childNodesList)return false;
                        for(var i=0;i<childNodesList.length;i++){
                            var $this=childNodesList[i];
                            var getCSS=commonFun.getDomCss;
                            var tempH=getCSS($this,'height');
                            var thisChildH=getCSS($this,'display')=='none'?0:
                                ((getCSS($this,'float')=='left'||getCSS($this,'float')=='right') && i!=0?0:
                                    tempH=='auto'?'auto': parseFloat(tempH.replace('px','')));
                            if(thisChildH=='auto'||(!thisChildH && thisChildH!=0)){
                                thisChildH=getCSS($this,'offsetHeight');
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
                PS.overflow = 'hidden';
                style.display='block';
            }
            var oHeight;
            var oPaddingT=this.getDomCss(elem,'paddingTop');
            var oPaddingB=this.getDomCss(elem,'paddingBottom');
            var oMarginT=(function () {
                elem=commonFun.deleteEmptyNode(elem);
                var childList=elem.childNodes;
                var total=0;
                for(var i=0,l=childList.length;i<l;i++){
                    total+=parseFloat(commonFun.getDomCss(childList[i],'marginTop')) ;
                    //只取一个存在margin的子元素，之后存在margin如果计算，需要判断是否和当前在同一行，同一行的margin不因计算
                    if(total>0)return total+'px';
                }
                return '0px';
            })();
            if(attObj.height!=undefined){
                style.paddingTop='0';
                style.paddingBottom='0';
                oHeight=getHeight(elem);
                style.height = 0+'px';
            }
            var duration=isNum?timingStyle+'ms':isNumStr?parseInt(timingStyle)+'ms':'300ms';
            var timing=(!isNum && !isNumStr && (timingStyle==='linear'||timingStyle.match('ease')))?timingStyle:'ease-in-out';
            style.transition='all '+duration +' '+timing ;
            style.webkitTransition='all '+duration +' '+timing;
            style.oTransition='all '+duration+' '+timing;
            style.mozTransition='all '+duration+' '+timing;
            style.overflow='hidden';
            setTimeout(function () {
                if(elem.parentNode){
                    elem.parentNode.style.height=parentOH||'auto';
                    elem.parentNode.style.overflow =parentOverflow|| 'visible';
                }
                style.paddingTop=oPaddingT;
                style.paddingBottom=oPaddingB;
                style.height =parseFloat(oHeight)+parseFloat(oMarginT)+'px';
                setTimeout(function () {
                    style.height='auto';
                },parseInt(duration)+50);
                setTimeout(function () {
                    commonFun.setOpacity(elem,attObj && attObj.opacity && attObj.opacity.end||'100');
                },parseInt(duration)/6);
            },-1);
        },
        JQHide:function (elem,directionH,HSpeed) {
            this.hide(elem,directionH,HSpeed);
        },
        // hideO:function (elem,directionH,HSpeed) {
        //     if (elem && !HSpeed) {
        //         elem.style.display = 'none';
        //         return;
        //     }
        //     if(HSpeed){
        //         HSpeed = HSpeed==='fast'?20:HSpeed==='normal'?10:5;
        //         elem.style.overflow = 'hidden';
        //     }
        //     var  oHeight = this.getDomCss(elem,'height').replace('px','');
        //     var hAdd=HSpeed;
        //     var process = function(height,width){
        //         height = height-hAdd>0?height-hAdd:0;
        //         if(height !== 0) {
        //             elem.style.height = height+'px';
        //             setTimeout(function(){process(height,width);},2);
        //         }
        //         else {
        //             elem.style.display='none';
        //             elem.style.height = oHeight+'px';
        //         }
        //     };
        //     process(oHeight.replace('px',''));
        // },
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
            // if(elem.parentNode){
            //     var $parent=elem.parentNode;
            //     parentOH=$parent.style.height;
            //     parentOverflow=commonFun.getDomCss($parent,'overflow');
            //     $parent.style.height=$parent.offsetHeight+'px';
            //     $parent.style.overflow = 'hidden';
            //     style.display='block';
            // }
            var oHeight;
            var oPaddingT;
            var oPaddingB;
            if(attObj.height!=undefined){
                oHeight=this.getDomCss(elem,'height').replace('px','');
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
                commonFun.setOpacity(elem,attObj && attObj.opacity && attObj.opacity.end||'0');
                setTimeout(function () {
                    style.display='none';
                    style.paddingTop=oPaddingT;
                    style.paddingBottom=oPaddingB;
                    style.height =oHeight;
                    commonFun.setOpacity(elem,'100');
                },parseInt(duration));
            },-1);
        },
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
        appendChilds:function (father,sonList) {
            var list=sonList||[];
            for(var i in list){0
                father.appendChild(list[i]);
            }
        },
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
        setOpacity:function(ele, opacity) {
            if (ele.style.opacity != undefined) {
                ///兼容FF和GG和新版本IE
                ele.style.opacity = opacity / 100;
            } else {
                ///兼容老版本ie
                ele.style.filter = "alpha(opacity=" + opacity + ")";
            }
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
            style.transformOrigin='center center';
        },
        addClass:function (ele,newClass) {
            if(ele.className.match(newClass))return;
            ele.className+=(" "+newClass);
        },
        minusClass:function (ele,className) {
            if(!ele.className.match(className))return;
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            ele.className = ele.className.replace(reg, ' ');
        },
        //@param obj parse//parse.$box监听元素//parse.dir XY方向//parse.posType移动元素相关参数//parse.pre是否阻止其他事件
        //@param obj  parse.posType://posType.type '01' first-child//posType.maxX 水平最大移动值
        scroll:function (parse) {
            if(!parse.$box)return;
            //定义动画时间和频率以及每次移动幅度
            var totalTime=1000;
            var frequency=50;
            var step=null;
            var touchXS,touchYS,touchXE,touchYE,moveX,moveY,startTime,endTime,moveTime,speedX,$pos;
            parse.prevent && parse.$box.addEventListener('touchmove',function () {
                event.preventDefault();
            },false);
            //elem 父级 posObj 移动元素相关参数,sx SPEED_X,mx MOVE_X,sy SPEED_Y,my MOVE_Y
            var moveChoseEle=function (elem,posObj,sx,mx,sy,my) {
                var moveElem=function ($pos,obj,sx,mx) {
                    //获取当前margin的单位rem/px/em
                    var unitSource=$pos.style.marginLeft;
                    var unit=unitSource.match('rem')?'rem':(unitSource.match('px')?'px':(unitSource.match('em')?'em':'px'));
                    //rem&em时换算像素为rem
                    if(unit=='rem'||unit=='em'){
                        mx=mx/$$.actualPx;
                    }
                    //alert(obj.maxX+'#'+obj.minX);
                    if(sx && !sy){
                        //sx低于0.5则实际滑动多少是多少，大于3则滑动到最后
                        var absSx=Math.abs(sx);
                        absSx=absSx>3?3:absSx<0.5?0.5:absSx;
                        //可以滑动的最大距离
                        var range=obj.maxX-obj.minX;
                        //当前移动的距离
                        var changeMargin=absSx<=0.5?mx:absSx<=3?range*(absSx-0.5)/2.5:range;
                        changeMargin=changeMargin>range?range:changeMargin;
                       // alert(changeMargin);
                        var process=function (elem,change,oldM) {
                            if(!step)step=change/frequency;
                            //原来的margin值
                            var oldMargin=oldM || $pos.style.marginLeft;
                            //oldMargin取数值部分
                            oldMargin=parseFloat(oldMargin);
                            var newMargin=oldMargin+(sx>=0?step:-step);
                            setTimeout(function () {
                                if(newMargin<obj.minX){$pos.style.marginLeft=obj.minX+unit;return;}
                                if(newMargin>obj.maxX){$pos.style.marginLeft=obj.maxX+unit;return;}
                                $pos.style.marginLeft=newMargin+unit;
                                change-=step;
                                change=change<0?0:change;
                                if(change>0)process($pos,change,newMargin+unit);

                            },totalTime/frequency);
                        };
                        process($pos,changeMargin);
                    }
                };
                switch (posObj.type){
                    case'01':
                        $pos=$$.deleteEmptyNode(elem).firstChild;
                        if(sx && !sy){
                            moveElem($pos,posObj,sx,mx);
                        }
                }
            };
            var directionX=function(){
                if(!touchXS || !touchXE)return;
                moveX=touchXE-touchXS;
                moveTime=endTime-startTime;
                speedX=moveX/moveTime;
                moveChoseEle(parse.$box,parse.posType,speedX,moveX);
            };
            parse.$box.addEventListener('touchstart',function (e) {
                if(e.targetTouches.length<=0)return;
                startTime=new Date().getTime();
                var targetTouch=e.targetTouches[0];
                touchXS=targetTouch.clientX;
                touchYS=targetTouch.clientY;
                // alert(touchXS+'&'+touchYS);
            },false);
            parse.$box.addEventListener('touchend',function (e) {
                //alert(e.changedTouches.length);
                if(e.changedTouches.length<=0)return;
                endTime=new Date().getTime();
                var targetTouch=e.changedTouches[0];
                touchXE=targetTouch.clientX;
                touchYE=targetTouch.clientY;
                switch (parse.direction){
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
        }
    };
    g.commonFun=g.$$=commonFun;
    //给String类添加trim方法
    if(!String.prototype.trim){
        String.prototype.trim=function(){
            return this.replace(/(^\s*)|(\s*$)/g, "");
        }
    }
})(window,document);




