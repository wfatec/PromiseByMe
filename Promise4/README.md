# 传递Promise对象
之前的Promise实现中还存在一个问题，若callback的返回值是一个promise对象，则会产生异常。因此接下来我们就需要对这种情况进行处理。

## isPromise
在真正开始修改之前我们需要能够对promise对象进行判断，方法如下：
```js
var isPromise = function(inst){
    return inst instanceof MyPromise
}
```

## 改造then方法
当_callback返回值为promise时，我们不能直接将这个promise传入newPromise的resolve方法，因此尝试如下改造：
```js
 var callback = function(value){
    var valueReturnedByCallback = _callback(value);

    // 判断callback的返回值是否为Promise对象
    if (isPromise(valueReturnedByCallback)) {
        // 通过then方法将valueReturnedByCallback的resolve值传递给newPromise，并执行resolve
        valueReturnedByCallback.then((v)=>{newPromise.resolve(v)})
    }else{
        newPromise.resolve(valueReturnedByCallback)
    }
}
```
这样我们就成功获取到了valueReturnedByCallback中resolve的值，并触发newPromise.resolve方法，来测试一下：
```js
var MyPromise = require('./Promise').MyPromise;
var isPromise = require('./Promise').isPromise;

var myPromiseResolve = new MyPromise((resolve,reject)=>{  
	resolve('I am resolved!')
}).then(
	(value)=>{
		console.log('resolve: ',value);
		return new MyPromise((resolve)=>{resolve('I am new Promise!')})
	},
	(message)=>{console.log('reject: ',message)}
).then((value)=>{
	console.log('resolve2: ',value);
	return 'I am the last!'
}).then((value)=>{
	console.log('resolve: ', value)
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
结果为：
```
resolve:  I am resolved!
resolve2:  I am new Promise!
resolve:  I am the last!
reject:  I am rejected!
reject2:  I am also rejected!
```
测试结果完全符合预期。

本节虽然改动不大，但却是实现promise传递的关键，希望大家好好体会！