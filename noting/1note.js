
//var debug = require('debug');
var debug = require('./3debug.js');
//var debug = require('./2debug');

//console.log(process.env.DEBUG);  // 输出环境变量中的某个值 process.env.theName


// 输出的时候，会用此日志记录器的名字和环境变量中的DEUBG值进行比较，
// 如果相同，则输出到控制台，如果不相同，则不输出任何东西

var loggerServer = debug('logger:server')

loggerServer('server')
var loggerClient = debug('logger:client')
loggerServer('client')


