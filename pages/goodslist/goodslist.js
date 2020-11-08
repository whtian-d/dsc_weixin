// pages/goodslist/goodslist.js
import { requestApi } from "../../utils/requestApi.js";
var app = getApp();
// app.globalData.base_url
Page({

    /**
     * 页面的初始数据
     */
    data: {
        page: 1,
        requestData: {
            cat_id: '',
            warehouse_id: 0,
            area_id: 0,
            goods_num: 0,
            size: 10,
            page: 0,
            sort: 'last_update',
            order: 'desc',
            self: 0,
        },
        goodslistData: [],
        oWidth: '',
        oHeight: '',
        tabsData: [{
            title: '综合',
            showicon: true,//控制是否显示iconfont
            sort: 'goods_id',
            order: 'desc',
            iconfalg: true,//控制上下箭头开关
        }, {
            title: '新品',
            showicon: false,//控制是否显示iconfont
            sort: 'last_update',
            order: 'desc',
            iconfalg: true,//控制上下箭头开关
        }, {
            title: '销量',
            showicon: false,//控制是否显示iconfont
            sort: 'sales_volume',
            order: 'desc',
            iconfalg: true,//控制上下箭头开关
        }, {
            title: '价格',
            showicon: true,//控制是否显示iconfont
            sort: 'shop_price',
            order: 'desc',
            iconfalg: true,//控制上下箭头开关
        }],
        activeTabIndex: 0,
        // 下面滚动加载配置信息
        goodslistData: {
            showTitle: true,
            showPrice: true,
            showOuter: true,
            showAuthor: false,
            datalist: [],
            categorygoods: false
        },
        falg: true,
        noinfo:false
    },
    // 切换goodlist布局
    changegoodslist() {
        this.setData({
            'goodslistData.categorygoods': !this.data.goodslistData.categorygoods
        })
    },
    // 请求数据函数
    async requestFn() {
        if (this.data.falg) {
            wx.showLoading({
                title: '加载中',
            })
            this.setData({
                'requestData.page': this.data.page,
                falg:false
            })
            var result = await requestApi(app.globalData.base_url + '/catalog/goodslist', this.data.requestData, 'post')
            console.log(result.data.data);
            if(result.data.data.length>0){
                this.setData({
                    falg:true
                })
            }else{
                this.setData({
                    falg:false,
                    noinfo:true
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
        }

    },
    // 切换按类型排序
    changesortFn(e) {
        var index = e.currentTarget.dataset.id;
        var datatabs = this.data.tabsData;
        if (this.data.activeTabIndex == index && this.data.tabsData[index].showicon == true) {
            datatabs[index].iconfalg = !datatabs[index].iconfalg;
            this.setData({
                tabsData: datatabs,
                page: 1,
                falg:true,
                noinfo:false
            })
            if (this.data.tabsData[index].iconfalg) {
                this.setData({
                    'requestData.order': 'desc'
                })
            } else {
                this.setData({
                    'requestData.order': 'asc'
                })
            }
            this.requestFn();
        } else {
            this.setData({
                activeTabIndex: index,
                page: 1,
                falg:true,
                noinfo:false,
                'requestData.sort': this.data.tabsData[index].sort
            })
            this.requestFn();
        }
    },
    // 底部加载函数
    bottomScrollFn() {
        console.log(this.data.requestData);
        this.setData({
            page: ++this.data.page
        })
        this.requestFn()
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            'requestData.cat_id': options.cat_id
        })
        this.requestFn();
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    oWidth: res.windowWidth,
                    oHeight: res.windowHeight
                })
            },
        })
    },
})