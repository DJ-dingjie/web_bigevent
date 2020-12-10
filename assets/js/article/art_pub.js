$(function () {
    const layer = layui.layer;
    const form = layui.form;
    // 初始化富文本编辑器
    initEditor();
    // 1. 初始化图片裁剪器
    let $image = $('#image')

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);

    //  获取文章分类列表
    getCateList();

    function getCateList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (response) {
                let articleContent = JSON.parse(localStorage.getItem(window.parent.index));
                response.articleContent = articleContent;
                const htmlStr = template('classificationList', response);
                console.log(response);
                $("select[name=cate_id]").html(htmlStr);
                form.render();
            }
        });
    }

    console.log(window.parent.index);
    console.log(JSON.parse(localStorage.getItem(window.parent.index)));
    if (window.parent.index) {
        getArticleDetails(window.parent.index);
    }

    function getArticleDetails(id) {
        let articleContent = JSON.parse(localStorage.getItem(id));
        form.val("add-content", articleContent);
        let imgURL = 'http://ajax.frontend.itheima.net' + articleContent.cover_img;
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    }

    // 选择封面图片文件按钮的点击事件
    $("#btnSelectCover").on("click", function () {
        $("input[type=file]").trigger("click");
    });

    // 用 change 事件判断用户是否选择了 封面图片
    $("input[type=file]").on("change", function (e) {
        let files = e.target.files;
        if (files.length <= 0) {
            return layer.msg('请选择文章封面')
        }

        let newImgURL = URL.createObjectURL(files[0]);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    });

    // button 区分按钮点击是发布还是存为草稿，用一个影藏的表单存入当前用户点击的
    // button 按钮的 name 属性值
    $(".layui-form").on("submit", function (e) {
        e.preventDefault();
        let fd = new FormData($(this)[0]);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将封面图片放入到 fd 中
                fd.append('cover_img', blob);
                // 发起 ajax 请求
                // 判断是更新文章还是发布文章
                if ($("button[name=已发布]").text() === '更新') {
                    $.ajax({
                        method: "POST",
                        url: "/my/article/edit",
                        data: fd,
                        // 以 FormData 创建的实例对象为参数 需要配置下面两个参数及值
                        contentType: false,
                        processData: false,
                        success: function (response) {
                            if (response.status !== 0) {
                                return layer.msg('更新文章失败')
                            }
                            layer.msg(response.message);
                            location.href = '/article/art_list.html';
                        }
                    });
                } else {
                    $.ajax({
                        method: "POST",
                        url: "/my/article/add",
                        data: fd,
                        // 以 FormData 创建的实例对象为参数 需要配置下面两个参数及值
                        contentType: false,
                        processData: false,
                        success: function (response) {
                            if (response.status !== 0) {
                                return layer.msg('发布文章失败')
                            }
                            let ddSecond = (window.parent.document.querySelector('#articleCenter').children[1].children[1]);
                            $(ddSecond).addClass("layui-this").siblings().removeClass("layui-this");
                            location.href = '/article/art_list.html';
                            layer.msg(response.message);
                        }
                    });
                }

            })
    })

    $("button").on("click", function () {
        $("#state").val($(this).prop("name"));
    });

    // 判断是跟新还是发布   文章
    console.log($($("#articleCenter dd", parent.document)[1]).hasClass("layui-this"));
    if ($($("#articleCenter dd", parent.document)[1]).hasClass("layui-this")) {
        let input = `<input type="hidden" name="Id" value="${window.parent.index}">`
        $("button[name=已发布]").text("更新")
        $(".layui-form").append(input);
    }

    console.log($("button[name=已发布]").text() === '更新')
})