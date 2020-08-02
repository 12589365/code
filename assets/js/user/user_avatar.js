$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview',
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //2.修改上传的图片
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })
    //3.为文件选择框绑定change事件
    $('#file').on('change', function (e) {
        // console.log(e)
        //获取用户选择到的文件
        var filelist = e.target.files
        // console.log(filelist)
        if (filelist.length == 0) {
            return layui.layer.msg('请选择照片')
        }
        //1.拿到用户选择的文件,获取到多个文件中的一个
        var file = e.target.files[0]
        //2.根据选择的文件转化为路径，再重新设置图片路径
        var newImgURL = URL.createObjectURL(file)
        // console.log(newImgUrl)
        //3.把图片路径重新赋值
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    //3..点击确定按钮，头像上传到后台
    $('#btnUpload').on('click', function () {
        //将裁剪后的图片，输出为base64格式的字符串
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100,
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        //发送ajax请求，将头像上传到后台
        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            // 必传项，===新头像，base64格式的字符串
            data: {
                avatar: dataURL,
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg('头像上传成功')
                //更新父框架中的头像信息
                window.parent.getUserinfo()
            },
        })
    })
})
