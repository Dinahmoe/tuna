import { Super } from "../Super";
import { TREMOLO_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";
import { fmod } from "../utils/fmod";
import { LFO } from "./LFO";

export class Tremolo extends Super<typeof TREMOLO_DEFAULTS> {
	splitter: ChannelSplitterNode;
	amplitudeL: GainNode;
	amplitudeR: GainNode;
	merger: ChannelMergerNode;
	lfoL: LFO;
	lfoR: LFO;
	#intensity!: number;
	#rate!: number;
	#stereoPhase!: number;

	constructor(
		context: AudioContext,
		propertiesArg?: Properties<typeof TREMOLO_DEFAULTS>,
	) {
		super(context);
		this.defaults = TREMOLO_DEFAULTS;
		const options = {
			...this.getDefaults(),
			...propertiesArg,
		};

		this.splitter = this.activateNode = new ChannelSplitterNode(context, {
			numberOfOutputs: 2,
		});
		this.amplitudeL = new GainNode(context);
		this.amplitudeR = new GainNode(context);
		this.merger = new ChannelMergerNode(context, { numberOfInputs: 2 });
		this.lfoL = new LFO(context);
		this.lfoR = new LFO(context);

		this.inputConnect(this.splitter);
		this.splitter.connect(this.amplitudeL, 0);
		this.splitter.connect(this.amplitudeR, 1);
		this.amplitudeL.connect(this.merger, 0, 0);
		this.amplitudeR.connect(this.merger, 0, 1);
		this.merger.connect(this.output);

		this.rate = options.rate;
		this.intensity = options.intensity;
		this.stereoPhase = options.stereoPhase;

		this.lfoL.offset = 1 - this.intensity / 2;
		this.lfoR.offset = 1 - this.intensity / 2;
		this.lfoL.phase = (this.stereoPhase * Math.PI) / 180;

		this.lfoL.connect(this.amplitudeL.gain);
		this.lfoR.connect(this.amplitudeR.gain);
		this.bypass = options.bypass;
	}
	get intensity() {
		return this.#intensity;
	}
	set intensity(value) {
		this.#intensity = value;
		this.lfoL.offset = 1 - this.#intensity / 2;
		this.lfoR.offset = 1 - this.#intensity / 2;
		this.lfoL.oscillation = this.#intensity;
		this.lfoR.oscillation = this.#intensity;
	}
	get rate() {
		return this.#rate;
	}
	set rate(value) {
		this.#rate = value;
		this.lfoL.frequency = this.#rate;
		this.lfoR.frequency = this.#rate;
	}
	get stereoPhase() {
		return this.#stereoPhase;
	}
	set stereoPhase(value) {
		this.#stereoPhase = value;
		if (this.lfoL.phase?.value) {
			let newPhase =
				this.lfoL.phase.value + (this.#stereoPhase * Math.PI) / 180;
			newPhase = fmod(newPhase, 2 * Math.PI);
			this.lfoR.phase = newPhase;
		}
	}
}
