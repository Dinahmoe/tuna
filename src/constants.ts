import { DATATYPE } from "./types/DATATYPE";

export const BITCRUSHER_DEFAULTS = {
	bits: {
		value: 4,
		min: 1,
		max: 16,
		automatable: false,
		type: DATATYPE.INT,
	},
	bufferSize: {
		value: 4096,
		min: 256,
		max: 16384,
		automatable: false,
		type: DATATYPE.INT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
	normfreq: {
		value: 0.1,
		min: 0.0001,
		max: 1.0,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
};

export const COMPRESSOR_DEFAULTS = {
	threshold: {
		value: -20,
		min: -60,
		max: 0,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	release: {
		value: 250,
		min: 10,
		max: 2000,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	makeupGain: {
		value: 1,
		min: 1,
		max: 100,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	attack: {
		value: 1,
		min: 0,
		max: 1000,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	ratio: {
		value: 4,
		min: 1,
		max: 50,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	knee: {
		value: 5,
		min: 0,
		max: 40,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	automakeup: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
};

export const CABINET_DEFAULTS = {
	makeupGain: {
		value: 1,
		min: 0,
		max: 20,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
};

export const CHORUS_DEFAULTS = {
	delay: {
		value: 0.0045,
		min: 0,
		max: 1,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	depth: {
		value: 0.7,
		min: 0,
		max: 1,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	rate: {
		value: 1.5,
		min: 0,
		max: 8,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
};

export const CONVOLVER_DEFAULTS = {
	highCut: {
		value: 22050,
		min: 20,
		max: 22050,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	lowCut: {
		value: 20,
		min: 20,
		max: 22050,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	dryLevel: {
		value: 1,
		min: 0,
		max: 1,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	wetLevel: {
		value: 1,
		min: 0,
		max: 1,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	level: {
		value: 1,
		min: 0,
		max: 1,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
};

export const DELAY_DEFAULTS = {
	delayTime: {
		value: 100,
		min: 20,
		max: 1000,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	feedback: {
		value: 0.45,
		min: 0,
		max: 0.9,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	cutoff: {
		value: 20000,
		min: 20,
		max: 20000,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	wetLevel: {
		value: 0.5,
		min: 0,
		max: 1,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	dryLevel: {
		value: 1,
		min: 0,
		max: 1,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
};

export const FILTER_DEFAULTS = {
	frequency: {
		value: 800,
		min: 20,
		max: 22050,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	Q: {
		value: 1,
		min: 0.001,
		max: 100,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	gain: {
		value: 0,
		min: -40,
		max: 40,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
	filterType: {
		value: "lowpass" as BiquadFilterType,
		automatable: false,
		type: DATATYPE.STRING,
	},
};

export const GAIN_DEFAULTS = {
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
	gain: {
		value: 1.0,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
};

export const MOOGFILTER_DEFAULTS = {
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
	cutoff: {
		value: 0.065,
		min: 0.0001,
		max: 1.0,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	resonance: {
		value: 3.5,
		min: 0.0,
		max: 4.0,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
};

export const OVERDRIVE_DEFAULTS = {
	drive: {
		value: 0.197,
		min: 0,
		max: 1,
		automatable: true,
		type: DATATYPE.FLOAT,
		scaled: true,
	},
	outputGain: {
		value: -9.154,
		min: -46,
		max: 0,
		automatable: true,
		type: DATATYPE.FLOAT,
		scaled: true,
	},
	curveAmount: {
		value: 0.979,
		min: 0,
		max: 1,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	algorithmIndex: {
		value: 0,
		min: 0,
		max: 5,
		automatable: false,
		type: DATATYPE.INT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
};

export const PANNER_DEFAULTS = {
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
	pan: {
		value: 0.0,
		min: -1.0,
		max: 1.0,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
};

export const PHASER_DEFAULTS = {
	rate: {
		value: 0.1,
		min: 0,
		max: 8,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	depth: {
		value: 0.6,
		min: 0,
		max: 1,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	feedback: {
		value: 0.7,
		min: 0,
		max: 1,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	stereoPhase: {
		value: 40,
		min: 0,
		max: 180,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	baseModulationFrequency: {
		value: 700,
		min: 500,
		max: 1500,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
};

export const PINGPONGDELAY_DEFAULTS = {
	delayTimeLeft: {
		value: 200,
		min: 1,
		max: 10000,
		automatable: false,
		type: DATATYPE.INT,
	},
	delayTimeRight: {
		value: 400,
		min: 1,
		max: 10000,
		automatable: false,
		type: DATATYPE.INT,
	},
	feedback: {
		value: 0.3,
		min: 0,
		max: 1,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	wetLevel: {
		value: 0.5,
		min: 0,
		max: 1,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
};

export const TREMOLO_DEFAULTS = {
	intensity: {
		value: 0.3,
		min: 0,
		max: 1,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	stereoPhase: {
		value: 0,
		min: 0,
		max: 180,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	rate: {
		value: 5,
		min: 0.1,
		max: 11,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
};

export const WAHWAH_DEFAULTS = {
	automode: {
		value: true,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
	baseFrequency: {
		value: 0.153,
		min: 0,
		max: 1,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	excursionOctaves: {
		value: 3.3,
		min: 1,
		max: 6,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	sweep: {
		value: 0.35,
		min: 0,
		max: 1,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	resonance: {
		value: 19,
		min: 1,
		max: 100,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	sensitivity: {
		value: -0.5,
		min: -1,
		max: 1,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
};

export const ENVELOPEFOLLOWER_DEFAULTS = {
	attackTime: {
		value: 0.003,
		min: 0,
		max: 0.5,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	releaseTime: {
		value: 0.5,
		min: 0,
		max: 0.5,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
};

export const LFO_DEFAULTS = {
	frequency: {
		value: 1,
		min: 0,
		max: 20,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	offset: {
		value: 0.85,
		min: 0,
		max: 22049,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	oscillation: {
		value: 0.3,
		min: -22050,
		max: 22050,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	phase: {
		value: 0,
		min: 0,
		max: 2 * Math.PI,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
};
