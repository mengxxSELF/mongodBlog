var express = require('express');
/* 创建 router实例 */

var auth = require('../middleware/auth')

var markdown = require('markdown').markdown;

var router = express.Router();

router.get('/add', function(req, res, next) {
    res.render('article/add');
});
router.post('/add', function(req, res, next) {
    var article = req.body;
    article.user = req.session.user._id;
    Model('Article').create(article).then(function (doc) {
        req.flash('success','文章发布成功');
        res.redirect('/article/list');
    }).catch(function () {
        req.flash('error','文章失败');
        res.redirect('back');
    })
});

/* 列表 */
router.get('/list', function (req,res) {
    /* 增加分页功能 */
    var totalP = 0; /* 文档的总条数 */
    var order = req.query.order; /* 排序 */
    var pageSize = parseInt( req.query.pageSize||3 ); /* 每一页限制几条*/
    var pageNum = parseInt(req.query.pageNum || 1 ); /* 查询的当前页码*/

    /* 增加查询关键字功能*/
    var keyword = req.query.keyword;


    // 判断是不是传入user 了 传入之后就是查看某一个用户的文章列表
    var user = req.query.user;
    var query = { }; /* 设置查询对象 默认是空*/
    if(user){
        query['user'] = user;
    }
    if(keyword){
        var filter = new RegExp(keyword);
        query['$or']=[{content:filter},{title:filter}]
    }

    //默认情况下按文章的发表顺序排列
    var defaultOrder={};
    if(order){
        var orderBy =''; /* 排序字段*/
        var orderVal = -1 ;  /* 正序还是倒序 */
        if(order.startsWith('-')){   // 如果以-开头  -createAt
            orderBy = order.slice(1); // 取出排序字段 createAt
        }else{
            orderBy = order;
            orderVal = 1;
        }
        defaultOrder[orderBy] =  orderVal;
    }else{
        defaultOrder = {createAt:-1}
    }
    Model('Article').count(query).then(function (res) {
        totalP = res;
        return Model('Article')
            .find(query)
            .skip((pageNum-1)*pageSize)
            .limit(pageSize)
            .sort(defaultOrder)
            .populate('user')
    }).then(function (docs) {
        docs.forEach(function (doc) {
            doc.content = markdown.toHTML(doc.content)
        })
        res.render('article/list',{
            title:'文章列表' ,
            articles:docs ,
            order: order  ,
            NowPageNum:pageNum ,
            pageSize:pageSize,
            totalPage:  Math.ceil(totalP/pageSize)
        })
    })
})

/* 详情 */
router.get('/detail/:id', function (req,res) {
    var articleId = req.params.id;
    Model('Article').update({_id:articleId},{ $inc :{ pv:1 }}).then(function () {
        return Model('Article').findById({_id:articleId}).populate('comments.user')
    }).then(function (doc) {
        doc.content = markdown.toHTML(doc.content);
        res.render('article/detail',{title:'文章详情' ,article:doc})
    })
})


/*删除文章*/
router.get('/delete/:id', function (req,res) {
    var articleId = req.params.id;
    Model('Article').remove({_id:articleId}).then(function () {
        req.flash('success','删除文章成功');
        res.redirect('/article/list')
    })
})
/* 编辑 */
router.post('/edit/:id', function (req,res) {
    var articleId = req.params.id;
    var article = req.body;
    Model('Article').update({_id:articleId} , article).then(function () {
        req.flash('success','编辑成功');
        res.redirect('/article/detail/'+articleId);
    })
})


/* 评论*/
/*router.post('/comment/:id', function (req,res) {
 var articleId = req.params.id;
 var content = req.body;
 Model('Article').update({_id:articleId},
 {
 $push:{comments:{
 content:content, user: req.session.user._id
 }}
 }
 ).then(function (result) {
 res.redirect('/article/detail/'+articleId );
 }, function (error) {
 res.redirect('back')
 })
 })
 */

/* 登录之后才可进行文章评论  */
router.post('/comment', [auth.mustLogin] , function (req,res) {
    // articleId comment
    var comment = req.body;
    Model('Article').update({_id:comment.articleId},
        {
            $push:{comments:{
                content: comment.content, user: req.session.user._id
            }}
        }
    ).then(function (result) {
            res.redirect('/article/detail/'+ comment.articleId );
        }, function (error) {
            res.redirect('back')
        })

});


/*删除评论*/
/*
router.get('/comment/:articleId/delete/:commentId', function (req,res) {
    var articleId = req.query.articleId;
    var commentId = req.query.commentId;
    Model('Article').remove({comments._id:commentId}).then(function () {
        req.flash('success','删除评论成功')
        res.redirect('/article/detail/'+articleId);
    })
})
*/





module.exports = router; /* 导出路由*/
