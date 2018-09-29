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

    then(_callback,_errback){
        if (this.status === PENDING) {
            this.pending.push([_callback,_errback])
        }else if(this.status === FULFILLED){
            _callback(this.value)
        }else{
            _errback(this.value)
        }
        
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