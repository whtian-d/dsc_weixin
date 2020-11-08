let requestApi=function(url,data={},method="get"){
    return new Promise((resolve,reject)=>{
        wx.request({
          url: url,
          data:data,
          method:method,
          success:(res)=>{
            resolve(res);
          },
          fail:(err)=>{
              reject(err);
          }
        })
    })
}
module.exports={
    requestApi:requestApi
}