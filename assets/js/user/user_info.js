$(function () {
    //1.定义校验规则
    //form身上有verify  利用form这个对象来创建密码的校规则
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称应该输入1-6位之间'
            }
        },
    })
    //2.在页面表单中初始化用户信息
    initUserInfo()
    function initUserInfo() {
        //发送ajax请求
        $.ajax({
            url: '/my/userinfo',
            success: function (res) {
                // console.log(res)
                // 获取用户信息校验
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //展示用户信息form.val为表单赋值
                form.val('formUserInfo', res.data)
            },
        })
    }

    //3..重置
    $('#btnReset').on('click', function (e) {
        console.log(111)
        // 取消浏览器的默认重置行为    取消表单默认清空
        e.preventDefault()
        // 再次初始化用户信息
        initUserInfo()
    })

    //4.提交修改的信息  给form表单
    $('.layui-form').on('submit', function (e) {
        // 取消form表单的默认提交行为，改为ajax提交
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg('用户信息修改失败')
                } else {
                    layer.msg('恭喜您，信息修改成功！')
                    //刷新父框架里面的用户信息
                    // 每个html页面都有一个window
                    window.parent.getUserinfo()
                }
            },
        })
    })
})
