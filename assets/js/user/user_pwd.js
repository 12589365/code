$(function () {
    //1. 定义修改密码的校验规则
    var form = layui.form
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 新密码和旧密码不能相同
        samePwd: function (value) {
            if (value == $('[name="oldPwd"]').val()) {
                return '新密码不能与原密码相同'
            }
        },
        //密码二次验证
        rePwd: function (value) {
            if (value != $('[name="newPwd"]').val()) {
                return '两次输入的密码不一致'
            }
        },
    })

    //2.修改密码的提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        //发送Ajax
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                } else {
                    layui.layer.msg('恭喜您，密码修改成功！')
                    // 重置表单
                    $('.layui-form')[0].reset()
                }
            },
        })
    })
})
