export function sign(x: number) {
	if (x === 0) {
		return 1;
	}
	return Math.abs(x) / x;
}
