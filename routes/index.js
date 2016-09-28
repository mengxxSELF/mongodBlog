var express = require('express');

/* 创建 router实例 */
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express'
     /*
     这里的权限高  会覆盖到app.js 中那个 success error
     success:req.flash('success'),
     error:req.flash('error'),*/
  });
});

module.exports = router;
