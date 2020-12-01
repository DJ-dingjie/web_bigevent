$(function () {
    // 定义表单验证规则
    let form = layui.form;
    let layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '用户昵称必须在 1~6个字符之间'
            }
        }
    });
    // 获得最初始的用户信息
    getUserInfo();

    function getUserInfo() {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message, {
                        time: 1500
                    })
                }
                // 快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        });
    }
    // 重置：初始化时的用户信息
    $("#btnReset").on("click", function (e) {
        // 阻止默认行为
        e.preventDefault()
        getUserInfo()
    })
    // 更新用户
    $("#layui-form").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                // 用 iframe 标签 绑定的页面 可以理解为 子页面，那么整个页面可以理解为 父页面
                // 子页面 可以通过 window.parent 来调用 父页面定义的函数
                window.parent.getUser()
            }
        });
    })
})