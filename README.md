yuJS/yuTemplate/yuCSS/yuAngel  lazyload 介绍



方法类库：yuJS是一个方法库，负责定义公共方法(目前处于初期维护阶段。很多方法实现还比较粗糙，且与JQ有功能重叠处。后期定位：JQ方法库的补充)

组建库：yuTemplate是依赖yuJS的组建库，定义了多个可配置的组建

插件库：yuCSS是依赖yuJS实现对HTML中自定义属性的特殊处理

框架（ES6语法）：yuAngel是一个实现了双向绑定的框架，目前处于初期维护阶段，后期定位：一个易于维护，可读性高的ES6框架。

插件：lazyload是在原JQ lazyload基础上修改。修改内容为：允许配置多套图片（同一个元素不同分辨率加载不同图片）;允许设置背景图片位置等样式

