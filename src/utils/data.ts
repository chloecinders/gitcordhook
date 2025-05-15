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
