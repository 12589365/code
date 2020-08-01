$(function () {
    //1.点击注册按钮，跳转到注册界面，登陆界面隐藏
    $('#link_reg').on('click', function () {
        $('.reg-box').show()
        $('.login-box').hide()
    })

    //点击登录按钮，跳转到登录界面，注册界面隐藏
    $('#link_login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    //2.自定义layui表单校验规则,这一步写完后要在lay-verify中写入pwd
    var form = layui.form
    //  form身上有verify  利用form这个对象来创建密码的校规则
    form.verify({
        // 属性的值可以是数组（简单使用，也可以是对象（复杂使用）
        pwd: [/^\S{6,12}$/, '密码6-12位，并且不能有空格'],
        //定义再次确认密码的校验规则,value代表获取的是再次密码的值
        repwd: function (value) {
            //获取密码的值，跟再次密码框做判断
            if ($('#reg-pwd').val() != value) {
                return '两次密码不一致'
            }
        },
    })

    //3.注册功能
    var layer = layui.layer
    // 在注册界面设置提交事件
    $('#form_reg').on('submit', function (e) {
        //点击提交按钮的时候阻止页面跳转
        e.preventDefault()
        // console.log($('#form_reg').serialize())
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val(),
            },
            // data: $('#form_reg').serialize(),
            success: function (res) {
                console.log(res)
                //注册失败校验
                if (res.status != 0) {
                    // return alert(res.message)
                    return layer.msg(res.message)
                }
                //注册成功
                // alert(res.message)
                layer.msg('注册成功')
                $('#link_login').click()
                // 注册表单清空
                $('#form_reg')[0].reset()
            },
        })
    })
    //4.登录功能
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('res.message')
                }
                layer.msg(res.message)
                //保存token
                localStorage.setItem('token', res.token)
                //页面跳转
                location.href = '/第1遍/code/index.html'
            },
        })
    })
})
