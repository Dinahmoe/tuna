import { Super } from "../Super";
import { OVERDRIVE_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";
import { dbToWAVolume } from "../utils/dbToWAVolume";
import { sign } from "../utils/sign";
import { tanh } from "../utils/tanh";

export class Overdrive extends Super<typeof OVERDRIVE_DEFAULTS> {
	k_nSamples: number;
	waveshaperAlgorithms: ((
		amountArg: number,
		n_samples: number,
		ws_table: Float32Array,
	) => void)[];
	inputDrive: GainNode;
	waveshaper: WaveShaperNode;
	outputDrive: GainNode;
	ws_table: Float32Array;
	#curveAmount!: number;
	#algorithmIndex!: number;
	#outputGain!: number;

	constructor(
		context: AudioContext,
		propertiesArg?: Properties<typeof OVERDRIVE_DEFAULTS>,
	) {
		super(context);
		this.k_nSamples = 8192;
		this.defaults = OVERDRIVE_DEFAULTS;
		this.waveshaperAlgorithms = [
			(amountArg, n_samples, ws_table) => {
				let amount = amountArg;
				amount = Math.min(amount, 0.9999);
				const k = (2 * amount) / (1 - amount);
				for (let i = 0; i < n_samples; i++) {
					const x = (i * 2) / n_samples - 1;
					ws_table[i] = ((1 + k) * x) / (1 + k * Math.abs(x));
				}
			},
			(_amount, n_samples, ws_table) => {
				let y: number | undefined;
				for (let i = 0; i < n_samples; i++) {
					const x = (i * 2) / n_samples - 1;
					y = (0.5 * (x + 1.4) ** 2 - 1) * (y && y >= 0 ? 5.8 : 1.2);
					ws_table[i] = tanh(y);
				}
			},
			(amount, n_samples, ws_table) => {
				const a = 1 - amount;
				for (let i = 0; i < n_samples; i++) {
					const x = (i * 2) / n_samples - 1;
					const y = x < 0 ? -(Math.abs(x) ** (a + 0.04)) : x ** a;
					ws_table[i] = tanh(y * 2);
				}
			},
			(amount, n_samples, ws_table) => {
				let y: number | undefined;
				let abx: number;
				const a = 1 - amount > 0.99 ? 0.99 : 1 - amount;
				for (let i = 0; i < n_samples; i++) {
					const x = (i * 2) / n_samples - 1;
					abx = Math.abs(x);
					if (abx < a) {
						y = abx;
					} else if (abx > a) {
						y = a + (abx - a) / (1 + ((abx - a) / (1 - a)) ** 2);
					} else if (abx > 1) {
						y = abx;
					}
					ws_table[i] = sign(x) * Number(y) * (1 / ((a + 1) / 2));
				}
			},
			(_amount, n_samples, ws_table) => {
				// fixed curve, amount doesn't do anything, the distortion is just from the drive
				for (let i = 0; i < n_samples; i++) {
					const x = (i * 2) / n_samples - 1;
					if (x < -0.08905) {
						ws_table[i] =
							(-3 / 4) *
								(1 -
									(1 - (Math.abs(x) - 0.032857)) ** 12 +
									(1 / 3) * (Math.abs(x) - 0.032847)) +
							0.01;
					} else if (x >= -0.08905 && x < 0.320018) {
						ws_table[i] = -6.153 * (x * x) + 3.9375 * x;
					} else {
						ws_table[i] = 0.630035;
					}
				}
			},
			(amount, n_samples, ws_table) => {
				const a = 2 + Math.round(amount * 14);
				// we go from 2 to 16 bits, keep in mind for the UI
				const bits = Math.round(2 ** (a - 1));
				// real number of quantization steps divided by 2
				for (let i = 0; i < n_samples; i++) {
					const x = (i * 2) / n_samples - 1;
					ws_table[i] = Math.round(x * bits) / bits;
				}
			},
		];

		const options = {
			...this.getDefaults(),
			...propertiesArg,
		};

		this.activateNode = new GainNode(context);
		this.inputDrive = new GainNode(context, {
			gain: options.drive,
		});
		this.waveshaper = new WaveShaperNode(context);
		this.outputDrive = new GainNode(context);

		this.activateNode.connect(this.inputDrive);
		this.inputDrive.connect(this.waveshaper);
		this.waveshaper.connect(this.outputDrive);
		this.outputDrive.connect(this.output);

		this.ws_table = new Float32Array(this.k_nSamples);
		this.drive = options.drive;
		this.outputGain = options.outputGain;
		this.curveAmount = options.curveAmount;
		this.algorithmIndex = options.algorithmIndex;
		this.bypass = options.bypass;
	}
	get drive(): AudioParam {
		return this.inputDrive.gain;
	}
	set drive(value: number) {
		this.inputDrive.gain.value = value;
	}
	get curveAmount() {
		return this.#curveAmount;
	}
	set curveAmount(value) {
		this.#curveAmount = value;
		if (this.#algorithmIndex === undefined) {
			this.#algorithmIndex = 0;
		}
		this.waveshaperAlgorithms[this.#algorithmIndex](
			this.#curveAmount,
			this.k_nSamples,
			this.ws_table,
		);
		this.waveshaper.curve = this.ws_table;
	}
	get outputGain(): AudioParam {
		return this.outputDrive.gain;
	}
	set outputGain(value: number) {
		this.#outputGain = dbToWAVolume(value);
		this.outputDrive.gain.setTargetAtTime(
			this.#outputGain,
			this.context.currentTime,
			0.01,
		);
	}
	get algorithmIndex() {
		return this.#algorithmIndex;
	}
	set algorithmIndex(value) {
		this.#algorithmIndex = value;
		this.curveAmount = this.#curveAmount;
	}
}
