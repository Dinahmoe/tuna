export function tanh(n: number) {
	return (Math.exp(n) - Math.exp(-n)) / (Math.exp(n) + Math.exp(-n));
}
