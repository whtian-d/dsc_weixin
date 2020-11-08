// pages/find/find.js
var app = getApp();
import { requestApi } from "../../utils/requestApi"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        titleData: ['社区', '店铺街', '视频'],
        activeIndex: 0,
        goodslistData: {
            showTitle: true,
            showPrice: false,
            showOuter: false,
            showAuthor: true,
            datalist: [],
            categorygoods: false
        },
        page: 1,
        falg: true,
        findVideoData: {
            showTitle: true,
            showPrice: false,
            showOuter: false,
            showAuthor: true,
            datalist: [],
            categorygoods: false
        },
        changeVideo: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    // 请求社区数据函数
    async getdatalist() {
        if (this.data.falg) {
            this.setData({
                falg: false
            })
            var result = await requestApi(app.globalData.base_url + '/discover/find_list', {
                size: 10,
                page: this.data.page
            }, 'get');
            if (result.data.data.length != 0) {
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

        }

    },
    bottomScrollFn() {
        console.log(1111);

        this.setData({
            page: this.data.page + 1
        })
        if(this.data.activeIndex==0){

            this.getdatalist();
        }
        if(this.data.activeIndex==2){
            this.getfindVideoData()
        }
    },
    changeSwiperFn(e) {
        this.setData({
            activeIndex: e.currentTarget.dataset.index,
            page: 1,
            falg: true
        })
        if(e.currentTarget.dataset.index==2){
            this.getfindVideoData();
        }
    },
    async getfindVideoData() {
        if (this.data.falg) {
            this.setData({
                falg: false
            })
            var result = await requestApi(app.globalData.base_url + '/goods/goodsvideo', {
                size: 10,
                page: this.data.page,
                sort: 'goods_id',
                order: 'desc'
            }, 'post');
            console.log(result);
            
            if (result.data.data.length != 0) {
                if (this.data.page > 1) {
                    this.setData({
                        'findVideoData.datalist': this.data.findVideoData.datalist.concat(result.data.data)
                    })
                } else {
                    this.setData({
                        'findVideoData.datalist': result.data.data
                    })
                }
                this.setData({
                    falg: true
                })
            }

        }
    },
    onLoad: function (options) {
        this.getdatalist();
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})