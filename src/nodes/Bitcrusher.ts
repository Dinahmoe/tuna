import { Super } from "../Super";
import { BITCRUSHER_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";
import { bitcrusherProcessorURL } from "./BitcrusherProcessor";

export class Bitcrusher extends Super<typeof BITCRUSHER_DEFAULTS> {
	processor!: AudioWorkletNode;
	defaults: typeof BITCRUSHER_DEFAULTS;

	constructor(
		context: AudioContext,
		propertiesArg?: Properties<typeof BITCRUSHER_DEFAULTS>,
	) {
		super(context);
		this.defaults = BITCRUSHER_DEFAULTS;
		const options = {
			...this.getDefaults(),
			...propertiesArg,
		};

		this.activateNode = new GainNode(context);
		context.audioWorklet.addModule(bitcrusherProcessorURL).then(() => {
			this.processor = new AudioWorkletNode(context, "BitcrusherProcessor", {
				parameterData: {
					bits: options.bits,
					normfreq: options.normfreq,
					bypass: Number(options.bypass),
				},
			});

			this.activateNode.connect(this.processor);
			this.processor.connect(this.output);

			this.bits = options.bits;
			this.normfreq = options.normfreq;
			this.bypass = options.bypass;
		});
	}

	get bits(): AudioParam | undefined {
		return this.processor.parameters.get("bits");
	}

	set bits(value: number) {
		this.processor.parameters
			.get("bits")
			?.setValueAtTime(value, this.context.currentTime);
	}

	get normfreq(): AudioParam | undefined {
		return this.processor.parameters.get("normfreq");
	}

	set normfreq(value: number) {
		this.processor.parameters
			.get("normfreq")
			?.setValueAtTime(value, this.context.currentTime);
	}
}
