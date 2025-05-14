import { IssuesEvent, IssuesOpenedEvent } from "@octokit/webhooks-types";
import { send } from "../discord";
import {
	ButtonStyle,
	ComponentType,
	MessageFlags,
	RESTPostAPIWebhookWithTokenJSONBody,
	SeparatorSpacingSize,
} from "discord-api-types/v10";
import { WebhookBody } from "../types";

export default function handleIssues(data: IssuesEvent): WebhookBody {
	switch (data.action) {
		case "opened": {
			return issueOpen(data);
		}
	}

	return { default: data };
}

function issueOpen(data: IssuesOpenedEvent): WebhookBody {
	const issueBody = (data.issue.body || "").slice(0, 1000);

	return {
		username: data.sender.name || data.sender.login,
		avatar_url: data.sender.avatar_url,
		components: [
			{
				type: ComponentType.TextDisplay,
				content: `# Opened: ${data.issue.title} @ ${data.repository.full_name}`,
			},
			...(data.issue.assignees.length
				? [
						{
							type: ComponentType.TextDisplay,
							content:
								"Assigned: " +
								data.issue.assignees
									.map(
										(assignee) =>
											`[${assignee.name || assignee.login}](${
												assignee.html_url
											})`
									)
									.join(" "),
						},
				  ]
				: ([] as any)),
			...(data.issue.labels?.length
				? [
						{
							type: ComponentType.TextDisplay,
							content: data.issue.labels
								?.map((label) => `\`${label.name}\``)
								.join(" "),
						},
				  ]
				: ([] as any)),
			...(issueBody.length
				? [
						{
							type: ComponentType.Separator,
							spacing: SeparatorSpacingSize.Large,
						},
						{
							type: ComponentType.TextDisplay,
							content: issueBody + (issueBody.length === 1000 ? "..." : ""),
						},
				  ]
				: ([] as any)),
			{
				type: ComponentType.Separator,
				spacing: SeparatorSpacingSize.Large,
			},
			{
				type: ComponentType.ActionRow,
				components: [
					{
						type: ComponentType.Button,
						label: "Open issue",
						url: data.issue.html_url,
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
