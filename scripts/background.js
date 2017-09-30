var Background = class {
	constructor() {
		this.draw = function() {
			context.beginPath();
			context.rect(0, 0, canvasWidth, canvasHeight);
			context.fillStyle = "#000";
			context.fill();
		}
	}
};
