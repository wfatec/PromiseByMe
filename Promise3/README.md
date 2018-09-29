# 提高Promise的稳定性
虽然之前已经能够实现基本的链式调用功能，但实际上现在的Promise还存在较多可以优化的部分。

## onFulfilled
若在实例化一个promise对象时，未传入onFulfilled函数，则会产生异常，因此这里需要进行校验
```js
// 对onFulfilled增加校验，提高鲁棒性
if (typeof onFulfilled === 'function') {
    onFulfilled(this.resolve,this.reject);
}
```

## _callback与_errback
在调用then方法时，我们必须同时传入_callback和_errback方法，否则也会产生异常，这里需要增加校验函数并设置默认值
```js
// 为_callback和_errback设置默认值
    var _callback = _callback||function(){return this.value};
    var _errback = _errback||function(){return this.value};
```

## callback的异步执行
我们实现链式调用有一个基本前提，那就是在实行resove时，所有的回调函数已经通过then方法注册完毕，但之前的实现中我们不能保证这一点。因此我们可以将callback延时执行：
```js
/**
 * 延时执行,确保then函数注册成功
 */
setTimeout(function(){
    callback(this.value);
},1)
```