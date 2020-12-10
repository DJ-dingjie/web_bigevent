// 每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // options.url 表示的是除根路径外的请求路径，所以要拼接完整的路径

    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    // 如果 请求 为 /my/ 开头的在加请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ""
        }
    }
    // 无论陈功还是失败都会调用这个函数
    options.complete = function (res) {
        // 请求失败
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制 清除 token,是为了 防止出现 假 token
            localStorage.removeItem('token');
            location.href = '/login.html';
        }
    }
})