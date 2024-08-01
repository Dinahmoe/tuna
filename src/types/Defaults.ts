import type { DATATYPE } from "./DATATYPE";
export type Defaults = Record<
	string,
	{
		min?: number;
		max?: number;
		value: number | boolean | BiquadFilterType | OscillatorType;
		automatable: boolean;
		type: DATATYPE;
		scaled?: boolean;
	}
>;
