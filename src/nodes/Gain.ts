import { Super } from "../Super";
import { GAIN_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";

export class Gain extends Super<typeof GAIN_DEFAULTS> {
	gainNode: GainNode;
	constructor(
		context: AudioContext,
		propertiesArg?: Properties<typeof GAIN_DEFAULTS>,
	) {
		super(context);
		this.defaults = GAIN_DEFAULTS;
		const options = {
			...this.getDefaults(),
			...propertiesArg,
		};

		this.gainNode = this.activateNode = new GainNode(context, {
			gain: options.gain,
		});

		this.activateNode.connect(this.gainNode);
		this.gainNode.connect(this.output);

		this.bypass = options.bypass;
	}

	get gain(): AudioParam {
		return this.gainNode.gain;
	}
	set gain(value: number) {
		this.gainNode.gain.setTargetAtTime(value, this.context.currentTime, 0.01);
	}
}
