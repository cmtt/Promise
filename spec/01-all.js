var promise = require('../');

describe('Promise.all', function () {
  it('resolves all', function (done) {
    var promises = [];

    function _push() {
      var defer = promise();
      promises.push(defer.promise);
      return defer;
    }

    for (var i = 0; i < 10; ++i) {
      var p = _push();
      p.resolve(i);
    }

    promise.all(promises).then(function (retvals) {
      assert.deepEqual(retvals, [0,1,2,3,4,5,6,7,8,9]);
      done();
    }, function (err) {
      throw err;
    });
  });

  it('rejects', function (done) {
    var promises = [];

    function _push() {
      var defer = promise();
      promises.push(defer.promise);
      return defer;
    }

    for (var i = 0; i < 10; ++i) {
      var p = _push();
      if (i === 8) {
        p.reject(new Error('Rejecting at ' + i));
      } else {
        p.resolve(i);
      }
    }

    promise.all(promises).then(function (retvals) {
      throw new Error('Promise.all should have not rejected');
    }, function (err) {
      assert.ok(err);
      assert.equal(err.message, 'Rejecting at 8');
      done();
    });
  });



});

