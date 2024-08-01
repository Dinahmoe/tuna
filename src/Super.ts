import type { Defaults } from "./types/Defaults";
import type { Properties } from "./types/Properties";

export abstract class Super<T extends Defaults> extends GainNode {
	output: AudioNode;
	activateNode!: AudioNode;
	activateCallback!: (doActivate: boolean) => void;
	defaults!: T;

	_bypass?: boolean;
	_lastBypassValue?: boolean;
	inputConnect: GainNode["connect"];

	constructor(context: AudioContext, output?: AudioNode) {
		super(context);
		this.inputConnect = this.connect;
		this.output = output ?? new GainNode(context);
		this.connect = this.output.connect.bind(this.output);
	}

	get bypass() {
		return this._bypass;
	}

	set bypass(value) {
		if (this._lastBypassValue === value) {
			return;
		}
		this._bypass = value;
		this.activate(!value);
		this._lastBypassValue = value;
	}

	activate(doActivate: boolean) {
		if (doActivate) {
			this.disconnect();
			this.inputConnect(this.activateNode);
			if (this.activateCallback) {
				this.activateCallback(doActivate);
			}
		} else {
			this.disconnect();
			this.inputConnect(this.output);
		}
	}

	connectInOrder<C extends Super<T> | AudioNode>(nodeArray: C[]) {
		let i = nodeArray.length - 1;
		while (i--) {
			if (!nodeArray[i].connect) {
				return console.error(
					"AudioNode.connectInOrder: TypeError: Not an AudioNode.",
					nodeArray[i],
				);
			}
			const node = nodeArray[i + 1];
			nodeArray[i].connect(node);
		}
	}

	getDefaults() {
		const defaults = Object.fromEntries(
			Object.keys(this.defaults).map((key) => [
				key,
				this.defaults[key as keyof typeof this.defaults].value,
			]),
		);
		return defaults as Required<Properties<typeof this.defaults>>;
	}

	automate(
		property: keyof Properties<typeof this.defaults>,
		value: number,
		duration?: number,
		startTime?: number,
	) {
		const start = startTime ? ~~(startTime / 1000) : this.context.currentTime;
		const dur = duration ? ~~(duration / 1000) : 0;
		const _is = this.defaults[property];
		let param = this[property as keyof this];
		let method: "setValueAtTime" | "linearRampToValueAtTime";

		if (param) {
			if (_is.automatable) {
				if (!duration) {
					method = "setValueAtTime";
				} else {
					method = "linearRampToValueAtTime";
					(param as unknown as AudioParam).cancelScheduledValues(start);
					(param as unknown as AudioParam).setValueAtTime(
						(param as unknown as AudioParam).value,
						start,
					);
				}
				(param as unknown as AudioParam)[method](value, dur + start);
			} else {
				(param as number) = value;
			}
		} else {
			console.error(`Invalid Property for ${this.constructor.name}`);
		}
	}

	outputConnect(...args: [AudioNode, number?, number?]) {
		return this.output.connect(...args);
	}
}
