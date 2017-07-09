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
                    if($$.browser.indexOf('IE')>=0 && max==='auto'){
                        if(styleType==='height'){
                            max=sameItemList[0].offsetHeight||max;
                            //如果max值被重新设置则更新max oldmax，offsetHeight没有单位，此处需要添加px单位
                            if(max!==oldMax){
                                max=oldMax=max+'px';
                            }
                        }
                    }

                    var unit=max.match('px')?'px':max.match('rem')?'rem':max.match('em')?'em':max;
                    //max有数字则取数值
                    if(unit!=max)max= parseFloat(max);
                    //找出max最大情况
                    for(var k=1;k<l;k++){
                        var newValue=$$.getDomCss(sameItemList[k],styleType);
                        var oldNewValue=newValue;
                        if($$.browser.indexOf('IE')>=0 && newValue==='auto'){
                            if(styleType==='height'){
                                newValue=sameItemList[k].offsetHeight||newValue;
                                //如果max值被重新设置则更新max oldmax，offsetHeight没有单位，此处需要添加px单位
                                if(newValue!==oldNewValue){
                                    newValue=oldNewValue=newValue+'px';
                                }
                            }
                        }
                        var newUnit=newValue.match('px')?'px':newValue.match('rem')?'rem':newValue.match('em')?'em':newValue;
                        //unit==oldMax说明unit还是auto而不是尺寸单位
                        if(unit==oldMax) {
                            unit=newUnit;
                            oldMax=newValue;
                        }
                        if(newUnit!=newValue) newValue=  parseFloat(newValue);
                        if(!parseFloat(max)){
                            max=newValue;
                        }
                        else if(parseFloat(newValue)){
                            max=max>newValue?max:newValue;
                        }
                    }
                    //设置sameItemList中需要进行设置的style相等
                    (function () {
                        for(var h=0;h<l;h++){
                            sameItemList[h].style[styleType]=(parseFloat(max)?max:'')+unit;
                        }
                    })();
                }
            }
        },
        buryingPoint:function (url,name) {
            if(!url || !name)return;
            var elemList=$$.nodeDescendant($.body,'['+name+']');
            for(var i=0,l=elemList.length;i<l;i++){
                var elem=elemList[i];
                elem.addEventListener('click',function (e) {
                    var newUrl=url;
                    //组织冒泡后将会导致部分页面代理click事件失效；所以取消了组织冒泡
                    //阻止事件冒泡
                    // e = e || window.event;
                    // //e.preventDefault();
                    // if(e.stopPropagation) { //W3C阻止冒泡方法
                    //     e.stopPropagation();
                    // } else {
                    //     e.cancelBubble = true; //IE阻止冒泡方法
                    // }
                    //对查询字段的值进行编码



                    /////////////////////这一段是处理业务，不应放在common中，后期需要删除//////////////////////////////////////
                    //如果是头部系列导航，去掉当前页面url中的series，防止重复
                    if (this.getAttribute('data-nav') === 'true') {
                        newUrl = newUrl.replace(/&?series=.*?((?=&)|$)/, '');
                    }
                    /////////////////////这一段是处理业务，不应放在common中，后期需要删除//////////////////////////////////////

                    var fields = this.getAttribute(name).split('&'),
                        dataStr, item, key, value;
                    for (var i = 0; i < fields.length; i++) {
                        item = fields[i].split('=');
                        key = item[0];
                        value = item.slice(1).join('=');
                        if (!key) {
                            fields[i] = '';
                        } else {
                            fields[i] = key + '=' + encodeURIComponent(value);
                        }
                    }
                    dataStr = fields.join('&');
                    newUrl += (dataStr.charAt(0) == '&' ? dataStr : '&' + dataStr);
                    new Image().src = newUrl;
                },true);

            }
        }
    };
    g.yuCSS=g.$$$=yuCSS;
})(window,document);
