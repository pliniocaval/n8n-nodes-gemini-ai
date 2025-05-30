import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

// Main class for the Gemini Node
export class Gemini implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Gemini AI',
		name: 'gemini',
		icon: 'file:gemini.svg', // You'll need to create an SVG icon for your node
		group: ['ai'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interacts with Google Gemini API',
		defaults: {
			name: 'Gemini AI',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'geminiApi', // Must match the name in GeminiApi.credentials.ts
				required: true,
			},
		],
		properties: [
			// Define the operations the node can perform
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Generate Content',
						value: 'generateContent',
						action: 'Generate content from text prompt',
						description: 'Generates text based on a given prompt',
					},
					// You can add more operations here (e.g., chat, vision, embeddings)
				],
				default: 'generateContent',
			},

			// --- Properties for 'generateContent' operation ---
			{
				displayName: 'Model',
				name: 'model',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						operation: ['generateContent'],
					},
				},
				options: [
					{
						name: 'gemini-1.5-flash-latest',
						value: 'gemini-1.5-flash-latest',
						description: 'Fast and versatile model for general tasks',
					},
					{
						name: 'gemini-1.0-pro', // Older, but still available
						value: 'gemini-1.0-pro',
						description: 'Good for a wide range of text generation tasks',
					},
                    {
						name: 'gemini-pro', // Alias for gemini-1.0-pro
						value: 'gemini-pro',
						description: 'Alias for gemini-1.0-pro',
					},
					// Add other models as needed, e.g., gemini-1.5-pro-latest
				],
				default: 'gemini-1.5-flash-latest',
				description: 'The Gemini model to use for generating content.',
			},
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				required: true,
				typeOptions: {
					rows: 5, // Makes the text area larger
				},
				displayOptions: {
					show: {
						operation: ['generateContent'],
					},
				},
				default: '',
				placeholder: 'e.g., Write a short story about a robot learning to paint.',
				description: 'The text prompt to send to the Gemini model.',
			},
			{
				displayName: 'Generation Configuration (Optional)',
				name: 'generationConfig',
				type: 'collection',
				placeholder: 'Add Generation Option',
				default: {},
				displayOptions: {
					show: {
						operation: ['generateContent'],
					},
				},
				options: [
					{
						displayName: 'Temperature',
						name: 'temperature',
						type: 'number',
						typeOptions: {
							minValue: 0,
							maxValue: 2, // As per Gemini API docs (some models up to 2.0)
						},
						default: 0.9, // A common default, adjust as needed
						description: 'Controls randomness. Lower for less random, higher for more. (0.0-2.0)',
					},
					{
						displayName: 'Max Output Tokens',
						name: 'maxOutputTokens',
						type: 'number',
						typeOptions: {
							minValue: 1,
						},
						default: 2048,
						description: 'Maximum number of tokens to generate in the response.',
					},
					{
						displayName: 'Top P',
						name: 'topP',
						type: 'number',
						typeOptions: {
							minValue: 0,
							maxValue: 1,
						},
						default: 1.0,
						description: 'Nucleus sampling. (0.0-1.0)',
					},
					{
						displayName: 'Top K',
						name: 'topK',
						type: 'number',
						typeOptions: {
							minValue: 1,
						},
						default: 1,
						description: 'Top-k sampling.',
					},
					// Add other generationConfig parameters like stopSequences if needed
				],
			},
			{
				displayName: 'Return Full Response',
				name: 'returnFullResponse',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						operation: ['generateContent'],
					},
				},
				description: 'Whether to return the full API response or just the generated text',
			},
		],
	};

	// The execute method will be called for each item in the input.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const operation = this.getNodeParameter('operation', itemIndex) as string;
				const credentials = await this.getCredentials('geminiApi');
				const apiKey = credentials.apiKey as string;

				if (operation === 'generateContent') {
					const model = this.getNodeParameter('model', itemIndex) as string;
					const prompt = this.getNodeParameter('prompt', itemIndex) as string;
					const generationConfigParams = this.getNodeParameter('generationConfig', itemIndex, {}) as {
						temperature?: number;
						maxOutputTokens?: number;
						topP?: number;
						topK?: number;
					};
					const returnFullResponse = this.getNodeParameter('returnFullResponse', itemIndex, false) as boolean;


					const requestBody: any = {
						contents: [{ parts: [{ text: prompt }] }],
					};

                    // Add generationConfig if any parameters are set
					const genConfig: any = {};
					if (generationConfigParams.temperature !== undefined) genConfig.temperature = generationConfigParams.temperature;
					if (generationConfigParams.maxOutputTokens !== undefined) genConfig.maxOutputTokens = generationConfigParams.maxOutputTokens;
					if (generationConfigParams.topP !== undefined) genConfig.topP = generationConfigParams.topP;
					if (generationConfigParams.topK !== undefined) genConfig.topK = generationConfigParams.topK;

					if (Object.keys(genConfig).length > 0) {
						requestBody.generationConfig = genConfig;
					}

					// Construct the API URL. Note: v1beta is used here, check for latest stable version.
					// The key is passed as a query parameter for generateContent.
					const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

					const response = await this.helpers.httpRequest({
						method: 'POST',
						url: apiUrl,
						body: requestBody,
						json: true, // Automatically stringifies the body and parses the response
						headers: {
							'Content-Type': 'application/json',
						},
					});

					// Process the response
					// The structure of the Gemini API response for generateContent is typically:
					// response.candidates[0].content.parts[0].text
					let resultData: any;
					if (returnFullResponse) {
						resultData = response;
					} else {
						if (response.candidates && response.candidates.length > 0 &&
							response.candidates[0].content && response.candidates[0].content.parts &&
							response.candidates[0].content.parts.length > 0) {
							resultData = { generatedText: response.candidates[0].content.parts[0].text };
						} else if (response.promptFeedback) {
							// Handle cases where content might be blocked
							resultData = {
								error: 'Content generation failed or was blocked.',
								promptFeedback: response.promptFeedback,
							};
						}
						else {
							resultData = { error: 'Unexpected response structure from Gemini API.', details: response };
						}
					}
					returnData.push({ json: resultData, pairedItem: { item: itemIndex } });

				} else {
					throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not supported.`, { itemIndex });
				}

			} catch (error) {
				// This error handling will catch issues like network errors or issues with the n8n framework
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: itemIndex } });
					continue;
				}
				// Throws the error if 'Continue on Fail' is not active
				throw error;
			}
		}
		return [returnData];
	}
}