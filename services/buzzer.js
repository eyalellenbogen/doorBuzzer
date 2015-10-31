module.exports = function (router, basePath) {
	
	var GpioPin = require("gpio-promise");
	
	function post(req, res) {
		var action = req.params.action;
		if (action == "buzz") {
			var pin = new GpioPin(4);
			pin.open('out').then(function () {
				pin.set(1);
			});
			//setTimeout(function () {
			//	pin.set(0);
			//}, 5000);
			res.status(200).send("Buzzing door");
			return;
		}
		if (action == "ring") {
			res.status(200).send("Ringing bell");
			return;
		}
		
		return res.status(400).send("Invalid action");
	}
	
	
	function register() {
		router.post(basePath + "/:action", post);
	}
	
	return {
		register: register
	};
};
