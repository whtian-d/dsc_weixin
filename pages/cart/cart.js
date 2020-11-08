var app = getApp();
import { requestApi } from "../../utils/requestApi"
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
Page({
    /**
     * 页面的初始数据
     */
    data: {
        tabnav: {
            showback: true,
            title: '购物车'
        },
        oheight: '',
        cartData: {},
        totalSelect: true,
        total: '',
        sum: "",
        allDataLen: false,//是否有数据
        page: 1,
        // 猜你喜欢配置信息
        goodslistData: {
            showTitle: true,
            showPrice: true,
            showOuter: false,
            showAuthor: false,
            datalist: [],
            categorygoods: false
        },
        falg: true
    },
    // 改变商品选中状态
    changeGoodsIsSelect(e) {
        var cartData = this.data.cartData;
        var shopname = e.currentTarget.dataset.shopname;
        var goodsindex = e.currentTarget.dataset.goodsindex;
        for (var key in cartData) {
            if (key == shopname) {
                cartData[key].goodsData[goodsindex].isSelect = !cartData[key].goodsData[goodsindex].isSelect
            }
        }
        // 判断店铺得全选
        cartData[shopname].shopSelect = cartData[shopname].goodsData.every(item => {
            return item.isSelect
        })
        // 判断总的全选
        var totalSelect = Object.values(cartData).every(item => {
            return item.shopSelect
        })
        // 先将cartdata初始化
        this.setData({
            cartData: cartData,
            totalSelect: totalSelect
        })
        this.updatePrice()
        // 同步本地存储
        wx.setStorage({
            data: cartData,
            key: 'cartData',
        })
    },
    // 改变店铺得选中状态
    changeshopIsSelect(e) {
        var shopname = e.currentTarget.dataset.shopname;
        var cartData = this.data.cartData;
        cartData[shopname].shopSelect = !cartData[shopname].shopSelect;
        cartData[shopname].goodsData.forEach(item => {
            item.isSelect = cartData[shopname].shopSelect
        })
        // 判断全选
        var totalSelect = Object.values(cartData).every(item => {
            return item.shopSelect
        })
        // 设置cartdata
        this.setData({
            cartData: cartData,
            totalSelect: totalSelect
        })
        this.updatePrice()
        // 同步本地存储
        wx.setStorage({
            data: cartData,
            key: 'cartData',
        })
    },
    // 更新下面得价格
    updatePrice() {
        var cartData = this.data.cartData;
        var total = 0;
        var sum = 0;
        Object.values(cartData).forEach(item => {
            item.goodsData.forEach(res => {
                if (res.isSelect) {
                    total += Number(res.num) * Number(res.price);
                    sum += Number(res.num)
                }

            })
        })
        this.setData({
            total: total,
            sum: sum
        })
    },
    // 添加数量
    addgoodsNum(e) {
        var shopname = e.currentTarget.dataset.shopname;
        var goodindex = e.currentTarget.dataset.goodindex;
        var cartData = this.data.cartData;
        cartData[shopname].goodsData[goodindex].num++;
        this.submitFn(cartData);
    },
    reducegoodsNum(e) {
        console.log(e.currentTarget.dataset);
        var shopname = e.currentTarget.dataset.shopname;
        var goodindex = e.currentTarget.dataset.goodindex;
        var cartData = this.data.cartData;
        if (cartData[shopname].goodsData[goodindex].num > 1) {
            cartData[shopname].goodsData[goodindex].num--;
        } else {
            Dialog.alert({
                message: '最少要购买一个哦，亲！',
            }).then(() => {
            });
        }
        this.submitFn(cartData);
    },
    // input实去焦点事件
    changeinputFn(e) {
        var shopname = e.currentTarget.dataset.shopname;
        var goodindex = e.currentTarget.dataset.goodindex;
        var cartData = this.data.cartData;
        if (Number(e.detail.value) >= 1) {
            cartData[shopname].goodsData[goodindex].num = e.detail.value;
        }
        this.submitFn(cartData);
    },
    // 删除函数
    deleGoodFn(e) {
        Dialog.confirm({
            message: '您确定要放弃该宝贝吗？亲！',
        }).then(() => {
            var shopname = e.currentTarget.dataset.shopname;
            var goodindex = e.currentTarget.dataset.goodindex;
            var cartData = this.data.cartData;
            cartData[shopname].goodsData.splice(goodindex, 1);
            this.submitFn(cartData);
            this.AllDataFn();
        }).catch(() => {
            // on cancel
        });

    },
    // 全部选择函数
    allSelectFn() {
        var cartData = this.data.cartData;
        this.setData({
            totalSelect: !this.data.totalSelect
        })
        Object.values(cartData).forEach(item => {
            item.shopSelect = this.data.totalSelect;
            item.goodsData.forEach(goodsitem => {
                goodsitem.isSelect = this.data.totalSelect;
            })
        })
        this.submitFn(cartData);
    },
    // 提交数据函数
    submitFn(cartData) {
        // 设置cartdata
        this.setData({
            cartData: cartData
        })
        this.updatePrice()
        // 同步本地存储
        wx.setStorage({
            data: cartData,
            key: 'cartData',
        })
    },
    // 跳转详情页
    todetail(e) {
        wx.navigateTo({
            url: '../goodsdetail/goodsdetail?goods_id=' + e.currentTarget.dataset.goods_id,
        })
    },
    // 判断是否存在数据  
    AllDataFn() {
        var cartData = this.data.cartData;
        var result = Object.values(cartData);
        console.log(result);
        var isnull = result.every(item => {
            return item.goodsData.length == 0
        })
        console.log(isnull);
        this.setData({
            allDataLen: isnull
        })
    },
    /* 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            oheight: app.globalData.tabnacHeight
        })
        this.getLikeData();
    },
    onShow() {
        var data = wx.getStorageSync('cartData');
        this.setData({
            cartData: data
        })
        this.updatePrice();
        this.AllDataFn();
    },
    // 请求下面猜你喜欢数据
    async getLikeData() {
        if (this.data.falg) {
            wx.showLoading({
                title: '加载中',
            })
            this.setData({
                falg: false
            })
            var result = await requestApi(app.globalData.base_url + '/goods/goodsguess', {
                page: this.data.page,
                size: 10
            }, 'post');
            if (result.data.data.length >= 0) {
                if (this.data.page > 1) {
                    this.setData({
                        'goodslistData.datalist': this.data.goodslistData.datalist.concat(result.data.data)
                    })
                } else {
                    this.setData({
                        'goodslistData.datalist': result.data.data
                    })
                }
                this.setData({
                    falg: true
                })
            }
            wx.hideLoading()
        }

    },
    // 底部加载函数
    bottomLoadFn() {
        this.setData({
            page: this.data.page + 1
        })
        this.getLikeData()
    },
    goindex() {
        wx.switchTab({
            url: '/pages/home/home',
        })
    }
})