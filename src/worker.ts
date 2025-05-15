/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { WebhookEvent } from "@octokit/webhooks-types";
import { send } from "./utils/discord";
import handleIssues from "./handlers/handleIssues";
import { WebhookBody, WebhookBodyWithHeaders } from "./types";
import { ComponentType } from "discord-api-types/v10";
import handleCreate from "./handlers/handleCreate";
import handlePush from "./handlers/handlePush";
import handlePullRequests from "./handlers/handlePullRequests";

export interface Env {}

export const DEFAULT_USER = {
	username: "GitCordHook [META]",
	avatar_url:
		"https://media.discordapp.net/attachments/1202351390484353046/1372294496456413294/443813695-80bf856e-a6e5-42fd-9e41-d0f5d346b4de.png?ex=68264057&is=6824eed7&hm=6e3f2a0ef679ba093c693255a03d182da1872f2f119a7bc9bea9a575b80eaf16&=&format=webp&quality=lossless",
};

function runHandler(githubEvent: string, data: WebhookEvent): WebhookBody {
	console.log(githubEvent);
	switch (githubEvent) {
		case "issues": {
			return handleIssues(data as any);
		}

		case "pull_request": {
			return handlePullRequests(data as any);
		}

		case "create": {
			return handleCreate(data as any);
		}

		case "push": {
			return handlePush(data as any);
		}

		case "ping": {
			return {
				components: [
					{
						type: ComponentType.TextDisplay,
						content: "# Webhook Ping!",
					},
					{
						type: ComponentType.TextDisplay,
						content:
							"GitHub webhook setup successfully, using Webhook proxy by https://github.com/surgedevs/gitcordhook",
					},
				],
			};
		}
	}

	return { default: data };
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		if (request.method == "GET") {
			return new Response(
				"Hey you aren't a webhook! This page is only for webhooks! See https://github.com/surgedevs/gitcordhook for more info :D"
			);
		}

		const webhookUrl = new URL(request.url);
		const discordWebhook = webhookUrl.pathname.replace(
			/^\/https:\/\//,
			"https://"
		);

		let json = null;

		try {
			json = await request.json();
		} catch (exception) {
			await send(discordWebhook, {
				content:
					"You must select application/json inside the Github webhook settings!",
			});
		}

		const eventType = request.headers.get("X-GitHub-Event");
		const webhookBody = runHandler(eventType ?? "", json as any);

		if ("default" in webhookBody) {
			webhookBody.headers = {
				"X-GitHub-Delivery": request.headers.get("X-GitHub-Delivery"),
				"X-GitHub-Event": request.headers.get("X-GitHub-Event"),
				"X-GitHub-Hook-ID": request.headers.get("X-GitHub-Hook-ID"),
				"X-GitHub-Hook-Installation-Target-ID": request.headers.get(
					"X-GitHub-Hook-Installation-Target-ID"
				),
				"X-GitHub-Hook-Installation-Target-Type": request.headers.get(
					"X-GitHub-Hook-Installation-Target-Type"
				),
			};
		}

		const response = await send(
			discordWebhook,
			webhookBody as WebhookBodyWithHeaders
		);

		if (response.success) {
			return new Response(`Discord Webhook Execute Success: ${response.body}`);
		}

		return new Response(
			`Discord Webhook Execute Failed; response body = ${
				response.body
			}, sent body = ${JSON.stringify(webhookBody)}`,
			{
				status: 500,
			}
		);
	},
};
