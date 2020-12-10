window.parent.index = '';
$(function () {
    const layer = layui.layer;
    const form = layui.form;
    const laypage = layui.laypage;
    // 定义 补 0 函数
    function complementZero(num) {
        return num >= 10 ? num : '0' + num;
    }
    // 定义处理时间的函数
    template.defaults.imports.formatTime = function (time) {
        const t = new Date(time);
        let y = t.getFullYear();
        let m = t.getMonth() + 1;
        let d = t.getDate();

        let h = t.getHours();
        let mi = t.getMinutes();
        let s = t.getSeconds();
        return y + '-' + complementZero(m) + '-' + complementZero(d) + ' ' + complementZero(h) + ':' + complementZero(mi) + ':' + complementZero(s);

    }
    // 定义查询参数，用于 发起请求时携带的参数
    let q = {
        pagenum: 1,
        /*  页码值  默认为 1 */
        pagesize: 2,
        /* 每页显示多少条数据  默认为 2 */
        cate_id: '',
        /* 文章分类的 id */
        state: '' /* 文章的状态，可选值有：已发布、草稿  */
    }

    initArticleList();
    getClassificationList()
    // 查询或初始化文章列表
    function initArticleList() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function (response) {
                if (response.status !== 0) {
                    return layer.msg('获取文章信息失败')
                }
                // if (response.data.length <= 0) {
                //     layer.msg('您还没有发布过文章')
                // }
                const htmlStr = template('articleList', response);
                $("tbody").html(htmlStr);
                // 调用 分页的函数
                console.log(response);
                makePagingBox(response);
            }
        });
    }
    // 初始化或获取  分类列表
    function getClassificationList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (response) {
                if (response.status !== 0) {
                    return layer.msg('获取文章分类失败')
                }
                const htmlStr = template('ClassificationList', response);
                $("select[name='cate_id']").html(htmlStr);
                // 由于 layui 模块的加载机制  需要我们再重新渲染一次
                form.render()
            }
        });
    }

    // 筛选 文章分类和状态
    $("#formScreen").on("submit", function (e) {
        e.preventDefault();
        q.cate_id = $("select[name=cate_id]").val();
        q.state = $("select[name=state]").val();
        initArticleList()
    })

    // 分页制作
    function makePagingBox(data) {
        laypage.render({
            elem: 'pagingBox',
            count: data.total,
            limit: q.pagesize,
            curr: q.pagenum,
            /* 起始页 */
            limits: [2, 3, 5, 10],
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            // 当页面被运行的时候 会调用一次 jump 函数, 这个时候 first 输出的是 true
            // 当我们点击页码值的时候也会调用此函数, 这个时候 first 输出的是  undefined
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                let pageCurrent = obj.curr; //得到当前页，以便向服务端请求对应页的数据。
                let pagesizeCurrent = obj.limit; //得到每页显示的条数
                q.pagenum = pageCurrent;
                q.pagesize = pagesizeCurrent;
                if (first) {
                    $(".layui-laypage-count").text('共' + obj.count + '条,' + Math.ceil(obj.count / pagesizeCurrent) + '页');
                    //  解决当删除时 无法再次查询文章，而导致最新的文章列表无法加载出来
                    if (data.data.length <= 0) {
                        initArticleList()
                    }
                    return
                }
                console.log($(".layui-laypage-count"));
                $(".layui-laypage-count").text('共' + obj.count + '条,' + Math.ceil(obj.count / pagesizeCurrent) + '页');
                initArticleList();
            }
        })
    }

    //  删除文章
    $("tbody").on("click", "#btnDel", function () {
        // alert($("tbody #btnDel").length);
        let id = $(this).attr("data-id");
        layer.confirm('是否删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function (response) {
                    if (response.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg(response.message);
                    // 解决当删除当前页最后一条文章时无法查询到文章的第二种方法
                    // 获取 当前页的删除按钮， 即代表了当前页有多少条数据，当点击删除按钮的
                    // 时候还剩下最后一个按钮即代表当前页的数据已经删除完了,这时候让当前页减一
                    // 然后通过 函数  initArticleList 查询 当前页减一对应的页码值 的数据
                    initArticleList();
                    layer.close(index);
                }
            });
        });
    });

    // 编辑按钮 
    $("tbody").on("click", "#btnEdit", function () {
        let id = $(this).attr("data-id");
        window.parent.index = id;
        // let ddThree = (window.parent.document.querySelector('#articleCenter').children[1].children[2]);
        // $(ddThree).addClass("layui-this").siblings().removeClass("layui-this")
        $.ajax({
            type: "GET",
            url: "/my/article/" + id,
            success: function (response) {
                if (response.status !== 0) {
                    layer.msg('获取文章信息失败')
                }
                let content = localStorage.getItem('token');
                localStorage.clear();
                localStorage.setItem('token', content);
                localStorage.setItem(id, JSON.stringify(response.data));
                location.href = '/article/art_pub.html';    
            }
        });
    })
})