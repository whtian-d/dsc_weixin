var countdownFn=function(date){
    var nowDate=new Date().getTime();
    var futureDate=new Date(date).getTime();
    var sumsecond=(futureDate-nowDate)/1000;
    var hour=Math.floor(sumsecond/60/60%24);
    var minutes=Math.floor(sumsecond/60%60);
    var second=Math.floor(sumsecond%60);
    return {
        hour:hour.toString().padStart(2,'0'),
        minutes:minutes.toString().padStart(2,'0'),
        second:second.toString().padStart(2,'0')
    }

}
module.exports={
    countdownFn
}