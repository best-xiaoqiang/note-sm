(function(){
  // https://juejin.cn/post/6844903843507994632
  //Promise函数
  function Promise(executor) {
    let self = this; //保留this。防止后面方法出现this只想不明的问题
    self.status = 'pending'; //promise的默认状态是pending
    self.success = undefined; //保存成功回调传递的值
    self.error = undefined; //保存失败回调传递的值

    self.onSuccessCallbacks = []; //存放成功的回调
    self.onErrorCallbacks = []; //存放失败的回调

    function resolve(success) {
        if (self.status === 'pending') {
            self.status = 'resolved'; //成功函数将其状态修改为resolved
            self.success = success; //将成功的值保存起来
            self.onSuccessCallbacks.forEach(element => {
                element();
            });
        }
    }

    function reject(error) {
        if (self.status === 'pending') {
            self.status = 'rejected'; //失败函数将其函数修改为rejected
            self.error = error; //将失败的值保存起来
            self.onErrorCallbacks.forEach(element => {
                element();
            })
        }
    }
    try {
        executor(resolve, reject);
    } catch (err) {
        reject(err);
    }
  }

  //then函数
  Promise.prototype.then = function (onResolved, onRejected) {
    onResolved = typeof onResolved == 'function' ? onResolved : val => val;
    onRejected = typeof onRejected == 'function' ? onRejected : err => {
        throw err;
    }
    let self = this;
    let promiseAgain = new Promise((resolve, reject) => {
        if (self.status === 'pending') {
            self.onSuccessCallbacks.push(() => {
                try {
                    let x = onResolved(self.success); //将resolve函数保留的成功值传递作为参数
                    resolvePromise(promiseAgain, x, resolve, reject);
                } catch (e) {
                    reject(e)
                }
            })
            self.onErrorCallbacks.push(() => {
                try {
                    let x = onRejected(self.error); //将reject函数保留的失败值传递作为参数
                    resolvePromise(promiseAgain, x, resolve, reject);
                } catch (e) {
                    reject(e)
                }
            })
        }
        if (self.status === 'resolved') {
            try {
                let x = onResolved(self.success); //将resolve函数保留的成功值传递作为参数
                resolvePromise(promiseAgain, x, resolve, reject);
            } catch (e) {
                reject(e)
            }
        }
        if (self.status === 'rejected') {
            try {
                let x = onRejected(self.error); //将reject函数保留的失败值传递作为参数
                resolvePromise(promiseAgain, x, resolve, reject);
            } catch (e) {
                reject(e)
            }
        }
    })
    return promiseAgain;
  }
  //resolvePromise函数
  function resolvePromise(promiseAgain, x, resolve, reject) {
    if (promiseAgain === x) {
        return reject(new TypeError("循环调用"));
    }
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x, (y) => {
                    resolvePromise(promiseAgain, y, resolve, reject);
                }, (e) => {
                    reject(e);
                })
            } else {
                resolve(x);
            }
        } catch (error) {
            reject(error);
        }
    } else {
        resolve(x);
    }
  }

  module.exports = Promise;
})()