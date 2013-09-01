require([
'/../../scripts/tests/index.spec.js',
], function () {
var jasmineEnv = jasmine.getEnv();
jasmineEnv.execute();
}, function (err) {
console.error('Unable to load some or all of the requires specs. Error message = ' + err);
});
