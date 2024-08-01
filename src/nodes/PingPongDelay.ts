import { Super } from "../Super";
import { PINGPONGDELAY_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";

export class PingPongDelay extends Super<typeof PINGPONGDELAY_DEFAULTS> {
	wet: GainNode;
	stereoToMonoMix: GainNode;
	feedbackLevel: GainNode;
	delayLeft: DelayNode;
	delayRight: DelayNode;
	splitter: ChannelSplitterNode;
	merger: ChannelMergerNode;
	#delayTimeLeft!: number;
	#delayTimeRight!: number;

	constructor(
		context: AudioContext,
		propertiesArg?: Properties<typeof PINGPONGDELAY_DEFAULTS>,
	) {
		super(context);
		this.defaults = PINGPONGDELAY_DEFAULTS;
		const options = {
			...this.getDefaults(),
			...propertiesArg,
		};

		this.wet = new GainNode(context, {
			gain: options.wetLevel,
		});
		this.stereoToMonoMix = new GainNode(context);
		this.feedbackLevel = new GainNode(context, {
			gain: options.feedback,
		});
		this.delayLeft = new DelayNode(context, {
			delayTime: 10,
		});
		this.delayRight = new DelayNode(context, {
			delayTime: 10,
		});

		this.activateNode = new GainNode(context);
		this.splitter = new ChannelSplitterNode(context, {
			numberOfOutputs: 2,
		});
		this.merger = new ChannelMergerNode(context, {
			numberOfInputs: 2,
		});

		this.activateNode.connect(this.splitter);
		this.splitter.connect(this.stereoToMonoMix, 0, 0);
		this.splitter.connect(this.stereoToMonoMix, 1, 0);
		this.stereoToMonoMix.gain.value = 0.5;
		this.stereoToMonoMix.connect(this.wet);
		this.wet.connect(this.delayLeft);
		this.feedbackLevel.connect(this.wet);
		this.delayLeft.connect(this.delayRight);
		this.delayRight.connect(this.feedbackLevel);
		this.delayLeft.connect(this.merger, 0, 0);
		this.delayRight.connect(this.merger, 0, 1);
		this.merger.connect(this.output);
		this.activateNode.connect(this.output);

		this.delayTimeLeft = options.delayTimeLeft;
		this.delayTimeRight = options.delayTimeRight;

		this.bypass = options.bypass;
	}
	get delayTimeLeft() {
		return this.#delayTimeLeft;
	}
	set delayTimeLeft(value) {
		this.#delayTimeLeft = value;
		this.delayLeft.delayTime.value = value / 1000;
	}
	get delayTimeRight() {
		return this.#delayTimeRight;
	}
	set delayTimeRight(value) {
		this.#delayTimeRight = value;
		this.delayRight.delayTime.value = value / 1000;
	}
	get wetLevel(): AudioParam {
		return this.wet.gain;
	}
	set wetLevel(value: number) {
		this.wet.gain.setTargetAtTime(value, this.context.currentTime, 0.01);
	}
	get feedback(): AudioParam {
		return this.feedbackLevel.gain;
	}
	set feedback(value: number) {
		this.feedbackLevel.gain.setTargetAtTime(
			value,
			this.context.currentTime,
			0.01,
		);
	}
}
