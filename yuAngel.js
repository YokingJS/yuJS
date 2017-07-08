/**
 * Created by vivo_yezhen on 2017/7/6.
 */
( (g,$,undefined) =>{
    class yuAngel{
        constructor(root){
            this.init(root);
        }
        init(root){
            //根节点
            this.root=typeof(root)==='string'?$.querySelector(`#${root}`):root;
            //存放所有监听模型
            this._={};
            //通知列表的集合，对象的每个成员都是一个通知列表，model变化则找出对应的通知列表，通知列表中所有节点更新view
            this.bridge={};

        }
        execute(fun){
            //执行页面处理方法，并将this._作为参数传入。所有this._中的属性将被绑定监听
            fun.apply(g,[this._]);
            //绑定监听 this._中所有属性
            this.bindWatch(this);
            //整理root中所有节点逐一处理成新的Node删除原node并映射监听，将整理后的node放在片段中，最后重新添加到root中
            this.root.appendChild(this.tidyRoot(this.root));
        }
        //绑定监听 this._中所有属性//若没有viewKey则绑定由model发起，有则说明绑定由view发起
        bindWatch(yu,viewKey){
            //添加get/set的公共方法
            let bind=(key)=>{
                let keyValue=yu._[key];
                Object.defineProperty(yu._,key,{
                    configurable:false,
                    get: () =>{
                        return keyValue;
                    },
                    set:(newValue)=>{
                        //如果值没变化则不执行
                        if(keyValue===newValue)return;
                        keyValue=newValue;
                        //第二个参数表示有数据跟新需要通过viewModel通知bridge
                        yu.viewModel(key,true);
                    }
                });
            }
            //如果来自view
            if(viewKey){
               // if(this._[viewKey]!=='undefined')return;
                bind(viewKey);
                return;
            }
            else{
                //遍历data
                Object.keys(this._).forEach( (key)=> {
                    bind(key);
                });
            }
        }
        //this._变化通知viewModel进而通知bridge中的对应通知列表;from表示来源,true表示从来自model的变化通知，false表示来自view的添加通知列表
        //node是元素节点,value是当前元素节点的y-value值，keyMatch是Key在value中的代位字符串,如果一个y-value中有多个key则keyMatch是这些key的代位字符串数组
        viewModel(key,from,node,nodeValue,keyMatch){
            //a（被通知体）需要被通知的元素的node节点，y-value属性，keyMatch组成的数组，不存在a，则被通知体本身是元素节点
            let fixValue=(a)=>{
                //a[2]如果是数组(对应元素的value绑定了超过1个变量)
                if(a){
                    //a[2]是一个变量的代位字符串
                    if(typeof(a[2])==='string'){
                        let str='\\$\\`'+key+'\\`';
                        let reg=new RegExp(str,'g');
                        return a[1].replace(reg,this._[key]);
                    }
                    else{
                        let value=a[1];
                        a[2][0].forEach((key,index)=>{
                            value=value.replace(a[2][1][index],this._[key]||'');
                        });
                        return value;
                    }
                }

                else{
                    return this._[key];
                }
            };
            let arr=null;
            if(Object.prototype.toString.call(node)==='[object Array]'){
                arr=node;
                node=node[0];
            }
            if(from){
                this.bridge[key].forEach( (node) =>{
                    if(Object.prototype.toString.call(node)==='[object Array]'){
                        arr=node;
                        node=node[0];
                    }
                    //根据当前通知对象类型执行通知。node是string则通知
                    switch (node.localName||node[0].localName){
                        case 'input':
                            node.value=fixValue(arr);
                            break;
                        default:
                            node.innerHTML=fixValue(arr);
                            break;
                    }

                });
            }
            else{
                //通知队列已经存在,node为value属性值node==='string'，否则为元素节点
                if(this.bridge[key]){
                    if(nodeValue){
                        this.bridge[key].push([node,nodeValue,keyMatch]);
                    }
                    else{this.bridge[key].push(node);}
                }
                //新建通知队列
                else{
                    if(nodeValue){
                        this.bridge[key]=[node,nodeValue,keyMatch];
                    }
                    else{
                        this.bridge[key]=[node];
                    }
                    //将需要监听的键值和view中初始值传入绑定
                    if(this._[key]===undefined)this.bindWatch(this,key);
                }
                //view改变更改model,以及初始化view中的绑定变量
                switch (node.localName){
                    case 'input':
                        //添加监听事件，监听view的变化
                        let CL=false;
                        let inputChange=()=>{
                            if(CL)return;
                            this._[key]=node.value;
                        }
                        if("\v"=="v") {
                            node.onpropertychange =inputChange ;
                        }else{
                            node.addEventListener("input",inputChange,false);
                        }
                        //禁止中文输入拼音触发事件
                        node.addEventListener('compositionstart', ()=> {
                            CL=true;
                        });
                        node.addEventListener('compositionend', ()=>{
                            CL=false;
                            inputChange();
                        });
                        //根据view的初始数据初始化model中的对应变量值
                        let inputValue=node.value;
                        if(inputValue)this._[key]=inputValue;
                        break;
                    case 'div':
                        //初始化div值
                        let divInner=node.innerHTML;
                        break;
                    default:
                        break;

                }
            }
        }
        tidyRoot(root){
            //node 片段
            let node,fragment=$.createDocumentFragment();
            //将reg写在此处作为参数传入实际使用的方法中。如果放在使用的方法中定义，会每次都重新创建分配该定义空间。
            let  reg=/\$\`(.*?)\`/g;
            //遍历root节点，处理后放入fragment，最后放回root
            while(node=root.firstChild){
                if(node.firstChild ){
                    node.appendChild(this.tidyRoot(node));
                    //过滤节点中的绑定并添加到对应通知中
                    this.leachNode(node,reg);
                    fragment.appendChild(node);
                }
                else {
                    //过滤节点中的绑定并添加到对应通知中
                    this.leachNode(node,reg);
                    fragment.appendChild(node);
                }
            }
            return fragment;
        }
        //过滤节点中的绑定并添加到this.bridge对应的通知列表
        leachNode(node,reg){
            switch (node.nodeType){
                case 1:
                    let model=node.getAttribute('y-model');
                    if(model){
                        //添加node到model的通知队列
                        this.viewModel(model,false,node);
                        break;
                    }
                    let value=node.getAttribute('y-value');
                    //匹配出满足$``的片段
                    let matchArr=value.match(reg);
                    //matchArr去重
                    matchArr=((oldArr)=>{
                        let arr=[],arrobj={};
                        oldArr.forEach(function (key) {
                            if(!arrobj[key]){
                                arrobj[key]=true;
                                arr.push(key);
                            }
                        });
                        return arr;

                    })(matchArr);
                    let keyArr=[];
                    if(value && matchArr){
                        matchArr.forEach((match)=>{
                            let key=match.substring(2,match.length-1);
                            if(matchArr.length===1){
                                this.viewModel(key,false,node,value,match);
                                this.viewModel(key,true);
                            }
                            else{
                                //this.viewModel(key,false,node,value,matchArr);
                                keyArr.push(key);
                            }

                        });
                        if(keyArr) {
                            keyArr.forEach((key) => {
                                this.viewModel(key, false, node, value, [keyArr, matchArr]);
                            })
                            this.viewModel(keyArr[0],true);
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    }
    g.yuAngel=yuAngel;
})(window,document);
