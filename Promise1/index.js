var MyPromise = require('./Promise').MyPromise;

var myPromiseResolve = new MyPromise((resolve,reject)=>{  
	resolve('I am resolve!')
}).then(
	(value)=>{console.log('resolve: ',value)},
	(message)=>{console.log('reject: ',message)}
);

var myPromiseReject = new MyPromise((resolve,reject)=>{  
	reject('I am reject!')
}).then(
	(value)=>{console.log('resolve: ',value)},
	(message)=>{console.log('reject: ',message)}
);