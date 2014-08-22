var promise = require('../');

describe('Promise', function () {
  it('resolves without arguments', function (done) {
    var defer = promise();

    defer.resolve();

    defer.promise.then(function (retval) {
      assert.equal(retval, undefined);
      done();
    }, function (err) {
      throw new Error('Promise should have not been rejected');
    });
  });

  it('rejects', function (done) {
    var defer = promise();

    defer.reject(new Error('Rejected error'));

    defer.promise.then(function (err) {
      throw new Error('Promise should have not been resolve');
    }, function (err) {
      assert.ok(err);
      assert.equal(err.message, 'Rejected error');
      done();
    });
  });

});

