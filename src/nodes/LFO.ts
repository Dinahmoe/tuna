import { Super } from "../Super";
import { LFO_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";
import { LFOProcessorURL } from "./LFOProcessor";

export class LFO extends Super<typeof LFO_DEFAULTS> {
	processor!: AudioWorkletNode;

	constructor(
		context: AudioContext,
		propertiesArg?: Properties<typeof LFO_DEFAULTS>,
	) {
		super(context);

		this.defaults = LFO_DEFAULTS;
		const options = {
			...this.getDefaults(),
			...propertiesArg,
		};

		//Instantiate AudioNode
		this.activateNode = new GainNode(context);
		context.audioWorklet.addModule(LFOProcessorURL).then(() => {
			this.processor = new AudioWorkletNode(context, "LFOProcessor", {
				parameterData: {
					frequency: options.frequency,
					phase: options.phase,
					oscillation: options.oscillation,
					offset: options.offset,
				},
			});

			this.activateNode.connect(this.processor);
			this.output = this.processor;
		});

		//Set Properties

		this.bypass = options.bypass;
	}
	get frequency(): AudioParam | undefined {
		return this.processor?.parameters.get("frequency");
	}
	set frequency(value: number) {
		this.processor?.parameters
			.get("frequency")
			?.setValueAtTime(value, this.context.currentTime);
	}
	get offset(): AudioParam | undefined {
		return this.processor?.parameters.get("offset");
	}
	set offset(value: number) {
		this.processor?.parameters
			.get("offset")
			?.setValueAtTime(value, this.context.currentTime);
	}
	get oscillation(): AudioParam | undefined {
		return this.processor?.parameters.get("oscillation");
	}
	set oscillation(value: number) {
		this.processor?.parameters
			.get("oscillation")
			?.setValueAtTime(value, this.context.currentTime);
	}
	get phase(): AudioParam | undefined {
		return this.processor?.parameters.get("phase");
	}
	set phase(value: number) {
		this.processor?.parameters
			.get("phase")
			?.setValueAtTime(value, this.context.currentTime);
	}
}
