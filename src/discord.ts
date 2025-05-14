import {
	MessageFlags,
	RESTPostAPIWebhookWithTokenJSONBody,
} from "discord-api-types/v10";
import { WebhookBodyWithHeaders } from "./types";
import { DEFAULT_USER } from "./worker";

type WebhookResponse = {
	success: boolean;
	body: string;
};

export async function send(
	url: string,
	options: WebhookBodyWithHeaders
): Promise<WebhookResponse> {
	options = { ...options, flags: MessageFlags.IsComponentsV2 };

	if (!("avatar_url" in options) && !("name" in options)) {
		options = { ...options, ...DEFAULT_USER };
	}

	if ("default" in options && "headers" in options) {
		const response = await fetch(url + "/github", {
			method: "POST",
			body: JSON.stringify(options.default),
			headers: {
				"content-type": "application/json",
				...(options.headers || {}),
			},
		});

		return {
			success: response.ok,
			body: JSON.stringify(response),
		};
	}

	url = url + "?with_components=true";

	const response = await fetch(url, {
		method: "POST",
		body: JSON.stringify(options),
		headers: {
			"content-type": "application/json",
		},
	});

	return {
		success: response.ok,
		body: await response.text(),
	};
}
