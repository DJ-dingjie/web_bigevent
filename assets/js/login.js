$(function () {
    $("#reg").on("click", function () {
        $(".reg-box").show();
        $(".login-box").hide();
    });
    $("#login").on("click", function () {
        $(".reg-box").hide();
        $(".login-box").show();
    });
    let form = layui.form;
    let layer = layui.layer;
    // 验证表单规则
    form.verify({
        // 只需要把 username 或者 pass 传入对应的 lay-verify 
        username: function (value, item) {
            //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return "用户名不能有特殊字符";
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return "用户名首尾不能出现下划线'_'";
            }
            if (/^\d+\d+\d$/.test(value)) {
                return "用户名不能全为数字";
            }
        },

        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pass: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        repass: function (value, item) {
            let pwd = $(".reg-box #pwd").val();
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    });
    // 发起登录请求,submit 事件 需要按钮的类型是 submit
    $("#login-form-box").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/api/login",
            /* 由于 baseApi文件的配置 所以不需要拼接根路径 */
            data: $("#login-form-box").serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message, {
                        time: 1500
                    });
                    return
                }
                console.log(res);
                layer.msg('登录成功', {
                    time: 1000
                })
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = '/index.html'
            }
        });
    });
    // 发起注册请求
    $("#reg-form-box").on("submit", function (e) {
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/api/reguser",
            data: {
                username: $("#reg-form-box #username").val(),
                password: $("#reg-form-box #pwd").val(),
            },
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message, {
                        time: 1500 //1 秒关闭（如果不配置，默认是3秒）
                    }, );
                    return
                }
                // 注册成功 显示登陆框
                layer.msg('注册成功', {
                    time: 1500
                })
                let regValue = $(".reg-box #username").val();
                $(".reg-box").hide();
                $(".login-box").show();
                $(".login-box #username-login").val(regValue);
            }
        });
    });
});