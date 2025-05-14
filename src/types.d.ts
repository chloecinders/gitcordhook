import type { RESTPostAPIWebhookWithTokenJSONBody } from "discord-api-types/v10";

type WebhookBody =
	| RESTPostAPIWebhookWithTokenJSONBody
	| { default: any; headers?: any };

type WebhookBodyWithHeaders =
	| RESTPostAPIWebhookWithTokenJSONBody
	| { default: any; headers: any };
