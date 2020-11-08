// components/scroll_goods/scroll_goods.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        params: {
            type: Object
        },
        imgtoVideo:{
            type:Boolean,
            value:true
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        navgetorFn(e) {
            // console.log(e.currentTarget.dataset.goodid);
            if (e.currentTarget.dataset.goodid) {
                wx.navigateTo({
                    url: '/pages/goodsdetail/goodsdetail?goods_id=' + e.currentTarget.dataset.goodid,
                })
            }

        },
    },
    attached() {


    }
})
