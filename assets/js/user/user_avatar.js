$(function () {
    let layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);

    // 用 change(当文件域的内容发生变化时触发) 事件 来获得文件选择框选中的文件
    $("#file").on("change", function (e) {
        let file = e.target.files[0];
        // 根据选择的文件，创建一个对应的 URL 地址：
        // var newImgURL = URL.createObjectURL(file);
        // 用来判断用户是否选择了 至少一张图片
        if (e.target.files.length <= 0) {
            return layer.msg('请选择照片')
        }
        // 第二种判断方法
        if (!file) {
            return layer.msg('请选择照片')
        }
        let newImageURL = URL.createObjectURL(file);
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImageURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    $("#btnChooseImage").on("click", function (e) {
        // $("#file").click();
        $("#file").trigger("click")
    });

    $("#btnDetermine").on("click", function () {
        let dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png'); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            type: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新头像失败')
                }
                layer.msg(res.message);
                window.top.getUser()
            }
        });
    })

})