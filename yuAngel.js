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
        viewModel(key,from,node){
            if(from){
                this.bridge[key].forEach( (node) =>{
                    switch (node.localName){
                        case 'input':
                            node.value=this._[key];
                            break;
                        default:
                            node.innerHTML=this._[key];
                            break;
                    }

                });
            }
            else{
                //通知队列已经存在
                if(this.bridge[key]){
                    this.bridge[key].push(node);
                }
                //新建通知队列
                else{
                    this.bridge[key]=[node];
                    //将需要监听的键值和view中初始值传入绑定
                    this.bindWatch(this,key);
                }
                //view改变更改model
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
                        let value=node.value;
                        if(value)this._[key]=value;
                }
            }
        }
        tidyRoot(root){
            //node 片段
            let node,fragment=$.createDocumentFragment();
            //将reg写在此处作为参数传入实际使用的方法中。如果放在使用的方法中定义，会每次都重新创建分配该定义空间。
            let  reg=/\$\`(.*)\`/;
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
                        this.viewModel(model,false,node);
                        break;
                    }
                    let value=node.getAttribute('y-value');
                    if(value){

                    }
                default:
                    break;
            }
        }
    }
    g.yuAngel=yuAngel;
})(window,document);
