export const bitcrusherProcessorURL = URL.createObjectURL(
	new Blob(
		[
			"(",
			(() => {
				class BitcrusherProcessor extends AudioWorkletProcessor {
					static get parameterDescriptors() {
						return [
							{
								name: "bits",
								defaultValue: 4,
								minValue: 1,
								maxValue: 16,
							},
							{
								name: "bypass",
								defaultValue: 0,
							},
							{
								name: "normfreq",
								defaultValue: 0.1,
								minValue: 0.0001,
								maxValue: 1.0,
							},
						];
					}

					constructor() {
						super();

						// Listen to events from the RTANode running on the main thread.
						this.port.onmessage = (event) => this.onmessage(event);
					}

					onmessage(_event: MessageEvent) {}

					process(
						inputs: Float32Array[][],
						outputs: Float32Array[][],
						parameters: Record<string, Float32Array>,
					) {
						const input = inputs[0];
						const output = outputs[0];
						const bits = parameters.bits;
						const normfreq = parameters.normfreq;

						for (let channelNum = 0; channelNum < input.length; channelNum++) {
							const inputChannel = input[channelNum];
							const outputChannel = output[channelNum];

							let phaser = 0;
							let last = 0;

							for (let i = 0; i < inputChannel.length; i++) {
								const step = (1 / 2) ** (bits[0] || 0);
								phaser += normfreq[0] || 0;
								if (phaser >= 1.0) {
									phaser -= 1.0;
									last = step * Math.floor(inputChannel[i] / step + 0.5);
								}
								outputChannel[i] = last;
							}
						}

						// Returning true tells the Audio system to keep going.
						return true;
					}
				}

				registerProcessor("BitcrusherProcessor", BitcrusherProcessor);
			}).toString(),
			")()",
		],
		{ type: "application/javascript" },
	),
);
