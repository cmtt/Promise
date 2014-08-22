"use strict";

module.exports = Promise;

function Promise() {
  var callbacks = [];
  var promise = {
    then: then,
    safe: {
      then: function safeThen(resolve, reject) {
        promise.then(resolve, reject);
      }
    }
  };

  function complete(type, result) {
    promise.then = type === 'reject' ? function(resolve, reject) { reject(result); } : function(resolve) { resolve(result); };
    promise.resolve = promise.reject = function() { throw new Error("Promise already completed"); };
    var i = 0, cb;
    while ((cb = callbacks[i++])) {
      if (cb[type]) cb[type](result);
    }
    callbacks = null;
  }

  function resolve(result) {
    complete('resolve', result);
  }

  function reject(err) {
    complete('reject', err);
  }

  function then(resolve, reject) {
    callbacks.push({ resolve: resolve, reject: reject });
  }

  return {
    resolve: resolve,
    reject: reject,
    promise : promise
  };
}

Promise.all = function (arr) {
  var args = Array.prototype.slice.call(arr);
  var defer = Promise();

  if (args.length === 0) return defer.resolve(args);
  var remaining = args.length;

  function res(i, val) {
    try {
      if (val && (typeof val === 'object' || typeof val === 'function')) {
        var then = val.then;
        if (typeof then === 'function') {
          then.call(val, function (val) {
            res(i, val);
          }, defer.reject);
          return;
        }
      }
      args[i] = val;
      if (--remaining === 0) {
        defer.resolve(args);
      }
    } catch (ex) {
      defer.reject(ex);
    }
  }

  for (var i = 0; i < args.length; i++) {
    res(i, args[i]);
  }

  return defer.promise;
};
