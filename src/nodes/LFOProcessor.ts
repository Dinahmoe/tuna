export const LFOProcessorURL = URL.createObjectURL(
	new Blob(
		[
			"(",
			(() => {
				class LFOProcessor extends AudioWorkletProcessor {
					phase: number;

					constructor() {
						super();
						this.phase = 0;
					}
					static get parameterDescriptors() {
						return [
							{
								name: "phase", //phase offset
								defaultValue: 0,
								max: 2 * Math.PI,
								min: 0,
							},
							{
								name: "frequency",
								defaultValue: 1,
								min: 0,
								max: 20,
							},
							{
								name: "oscillation", //amplitude
								defaultValue: 0.3,
								min: -22050,
								max: 22050,
							},
							{
								name: "offset", //vertical offset
								defaultValue: 0.85,
								min: 0,
								max: 22049,
								automatable: false,
							},
						];
					}

					process(
						inputs: Float32Array[][],
						outputs: Float32Array[][],
						parameters: Record<string, Float32Array>,
					) {
						const input = inputs[0];
						const output = outputs[0];
						const phase = parameters.phase[0];
						const frequency = parameters.frequency[0];
						const offset = parameters.offset[0];
						const oscillation = parameters.oscillation[0];

						for (let channelNum = 0; channelNum < input.length; channelNum++) {
							const inputChannel = input[channelNum];
							const outputChannel = output[channelNum];

							for (let i = 0; i < inputChannel.length; i++) {
								outputChannel[i] =
									offset + oscillation * Math.sin(phase + this.phase);
							}
						}
						this.phase +=
							(2 * Math.PI * frequency * output.length) / sampleRate;
						this.phase %= sampleRate;

						// Returning true tells the Audio system to keep going.
						return true;
					}
				}

				registerProcessor("LFOProcessor", LFOProcessor);
			}).toString(),
			")()",
		],
		{ type: "application/javascript" },
	),
);
