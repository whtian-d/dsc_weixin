// pages/my/my.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfoData:{},
        falg:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       this.loginFn()
    },
    loginFn() {
        wx.getSetting({
            success: (res) => {
                console.log(12312);
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success:(res)=> {
                            var userInfo = res.userInfo
                            console.log(userInfo);
                            this.setData({
                                userInfoData:userInfo,
                                falg:true
                            })
                            var nickName = userInfo.nickName    //网名
                            var avatarUrl = userInfo.avatarUrl    //头像
                            var gender = userInfo.gender //性别 0：未知、1：男、2：女
                            var province = userInfo.province    //省份
                            var city = userInfo.city            //地区
                            var country = userInfo.country       //国家
                        }
                    })
                }else{
                    this.setData({
                        falg:false
                    })
                }
            }
        })
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