define(['qunit'], function() {

	console.log('');
	console.log('Enabling debugging');

	require.debug = true;

	var formats = {
		module   : '========== $1 ==========',
		test     : '> $1',
		asyncTest: '* $1'
	};

	['module', 'test', 'asyncTest'].forEach(function(methodName) {
		window[methodName] = (function(oldMethod) {
			return function() {
				console.log(formats[methodName].replace('$1', arguments[0]));
				return oldMethod.apply(this, arguments);
			};
		}(window[methodName]));
	});
});