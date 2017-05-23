/**
 * Created by yoking on 2017/2/23.
 */

(function (g,$,undefined) {
    //select 封装一个select控件
    //toast 封装一个toast控件
    var commonTemplate={
       select:function () {
            // options={
            //     container:obj//DOM容器
            //     dataJson:list obj//下拉列表数组对象
            //     styleObj:{
            //         inputHeight://输入框高度
            //         inputFontSize://输入框字体大小
            //         inputColor://输入框颜色
            //         listHeight://列表单列高度
            //         listFontSize://列表单列字体大小
            //         listColor://列表单列颜色
            //         listHoverFontColor://列表hover状态颜色
            //     }
            //     allowInput:bo0len//是否允许输入框输入
            //     clickBack:function(data){}//回调//data回参
            // };
            var selectObj=function (options) {
                this.options = options || {};
                this.duration=400;
                this.init();
            };
            selectObj.prototype = {
                constructor: selectObj,
                keywords: '',
                _isRended: false,
                _isListShow:false,
                _isResetSize: false,
                _highlightIndex: -1,
                _seletedIndex: -1,
                init: function() {
                    if (!this.options.container) return;
                    this.dataList =(this.options.dataJson)? $$.jsonParse(this.options.dataJson):[{}];
                    this.isHoverShow=this.options.isHoverShow||false;
                    this.initContainer();
                    this.listenFocus();
                    this.listenBlur();
                    this.listenTrigger();
                    this.listenSearch();
                    this.listenBodyClick();
                    this.listenMouseover();
                    this.listenMove();
                    if(this.dataList.length<=0)return;
                    this.listenSelect();
                },
                initContainer: function(changeObj) {
                    this.$container =commonFun.deleteEmptyNode(this.options.container);
                    this.$container.innerHTML='';
                    this.$container.style.position='relative';
                    this.allowInput=(typeof(this.options.allowInput)!='undefined')?this.options.allowInput:true;
                    this.style=changeObj || this.options.styleObj||{};
                    this.v1=this.$container.getAttribute('default-value');
                    var v2=this.$container.getAttribute('placeholder');
                    this.v1=(!this.v1)&&(this.dataList.length>0)?this.dataList[0].name:this.v1;
                    v2=(!v2)?"":v2;
                    this.$dom1=this.$dom1||$.createElement('div');
                    this.$dom2=this.$dom2||$.createElement('div');
                    this.$dom1.setAttribute('inBody','true');
                    this.$dom2.setAttribute('inBody','true');
                    this.$dom1.setAttribute('style','position: relative;width:100%;height: '+(this.style.inputHeight||'30px')
                        +';overflow: hidden;background-color: transparent;');
                    this.$dom2.setAttribute('style','width: 100% ;height: auto;background-color: transparent;z-index: 9999;display:none;');
                    this.$dom2.setAttribute('class','select_list_#fes4/ef5');
                    this.$dom1_1=this.$dom1_1||$.createElement('input');
                    this.$dom1_2=this.$dom1_2||$.createElement('div');
                    this.$dom1_1.setAttribute('inBody','true');
                    this.$dom1_2.setAttribute('inBody','true');
                    this.$dom1_1.setAttribute('readonly',(this.allowInput)?'':'readonly');
                    this.$dom1_1.setAttribute('style',
                        'width:80%;max-width:calc(92% - 30px); height: 100%;position: absolute;left: 5%;margin-left: 4px;background-color: transparent;'
                        +'font-size: '+(this.style.inputFontSize||'14px')+';color:'+(this.style.inputColor||'#333333')
                        +';border: none;line-height:'+(this.style.inputHeight||'30px')+';'+((this.allowInput)?'':'cursor:pointer;'));
                    this.$dom1_1.setAttribute('value',this.v1);
                    this.$dom1_1.setAttribute('placeholder',v2);
                    this.$dom1_2.setAttribute('style','height: 30px;width: 30px;position: absolute;right: 0;top: 0;background-color: transparent;padding-top: 8px;');
                    this.$dom1_2.setAttribute('onmouseover','this.style.cursor=\'pointer\';');
                    this.$dom1_2_1=this.$dom1_2_1||$.createElement('div');
                    this.$dom1_2_1.setAttribute('style','width: 14px;height: 14px;transform: rotate(-45deg);background-color: transparent;'+
                        'border-left:2px;border-bottom: 2px;border-style: solid;border-color: #333333;');
                    this.$dom1_2_1.setAttribute('inBody','true');
                    this.$dom1_2.appendChild(this.$dom1_2_1);
                    $$.appendChilds(this.$dom1,[this.$dom1_1,this.$dom1_2]);
                    $$.appendChilds(this.$container,[this.$dom1,this.$dom2]);

                    this.clickBack=(this.options.clickBack)?this.options.clickBack:function () {};

                    this.$input = commonFun.deleteEmptyNode(this.$container.childNodes[0]).childNodes[0];
                    this.$list = this.$container.childNodes[1];
                    this.$filterList = {};
                    this.$trigger = commonFun.nextNode(this.$input);
                    this.$container.data={
                        'customSelect': this,
                        'id': ''
                    };
                },
                arrowRotate:function (deg,elem) {
                    deg=parseInt(deg);
                    deg && $$.rotate(elem||this.$dom1_2_1,{deg:deg});
                },
                highlight: function(idx) {
                    var self=this;
                    idx = idx !== undefined && idx > -1 ? idx : this._highlightIndex;
                    idx >= 0&& idx !=null && (function () {
                        var childeList=commonFun.deleteEmptyNode(self.$list).childNodes;
                        for(var i=0;i<childeList.length;i++){
                            childeList[i].style.color= idx==i?self.style.listHoverFontColor||'black'
                                :self.style.listColor||'black';
                        }
                    })();
                },
                renderList: function(list) {
                    var listTpl = '',
                        len = list.length;
                    if (len > 0) {
                        for (var i = 0; i < len; i++) {
                            var $span=$.createElement('div');
                            $span.setAttribute('name',list[i].id||'null');
                            $span.innerHTML=decodeURI(list[i].des)||'';
                            $span.setAttribute('style',
                                'background-color: transparent; padding-left: 5px;width:auto;height:'+(this.style.listHeight||'25px')
                                +';line-height: '+(this.style.listHeight||'25px')+';font-size: '+(this.style.listFontSize||'14px')+';'
                                +'text-align: left;text-overflow: ellipsis;overflow: hidden;color:'+(this.style.listColor||'#808080')+';cursor:pointer;');
                            this.$list.appendChild($span);
                        }
                        $$.show(this.$list,{
                            opacity:{},
                            height:''
                        },this.duration);
                        this._isListShow=!this._isListShow;
                        this.arrowRotate(135);
                        this.highlight();
                    } else {
                        this.$list.innerHTML=listTpl;
                        commonFun.JQHide(this.$list,'height','fast');
                        self.arrowRotate(-45);
                        self.$input.onblur();
                    }
                    this.filterDataList = list;
                    this._isRended = true;
                },
                search: function() {
                    if (this.keywords === '' || this.keywords === this.v1) {
                        //this.$input.value='';
                        this.renderList(this.dataList);
                        this.$filterList = this.$list;
                        return;
                    }
                    var searchList = [];
                    var len = this.dataList.length;
                    var reg = new RegExp(this.keywords, 'ig');

                    for (var i = 0; i < len; i++) {
                        var dataItem = this.dataList[i];
                        dataItem.name.match(reg) && (searchList.push(dataItem));
                        // this.$filterList = this.$filterList.add(this.$list.eq(i));
                    }
                    this.renderList(searchList);
                },
                //input框选中//$input.onclick
                listenFocus: function() {
                    var self = this;
                    this.$input.onclick=function () {
                        //已经渲染过则直接展开
                        if (self._isRended && self.filterDataList.length > 0 && !self._isListShow) {
                            self.highlight(self._seletedIndex);
                            $$.show(self.$list,{
                                opacity:{},
                                height:''
                            },self.duration);
                            self._isListShow=!self._isListShow;
                            self.arrowRotate(135);
                            self.highlight();
                            return;
                        }
                        if(self._isListShow){
                            commonFun.JQHide(self.$list,'height','fast');
                            self.arrowRotate(-45);
                            self._isListShow=!self._isListShow;
                            return;
                        }
                        //未渲染则渲染
                        self.search();
                    };
                },
                listenBlur: function() {
                    var self = this;
                    this.$input.onblur=function () {
                        self._isListShow=false;
                        if (self.filterDataList.length === 0) {
                            self.$input.value=self.v1;
                            self.keywords = '';
                        } else if (self.$input.value.trim() === '') {
                            self.$input.value=self.v1;
                        }
                    };
                },
                keyboardSelect: function(code) {
                    if (code === 38) {
                        this._highlightIndex > 0 ?this._highlightIndex--:null;
                        this.highlight();
                    } else if (code === 40) {
                        this._highlightIndex < this.filterDataList.length ?this._highlightIndex++:null;
                        this.highlight();
                    }
                    this._seletedIndex = this._highlightIndex;
                    // this.callbackKeyword();
                },
                listenSearch: function() {
                    var self = this;
                    this.$input.onkeyup=function (e) {
                        var code = e.keyCode || e.which;
                        self.keywords =self.$input.value.trim();
                        if (code === 38 || code === 40) {
                            self.keyboardSelect(code);
                        } else if (code === 13 && self._highlightIndex >= 0&&self.filterDataList.length>self._highlightIndex-1) {
                            var selectObj = self.filterDataList[self._highlightIndex];
                            self.$input.value=selectObj.name;
                            self.$container.data.value= selectObj.id;
                            commonFun.JQHide(self.$list,"height","fast");
                            self.arrowRotate(-45);
                            self.$input.onblur();
                        } else {
                            self.search();
                        }
                    };
                },
                listenTrigger: function() {
                    var self = this;
                    this.$trigger.onclick=function () {
                        self.$input.onclick();
                        return;
                        //以下是原来的触发展开方式,弃用
                        if(!self._isRended){
                            self.search();
                            return;
                        }
                        if (self._isRended && self.filterDataList.length > 0 && self.$list.style.display==='none') {
                            $$.show(this.$list,{
                                opacity:{},
                                height:''
                            },this.duration);
                            self.highlight();
                            self.arrowRotate(135);
                        }
                        else {

                            commonFun.JQHide(self.$list,'height','fast');
                            self.arrowRotate(-45);
                            self.$input.onblur();
                        }
                    };
                },
                listenSelect: function() {
                    var self = this;
                    self.$container.onclick=function (e) {
                        var id=e.target.getAttribute('name');
                        if(!id)return;
                        var $this = e.target;

                        self.keywords = $this.innerHTML;
                        commonFun.JQHide(self.$list,'height','fast');
                        self.arrowRotate(-45);
                        self.$container.data.id= id;
                        self._highlightIndex= self._seletedIndex=commonFun.childIndex($this);
                        self.$input.value=$this.innerHTML;
                        self.clickBack($this.getAttribute('name'));
                    };
                },
                listenMouseover: function() {
                    var self = this;
                    var $current=null;
                    this.$container.onmouseover=function (e) {
                        var $this=e.target;   
                        if($this.getAttribute('name')){
                            //console.log($this);
                            $this.style.color=self.style.listHoverFontColor||'black';
                            $current && ($current.style.color=self.style.listColor||'black');
                            $current=$this;
                        }
                        else{
       
                            if(!self._isListShow)self.$input.onclick();
                        }
                    };
                    this.$container.onmouseout=function (e) {
                        var $target=e.target;
                        //移开后进入的元素
                        var toElemet;
                        //IE没有relatedTarget有toElement和fromElement
                        if(e.relatedTarget){
                            toElemet=e.relatedTarget;
                        }
                        else{
                            toElemet=e.toElement;
                        }
                        //通过新进入的元素父级中是否存在container判断是否还在元素内
                        var hasAncestor=(function () {
                            var $parent;
                            if(toElemet==self.$container)return true;
                            $parent=toElemet.parentNode;
                            while($parent){
                                if($parent==self.$container)return true;
                                $parent=$parent.parentNode;
                            }
                            return false;
                        })();
                        if(hasAncestor)
                        {
                            return;
                        }
                        if(self._isListShow){
                            self.$input.onclick();
                        }
                    }
                },
                listenBodyClick: function() {
                    var self = this;
                    $.body.onclick=function (e) {
                        var $this=e.target;
                        if (!$this.getAttribute('inBody')) {
                            var domList=$.getElementsByClassName('select_list_#fes4/ef5');
                            for(var i in domList){
                                if(i=='length')return;
                                if(domList[i].style.display=='none')continue;
                                commonFun.JQHide(domList[i],'height','fast');
                                var $thisGFather=commonFun.deleteEmptyNode(domList[i].parentNode).childNodes[0];
                                var $thisFather=commonFun.deleteEmptyNode($thisGFather).lastChild;
                                var $target=commonFun.deleteEmptyNode($thisFather).lastChild;
                                self.arrowRotate.call($target,-45,$target);
                                commonFun.deleteEmptyNode($thisGFather).firstChild.onblur();
                            }
                        }
                    };
                },
                //当PC滚动滚轮手机端滑动页面时，input失去焦点，输入框收起
                listenMove:function () {
                    var self=this;
                    var listener=document.addEventListener||null;
                    var moveFun=function () {
                        commonFun.JQHide(self.$list,'height','fast');
                        self.$input.blur();
                    }
                    if(listener){
                        listener('DOMMouseScroll',moveFun,false);
                        listener('touchmove',moveFun,false);
                    }
                    g.onmousewheel=document.onmousewheel=moveFun;
                },
                //更改样式接口
                setStyle:function (obj) {
                    obj && this.initContainer(obj);
                }

            };
            return selectObj;
        },
        toast:function () {
            var Toast = function (config) {
                this.context = config.context ? config.context:$; //上下文
                this.message = config.message; //显示内容
                this.time = config.time ? config.time:3000 ; //持续时间
                this.left = config.left; //距容器左边的距离
                this.top = config.top; //距容器上方的距离
                this.init();
                this.show();
            };
            Toast.prototype = {
                //初始化显示的位置内容等
                init: function () {
                    this.$toastMessage=$.getElementById('#toastMessage');
                    var self=this;
                    if(self.$toastMessage)self.context.removeChild(self.$toastMessage);
                    //设置消息体
                    self.msgDIV =$.createElement('div');
                    self.msgDIV.setAttribute('id','toastMessage');
                    self.msgDIV.setAttribute('style',
                        'position:absolute;top:50%;z-index:999;width: 100%;text-align:center;color:white;font-size:18px;border-radius:2px;');
                    self.msgDIV.innerHTML='<div  style="background-color: black;display:inline-block;padding:10px;">'
                        +'<span style="color:white" >    '+this.message +  '</span>'
                        +'</div>';
                    $$.setOpacity(self.msgDIV,0);
                    this.context.appendChild(self.msgDIV);
                },
                //显示动画
                show: function () {
                    if(!this.msgDIV)return;
                    var self=this;
                    $$.fadein(self.msgDIV,100,self.time*2/3,function () {
                        $$.fadeout(self.msgDIV,0,self.time /3);
                    });

                }
            };
            return Toast;
        }
    };
    g.commonTemplate = commonTemplate;
})(window,document);




