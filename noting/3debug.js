
/*  原生实现debug打印日志 */
module.exports = function (name) {
    /*读取环境变量中的debug  当名字一样时候 打印信息*/
    return function (msg) {
        var debug = process.env.DEBUG;
        debug = '^'+debug.replace('*','.*');
        var regex = new RegExp(debug);
        // ^logger:.*
        if(regex.test(name)){
            console.log(name,msg)
        }
    }
}