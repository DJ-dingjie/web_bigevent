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
            console.log(res);
            if (res.data.user_pic) {
                $("#user-touxiang-left, #user-touxiang-right").attr("src", res.data.user_pic)
                $("#user-touxiang-left, #user-touxiang-right").show();
                $("#default-portrait, .right-portrait").hide();
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
$(function () {

    let layer = layui.layer;
    // getUser()
    


    // 获取用户信息 
    getUser()
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

    // 为左侧个人中心 与 头部个人中心 相对应
    $("#userCenter dl dd").on("click", function (e) {
        console.log($(this).text());
        let index = $("#userCenter dl dd").index($(this));
        // console.log($("#userCenter dl dd")[index].innerText);
        $($(".layui-layout-right dl dd")[index]).addClass("layui-this").siblings("dd").removeClass("layui-this")
    });
    $(".layui-layout-right dl dd").on("click", function () {
        let index = $(".layui-layout-right dl dd").index(this);
        $($("#userCenter dl dd")[index]).addClass("layui-this").siblings("dd").removeClass("layui-this");
        $("#articleCenter dl dd").removeClass("layui-this")
    })
    $("#articleCenter dl dd").on("click", function () {
        $(".layui-layout-right dl dd").removeClass("layui-this")
    })
})