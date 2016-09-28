var mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId;

var settings = require('../settings')

mongoose.connect(settings.dbUrl);  /*   独立出来了  */

/* 用户的模型骨架  定义集合的字段和类型  */
var UserSchema = new mongoose.Schema({
    username:'String',
    password:'String', /*  需要MD5加密*/
    email:'String',
    avatar:'String', /* 头像*/
})
var UserModel = mongoose.model('User', UserSchema);


var ArticleSchema = new mongoose.Schema({
    title:'String',
    content:'String',
    user:{type:ObjectId,ref:'User'},  /* 作者 ：  引用另一个 */
    pv:{type:Number,default:0} , /* 文章浏览量 */
    /* 增加评论字段 */
    comments:[{user: {type:ObjectId,ref:'User'} , createAt:{type:Date,default:Date.now()} , content:String}],
    createAt:{type:Date,default :Date.now()} /* 创建时间 默认当前时间*/
})
var ArticleModel = mongoose.model('Article',ArticleSchema)


/* 全局对象上挂载一个方法属性 */
global.Model = function (modelName) {
    return mongoose.model(modelName)
}



















