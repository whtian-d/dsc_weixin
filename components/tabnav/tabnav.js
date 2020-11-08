// components/tabnav/tabnav.js
var app=getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        params:{
            type:Object
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        oheight:''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        backFn(){
            wx.navigateBack()
        }
    },
    attached(){
        console.log(app.globalData.tabnacHeight);
        this.setData({
            oheight:app.globalData.tabnacHeight
        })
    }
})
