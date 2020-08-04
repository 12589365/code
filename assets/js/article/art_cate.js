$(function () {
    var layer = layui.layer
    var form = layui.form
    // 1.文章分类列表的渲染
    initArtCateList()
    //2.添加文章分类===显示
    var index = null
    $('#addArtCate').on('click', function () {
        index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html(),
        })
    })
    //3.添加文章===添加后台并显示到页面中
    //由于添加在模板中，所以需要委托事件
    $('body').on('submit', '#boxAddCate', function (e) {
        // console.log(111)
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg('新增失败')
                }
                //渲染到html页面中
                initArtCateList()
                layer.msg('新增成功')
                // 关闭添加弹出层区域====需要知道关闭的是哪个弹出层，所以需要用到index
                layer.close(index)
            },
        })
    })

    //4.编辑文章
    var indexEdit = null
    $('tbody').on('click', '#btn-edit', function (e) {
        e.preventDefault()
        //弹出一个修改文章信息的弹出层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
        })

        // 发起请求获取对应的数据===在html页面中可以利用lay-filter
        //  获取id值，找到对应的数据====点击按钮的自定义属性
        var id = $(this).attr('data-id')

        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res)
                // 为表单快速的赋值
                form.val('dialog-edit', res.data)
            },
        })
        // console.log(id)
    })

    //5.通过代理的形式，为修改分类的表单提供submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    alert(layer.msg('失败'))
                }
                layer.msg('成功')
                layer.close(indexEdit)
                initArtCateList()
            },
        })
    })

    //6.通过代理的形式，为删除按钮绑定事件
    $('tbody').on('click', '#btn-delete', function (e) {
        e.preventDefault()
        //获取到删除的id值，避免删错
        var id = $(this).attr('data-id')
        //提示用户是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (
            index
        ) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    // console.log(res)
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    layer.close(index)
                    initArtCateList()
                },
            })
        })
    })
})

// 1.文章分类列表封装
function initArtCateList() {
    $.ajax({
        url: '/my/article/cates',
        success: function (res) {
            // console.log(res)
            //模板引擎渲染（传递的是对象，script模板中使用的是属性）
            var htmlStr = template('tpl-table', res)
            $('tbody').html(htmlStr)
        },
    })
}
