import { Super } from "../Super";
import { CONVOLVER_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";

export class Convolver extends Super<typeof CONVOLVER_DEFAULTS> {
	dry: GainNode;
	wet: GainNode;
	_convolver: ConvolverNode;
	filterLow: BiquadFilterNode;
	filterHigh: BiquadFilterNode;
	buffer: AudioBuffer | null;
	level: AudioParam;
	lowCut: AudioParam;
	highCut: AudioParam;
	dryLevel: AudioParam;
	wetLevel: AudioParam;

	constructor(
		context: AudioContext,
		propertiesArg?: Properties<typeof CONVOLVER_DEFAULTS> & {
			impulse?: string;
		},
	) {
		super(context);
		this.defaults = CONVOLVER_DEFAULTS;
		const options = {
			...this.getDefaults(),
			...propertiesArg,
		};

		this.activateNode = this._convolver = new ConvolverNode(context);

		this.dry = new GainNode(context);
		this.filterLow = new BiquadFilterNode(context);
		this.filterHigh = new BiquadFilterNode(context);
		this.wet = new GainNode(context);

		this.inputConnect(this.filterLow);
		this.inputConnect(this.dry);
		this.filterLow.connect(this.filterHigh);
		this.filterHigh.connect(this);
		this.inputConnect(this.wet);
		this.wet.connect(this.output);
		this.dry.connect(this.output);

		//don't use setters at init to avoid smoothing
		this.dry.gain.value = options.dryLevel;
		this.wet.gain.value = options.wetLevel;
		this.filterHigh.frequency.value = options.highCut;
		this.filterLow.frequency.value = options.lowCut;

		this.filterHigh.type = "lowpass";
		this.filterLow.type = "highpass";
		this.buffer = this._convolver.buffer;
		this.bypass = options.bypass;
		this.level = (this.output as GainNode).gain;
		this.lowCut = this.filterLow.frequency;
		this.highCut = this.filterHigh.frequency;
		this.dryLevel = this.dry.gain;
		this.wetLevel = this.wet.gain;
	}
}
