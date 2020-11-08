// components/homeheader/homeheader.js
var app = getApp();
var { requestApi } = require('../../utils/requestApi.js');
var { countdownFn } = require('../../utils/countdown.js');
Component({
    /**
     * 组件的属性列表
     */
    properties: {
    },

    /**
     * 组件的初始数据
     */
    data: {
        navwidth: 1300,
        value: 'iPhone 12',
        active: "",
        navdata: [{
            title: '首页'
        }, {
            title: '家用电器',
            cat_id: '858'
        }, {
            title: '男装女装',
            cat_id: '6'
        }, {
            title: '鞋靴箱包',
            cat_id: '8'
        }, {
            title: '手机数码',
            cat_id: '3'
        }, {
            title: '电脑办公',
            cat_id: '4'
        }, {
            title: '家居家纺',
            cat_id: '5'
        }, {
            title: '个人化妆',
            cat_id: '860'
        }],
        colordata: '',
        scrollHeight: 0,
        headerFixFalg: true,
        swiperdata: [],//子组件轮播图数据
        swiperlistdata: [],//子组件轮播列表数据
        swipercurrent: '',
        childDatas: {},
        freach: false,//下拉刷新
        // 滚动刷新配置
        childScrollDatas: {
            showTitle: true,
            showPrice: true,
            showOuter: true,
            showAuthor: false,
            datalist: [],
            categorygoods:false
        },
        scrollFalg: true,
        page: 1,
        nowChildApi: '',//目前子组件接口api
        miaoshaData: {},//秒杀的数据
        daojishiTime: '',
        miaoshaactiveIndex: 0,
        // 秒杀下面滚动配置
        miaoshagoodsInit: {
            showLogo: true,
            owidth: 216,
            showpricelogo: false,
            logo: 'https://x.dscmall.cn/static/dist/img/seckill-tag.png'
        },
        miaoshagoodsdata: [],
        // 拼团下面滚动配置
        pintuangoodsInit: {
            showLogo: false,
            showpricelogo: true,
            owidth: 230,
            logo: 'https://x.dscmall.cn/static/dist/img/seckill-tag.png'
        },
        pintuangoodsdata: [],
        // 潮流科技的数据配置
        chaoliukejiData: {
            titleImg: '',
            data: [],
            owidth: 210
        },
        meizhuangData: {
            titleImg: '',
            data: [],
            owidth: 210
        },
        // 品质服饰的数据配置
        pinzhiData: {
            titleImg: '',
            bgColor: '',
            data: []
        },
        xiaodiaoData: {
            titleImg: '',
            bgColor: '',
            data: []
        },
        // 商铺推荐得数据
        shopsData: {
            data: [],
            owidth: 214
        },
        // 首页下面滚动加载头部信息
        indexScrollTitleData: [{
            title: '精选',
            desc: "为你推荐",
            borderRight: true,
            req_url: '/goods/type_list',
            method: 'get',
            type: 'is_best',
            active: true,
            showTitle: true,
            showPrice: true,
            showOuter: false,
            showAuthor: false
        }, {
            title: '社区',
            desc: "新奇好物",
            borderRight: true,
            req_url: '/discover/find_list',
            method: 'get',
            active: false,
            showTitle: true,
            showPrice: false,
            showOuter: false,
            showAuthor: true
        }, {
            title: '新品',
            desc: "潮流上新",
            borderRight: true,
            req_url: '/goods/type_list',
            method: 'get',
            type: 'is_new',
            active: false,
            showTitle: true,
            showPrice: true,
            showOuter: false,
            showAuthor: false
        }, {
            title: '热卖',
            desc: "火热爆款",
            borderRight: false,
            req_url: '/goods/type_list',
            method: 'get',
            type: 'is_hot',
            active: false,
            showTitle: true,
            showPrice: true,
            showOuter: false,
            showAuthor: false
        }],
        // 首页下面滚动配置信息
        indexscrolllist: { datalist: [] },
        ScrollListIndex: 0
    },
    /**
     * 组件的方法列表
     */
    methods: {
        onClick() {
            console.log('开始搜索');
        },
        // 切换子组件函数
        changeFn(e) {
            this.setData({
                active: e.currentTarget.dataset.index,
                swipercurrent: 0,
                colordata: this.data.swiperdata.allValue.bgColor
            })
            // 切换时候先将page初始化为1,将下拉开关打开
            this.setData({
                page: 1,
                scrollFalg: true
            })
            if (this.data.navdata[e.currentTarget.dataset.index].cat_id) {
                let cat_id = this.data.navdata[e.currentTarget.dataset.index].cat_id;
                this.setData({
                    nowChildApi: cat_id,
                    'childScrollDatas.datalist': []
                })
                this.getchildData(cat_id);
            }
        },
        // 头部固定函数
        fixFn(e) {
            if (e.detail.scrollTop >= 100) {
                this.setData({
                    headerFixFalg: true,
                    colordata: this.data.swiperdata.allValue.bgColor
                })
            } else {
                this.setData({
                    headerFixFalg: false,
                    colordata: this.data.swiperdata.allValue.bgColor,
                    swipercurrent: 0
                })
            }
        },
        // 对子组件滚动列表数据进行处理
        initSwiperListFn(data, n) {
            var datalist = data;
            console.log(data);
            
            var arr = [];
            var arr2 = [];
            for (var i = 0; i < datalist.length; i++) {
                arr.push(datalist[i])
                if ((i + 1) % n == 0) {
                    arr2.push(arr);
                    arr = [];
                }
            }
            return arr2;
        },
        // 轮播图改变事件
        changeswiperFn(e) {
            this.setData({
                colordata: this.data.swiperdata.list[e.detail.current].bgColor
            })
        },
        // 点击切换获取子组件数据
        async getchildData(cat_id) {

            var categorygoods = await requestApi(app.globalData.base_url + '/visual/visual_second_category', {
                cat_id
            }, 'get');
            // 请求下面滚动数据
            this.getchildScrollData(cat_id);

            this.setData({
                childDatas: categorygoods.data.data
            })

        },
        // 子组件下面滚动数据
        async getchildScrollData(cat_id) {
            this.setData({
                scrollFalg: false
            })
            wx.showLoading({
                title: '加载中',
            })
            var goodslist = await requestApi(app.globalData.base_url + '/catalog/goodslist', {
                cat_id: cat_id,
                size: 10,
                page: this.data.page,
                sort: 'goods_id',
                order: 'desc'
            }, 'post')
            if (goodslist.length == 0) {
                this.setData({
                    scrollFalg: false
                })
            } else {
                this.setData({
                    scrollFalg: true
                })
            }
            wx.hideLoading()
            this.setData({
                'childScrollDatas.datalist': this.data.childScrollDatas.datalist.concat(goodslist.data.data)
            })
        },
        async initFn() {
            //初始化子组件
            this.setData({
                active: app.globalData.componentIndex
            });
            // 动态设置上面固定定位得宽度
            wx.getSystemInfo({
                success: (res) => {
                    this.setData({
                        scrollHeight: res.windowHeight
                    })
                }
            })
            // 请求子组件数据
            var res = await requestApi(app.globalData.base_url + '/visual/view', {
                id: 3,
                type: 'index',
                device: 'h5'
            }, 'post');
            var datalist = res.data.data.data;
            app.globalData.indexData = JSON.parse(datalist);
            console.log(app.globalData.indexData);
            // 设置swiper数据
            this.setData({
                swiperdata: app.globalData.indexData[2].data,
            })
            this.setData({
                colordata: this.data.swiperdata.allValue.bgColor
            })
            // 设置swiperlist数据
            var result = this.initSwiperListFn(app.globalData.indexData[3].data.list, 10);
            this.setData({
                swiperlistdata: result
            });
            this.setData({
                freach: false
            })
            // 请求秒杀数据
            this.getmiaoshaData();
            // 请求拼团的数据
            this.getpintuanData();
            // 处理潮流科技的数据
            this.changeChaoliuData(app.globalData.indexData[9].data, 0);
            this.changeChaoliuData(app.globalData.indexData[10].data, 1);
            // 初始化品质服饰的数据
            this.changePinzhiData(app.globalData.indexData[11].data, 0);
            this.changePinzhiData(app.globalData.indexData[12].data, 1);
            // 初始化商铺信息得数据
            this.setShopsData();
            // 初始化首页下面滚动商品得数据
            this.getIndexScrollData(this.data.indexScrollTitleData[0])


        },
        // 首页下面无线加载
        scrollGoodsFn() {
            if (this.data.active == 0) {
                this.setData({
                    page: ++this.data.page
                })
                this.getIndexScrollData(this.data.indexScrollTitleData[this.data.ScrollListIndex])
            } else {
                if (this.data.scrollFalg) {
                    this.setData({
                        page: ++this.data.page
                    })
                    this.getchildScrollData(this.data.nowChildApi);
                }
            }
        },
        // 请求秒杀的数据
        async getmiaoshaData() {
            var result = await requestApi(
                app.globalData.base_url + '/visual/visual_seckill');
            this.setData({
                miaoshaData: result.data.data,
                miaoshagoodsdata: result.data.data.seckill_list
            })
            var data = this.data.miaoshaData.time_list.filter((item) => {
                return item.status == true
            })
            setInterval(() => {
                this.setData({
                    daojishiTime: countdownFn(data[0].frist_end_time)
                })
            }, 1000);

        },
        async changemiaoshaData(e) {
            this.setData({
                miaoshaactiveIndex: e.currentTarget.dataset.index,
                miaoshagoodsdata: []
            })
            var data = {};
            if (this.data.miaoshaData.time_list[this.data.miaoshaactiveIndex].id) {
                data = {
                    id: this.data.miaoshaData.time_list[this.data.miaoshaactiveIndex].id,
                    tomorrow: this.data.miaoshaData.time_list[this.data.miaoshaactiveIndex].tomorrow
                }
            }
            var result = await requestApi(
                app.globalData.base_url + '/visual/visual_seckill', data);
            this.setData({
                miaoshagoodsdata: result.data.data.seckill_list
            })
        },
        // 请求拼团的数据
        async getpintuanData() {
            // https://x.dscmall.cn/api/visual/visual_team_goods
            var result = await requestApi(app.globalData.base_url + '/visual/visual_team_goods')
            this.setData({
                pintuangoodsdata: result.data.data
            })
        },
        // 请求潮流科技的数据函数
        changeChaoliuData(data, falg) {
            // console.log(data.allValue);
            if (falg == 0) {
                var obj = this.data.chaoliukejiData;
            } else if (falg == 1) {
                var obj = this.data.meizhuangData;
            }
            obj.titleImg = data.allValue.titleImg;
            requestApi(app.globalData.base_url + '/visual/checked', {
                number: data.allValue.selectGoodsId.length,
                goods_id: data.allValue.selectGoodsId
            }, 'post').then(result => {
                obj.data = result.data.data;
                if (falg == 0) {
                    this.setData({
                        chaoliukejiData: obj
                    })
                } else if (falg == 1) {
                    this.setData({
                        meizhuangData: obj
                    })
                }
            });
        },
        changePinzhiData(data, falg) {
            if (falg == 0) {
                var obj = this.data.pinzhiData;
            } else if (falg == 1) {
                var obj = this.data.xiaodiaoData;
            }
            obj.titleImg = data.allValue.titleImg;
            obj.bgColor = data.allValue.bgColor
            requestApi(app.globalData.base_url + '/visual/checked', {
                number: data.allValue.selectGoodsId.length,
                goods_id: data.allValue.selectGoodsId
            }, 'post').then(result => {
                obj.data = result.data.data;
                if (falg == 0) {
                    this.setData({
                        pinzhiData: obj
                    })
                } else if (falg == 1) {
                    this.setData({
                        xiaodiaoData: obj
                    })
                }

            });
        },
        // 请求店铺推荐得数据
        async setShopsData() {
            var result = await requestApi(app.globalData.base_url + '/visual/store', {
                number: 10
            }, 'post');
            this.setData({
                "shopsData.data": result.data.data
            })
        },
        // 首页下面滚动加载切换函数
        changeIndexScrollist(e) {
            var arr = this.data.indexScrollTitleData;
            // 初始化滚动加载得开关,以及下面得数据
            this.setData({
                scrollFalg: true,
                page: 1,
                'indexscrolllist.datalist': []
            })
            // 循环判断下标将上面样式改变
            for (var i = 0; i < arr.length; i++) {
                if (i == e.currentTarget.dataset.item) {
                    arr[i].active = true;
                    // 调用请求得函数
                    this.getIndexScrollData(this.data.indexScrollTitleData[i])
                } else {
                    arr[i].active = false
                }
            }
            this.setData({
                indexScrollTitleData: arr,
                ScrollListIndex: e.currentTarget.dataset.item,
            })
        },
        // 请求首页下面滚动商品得数据
        async getIndexScrollData(item) {


            if (this.data.scrollFalg) {
                if (this.page != 1) {
                    wx.showLoading({
                        title: '加载中',
                    })
                }
                var data = {};
                if (item.type) {
                    data.type = item.type
                }
                data.page = this.data.page;
                data.size = 10
                this.setData({
                    scrollFalg: false
                })
                var result = await requestApi(app.globalData.base_url + item.req_url, data, item.method);
                var datalist = this.data.indexscrolllist.datalist;
                if (result.data.data.length > 0) {
                    datalist = datalist.concat(result.data.data);
                    this.setData({
                        'indexscrolllist.showTitle': item.showTitle,
                        'indexscrolllist.showPrice': item.showPrice,
                        'indexscrolllist.showOuter': item.showOuter,
                        'indexscrolllist.datalist': datalist,
                        'indexscrolllist.showAuthor': item.showAuthor,
                        scrollFalg: true
                    })
                }
                wx.hideLoading();

            }

        }
    },
    lifetimes: {
        attached() {
            // wx.showLoading({
            //     title: '加载中',
            // })
            this.initFn();
        }
    }

})