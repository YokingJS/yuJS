(function (g,$,undefined) {
    //yuCSS是一个基于yuJS，采用HTML属性和JS，实现例如布局控制/埋点等功能的JS插件
    var yuCSS={
        //执行全部yuCSS中的设置
        init:function (list) {
            if(!list || !$$.isArray(list))return;
            this.setSameStyle();
        },
        setSameStyle:function () {
            var domAll=$.all;
            var count=0;
            //存放分类
            var sameStyle={};
            for(var i=0,l=domAll.length;i<l;i++){
                var same=domAll[i].getAttribute('same-height');
                if(same!== (undefined||null)){
                    //初始化height分类
                    if(!sameStyle.height){sameStyle.height={};}
                    //初始化same-height下相同same-height值的元素数组
                    if(!sameStyle.height[same]){sameStyle.height[same]={list:[],style:'height'};}
                    //添加same-height值为same的元素进数组
                    sameStyle.height[same].list.push(domAll[i]);
                }
            }
            for(var i in sameStyle){
                var classItem=sameStyle[i];
                for(var j in classItem){
                    //sameItemList存放着相同值且具有相同属性的元素
                    var sameItemList=classItem[j].list;
                    var l=sameItemList && sameItemList.length;
                    if(!l || (l&&l<=0))continue;
                    //初始化max为第一个元素的（此处需要进行设置的）style值
                    var styleType=classItem[j].style;
                    var max=$$.getDomCss(sameItemList[0],styleType);
                    //保存原始max
                    var oldMax=max;
                    var unit=max.match('px')?'px':max.match('rem')?'rem':max.match('em')?'em':max;
                    //max有数字则取数值
                    max=unit!=max && parseFloat(max);
                    //找出max最大情况
                    for(var k=1;k<l;k++){
                        var newValue=$$.getDomCss(sameItemList[k],styleType);
                        var newUnit=newValue.match('px')?'px':newValue.match('rem')?'rem':newValue.match('em')?'em':newValue;
                        if(unit==oldMax) {
                            unit=newUnit;
                            oldMax=newValue;
                        }
                        newValue=newUnit!=newValue && parseFloat(newValue);
                        max=max>newValue?max:newValue;
                    }
                    //设置sameItemList中需要进行设置的style相等
                    (function () {
                        for(var h=0;h<l;h++){
                            sameItemList[h].style[styleType]=max+unit;
                        }
                    })();
                }
            }
        },
        buryingPoint:function (url,name) {
            if(!url || !name)return;
            var elemList=$$.nodeDescendant($.body,'['+name+']');
            for(var i in elemList){
                var elem=elemList[i];
                elem.addEventListener('click',function (e) {
                    //阻止事件冒泡
                    e = e || window.event;
                    e.preventDefault();
                    if(e.stopPropagation) { //W3C阻止冒泡方法
                        e.stopPropagation();
                    } else {
                        e.cancelBubble = true; //IE阻止冒泡方法
                    }
                    var dataStr=this.getAttribute(name);
                    url+=dataStr;
                    var img=new Image();
                    img.src=url;
                },false);

            }
        }
    };
    g.yuCSS=g.$$$=yuCSS;
})(window,document);
