
在之前的学习中我们跟着Q的作者走了一遍其实现Promise的思路历程，不经收获满满。但由于这只是一个实现思路，因此在实际使用时我们更希望最后的Promise是一个构造函数方法，以new的方式实现调用，也更符合我们的变成习惯。接下来我们就以ES6的class来实现我们自己的Promise类

# Promise基础实现

首先实现一个Promise的class结构：
```js
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

    resolve(){}

    then(){}

    reject(){}
}
```
## then方法

首先实现`then`方法，主要用于注册callback函数，在`resolve`执行时被调用。在注册callback时需要对当前的promise状态进行判断，若`status`为`pending`状态，则将`callback`注册到`pending`数组中；若`status`为`fulfilled`状态，则直接执行`callback`函数；若`status`为`rejected`状态，则直接执行`errback`函数。
```js
then(_callback,_errback){
    if (this.status === PENDING) {
        this.pending.push([_callback,_errback])
    }else if(this.status === FULFILLED){
        _callback(this.value)
    }else{
        _errback(this.value)
    }
    
}
```

## resolve方法
`resolve`方法的作用是输入一个参数value，对属性value进行赋值，并在status为pending状态时遍历pending数组中注册的callback函数，传入value并执行，最后将status专为fulfilled状态。
```js
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
```

## reject方法
将错误信息作为参数message传入value属性，遍历penging中的errback方法并执行：
```js
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
```

## 验证

执行下列测试代码：
```js
var myPromiseResolve = new MyPromise((resolve,reject)=>{  
	resolve('I am resolve!')
}).then(
	(value)=>{console.log('resolve: ',value)},
	(message)=>{console.log('reject: ',message)}
);

// resolve:  I am resolve!

var myPromiseReject = new MyPromise((resolve,reject)=>{  
	reject('I am reject!')
}).then(
	(value)=>{console.log('resolve: ',value)},
	(message)=>{console.log('reject: ',message)}
);

// reject:  I am reject!
```
结果符合我们的预期。