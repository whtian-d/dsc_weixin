// pages/category/category.js
import { requestApi } from "../../utils/requestApi.js";
var app = getApp();
console.log(app.globalData.base_url);
Page({
    /**
     * 页面的初始数据
     */
    data: {
        leftData: [],
        activeIndex: 0,
        rightData: [],
        myscrolltop: 0,
        scrollId: 'id0',
        scrollListTop: []
    },
    // 请求左边数据的函数
    async getLeftData() {
        var result = await requestApi(app.globalData.base_url + '/catalog/list');
        this.setData({
            leftData: result.data.data
        })
        // console.log(this.data.leftData);
        // 对右边所有数据进行请求
        for (var i = 0; i < this.data.leftData.length; i++) {
            var result = await requestApi(app.globalData.base_url + '/catalog/list/' + this.data.leftData[i].cat_id);
            var data = this.data.rightData;
            data[i] = result.data.data;
            this.setData({
                rightData: data
            })
        }
        // 设置每个块得top
        var query = wx.createSelectorQuery();
        var scrollharr = [];
        query.selectAll('.items').boundingClientRect(res => {
            console.log(res);
            for (var i = 0; i < res.length; i++) {
                var scrollH = res[i].height;
                for (var j = 0; j < i; j++) {
                    scrollH += res[j].height
                }
                scrollharr.push(scrollH)
            }
            console.log(scrollharr);
            this.setData({
                scrollListTop: scrollharr
            })
        }).exec()
    },
    // 切换右边数据函数
    changeList(e) {
        // console.log(e.currentTarget.dataset.scrollid);
        this.setData({
            scrollId: e.currentTarget.dataset.scrollid,
            activeIndex: e.currentTarget.dataset.index
        })
        // this.setData({
        //     activeIndex:e.currentTarget.dataset.index
        // })
        // this.getrightData(this.data.leftData[this.data.activeIndex].cat_id)
    },
    // 请求右边数据的函数
    async getrightData(cat_id, index) {
        var result = await requestApi(app.globalData.base_url + '/catalog/list/' + cat_id);
        var data = this.data.rightData;
        data[index] = result.data.data;
        this.setData({
            rightData: data
        })
        console.log(this.data.rightData);
    },
    // 滚动条滚动函数
    changeScroll(e) {
        // console.log(e.detail.scrollTop);
        console.log(this.data.scrollListTop);
        for (var i = 0; i < this.data.scrollListTop.length; i++) {
            if (e.detail.scrollTop <= this.data.scrollListTop[i]) {
                this.setData({
                    activeIndex: i
                })
                break;
            }
        }
    },
    // 触底函数切换数据
    bottomFn() {
        // if(this.data.activeIndex<=this.data.leftData.length-2){
        //     this.setData({
        //         activeIndex:++this.data.activeIndex
        //     })
        //     this.getrightData(this.data.leftData[this.data.activeIndex].cat_id);
        //     this.setData({
        //         myscrolltop:0
        //     })
        // }
    },
    // 点击跳转商品列表也
    navgaterFn(e) {
        console.log(e.currentTarget.dataset.id);
        wx.navigateTo({
            url: '../goodslist/goodslist?cat_id=' + e.currentTarget.dataset.id,
        })
    },
    // 初始化数据
    initFn() {
        this.getLeftData();
        // this.getrightData('858');
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initFn();
    },
})