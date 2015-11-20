module.exports = function (router, basePath) {
	
	//var GpioPin = require("gpio-promise");
	var gpio = require("gpio");
	var pin4 = gpio.export(4, {
		direction: "out",
		interval: 200,
		ready: function(){
			pin4.set(0);
		}
	});

	var isBuzzing = false;

	function isPositiveInteger(n) {
		return 0 === n % (!isNaN(parseFloat(n)) && 0 <= ~~n);
	}

	function buzz(req, res) {
		var action = req.params.action;
		var seconds = 20;
		if (isBuzzing) {
			return res.status(400).send("Buzzing already");
		}
		isBuzzing = true;
		var worker;
		if (action == 'stop') {
			worker = function () {
				pin4.set(0);
			}
		} else {
			worker = function () {
				pin4.set(1);
				setTimeout(function () {
					pin4.set(0);
					isBuzzing = false;
				}, seconds * 1000)
			}
		}

		pin4 = gpio.export(4, {
			direction: "out",
			interval: 200,
			ready: worker
		});
		res.status(200).send("Buzzing door");
	}

	function ring(req, res) {
		res.status(200).send("ringing");
	}

	function register() {
		router.post(basePath + "/buzz/:action?", buzz);
		router.post(basePath + "/ring", ring);
	}

	return {
		register: register
	};
};
