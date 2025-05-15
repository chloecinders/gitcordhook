import { CreateEvent } from "@octokit/webhooks-types";
import { WebhookBody } from "../types";
import { getGithubUser } from "../utils/data";
import {
	ButtonStyle,
	ComponentType,
	SeparatorSpacingSize,
} from "discord-api-types/v10";

export default function handleCreate(data: CreateEvent): WebhookBody {
	switch (data.ref_type) {
		case "branch": {
			return branchCreate(data);
		}
	}

	return { default: data };
}

function branchCreate(data: CreateEvent): WebhookBody {
	return {
		...getGithubUser(data),
		components: [
			{
				type: ComponentType.TextDisplay,
				content: `## Created: ${data.ref}:${data.repository.full_name}`,
			},
			{
				type: ComponentType.Separator,
				spacing: SeparatorSpacingSize.Small,
			},
			{
				type: ComponentType.ActionRow,
				components: [
					{
						type: ComponentType.Button,
						label: "Open branch",
						url: `${data.repository.html_url}/tree/${data.ref}`,
						style: ButtonStyle.Link,
					},
					{
						type: ComponentType.Button,
						label: "Open branch list",
						url: `${data.repository.html_url}/branches`,
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
