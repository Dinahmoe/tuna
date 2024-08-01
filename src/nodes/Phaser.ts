import { Super } from "../Super";
import { PHASER_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";
import { fmod } from "../utils/fmod";
import { LFO } from "./LFO";

export class Phaser extends Super<typeof PHASER_DEFAULTS> {
	stage: number;
	splitter: ChannelSplitterNode;
	feedbackGainNodeL: GainNode;
	feedbackGainNodeR: GainNode;
	merger: ChannelMergerNode;
	filtersL: BiquadFilterNode[];
	filtersR: BiquadFilterNode[];
	lfoL: LFO;
	lfoR: LFO;
	depthNodeL: GainNode;
	depthNodeR: GainNode;
	depthRangeNodeL: GainNode;
	depthRangeNodeR: GainNode;
	#depth!: number;
	#baseModulationFrequency!: number;
	#rate!: number;
	#feedback!: number;
	#stereoPhase!: number;

	constructor(
		context: AudioContext,
		propertiesArg?: Properties<typeof PHASER_DEFAULTS>,
	) {
		super(context);
		this.stage = 4;
		this.defaults = PHASER_DEFAULTS;

		const options = {
			...this.getDefaults(),
			...propertiesArg,
		};

		this.splitter = this.activateNode = new ChannelSplitterNode(context, {
			numberOfOutputs: 2,
		});
		this.filtersL = [];
		this.filtersR = [];
		this.feedbackGainNodeL = new GainNode(context);
		this.feedbackGainNodeR = new GainNode(context);

		this.depthRangeNodeL = new GainNode(context, { gain: 1000 });
		this.depthRangeNodeR = new GainNode(context, { gain: 1000 });
		this.depthNodeL = new GainNode(context, { gain: 0.5 });
		this.depthNodeR = new GainNode(context, { gain: 0.5 });

		this.merger = new ChannelMergerNode(context, { numberOfInputs: 2 });

		this.lfoL = new LFO(context, {
			frequency: 4,
		});
		this.lfoR = new LFO(context, {
			frequency: 4,
		});

		let i = this.stage;
		while (i--) {
			this.filtersL[i] = new BiquadFilterNode(context, {
				frequency: options.baseModulationFrequency,
			});
			this.filtersR[i] = new BiquadFilterNode(context, {
				frequency: options.baseModulationFrequency,
			});
			this.filtersL[i].type = "allpass";
			this.filtersR[i].type = "allpass";
		}
		this.inputConnect(this.splitter);
		this.inputConnect(this.output);
		this.splitter.connect(this.filtersL[0], 0, 0);
		this.splitter.connect(this.filtersR[0], 1, 0);
		this.connectInOrder(this.filtersL);
		this.connectInOrder(this.filtersR);
		this.filtersL[this.stage - 1].connect(this.feedbackGainNodeL);
		this.filtersL[this.stage - 1].connect(this.merger, 0, 0);
		this.filtersR[this.stage - 1].connect(this.feedbackGainNodeR);
		this.filtersR[this.stage - 1].connect(this.merger, 0, 1);
		this.feedbackGainNodeL.connect(this.filtersL[0]);
		this.feedbackGainNodeR.connect(this.filtersR[0]);
		this.merger.connect(this.output);

		this.rate = options.rate;
		this.baseModulationFrequency = options.baseModulationFrequency;
		this.depth = options.depth;
		this.feedback = options.feedback;
		this.stereoPhase = options.stereoPhase;

		this.lfoL.activate(true);
		this.lfoR.activate(true);
		this.bypass = options.bypass;
	}
	get depth() {
		return this.#depth;
	}
	set depth(value) {
		this.#depth = value;
		this.depthNodeL.gain.setValueAtTime(value, this.context.currentTime);
		this.depthNodeR.gain.setValueAtTime(value, this.context.currentTime);
	}
	get rate() {
		return this.#rate;
	}
	set rate(value) {
		this.#rate = value;
		this.lfoL.frequency?.setValueAtTime(value, this.context.currentTime);
		this.lfoR.frequency?.setValueAtTime(value, this.context.currentTime);
	}
	get baseModulationFrequency() {
		return this.#baseModulationFrequency;
	}
	set baseModulationFrequency(value) {
		this.#baseModulationFrequency = value;
		for (let stage = 0; stage < this.stage; stage++) {
			this.filtersL[stage].frequency.setValueAtTime(
				value,
				this.context.currentTime,
			);
			this.filtersR[stage].frequency.setValueAtTime(
				value,
				this.context.currentTime,
			);
		}
	}

	get feedback() {
		return this.#feedback;
	}
	set feedback(value) {
		this.#feedback = value;
		this.feedbackGainNodeL.gain.setValueAtTime(
			this.#feedback,
			this.context.currentTime,
		);
		this.feedbackGainNodeR.gain.setValueAtTime(
			this.#feedback,
			this.context.currentTime,
		);
	}
	get stereoPhase() {
		return this.#stereoPhase;
	}
	set stereoPhase(value) {
		this.#stereoPhase = value;
		if (this.lfoL.phase?.value) {
			let newPhase =
				this.lfoL.phase?.value + (this.#stereoPhase * Math.PI) / 180;
			newPhase = fmod(newPhase, 2 * Math.PI);
			this.lfoR.phase = newPhase;
		}
	}

	callback(filters: { frequency: { value: number } }[], value: number) {
		for (let stage = 0; stage < 4; stage++) {
			filters[stage].frequency.value = value;
		}
	}
}
