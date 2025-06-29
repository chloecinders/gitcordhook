/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import {
    CreateEvent,
    DeleteEvent,
    IssuesEvent,
    PullRequestEvent,
    PushEvent,
    StarEvent,
    WatchEvent,
    WebhookEvent,
    WebhookEvents,
} from "@octokit/webhooks-types";
import Br from "./components/Br";
import { TextDisplay } from "./components/TextDisplay";
import handleCreate from "./handlers/create";
import handleDelete from "./handlers/delete";
import handleIssues from "./handlers/issues";
import handlePullRequests from "./handlers/pullRequests";
import handlePush from "./handlers/push";
import handleStar from "./handlers/star";
import handleWatch from "./handlers/watch";
import { WebhookBody, WebhookBodyWithHeaders } from "./types";
import { send } from "./utils/discord";

export interface Env {}

export const DEFAULT_USER = {
    username: "GitCordHook [META]",
    avatar_url:
        "https://media.discordapp.net/attachments/1202351390484353046/1372294496456413294/443813695-80bf856e-a6e5-42fd-9e41-d0f5d346b4de.png?ex=68264057&is=6824eed7&hm=6e3f2a0ef679ba093c693255a03d182da1872f2f119a7bc9bea9a575b80eaf16&=&format=webp&quality=lossless",
};

function runHandler(
    githubEvent: WebhookEvents[0] | "ping",
    data: WebhookEvent
): WebhookBody | Promise<WebhookBody> {
    switch (githubEvent) {
        case "issues": {
            return handleIssues(data as IssuesEvent);
        }

        case "pull_request": {
            return handlePullRequests(data as PullRequestEvent);
        }

        case "create": {
            return handleCreate(data as CreateEvent);
        }

        case "delete": {
            return handleDelete(data as DeleteEvent);
        }

        case "push": {
            return handlePush(data as PushEvent);
        }

        case "star": {
            return handleStar(data as StarEvent);
        }

        case "watch": {
            return handleWatch(data as WatchEvent);
        }

        case "ping": {
            return {
                components: (
                    <>
                        <TextDisplay>
                            # Webhook Ping!
                            <Br />
                            GitHub webhook setup successfully, using Webhook
                            proxy by https://github.com/surgedevs/gitcordhook
                        </TextDisplay>
                    </>
                ),
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

        globalThis.DiscordWebhookURL = discordWebhook;

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
        let webhookBody = runHandler(eventType ?? ("" as any), json as any);

        if (webhookBody instanceof Promise) {
            webhookBody = await webhookBody;
        }

        console.log(webhookBody);

        if ("none" in webhookBody) {
            return new Response(
                `Discord Webhook Execute Success; Event intentionally skipped! Reason: ${
                    webhookBody.reason ? webhookBody.reason : "None provided"
                }`
            );
        }

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
            return new Response(
                `Discord Webhook Execute Success; response body = ${
                    response.body
                }, sent body = ${JSON.stringify(webhookBody)}`
            );
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
