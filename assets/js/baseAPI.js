// 设置路径（测试）
var baseURL = 'http://ajax.frontend.itheima.net'
//设置路径（生产）
// var prejURL='http://ajax.frontend.itheima.net'

//1.拦截/过滤每一次Ajax请求，配置每次请求需要的参数
$.ajaxPrefilter(function (options) {
    // console.log(options.url)
    options.url = baseURL + options.url

    // 2.判断路径中是否包含/my/
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        }
    }
    //3.所有的请求完成后都要认证判断===用户没有登陆的情况下不可以直接进入其他页面
    options.complete = function (res) {
        // console.log(res)
        var data = res.responseJSON
        console.log(data)
        // 要和控制台的信息一摸一样
        if (data.status == 1 && data.message == '身份认证失败！') {
            //1.删除token
            localStorage.removeItem('token')
            //2.跳转
            location.href = '/第1遍/code/login.html'
        }
    }
})
