const assert = require('assert');

class Car {
	park() {
		return('stopped');
	}

	drive() {
		return('vroom');
	}
}

let car;

beforeEach(() => {
	car = new Car();
});

describe('Car', () => {
	it('Can park', () => {
		assert.equal(car.park(), 'stopped');
	});

		it('Can drive', () => {
		assert.equal(car.drive(), 'vroom');
	});
});