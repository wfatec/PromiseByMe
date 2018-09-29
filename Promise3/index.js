var MyPromise = require('./Promise').MyPromise;

var myPromiseResolve = new MyPromise((resolve,reject)=>{  
	resolve('I am resolved!')
}).then(
	(value)=>{
		console.log('resolve: ',value);
		return 'I am also resolved！'
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