/**
 * Created by 11055846 on 2017/6/7.
 */

(function (g,d,undefined) {
    var init = function () {
            new buryingPoint();
        },
        buryingPoint = function () {
            this.init();
        };

    buryingPoint.prototype={
        init:function () {
            this.url='//stpc.vivo.com.cn/eden/flyHeart';
            //存取session id
            this.sessionId=$$.getCookie('sessionId');
            if(!this.sessionId){
                this.sessionId=$$.newGuid();
                $$.setCookie({
                    name:'sessionId',
                    value:this.sessionId,
                    days:'browserClose'
                });
            }
            //get imei
            this.imei=$$.getCookie('imei');
            if(this.imei){
                this.url+='?imei='+this.imei;
            }
            //存取cookie id
            this.cookieId= $$.getCookie('vivo_fe_vftcookid') || $$.getCookie('cookieId');
            if(!this.cookieId){
                this.cookieId=this.imei?this.imei:(this.sessionId+this.getVisitTime());
                $$.setCookie({
                    name:'cookieId',
                    value:this.cookieId,
                    domain:'.vivo.com.cn'
                });
            }

            this.openId=this.getUserId();
            //版本
            this.version='v1.0';
            //终端类型
            this.visitType=this.getVisitType();
            this.url+='?cookid='+this.cookieId+'&sessionid='
                +this.sessionId+'&version='+this.version+'&visittype='+this.visitType+'&domain=www.vivo.com.cn';
            //获取pageView字段(页面名称)
            this.buryingInPage();
        },
        getVisitTime:function () {
            return (new Date()).getTime();
        },
        getUserId:function () {
            var self=this;
            $$.ajax$({
                url: '//www.vivo.com.cn/portal/open/api/cookie',
                data: {"cookieName": 'vivo_account_cookie_iqoo_openid'},
                method: 'POST',
                success: function (data) {
                    self.url+='&openid='+data;
                }
            });
        },
        getVisitType:function () {
            var userAgentInfo = g.navigator.userAgent;
            var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    if(userAgentInfo.match(/MicroMessenger/i))return 'weichat';
                    else return 'wap';
                }
            }
            return 'pc';
        },
        commonBurying:function () {
            $$$.buryingPoint(this.url,'burying');
        },
        buryingInPage: function () {
            var i,search_page,path = g.location.pathname,series;

            this.pageView = '';
            if (!path) this.pageView = '';

            switch (true) {
                case /^\/?$/.test(path):     //首页
                    search_page=1;
                    this.pageView = '官网首页';
                    this.url += '&pageview=' + encodeURIComponent(this.pageView);
                    //加载完埋点
                    new Image().src = this.url + '&visittime='+this.getVisitTime()+'&cfrom=1100&is_done=1';
                    //使用coolie记录当前页面标识。跳转页面可通过该cookie追踪上一页面
                    $$.setCookie('pageTAG',gloablVAR.pageTAG,'browserClose');
                    break;
                case /^\/products-\w+\.html\/?$/.test(path):       //系列主页
                    search_page=2;
                    series = document.getElementById('series-id').getAttribute('data-id');
                    this.pageView = '官网系列主页';
                    this.url += '&pageview=' + encodeURIComponent(this.pageView) + '&series=' + encodeURIComponent(series);
                    //加载完埋点
                    new Image().src = this.url +'&visittime='+this.getVisitTime()+ '&cfrom=2100&is_done=1';
                    //使用coolie记录当前页面标识。跳转页面可通过该cookie追踪上一页面
                    $$.setCookie('pageTAG',gloablVAR.pageTAG,'browserClose');
                    break;
                case /^\/vivo\/\w+\/?$/.test(path):     //手机详情页
                    search_page=3;
                    series = document.getElementById('series-id').getAttribute('data-id');
                    this.pageView = '官网系列详情页';
                    this.url += '&pageview=' + encodeURIComponent(this.pageView) + '&series=' + encodeURIComponent(series);
                    //加载完埋点
                    new Image().src = this.url +'&visittime='+this.getVisitTime()+ '&cfrom=2200&is_done=1&name=' + encodeURIComponent(document.getElementById('series-id').getAttribute('data-name'));
                    //使用coolie记录当前页面标识。跳转页面可通过该cookie追踪上一页面
                    $$.setCookie('pageTAG',gloablVAR.pageTAG,'browserClose');
                    break;
                case /^\/vivo\/os\/?/.test(path):     //手机funtouch
                    search_page=3;
                    //加载完埋点
                    new Image().src = this.url +'&visittime='+this.getVisitTime()+ '&is_done=1';
                    //使用coolie记录当前页面标识。跳转页面可通过该cookie追踪上一页面
                    $$.setCookie('pageTAG',gloablVAR.pageTAG,'browserClose');
                    break;
                case /^\/vivo\/param\/?/.test(path):     //手机参数页
                    search_page=3;
                    //加载完埋点
                    new Image().src = this.url +'&visittime='+this.getVisitTime()+ '&is_done=1';
                    //使用coolie记录当前页面标识。跳转页面可通过该cookie追踪上一页面
                    $$.setCookie('pageTAG',gloablVAR.pageTAG,'browserClose');
                    break;
                case /^\/service\.html\/?$/.test(path):     //服务首页
                    search_page=7;
                    this.pageView = '官网服务首页';
                    this.url += '&pageview=' + encodeURIComponent(this.pageView);
                    //加载完埋点
                    new Image().src = this.url +'&visittime='+this.getVisitTime()+ '&cfrom=4100&is_done=1';
                    //使用coolie记录当前页面标识。跳转页面可通过该cookie追踪上一页面
                    $$.setCookie('pageTAG',gloablVAR.pageTAG,'browserClose');
                    break;
                case /^\/service\/questions\/all\/?$/.test(path):  //全部问题首页
                    this.pageView = '官网服务首页全部问题';
                    this.url += '&pageview=' + encodeURIComponent(this.pageView);
                    //加载完埋点
                    new Image().src = this.url +'&visittime='+this.getVisitTime()+'&cfrom=4200&is_done=1';
                    //使用coolie记录当前页面标识。跳转页面可通过该cookie追踪上一页面
                    $$.setCookie('pageTAG',gloablVAR.pageTAG,'browserClose');
                    break;
                case /^\/service\/?/.test(path):     //服务其他页面
                    search_page=7;
                    //加载完埋点
                    new Image().src = this.url +'&visittime='+this.getVisitTime()+ '&is_done=1';
                    //使用coolie记录当前页面标识。跳转页面可通过该cookie追踪上一页面
                    $$.setCookie('pageTAG',gloablVAR.pageTAG,'browserClose');
                    break;
                case /^\/funtouchos\/?$/.test(path):  //FuntouchOS首页
                    search_page=4;
                    this.pageView = '官网funtouch系列页面';
                    this.url += '&pageview=' + encodeURIComponent(this.pageView);
                    //加载完埋点
                    new Image().src = this.url +'&visittime='+this.getVisitTime()+ '&cfrom=6100&is_done=1';
                    //使用coolie记录当前页面标识。跳转页面可通过该cookie追踪上一页面
                    $$.setCookie('pageTAG',gloablVAR.pageTAG,'browserClose');
                    break;
                case /^\/about\/?$/.test(path):  //关于vivo页
                    this.pageView = '官网关于vivo';
                    this.url += '&pageview=' + encodeURIComponent(this.pageView);
                    //加载完埋点
                    new Image().src = this.url +'&visittime='+this.getVisitTime()+ '&is_done=1';

                    break;
                case /^\/search\??$/.test(path):  //全局搜索结果页
                    this.pageView = '全局搜索结果页';
                    this.url += '&pageview=' + encodeURIComponent(this.pageView);
                    //加载完埋点
                    var keyword=$$.getQueryString('q');
                    new Image().src = this.url + '&visittime='+this.getVisitTime()+'&cfrom=9104&is_done=1&keyword='+keyword
                    +'&result_type=1&search_page='+($$.getCookie('pageTAG')||'null');
                    //将公共埋点数据传递给全局变量，再传递给搜索结果页，以供后者调用
                    gloablVAR.buryingBridge=this.url + '&visittime='+this.getVisitTime()+'&cfrom=9105&keyword='+keyword+'&search_page='+($$.getCookie('pageTAG')||'null');
                    break;
            }

            //搜索盒子出现埋点
            var searchInput = document.querySelector('.search-top input'),
                handler = function () {
                    var keyword = (searchInput.value || searchInput.getAttribute('placeholder')).replace(/^\s+|\s+$/g, '');

                    if (getComputedStyle(searchInput).visibility === 'hidden' || getComputedStyle(searchInput.parentNode.parentNode).display === 'none') {   //打开搜索盒子
                        new Image().src = this.url + '&visittime='+this.getVisitTime()+'&cfrom=9100' + (search_page !== undefined ? '&search_page=' + search_page : '');
                    } else if (keyword) {  //搜索
                        new Image().src = this.url + '&visittime='+this.getVisitTime()+'&cfrom=9102&keyword=' + encodeURIComponent(keyword) + (search_page !== undefined ? '&search_page=' + search_page : '');
                    }
                }.bind(this);
            document.querySelector('.nav-t-search').addEventListener('click', handler);
            document.querySelector('.nav-gb.menu-search').addEventListener('click', handler);

            //搜索埋点
            searchInput.addEventListener('keyup', function (event) {
                var keyword = (searchInput.value || searchInput.getAttribute('placeholder')).replace(/^\s+|\s+$/g, '');

                if (event.which === 13 && keyword) {
                    new Image().src = this.url + '&visittime='+this.getVisitTime()+'&cfrom=9102&keyword=' + encodeURIComponent(keyword) + (search_page !== undefined ? '&search_page=' + search_page : '');
                }
            }.bind(this));

            //搜索推荐热词添加埋点属性burying
            var recommends = document.querySelectorAll('.search-content a,.gb-vivo-s-nav a');
            for (i = 0; i < recommends.length; i++) {
                recommends[i].setAttribute('burying', 'cfrom=9101&keyword=' + encodeURIComponent(recommends[i].getAttribute('data-word')) + (search_page !== undefined ? '&search_page=' + search_page : ''));
            }

            //搜索结果点击埋点
            var resultHandler = function (event) {
                var target = event.target, type, dt;

                if (target.tagName.toLowerCase() === 'a') {
                    dt = target.parentNode.parentNode.querySelector('dt');
                    switch (true) {
                        case dt.textContent.indexOf('手机') !== -1:
                            type = 1;
                            break;
                        case dt.textContent.indexOf('配件') !== -1:
                            type = 2;
                            break;
                        case dt.textContent.indexOf('服务') !== -1:
                            type = 3;
                            break;
                        case dt.textContent.indexOf('体验店') !== -1:
                            type = 4;
                    }
                    new Image().src = this.url +'&visittime='+this.getVisitTime()+ '&cfrom=9103&name=' + encodeURIComponent(target.textContent) + '&keyword=' + encodeURIComponent(document.querySelector('.search-top input').value.replace(/^\s+|\s+$/g, '')) + '&result_type=' + type + (search_page !== undefined ? '&search_page=' + search_page : '');
                }
            }.bind(this);
            document.querySelector('.search-content .results').addEventListener('click', resultHandler);
            document.querySelector('.gb-vivo-s-nav .results').addEventListener('click', resultHandler);

            //全局拦截跳转到商城的动作
            var shopLinks = document.querySelectorAll('[data-cid],[data-search_kw]'), href;
            for (i = 0; i < shopLinks.length; i++) {
                if (shopLinks[i].tagName.toLowerCase() === 'a') {
                    href = shopLinks[i].getAttribute('href');
                } else {
                    href = shopLinks[i].getAttribute('onclick').match(/'(.*)'/)[1];
                }
                if (href.indexOf('?') === -1) {
                    href += '?';
                } else {
                    href += '&';
                }
                if (shopLinks[i].getAttribute('data-cid')) {
                    href += 'cid=' + shopLinks[i].getAttribute('data-cid');
                } else {
                    href += 'search_kw=' + shopLinks[i].getAttribute('data-search_kw');
                }
                if (shopLinks[i].tagName.toLowerCase() === 'a') {
                    shopLinks[i].setAttribute('href', href);
                } else {
                    shopLinks[i].setAttribute('onclick', "location.href='" + href + "'");
                }
            }

            this.commonBurying();
        }
    };
    $$.domReady([init]);
})(window,document,undefined);