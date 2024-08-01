import { Super } from "../Super";
import { PANNER_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";

interface PannerOptions extends StereoPannerOptions {
	bypass?: boolean;
	pan?: number;
}

export class Panner extends Super<typeof PANNER_DEFAULTS> {
	_panner: StereoPannerNode;
	pan: AudioParam;
	constructor(
		context: AudioContext,
		propertiesArg?: Properties<typeof PANNER_DEFAULTS>,
	) {
		super(context);
		this.defaults = PANNER_DEFAULTS;
		const options: PannerOptions = {
			...this.getDefaults(),
			...propertiesArg,
		};
		this._panner = this.activateNode = new StereoPannerNode(context, options);
		this.activateNode.connect(this._panner);
		this._panner.connect(this.output);
		this.pan = this._panner.pan;
		this.bypass = options.bypass;
	}
}
