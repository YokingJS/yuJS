/**
 * Created by vivo on 2017/7/6.
 */
( (g,$,undefined) =>{
    class yuAngel{
        constructor(root){
            this.init(root);
        }
        init(root){
            this.root=typeof(root)==='string'?$.querySelector(`#${root}`):root;
            this._={};
            this.bridge={};

        }
        execute(fun){
            //执行页面处理方法，并将this._作为参数传入。所有this._中的属性将被绑定监听
            fun.apply(g,[this._]);
            //绑定监听 this._中所有属性
            this.bindWatch(this);
        }
        //绑定监听 this._中所有属性
        bindWatch(yu){
            //遍历data
            Object.keys(this._).forEach( (key)=> {
                //第二个参数false表示初始化viewModel操作。设置bridge
                this.viewModel(key,false);
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
            });
        }
        //this._变化通知viewModel;update用于区分是更新或者是初始化操作
        viewModel(key,update){
            if(update){
                //
            }
            else{
                this.bridge[key]={};
            }
        }
    }
    g.yuAngel=yuAngel;
})(window,document);