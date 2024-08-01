import { Super } from "../Super";
import { CABINET_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";
import { Convolver } from "./Convolver";

export class Cabinet extends Super<typeof CABINET_DEFAULTS> {
	computeMakeup(): number {
		throw new Error("Method not implemented.");
	}
	makeupNode: GainNode;
	convolver: Convolver;

	constructor(
		context: AudioContext,
		propertiesArg?: Properties<typeof CABINET_DEFAULTS> & {
			impulsePath?: string;
		},
	) {
		super(context);
		this.defaults = CABINET_DEFAULTS;
		const options = {
			...this.getDefaults(),
			...propertiesArg,
		};

		this.activateNode = new GainNode(context);
		this.convolver = new Convolver(context, {
			impulse: options.impulsePath ?? "../impulses/impulse_guitar.wav",
			dryLevel: 0,
			wetLevel: 1,
		});

		this.makeupNode = new GainNode(context, {
			gain: options.makeupGain,
		});

		this.activateNode.connect(this.convolver);
		this.convolver.output.connect(this.makeupNode);
		this.makeupNode.connect(this.output);

		this.bypass = options.bypass;
	}

	get makeupGain(): AudioParam {
		return this.makeupNode.gain;
	}

	set makeupGain(value: number) {
		this.makeupNode.gain.setTargetAtTime(value, this.context.currentTime, 0.01);
	}
}
