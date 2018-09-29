# 实现Promise的链式调用

实现链式调用的关键就是then方法，首先物品们需要让它能够返回一个新的Promise对象，从而能够在这个返回的Promise对象上调用新的then方法，最终形成链式调用。

```js
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
```

接下来测试一下我的的链式调用功能:

```js
var MyPromise = require('./Promise').MyPromise;

var myPromiseResolve = new MyPromise((resolve,reject)=>{  
	resolve('I am resolved!')
}).then(
	(value)=>{
		console.log('resolve: ',value);
		return 'I am also resolved!'
	},
	(message)=>{console.log('reject: ',message)}
).then((value)=>{
	console.log('resolve2: ',value)
});

var myPromiseReject = new MyPromise((resolve,reject)=>{  
	reject('I am rejected!')
}).then(
	(value)=>{console.log('resolve: ',value)},
	(message)=>{
		console.log('reject: ',message);
		return 'I am also rejected!'
	}
).then(function(){},(err)=>{
	console.log('reject2: ',err)
});
```

执行结果为：
```
resolve:  I am resolved!
resolve2:  I am also resolved!
reject:  I am rejected!
reject2:  I am also rejected!
```

完全符合预期