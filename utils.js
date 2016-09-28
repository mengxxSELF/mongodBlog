exports.md5= function (str) {
    /*  md5 对 传入的参数加密  输出16进制字符串*/
    return require('crypto').createHash('md5').update(str).digest('hex');
                         /*   创建MD5 算法  更新  输出  */
}