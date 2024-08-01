export function dbToWAVolume(db: number) {
	return Math.max(0, Math.round(100 * 2 ** (db / 6)) / 100);
}
