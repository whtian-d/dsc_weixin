// pages/goodsdetail/goodsdetail.js
var app = getApp();
import { requestApi } from "../../utils/requestApi"

var WxParse = require('../../wxParse/wxParse.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        owidth: '',
        oHeight: '',
        tabnav: {
            showback: true,
            title: '商品详情'
        },
        otop: '',
        goodsid: '',
        GoodsData: '',
        shopData: '',
        cartNum: 0,
        animationData: '',
        addone: false,
        // 猜你喜欢配置信息
        goodslistData: {
            showTitle: true,
            showPrice: true,
            showOuter: false,
            showAuthor: false,
            datalist: [],
            categorygoods: false
        },
        page: 1,
        falg: true,
        scrollId: '',
        fixTopData: ['商品', '详情', '评论'],
        activeIndex: 0,
        domTopArr: [],
        showMask: false,
        domHeightArr: [],
        bottomAnimationData: '',
        selectNum: 1,
        addCartNum: 1
    },
    // 点击头部滚动条滑动
    bindFixTitle(e) {
        this.setData({
            scrollId: 'detail' + e.currentTarget.dataset.index,
            activeIndex: e.currentTarget.dataset.index
        })
    },
    // 滚动条函数
    scrollFn(e) {
        // console.log(e.detail.scrollTop);
        var scrolltop = e.detail.scrollTop;
        var topArr = this.data.domTopArr;
        for (var i = 0; i < topArr.length; i++) {
            if (scrolltop < topArr[i] - topArr[0] + this.data.domHeightArr[i]) {
                this.setData({
                    activeIndex: i
                })
                break;
            }
        }
    },
    scrollBottomFn() {
        this.setData({
            page: ++this.data.page
        })
        this.getguessData();
    },
    // 请求猜你喜欢数据
    async getguessData() {
        if (this.data.falg) {
            this.setData({
                falg: false
            })
            wx.showLoading({
                title: '加载中',
            })
            var result = await requestApi(app.globalData.base_url + '/goods/goodsguess', {
                page: this.data.page,
                size: 10
            }, 'post')
            if (result.data.data.length > 0) {
                this.setData({
                    falg: true
                })
            }
            if (this.data.page > 1) {
                this.setData({
                    'goodslistData.datalist': this.data.goodslistData.datalist.concat(result.data.data)
                })
            } else {
                this.setData({
                    'goodslistData.datalist': result.data.data
                })
            }
            wx.hideLoading()
            this.getDominfo();
        }
    },
    // 请求商品信息函数
    async requestGoodsData(goodsid) {
        // 请求商品数据
        var result = await requestApi(app.globalData.base_url + '/goods/show', {
            goods_id: goodsid,
            warehouse_id: 0,
            area_id: 0,
            is_delete: 0,
            is_on_sale: 1,
            is_alone_sale: 1
        }, 'post')
        var goodsData = result.data.data;

        // 请求店铺信息
        if (goodsData.ru_id != 0) {
            var shopresult = await requestApi(app.globalData.base_url + '/shop/shopdetail', {
                ru_id: goodsData.ru_id
            }, 'post')
            var shopData = shopresult.data.data;
            this.setData({
                shopData: shopData
            })
        }
        // 解析下面得html
        let that = this;
        WxParse.wxParse('courseDetail', 'html', goodsData.goods_desc, that, 5)
        this.setData({
            GoodsData: goodsData
        })
        // 获取本地存储得购物车数据
        var cartData = wx.getStorageSync('cartData');
        if (cartData) {
            var value = wx.getStorageSync('cartData');
            let cartvalues = Object.values(value);
            var cartNum = 0;
            cartvalues.forEach(item => {
                item.goodsData.forEach(res => {
                    cartNum += res.num
                })
            })
            // 更新购物车数量信息
            this.setData({
                cartNum: cartNum
            })
        } else {
            let cartData = {};
            wx.setStorageSync('cartData', cartData)
        }
        wx.hideLoading();
        setTimeout(() => {
            this.getDominfo();
        }, 500)
    },
    // 初始化商品信息
    initGoodsFn(goodsData, num = 1) {
        var goods = {};
        goods.goods_id = goodsData.goods_id;
        goods.goods_name = goodsData.goods_name;
        goods.price = goodsData.shop_price_original;
        goods.num = num;
        goods.isSelect = true;
        goods.img = goodsData.goods_thumb;
        return goods
    },
    getDominfo() {
        for (let i = 0; i < this.data.fixTopData.length; i++) {
            var idname = '#detail' + i
            wx.createSelectorQuery().selectAll(idname).boundingClientRect((rect) => {
                var domTopArr = this.data.domTopArr;
                var domHeightArr = this.data.domHeightArr;
                domHeightArr[i] = rect[0].height;
                domTopArr[i] = rect[0].top;
                this.setData({
                    domHeightArr: domHeightArr,
                    domTopArr: domTopArr
                })
            }).exec()
        }
    },
    // 加入购物车
    addcart() {
        this.addanimation()
        // 先将本页面数量加一
        var num = this.data.addCartNum;
        this.setData({
            cartNum: this.data.cartNum + num
        })
        var cartData = wx.getStorageSync('cartData') || [];
        var shopData = this.data.shopData;
        var goodsData = this.data.GoodsData;
        var shopname = ''
        if (!shopData) {
            shopname = "自营"
        } else {
            shopname = shopData.shop_name
        }
        // 如果店铺存在
        if (cartData[shopname]) {
            var index = cartData[shopname].goodsData.findIndex(item => {
                return item.goods_id == goodsData.goods_id
            })
            // 商品不存在
            if (index == -1) {
                var goods = this.initGoodsFn(goodsData, num)
                cartData[shopname].goodsData.push(goods);
            } else {
                cartData[shopname].goodsData[index].num += num;
            }
        } else {
            // 如果店铺不存在
            cartData[shopname] = {};
            // 添加店铺得id
            cartData[shopname].ru_id = goodsData.ru_id
            // 添加店铺得默认选中状态
            cartData[shopname].shopSelect = true
            // 添加商品信息
            cartData[shopname].goodsData = [];
            // 初始化商品信息
            var goods = this.initGoodsFn(goodsData)
            cartData[shopname].goodsData.push(goods);
        }
        // 重置到本地存储
        wx.setStorageSync('cartData', cartData);
    },
    // 跳转购物车
    onClickIcon() {
        wx.switchTab({
            url: '../cart/cart',
        })
    },
    // 加一动画函数
    addanimation() {
        var myanimation = wx.createAnimation({
            delay: 0,
            timingFunction: 'linear',
            duration: 500
        })
        myanimation.translateY(25).opacity(0).step();
        this.setData({
            animationData: myanimation.export()
        })
        setTimeout(() => {
            myanimation.translateY(0).opacity(1).step();
            myanimation.opacity(0).step();
            this.setData({
                animationData: myanimation.export()
            })
        }, 500)
    },
    showPopup() {
        var myAnimation = wx.createAnimation({
            duration: 500
        })
        myAnimation.translateY(217).step();
        this.setData({
            bottomAnimationData: myAnimation.export(),
            showMask: true
        })
        setTimeout(() => {
            myAnimation.translateY(0).step();
            this.setData({
                bottomAnimationData: myAnimation.export()
            })
        }, 200)
    },
    clickMaskFn() {
        var myAnimation = wx.createAnimation({
            duration: 500
        })
        myAnimation.translateY(217).step();
        this.setData({
            bottomAnimationData: myAnimation.export()
        })
        setTimeout(() => {
            myAnimation.translateY(0).step();
            this.setData({
                bottomAnimationData: myAnimation.export(),
                showMask: false
            })
        }, 500)
    },
    // 添加多个购物车
    addCartNumFn() {
        this.setData({
            selectNum: this.data.selectNum + 1
        })
    },
    jianCartNumFn() {
        if (this.data.selectNum > 1) {
            this.setData({
                selectNum: this.data.selectNum - 1
            })
        }
    },
    addSumCart() {
        this.setData({
            addCartNum: this.data.selectNum
        })
        this.addcart();
        this.clickMaskFn();
        this.setData({
            addCartNum:1
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中',
        })
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    owidth: res.windowWidth,
                    oHeight: res.windowHeight
                })
                console.log(res.windowHeight);

            },
        })
        this.setData({
            otop: app.globalData.tabnacHeight,
            goodsid: options.goods_id
        })
        this.requestGoodsData(this.data.goodsid);
        this.getguessData();

    },
})