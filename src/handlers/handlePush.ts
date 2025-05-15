import { PushEvent } from "@octokit/webhooks-types";
import { WebhookBody } from "../types";
import { getGithubUser } from "../utils/data";
import {
	APIBaseComponent,
	ButtonStyle,
	ComponentType,
} from "discord-api-types/v10";
import { getTimestamp } from "../utils/discord";

export default function handlePush(data: PushEvent): WebhookBody {
	// @TODO: check if this is really necessary
	if (data.commits.length !== 0) {
		return commitsPushed(data);
	}

	return { default: data };
}

function commitsPushed(data: PushEvent): WebhookBody {
	return {
		...getGithubUser(data),
		components: [
			{
				type: ComponentType.TextDisplay,
				content: `# Pushed: ${data.repository.full_name}\n\`${
					data.ref
				}\`: \`${data.before.slice(0, 7)}\` -> \`${data.after.slice(0, 7)}\``,
			},
			...data.commits.map(
				(commit) =>
					({
						type: ComponentType.Container,
						components: [
							{
								type: ComponentType.Section,
								accessory: {
									type: ComponentType.Button,
									label: "Open commit",
									url: commit.url,
									style: ButtonStyle.Link,
								},
								components: [
									{
										type: ComponentType.TextDisplay,
										content: `## ${
											commit.author.username || commit.author.name
										}: ${commit.message}`,
									},
									{
										type: ComponentType.TextDisplay,
										content: `ID: \`${commit.id.slice(
											0,
											7
										)}\` Tree: \`${commit.tree_id.slice(
											0,
											7
										)}\` At: ${getTimestamp(commit.timestamp)}`,
									},
									{
										type: ComponentType.TextDisplay,
										content:
											`\`\`\`diff\n${commit.added.map((a) => `+${a}\n`)}` +
											`${commit.modified.map((m) => `~${m}\n`)}` +
											`${commit.removed.map((r) => `-${r}\n`)}\`\`\``,
									},
								],
							},
						],
					} as APIBaseComponent<any>)
			),
			{
				type: ComponentType.ActionRow,
				components: [
					{
						type: ComponentType.Button,
						label: "Compare",
						url: data.compare,
						style: ButtonStyle.Link,
					},
					{
						type: ComponentType.Button,
						label: "Open repository",
						url: data.repository.html_url,
						style: ButtonStyle.Link,
					},
				],
			},
		],
	};
}
