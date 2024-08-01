import { Super } from "../Super";
import { DELAY_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";

export class Delay extends Super<typeof DELAY_DEFAULTS> {
	dry: GainNode;
	wet: GainNode;
	filter: BiquadFilterNode;
	delay: DelayNode;
	feedbackNode: GainNode;
	delayTime: AudioParam;
	dryLevel: AudioParam;
	wetLevel: AudioParam;
	cutoff: AudioParam;
	feedback: AudioParam;

	constructor(
		context: AudioContext,
		propertiesArg?: Properties<typeof DELAY_DEFAULTS>,
	) {
		super(context);
		this.defaults = DELAY_DEFAULTS;
		const options = {
			...this.getDefaults(),
			...propertiesArg,
		};

		this.activateNode = new GainNode(context);
		this.delay = new DelayNode(context, {
			delayTime: options.delayTime ?? 10,
		});
		this.dry = new GainNode(context, { gain: options.dryLevel });
		this.wet = new GainNode(context, { gain: options.wetLevel });
		this.filter = new BiquadFilterNode(context, { frequency: options.cutoff });

		this.feedbackNode = new GainNode(context, { gain: options.feedback });

		this.activateNode.connect(this.delay);
		this.activateNode.connect(this.dry);
		this.delay.connect(this.filter);
		this.filter.connect(this.feedbackNode);
		this.feedbackNode.connect(this.delay);
		this.feedbackNode.connect(this.wet);
		this.wet.connect(this.output);
		this.dry.connect(this.output);

		this.delayTime = this.delay.delayTime;

		this.feedback = this.feedbackNode.gain;

		this.wetLevel = this.wet.gain;
		this.dryLevel = this.dry.gain;
		this.cutoff = this.filter.frequency;
		this.filter.type = "lowpass";
		this.bypass = options.bypass;
	}
}
