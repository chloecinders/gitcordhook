import { WebhookEvent } from "@octokit/webhooks-types";

export function getGithubUser(data: WebhookEvent & { sender: any }): {
	username: string;
	avatar_url: string;
} {
	return {
		username: data.sender.name || data.sender.login,
		avatar_url: data.sender.avatar_url,
	};
}

export function parseGithubContent(content: string): string {
	// @TODO: Parse string for github issue/PR/whatever links, turn them into hypertext markup
	return content;
}
