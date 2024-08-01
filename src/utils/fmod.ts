export function fmod(x: number, y: number) {
	// http://kevin.vanzonneveld.net
	// *     example 1: fmod(5.7, 1.3);
	// *     returns 1: 0.5
	let tmp: number | RegExpMatchArray | null;
	let tmp2: number | RegExpMatchArray | null;
	let p = 0;
	let pY = 0;
	let l = 0.0;
	let l2 = 0.0;

	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	tmp = x.toExponential().match(/^.\.?(.*)e(.+)$/)!;
	p = Number.parseInt(tmp[2], 10) - `${tmp[1]}`.length;
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	tmp = y.toExponential().match(/^.\.?(.*)e(.+)$/)!;
	pY = Number.parseInt(tmp[2], 10) - `${tmp[1]}`.length;

	if (pY > p) {
		p = pY;
	}

	tmp2 = x % y;

	if (p < -100 || p > 20) {
		// toFixed will give an out of bound error so we fix it like this:
		l = Math.round(Math.log(tmp2) / Math.log(10));
		l2 = 10 ** l;

		return Number.parseFloat((tmp2 / l2).toFixed(l - p)) * l2;
	}
	return Number.parseFloat(tmp2.toFixed(-p));
}
