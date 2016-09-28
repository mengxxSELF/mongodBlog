var express  = require('express');
var auth = require('../middleware/auth')
var utils = require('../utils'); /* md5加密  */
var multer = require('multer');
var upload = multer({dest:'../public/uploads/'})
/* 创建 router实例 */
var router = express.Router();

/* GET users listing. */
router.get('/reg', [auth.mustNotLogin] ,function(req, res, next) {
  res.render('user/reg');
});
/*  处理注册  */
router.post('/reg',[auth.mustNotLogin] ,upload.single('avatar'),function(req, res, next) {
    console.log(req.file)
    var user = req.body;//username password repassword email avatarImg
    //如果密码和重复密码不一致，则返回重定向到上一个注册表单页面
    if(user.password != user.repassword){
        return res.redirect('back');
    }
    //  判断用户名是否存在 当不存在时才创建
   Model('User').findOne({username:user.username}, function (err,result) {
        if(result){
            req.flash('error','用户名已经存在');
            res.redirect('back')
        }else{
            user.password = utils.md5(user.password);
            // user.avatar = "https://s.gravatar.com/avatar/"+utils.md5(user.email)+"?s=40";
            /* 改变用户头像
             应该存储在本地public文件夹中 转为静态文件输出
            */
            if(req.file){
                user.avatar = '/uploads/'+req.file.filename;
                console.log(user.avatar)
            }

            Model('User').create(user).then(function (doc) {
                req.flash('success','您已注册成功')
                req.session.user  = doc;
                res.redirect('/');
            }).catch(function () {
                req.flash('error','注册失败，请重新尝试')
                res.redirect('back');
            })

        }
    })


});

/* 登录*/
router.get('/login',[ auth.mustNotLogin] ,function(req, res, next) {
  res.render('user/login');
});
/*  处理提交登录 */
router.post('/login', function(req, res, next) {
    var user = req.body;//user password repassword email
   /* 验证密码*/
    Model('User').findOne({username:user.username}).then(function(doc){
        if( doc.password == utils.md5(user.password) ){
            req.flash('success','welcome');
            req.session.user = doc;
            res.redirect('/');
        }else{ /* 处理 当密码不匹配的时候 */
            req.flash('error','登录失败，密码错误');
            res.redirect('back')
        }
    }).catch(function(){
        req.flash('error','登录失败,用户名不存在');
        res.redirect('back')
    })
});

/* 退出登录*/
router.get('/logout',[auth.mustLogin] , function(req, res, next) {
    req.session.user = null; /*  退出登录 删除user值 */
    res.redirect('/');
});

module.exports = router;
