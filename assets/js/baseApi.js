// 每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // options.url 表示的是除根路径外的请求路径，所以要拼接完整的路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
})