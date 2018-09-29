/**
 * Promise内部仅包含三种状态：PENDING/FULFILLED/REJECTED，
 * 且状态只能由PENDING转为FULFILLED或者PENDING转为REJECTED
 */
var PENDING = 0,
FULFILLED = 1,
REJECTED = 2;

/**
 * 实现Promise基本功能
 */
class MyPromise {
    constructor(onFulfilled){
        this.status = PENDING;
        this.pending = [];
        this.value = null;
        this.resolve = this.resolve.bind(this);
        this.then = this.then.bind(this);
        this.reject = this.reject.bind(this);
        onFulfilled(this.resolve,this.reject);
    }

    resolve(value){
        if (this.status === PENDING) {
            this.value = value;
            for (var index = 0,length = this.pending; index < this.pending.length; index++) {
                var callback = this.pending[index][0];
                callback(this.value);                 
            }
            this.status = FULFILLED;
        }      
    }
    /**
     * 注册resolve执行后调用的回调函数
     * @param {func} _callback 注册的回调函数
     * @param {func} _errback  注册的异常处理函数
     */
    then(_callback,_errback){

        //创建待返回的Promise对象
        var newPromise = new MyPromise(function(){});

        // 对_callback和_errback进行封装，这里是能够实现链式调用的关键
        var callback = function(value){
            newPromise.resolve(_callback(value))
        }
        var errback = function(value){
            newPromise.reject(_errback(value))
        }

        // 根据status的状态来进行处理
        if (this.status === PENDING) {
            // 注意，这里传入pending的是封装过的callback和errback
            this.pending.push([callback,errback])
        }else if(this.status === FULFILLED){
            callback(this.value)
        }else{
            errback(this.value)
        }

        // 返回新的promise对象
        return newPromise;
    }

    reject(message){
        if (this.status === PENDING) {
            this.value = message;
            for (var index = 0,length = this.pending; index < this.pending.length; index++) {
                var errback = this.pending[index][1];
                errback(this.value);                 
            }
            this.status = REJECTED;
        }
    }
}

exports.MyPromise = MyPromise;