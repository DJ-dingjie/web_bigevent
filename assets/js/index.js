$(function () {
    // 获取用户信息 
    let layer = layui.layer;
    getUser()

    function getUser() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message, {
                        time: 1500
                    });
                    return
                }
                // console.log(res);
                if (res.data.user_pic) {
                    $("#user-touxiang-left, #user-touxiang-right").attr("src", res.data.uer_pic)
                    $("#user-touxiang-left, #user-touxiang-right").show();
                    $("#default-portrait").hide();
                } else {
                    $("#user-touxiang-left, #user-touxiang-right").hide();
                    $("#default-portrait").show();
                }
                if (res.data.nickname) {
                    $("#username").html("欢迎&nbsp;&nbsp;" + res.data.nickname)
                } else {
                    $("#username").html("欢迎&nbsp;&nbsp;" + res.data.username)
                }
            }
            // 失败调用
            // error: function (XMLHttpRequest, textStatus, errorThrown) {
            //     console.log(XMLHttpRequest);
            //     console.log(textStatus);
            //     console.log(errorThrown);
            // }
        });
    }
    // 实现 退出功能
    $("#exit").on("click", function () {
        layer.confirm('是否退出', {
            icon: 3,
            title: '提示'
        }, function (index) {
            layer.close(index);
            // 删除权限的代表 
            localStorage.removeItem('token')
            // 退到登录页面
            location.href = '/login.html'
        });
        
    })
})