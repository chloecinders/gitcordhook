import {
	PullRequestEvent,
	PullRequestOpenedEvent,
} from "@octokit/webhooks-types";
import { ButtonStyle, SeparatorSpacingSize } from "discord-api-types/v10";
import { WebhookBody } from "../types";
import { getGithubUser } from "../utils/data";
import { ActionRow, Button, Separator, TextDisplay } from "../components";

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
		components: (
			<>
				<TextDisplay>
					# Opened: {data.pull_request.title} @ {data.repository.full_name}
				</TextDisplay>

				{data.pull_request.assignees.length && (
					<TextDisplay>
						Assigned:{" "}
						{data.pull_request.assignees
							.map(
								(assignee) =>
									`[${assignee.name || assignee.login}](${assignee.html_url})`
							)
							.join(" ")}
					</TextDisplay>
				)}

				{data.pull_request.labels?.length && (
					<TextDisplay>
						{data.pull_request.labels.map((l) => `\`${l.name}\``).join(" ")}
					</TextDisplay>
				)}

				{...prBody.length ? (
					<>
						<Separator spacing={SeparatorSpacingSize.Large} />

						<TextDisplay>
							{prBody}
							{prBody.length === 1000 ? "..." : ""}
						</TextDisplay>
					</>
				) : (
					<></>
				)}

				<Separator spacing={SeparatorSpacingSize.Large} />

				<ActionRow>
					<Button url={data.pull_request.html_url} style={ButtonStyle.Link}>
						Open issue
					</Button>

					<Button url={data.repository.html_url} style={ButtonStyle.Link}>
						Open repository
					</Button>
				</ActionRow>
			</>
		),
	};
}
