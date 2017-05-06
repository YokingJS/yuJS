# yuJS
Includes a class library and a component library
需求yujs的原因：
复杂众多的第三方库很好的解决了开发过程中的需求，但同样带来了可定制性、可读性、可维护性的大大降低。
提炼出一个符合自己项目的公共类库愈来愈重要。同时，我希望能够通过不断的维护yuJS,使其渐渐轻量而不失丰富。
后期，理想中的yuJS应该呈现出来的是一个框架，一个简化了开发模式的框架
除了常用的功能和需求，他能够通过调用封装的方法就能够实现自动调用打包压缩工具，自动优化内容（比如转化图片）等等。希望不久的将来,yu做到：让前端更简单

使用方法和功能介绍
在DOM加载初期引入yuJS
yuJS提供了两个全局对象（一个类库yuJS，一个组件库yuTemplate）
类库：yuJS可以简写为$$,关于yuJS的组成有如下介绍
 //yuJS是一个全局方法库//实现了对当前项目的零耦合
    //$$.jsonParse 一个全局parse方法
    //$$.screenWidth 获取当前屏幕可视区宽度
    //$$.setEmFun 针对手机端设置rem或者em的基础值
    //$$.deleteEmptyNode 删除节点中空子节点、注释子节点、换行或者空格子节点
    //$$.nextNode 取当前节点下一个节点
    //$$.childIndex 当前元素是父元素的第几个元素
    //$$.getDomCss 取节点某个属性
    //$$.JQShow 模拟JQ实现的一个下拉方法
    //$$.JQHide 模拟JQ实现的一个收缩方法
    //$$.domReady 当前页面全部加载完执行参数中方法
    //$$.appendChilds 给父元素添加多个子元素
    //$$.ajax 实现对ajax的封装
    //$$.getQueryString 获取当前url的参数//可以数组形式取出所有参数//可根据索引取参数/可则根据名称取参数
    //$$.setOpacity 设置元素透明度
    //$$.fadein//fadeout元素淡入淡出
    //$$.addClass 元素添加某个class
    //$$.minusClass 元素减去某个class
    //$$.scroll 元素添加滚动事件
    //$$.pause延时方法
    //给JS的String添加trim(去除String头尾空字符)属性
组建库：yuTemplate,关于yuTemplate的组成有如下介绍   
    //yuTemplate.select 封装一个select控件
        //yuTemplate.select.setStyle重新设置样式
        //option:{
                    container: elem,
                    dataJson:jsonList,
                    styleObj:{
                        inputHeight:'',//输入框高度
                        inputFontSize:'',//输入框字体大小
                        inputColor:'',//输入框字体颜色
                        listHeight:'',//选择框单列高度
                        listFontSize:'',//选择框字体大小
                        listColor:'',//选择框字体颜色
                        listHoverFontColor:''//选择框hover状态字体颜色
                    },
                    allowInput:false,//是否允许输入框输入
                    //回调
                    clickBack:function(data){
                        //data为选择的内容
                    }
                }
    //yuTemplate.toast 封装一个toast控件
        //yuTemplate.toast.show展示toast
        //option:{
                    context:elem,//toast容器
                    message:'',//展示内容
                    time:1500,//展示持续时间
                    left:'',//展示位置
                    top:''//展示位置
                 }
                 
                 
                 
                 
