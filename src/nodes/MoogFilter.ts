import { Super } from "../Super";
import { MOOGFILTER_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";
import { moogFilterProcessorURL } from "./MoogFilterProcessor";

export class MoogFilter extends Super<typeof MOOGFILTER_DEFAULTS> {
	processor!: AudioWorkletNode;
	constructor(
		context: AudioContext,
		propertiesArg?: Properties<typeof MOOGFILTER_DEFAULTS>,
	) {
		super(context);
		this.defaults = MOOGFILTER_DEFAULTS;
		const options = {
			...this.getDefaults(),
			...propertiesArg,
		};

		this.activateNode = new GainNode(context);
		context.audioWorklet.addModule(moogFilterProcessorURL).then(() => {
			this.processor = new AudioWorkletNode(context, "MoogFilterProcessor", {
				parameterData: {
					cutoff: options.cutoff,
					resonance: options.resonance,
					bypass: Number(options.bypass),
				},
			});

			this.activateNode.connect(this.processor);
			this.processor.connect(this.output);

			this.cutoff = options.cutoff;
			this.resonance = options.resonance;
			this.bypass = options.bypass;
		});
	}

	get cutoff(): AudioParam | undefined {
		return this.processor.parameters.get("cutoff");
	}
	set cutoff(value: number) {
		this.processor.parameters
			.get("cutoff")
			?.setValueAtTime(value, this.context.currentTime);
	}

	get resonance(): AudioParam | undefined {
		return this.processor.parameters.get("resonance");
	}
	set resonance(value: number) {
		this.processor.parameters
			.get("resonance")
			?.setValueAtTime(value, this.context.currentTime);
	}
}
