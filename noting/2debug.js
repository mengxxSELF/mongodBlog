
/*  原生实现debug打印日志 */
module.export = function (name) {
    /*读取环境变量中的debug  当名字一样时候 打印信息*/
    return function (msg) {

        if(process.dev.DEBUG==name){
            console.log(name,msg)
        }
    }
}