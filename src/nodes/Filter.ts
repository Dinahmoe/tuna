import { Super } from "../Super";
import { FILTER_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";

export class Filter extends Super<typeof FILTER_DEFAULTS> {
	filter: BiquadFilterNode;
	constructor(
		context: AudioContext,
		propertiesArg?: Properties<typeof FILTER_DEFAULTS> & {
			resonance?: number;
		},
	) {
		super(context);
		this.defaults = FILTER_DEFAULTS;
		const options = {
			...this.getDefaults(),
			...propertiesArg,
		};

		this.activateNode = new GainNode(context);
		this.filter = new BiquadFilterNode(context, {
			frequency: options.frequency,
			gain: options.gain,
			Q: options.resonance,
			type: options.filterType,
		});

		this.activateNode.connect(this.filter);
		this.filter.connect(this.output);

		//don't use setters for freq and gain at init to avoid smoothing

		this.bypass = options.bypass;
	}

	get filterType() {
		return this.filter.type;
	}
	set filterType(value) {
		this.filter.type = value;
	}
	get Q(): AudioParam {
		return this.filter.Q;
	}
	set Q(value: number) {
		this.filter.Q.value = value;
	}
	get gain(): AudioParam {
		return this.filter.gain;
	}
	set gain(value: number) {
		this.filter.gain.setTargetAtTime(value, this.context.currentTime, 0.01);
	}
	get frequency(): AudioParam {
		return this.filter.frequency;
	}
	set frequency(value: number) {
		this.filter.frequency.setTargetAtTime(
			value,
			this.context.currentTime,
			0.01,
		);
	}
}
