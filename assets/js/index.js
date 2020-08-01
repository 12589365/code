$(function () {
    getUserinfo()
    //3.退出登录
    var layer = layui.layer
    $('#btnLogout').on('click', function () {
        //3.1提示
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (
            index
        ) {
            //do something
            //关闭提示框
            layer.close(index)
            //3.2删除本地token
            localStorage.removeItem('token')
            //3.3跳转login.html
            location.href = '/第1遍/code/login.html'
        })
    })
})
//1.封装函数======获取用户个人信息函数
function getUserinfo() {
    $.ajax({
        method: 'get',
        //  封装的baseApi函数已经拼接好了路径
        url: '/my/userinfo',
        // 设置请求头信息获取权限   jquery中的ajax
        // headers: {
        //     Authorization: localStorage.getItem('token'),
        // },
        success: function (res) {
            // console.log(res)
            // 1.判断用户信息是否获取成功
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            //2.成功的话  调用用户的渲染函数
            renderUser(res.data)
        },
        // 所有的请求完成后都要认证判断===用户没有登陆的情况下不可以直接进入其他页面
        // complete: function (res) {
        //     // console.log(res)
        //     var data = res.responseJSON
        //     console.log(data)
        //     // 要和控制台的信息一摸一样
        //     if (data.status == 1 && data.message == '身份认证失败！') {
        //         //1.删除token
        //         localStorage.removeItem('token')
        //         //2.跳转
        //         location.href = '/第1遍/code/login.html'
        //     }
        // },
    })
}
//2.封装函数=====用户头像的渲染函数
// 改变用户头像之前要获取用户的个人登录信息
function renderUser(user) {
    //1.渲染用户名
    // 优先渲染哪个用户名
    var uname = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + uname)

    // 2.渲染用户头像
    //判断用户头像信息，如果有图片就渲染图片，没有则渲染文字
    if (user.user_pic !== null) {
        //2.1用户头像是图片
        // 头像的src请求地址通过attr属性设置
        $('.layui-nav-img').show().attr('src', user.user_pic)
        $('.text-avatar').hide()
    } else {
        //2.2用户头像是文字
        $('.layui-nav-img').hide()
        // 用户名的第一个字母转换为大写  uname[0]字符串第一个
        $('.text-avatar').show().html(uname[0].toUpperCase())
    }
}
