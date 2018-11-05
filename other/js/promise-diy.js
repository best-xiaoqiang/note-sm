(function () {
    function MyPromise(fn){
        var state = 'pending';
        var doneLists = [];
        this.then = function(done){
            return new MyPromise(function(resolve){
                handle({
                    done: done || null,
                    resolve: resolve
                });
            });
        }
        function resolve(newValue) {
            if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
                var then = newValue.then;
                if (typeof then === 'function') {
                    then.call(newValue, resolve);
                    return;
                }
            }
            state = 'fulfilled';
            value = newValue;
            setTimeout(function () {
                doneLists.forEach(function (deferred) {
                    handle(deferred);
                });
            }, 0);
        }
        function handle(deferred) {
            if (state === 'pending') {
                doneLists.push(deferred);
                return;
            }
            var ret = deferred.done(value);
            deferred.resolve(ret);
        }
        fn(resolve);
    }

    window.MyPromise = MyPromise
})()