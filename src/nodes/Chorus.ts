import { Super } from "../Super";
import { CHORUS_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";
import { LFO } from "./LFO";

export class Chorus extends Super<typeof CHORUS_DEFAULTS> {
	attenuator: GainNode;
	delayNode: DelayNode;
	dry: GainNode;
	wet: GainNode;
	lfo: LFO;
	modulationGain: GainNode;
	delay: AudioParam;
	depth: AudioParam;
	rate: AudioParam | undefined;

	constructor(
		context: AudioContext,
		propertiesArg?: Properties<typeof CHORUS_DEFAULTS>,
	) {
		super(context);
		this.defaults = CHORUS_DEFAULTS;
		const options = {
			...this.getDefaults(),
			...propertiesArg,
		};

		this.attenuator = this.activateNode = new GainNode(context);
		this.dry = new GainNode(context, { gain: 0.5 });
		this.wet = new GainNode(context, { gain: 0.5 });
		this.delayNode = new DelayNode(context, {
			delayTime: options.delay,
		});
		this.lfo = new LFO(context, {
			frequency: options.rate,
		});
		this.modulationGain = new GainNode(context, { gain: options.depth });
		this.lfo.connect(this.modulationGain);
		this.modulationGain.connect(this.delayNode.delayTime);

		this.attenuator.connect(this.dry);
		this.attenuator.connect(this.delayNode);
		this.delayNode.connect(this.wet);
		this.dry.connect(this.output);
		this.wet.connect(this.output);

		this.rate = this.lfo.frequency;
		this.delay = this.delayNode.delayTime;
		this.depth = this.modulationGain.gain;
		this.bypass = options.bypass;
	}
}
