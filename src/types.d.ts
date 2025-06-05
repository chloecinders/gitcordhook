import type { RESTPostAPIWebhookWithTokenJSONBody } from "discord-api-types/v10";

type WebhookBody =
    | RESTPostAPIWebhookWithTokenJSONBody
    | { default: any; headers?: any }
    | { none: true; reason?: string };

type WebhookBodyWithHeaders =
    | RESTPostAPIWebhookWithTokenJSONBody
    | { default: any; headers: any }
    | { none: true; reason?: string };
