import {
	PullRequestEvent,
	PullRequestOpenedEvent,
} from "@octokit/webhooks-types";
import {
	ButtonStyle,
	ComponentType,
	SeparatorSpacingSize,
} from "discord-api-types/v10";
import { WebhookBody } from "../types";
import { getGithubUser } from "../utils/data";

export default function handlePullRequests(
	data: PullRequestEvent
): WebhookBody {
	switch (data.action) {
		case "opened": {
			return issueOpen(data);
		}
	}

	return { default: data };
}

function issueOpen(data: PullRequestOpenedEvent): WebhookBody {
	const prBody = (data.pull_request.body || "").slice(0, 1000);

	return {
		...getGithubUser(data),
		components: [
			{
				type: ComponentType.TextDisplay,
				content: `# Opened: ${data.pull_request.title} @ ${data.repository.full_name}`,
			},
			...(data.pull_request.assignees.length
				? [
						{
							type: ComponentType.TextDisplay,
							content:
								"Assigned: " +
								data.pull_request.assignees
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
			...(data.pull_request.requested_reviewers.length
				? [
						{
							type: ComponentType.TextDisplay,
							content:
								"Reviewers: " +
								data.pull_request.requested_reviewers
									.map(
										(reviewer) =>
											`[${reviewer.name || "Unknown"}](${reviewer.html_url})`
									)
									.join(" "),
						},
				  ]
				: ([] as any)),
			...(data.pull_request.labels?.length
				? [
						{
							type: ComponentType.TextDisplay,
							content: data.pull_request.labels
								?.map((label) => `\`${label.name}\``)
								.join(" "),
						},
				  ]
				: ([] as any)),
			...(prBody.length
				? [
						{
							type: ComponentType.Separator,
							spacing: SeparatorSpacingSize.Large,
						},
						{
							type: ComponentType.TextDisplay,
							content: prBody + (prBody.length === 1000 ? "..." : ""),
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
						label: "Open pull request",
						url: data.pull_request.html_url,
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
