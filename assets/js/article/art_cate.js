$(function () {
    // 得到 layui 的 两个  操作对象
    let layer = layui.layer;
    let form = layui.form;
    // 获取 分类列表
    getClassificationList()

    function getClassificationList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (response) {
                if (response.status !== 0) {
                    return layer.msg('获取分类列表失败')
                }
                // 将分类列表 渲染到 页面上
                let htmlStr = template('classificationList', response);
                $("tbody").html("").append(htmlStr); 
                //  或者
                // $("tbody").html(htmlStr)
            }
        });
    }

    // 编辑   点击编辑  弹出一个编辑页面
    let indexEdit = 0;
    $("tbody").on("click", "#btnEdit", function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            content: $("#classificationListEdit").html(),
            area: ['500px', '250px']
        });
        // 获取原来的分类名称和分类别名
        let id = $(this).data("index");
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            success: function (response) {
                if (response.status !== 0) {
                    return layer.msg('获取失败')
                }
                form.val('form-edit', response.data)
            }
        });
    })

    //编辑   点击编辑 弹出的表单页面的提交事件
    //编辑   修改  分类列表 的 某一项
    $("body").on("submit", "#formEdit", function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: form.val('form-edit'),
            success: function (response) {
                if (response.status !== 0) {
                    return layer.msg('修改失败')
                }
                layer.msg(response.message);
                getClassificationList();
                // 关闭  弹出层
                layer.close(indexEdit);
            }
        });
    })

    //删除   点击  删除按钮  删除分类列表
    $("body").on("click", "#btnDelete", function (e) {
        let id = $(this).data("index");
        layer.confirm('确定删除?', {
            icon: 3,
            title: '删除分类'
        }, function (index) {
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (response) {
                    layer.msg(response.message);
                    getClassificationList();
                }
            });
            layer.close(index);
        });
        
    })

    // 添加   添加分类
    let indexAdd = 0;
    $("#btnAdd").on("click", function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $("#classificationListAdd").html(),
            area: ['500px', '250px']
        });
    })

    // 添加   弹出层表单提交事件
    $("body").on("submit", "#formAdd", function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (response) {
                if (response.status !== 0) {
                    return layer.msg('添加分类失败')
                }
                getClassificationList();
                layer.msg(response.message, {
                    time: 1000
                });
                layer.close(indexAdd);
            }
        });
        
    })
})