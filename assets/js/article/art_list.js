$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    //3.定义美化时间的过滤器=====形参,传过来的时间
    template.defaults.imports.dateFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + '  ' + hh + ':' + mm + ':' + ss
    }
    //3.1单个数字补零
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    //1.定义一个全局变量,存储分页的参数信息
    var p = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cata_id: '', //文章分类的id
        state: '', //文章的状态
    }
    //2.获取文章列表数据的方法
    initTable()
    initCate()
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: p,
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                //成功的话就把数据渲染到模板引擎中
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            },
        })
    }

    //4.文章分类的函数

    function initCate() {
        //获取到后台分类的数据信息
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg('获取信息失败')
                }
                // 成功的话就渲染到页面上===利用模板引擎的发方法
                var htmlStr = template('tpl-cate', res)
                $('[name="cata_id"]').html(htmlStr)
                // 通知layui重新渲染表单区域的ui结构
                form.render()
            },
        })
    }

    //5.表单的筛选功能
    $('#form-search').on('submit', function (e) {
        console.log(111)
        e.preventDefault()
        // 获取分类信息
        var cata_id = $('[name="cata_id"]').val()
        var state = $('[name="state"]').val()
        p.cata_id = cata_id
        p.state = state
        //重新获取文章列表
        initTable()
    })

    //6.定义渲染分页的方法
    function renderPage(total) {
        //调用laypage.render()方法渲染分页结构
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: p.pagesize,
            curr: p.pagenum, //最新页码值
            limits: [2, 3, 5, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 分页的回调函数
            //分页发生切换的时候触发jump回调函数
            //触发jump回调 的方式有两种
            //1.点击页码的时候，触发jump
            //2.只要调用了laypage.render()方法，会触发jump回调
            jump: function (obj, first) {
                //可以通过first的值来判断是通过哪种方式触发的回调函数
                //如果为真，是通过laypage.render()方法触发
                //如果为undeifined,是点击事件触发的
                // console.log(first)
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr) //得到当前页，以便向服务端请求对应页的数据。
                //把最新的页码值，赋值到p这个查询参数对象中
                p.pagenum = obj.curr
                // 把最新的条目数，赋值到p这个查询参数对象中
                p.pagesize = obj.limit
                //根据最新的p获取对应的数据列表，并渲染到表格
                //首次不执行   //不是第一次跳转的话就证明是点击事件被触发
                if (!first) {
                    initTable()
                }
            },
        })
    }

    //7.通过代理的形式，为删除按钮绑定点击事件的处理函数
    $('tbody').on('click', '.btn-delete', function () {
        //获取到文章的id
        var id = $(this).attr('data-id')
        //获取到按钮长度
        var len = $('.btn-delete').length
        console.log(len)
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (
            index
        ) {
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章列表失败')
                    }
                    layer.msg('删除成功')
                    //当数据删除完成后，需要判断当前这一页中是否还有剩余数据
                    //如果没有数据，则让页码值-1
                    //然后重新调用initTable()方法
                    //通过按钮的长度来判断
                    //如果页面只有一个btn按钮，并且页码值>1的时候
                    // if (len === 1 && p.pagenum > 1) {
                    //     p.pagenum = p.pagenum - 1

                    // }
                    if (len === 1) {
                        p.pagenum = p.pagenum == 1 ? 1 : p.pagenum - 1
                    }
                    initTable()
                },
            })

            layer.close(index)
        })
    })
})
