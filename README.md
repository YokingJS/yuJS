yuJS/yuTemplate/yuCSS提供了几个全局对象（一个方法库yuJS，一个组件库yuTemplate，一个插件yuCSS）

希望能够通过不断的维护yuJS,使其渐渐轻量而不失丰富。 后期，理想中的yuJS应该呈现出来的是一个简化了开发模式的框架. 除了常用的功能和需求，他能够实现自动调用打包压缩工具，自动优化内容（比如转化图片）等等。 希望yu最终做到：让前端更简单

使用方法
在DOM加载初期引入yuJS/yuTemplate/yuCSS

类库：yuJS是一个主依赖，负责定义公共方法

组建库：yuTemplate是依赖yuJS的组建库，定义了多个可配置的组建

插件库：yuCSS是依赖yuJS实现对HTML中自定义属性的特殊处理


