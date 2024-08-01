import { Super } from "../Super";
import { ENVELOPEFOLLOWER_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";
import { envelopeFollowerProcessorURL } from "./EnvelopeFollowerProcessor";
import type { WahWah } from "./WahWah";

export class EnvelopeFollower extends Super<typeof ENVELOPEFOLLOWER_DEFAULTS> {
	processor!: AudioWorkletNode;
	constructor(
		context: AudioContext,
		propertiesArg?: Properties<typeof ENVELOPEFOLLOWER_DEFAULTS> & {
			target?: WahWah;
			callback?: <T>(context: { sweep: T }, value: T) => void;
		},
	) {
		super(context);
		this.defaults = ENVELOPEFOLLOWER_DEFAULTS;
		const options = {
			...this.getDefaults(),
			...propertiesArg,
		};

		context.audioWorklet.addModule(envelopeFollowerProcessorURL).then(() => {
			this.processor = new AudioWorkletNode(context, "EnvelopeFollower", {
				parameterData: {
					attackTime: options.attackTime,
					releaseTime: options.releaseTime,
				},
			});

			this.activateNode.connect(this.processor);
			this.output = this.processor;
			this.inputConnect(this.output);
			this.bypass = options.bypass;
		});
	}
	get attackTime(): AudioParam | undefined {
		return this.processor?.parameters.get("attackTime");
	}
	set attackTime(value: number) {
		this.processor?.parameters
			.get("attackTime")
			?.setValueAtTime(value, this.context.currentTime);
	}
	get releaseTime(): AudioParam | undefined {
		return this.processor?.parameters.get("releaseTime");
	}
	set releaseTime(value: number) {
		this.processor?.parameters
			.get("releaseTime")
			?.setValueAtTime(value, this.context.currentTime);
	}
}
