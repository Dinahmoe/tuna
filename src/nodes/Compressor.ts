import { Super } from "../Super";
import { COMPRESSOR_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";
import { dbToWAVolume } from "../utils/dbToWAVolume";

type CompressorOptions = Required<
	Omit<DynamicsCompressorOptions, keyof AudioNodeOptions>
> & {
	makeupGain: number;
	automakeup?: boolean;
	bypass: boolean;
};

export class Compressor extends Super<typeof COMPRESSOR_DEFAULTS> {
	makeupNode: GainNode;
	_compNode: DynamicsCompressorNode;
	#automakeup!: boolean;

	constructor(
		context: AudioContext,
		propertiesArg?: Properties<typeof COMPRESSOR_DEFAULTS>,
	) {
		super(context);

		this.defaults = COMPRESSOR_DEFAULTS;
		const options: CompressorOptions = {
			...this.getDefaults(),
			...propertiesArg,
		};

		this._compNode = this.activateNode = new DynamicsCompressorNode(
			context,
			options,
		);
		this.makeupNode = new GainNode(context);
		this._compNode.connect(this.makeupNode);
		this.makeupNode.connect(context.destination);

		//don't use makeupGain setter at initialization to avoid smoothing
		if (this.automakeup) {
			this.makeupNode.gain.value = dbToWAVolume(this.computeMakeup());
		} else {
			this.makeupNode.gain.value = dbToWAVolume(options.makeupGain);
		}

		this.threshold = options.threshold;
		this.release = options.release;
		this.attack = options.attack;
		this.ratio = options.ratio;
		this.knee = options.knee;
		this.bypass = options.bypass;
	}

	computeMakeup() {
		const magicCoefficient = 4; // raise me if the output is too hot
		return (
			-(
				this._compNode.threshold.value -
				this._compNode.threshold.value / this._compNode.ratio.value
			) / magicCoefficient
		);
	}

	get automakeup() {
		return this.#automakeup;
	}
	set automakeup(value) {
		this.#automakeup = value;
		if (this.#automakeup) this.makeupGain = this.computeMakeup();
	}

	get makeupGain(): AudioParam {
		return this.makeupNode.gain;
	}
	set makeupGain(value: number) {
		this.makeupNode.gain.setTargetAtTime(
			dbToWAVolume(value),
			this.context.currentTime,
			0.01,
		);
	}

	get ratio(): AudioParam {
		return this._compNode.ratio;
	}

	set ratio(value: number) {
		this._compNode.ratio.value = value;
		if (this.#automakeup) this.makeupGain = this.computeMakeup();
	}

	get knee(): AudioParam {
		return this._compNode.knee;
	}

	set knee(value: number) {
		this._compNode.knee.value = value;
		if (this.#automakeup) this.makeupGain = this.computeMakeup();
	}

	get attack(): AudioParam {
		return this._compNode.attack;
	}

	set attack(value: number) {
		this._compNode.attack.value = value / 1000;
	}

	get release(): AudioParam {
		return this._compNode.release;
	}

	set release(value: number) {
		this._compNode.release.value = value / 1000;
	}

	get threshold(): AudioParam {
		return this._compNode.threshold;
	}

	set threshold(value: number) {
		this._compNode.threshold.value = value;
		if (this.#automakeup) this.makeupGain = this.computeMakeup();
	}
}
