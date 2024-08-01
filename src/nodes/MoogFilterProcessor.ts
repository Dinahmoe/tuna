export const moogFilterProcessorURL = URL.createObjectURL(
	new Blob(
		[
			"(",
			(() => {
				class MoogFilterProcessor extends AudioWorkletProcessor {
					static get parameterDescriptors() {
						return [
							{
								name: "cutoff",
								defaultValue: 0.065,
								minValue: 0.0001,
								maxValue: 1.0,
							},
							{
								name: "resonance",
								defaultValue: 3.5,
								minValue: 0.0,
								maxValue: 4.0,
							},
							{
								name: "bypass",
								defaultValue: 0,
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
						const cutoff = parameters.cutoff[0];
						const resonance = parameters.resonance[0];

						for (let channelNum = 0; channelNum < input.length; channelNum++) {
							const inputChannel = input[channelNum];
							const outputChannel = output[channelNum];

							let in1 = 0.0;
							let in2 = 0.0;
							let in3 = 0.0;
							let in4 = 0.0;
							let out1 = 0.0;
							let out2 = 0.0;
							let out3 = 0.0;
							let out4 = 0.0;

							let f: number;
							let fb: number;
							let inputFactor: number;

							f = (cutoff || 0) * 1.16;
							inputFactor = 0.35013 * (f * f) * (f * f);
							fb = (resonance || 0) * (1.0 - 0.15 * f * f);

							for (let i = 0; i < inputChannel.length; i++) {
								inputChannel[i] -= out4 * fb;
								inputChannel[i] *= inputFactor;
								out1 = inputChannel[i] + 0.3 * in1 + (1 - f) * out1; // Pole 1
								in1 = inputChannel[i];
								out2 = out1 + 0.3 * in2 + (1 - f) * out2; // Pole 2
								in2 = out1;
								out3 = out2 + 0.3 * in3 + (1 - f) * out3; // Pole 3
								in3 = out2;
								out4 = out3 + 0.3 * in4 + (1 - f) * out4; // Pole 4
								in4 = out3;
								outputChannel[i] = out4;
							}
						}

						// Returning true tells the Audio system to keep going.
						return true;
					}
				}

				registerProcessor("MoogFilterProcessor", MoogFilterProcessor);
			}).toString(),
			")()",
		],
		{ type: "application/javascript" },
	),
);
