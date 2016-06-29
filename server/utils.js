'use strict'

module.exports = function (_, moment, async, __db) {

	return {

		isntMobile (opt) {
			// TODO: place better test here
			let pattern = /(^(13\d|14[57]|15[^4,\D]|17[678]|18\d)\d{8}|170[059]\d{7})$/
			return !pattern.test(opt)
		}

	}

}
