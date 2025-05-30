import {
	ICredentialType,
	NodePropertyTypes,
} from 'n8n-workflow';

// This defines the structure of the credential type for the Gemini API.
// Users will create a credential of this type in n8n and enter their API key.
export class GeminiApi implements ICredentialType {
	name = 'geminiApi'; // Unique name for the credential type
	displayName = 'Gemini API'; // Display name in the n8n UI
	documentationUrl = 'https://ai.google.dev/docs/api_setup'; // Link to API key documentation
	properties = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string' as NodePropertyTypes, // Type of the property
			default: '',
			placeholder: 'Enter your Gemini API Key',
			description: 'Your API Key for the Google Gemini API',
		},
	];
}