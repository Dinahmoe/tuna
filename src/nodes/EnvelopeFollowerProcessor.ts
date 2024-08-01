export const envelopeFollowerProcessorURL = URL.createObjectURL(
	new Blob(
		[
			"(",
			(() => {
				class EnvelopeFollowerProcessor extends AudioWorkletProcessor {
					static get parameterDescriptors() {
						return [
							{
								name: "attackTime",
								defaultValue: 0.003,
								minValue: 0,
								maxValue: 0.5,
							},
							{
								name: "releaseTime",
								defaultValue: 0.5,
								minValue: 0,
								maxValue: 0.5,
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
						const attackTime = parameters.attackTime[0];
						const releaseTime = parameters.releaseTime[0];
						const attackC = Math.exp(
							((-1 / attackTime) * sampleRate) / input[0].length,
						);
						const releaseC = Math.exp(
							((-1 / releaseTime) * sampleRate) / input[0].length,
						);

						let envelope = 0;

						let current: number;

						let rms = 0;

						for (let channelNum = 0; channelNum < input.length; channelNum++) {
							const inputChannel = input[channelNum];

							for (let i = 0; i < inputChannel.length; i++) {
								current = inputChannel[i];
								rms += current * current;
							}
						}
						rms = Math.sqrt(rms / (input.length + 1));

						if (envelope < rms) {
							envelope *= attackC;
							envelope += (1 - attackC) * rms;
						} else {
							envelope *= releaseC;
							envelope += (1 - releaseC) * rms;
						}

						for (let channelNum = 0; channelNum < output.length; channelNum++) {
							const outputChannel = output[channelNum];
							outputChannel.fill(envelope);
						}

						// Returning true tells the Audio system to keep going.
						return true;
					}
				}

				registerProcessor(
					"EnvelopeFollowerProcessor",
					EnvelopeFollowerProcessor,
				);
			}).toString(),
			")()",
		],
		{ type: "application/javascript" },
	),
);
