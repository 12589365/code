$(function () {
    var layer = layui.layer
    var form = layui.form
    //1.动态获取文章分类
    initCate()

    //2.初始化富文本编辑器
    initEditor()

    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类失败')
                }
                //  成功的话就使用模板引擎渲染
                var htmlStr = template('tpl-cate', res)
                $('[name="cate_id"]').html(htmlStr)
                // 让layui重新渲染
                form.render()
            },
        })
    }

    //3.封面图片
    //3.1. 初始化图片裁剪器
    var $image = $('#image')

    // 3.2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview',
    }

    // 3.3. 初始化裁剪区域
    $image.cropper(options)

    //4。获取封面按钮，绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    //5.监听coverFile的change事件，胡秋道用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // console.log(e)
        //获取到文件的列表数组
        var files = e.target.files
        //判断是否选择了文件
        if (files.length == 0) {
            return
        }
        //根据文件创建对应的url地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    //5.1确定发布状态
    var state = ''
    $('#btnSave1').on('click', function () {
        state = '已发布'
        // alert(state)
    })
    $('#btnSave2').on('click', function () {
        state = '草稿'
        // alert(state)
    })

    //5.2发布文章（上面两个按钮，点击哪个都会触发
    $('#form-add').on('submit', function (e) {
        e.preventDefault()
        // 1.基于form表单，快速创建一个formdata对象
        var fd = new FormData(this)
        // 2.将文章的发布状态，存到fd中
        fd.append('state', state)
        //3.base64是字符串
        //生成二进制图片文件
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280,
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                // // 扩展运算符  ，省略foreach循环，但得到的是数组
                console.log(...fd)
                //ajax一定要放到回调函数里面去
                //因为生成问价 是耗时操作，异步，所以必须保证发送/Ajax的时候
                //图片已经生成了，所以必须写到回调函数中
                // 6.发布文章的ajax请求
                publishArticle(fd)
            })
    })
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是formData格式的数据
            //则必须要添加以下两个属性
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布失败')
                }
                layer.msg('发布成功')
                //发布成功后，要跳转到文章列表
                location.href = '/第1遍/code/article/art_list.html'
                // window.parent.document.getElementById('a2').click()
            },
        })
    }
})
