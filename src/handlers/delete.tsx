import { CreateEvent } from "@octokit/webhooks-types";
import { WebhookBody } from "../types";
import { getGithubUser } from "../utils/data";
import { Separator } from "../components/Separator";
import { ButtonStyle, SeparatorSpacingSize } from "discord-api-types/v10";
import { ActionRow } from "../components/ActionRow";
import { Button, TextDisplay } from "../components";

export default function handleDelete(data: CreateEvent): WebhookBody {
	switch (data.ref_type) {
		case "branch": {
			return branchDelete(data);
		}
	}

	return { default: data };
}

function branchDelete(data: CreateEvent): WebhookBody {
	return {
		...getGithubUser(data),
		components: (
			<>
				<TextDisplay>
					## Deleted: {data.ref}:{data.repository.full_name}
				</TextDisplay>

				<Separator spacing={SeparatorSpacingSize.Large} />

				<ActionRow>
					<Button
						url={`${data.repository.html_url}/branches`}
						style={ButtonStyle.Link}
					>
						Open branch list
					</Button>

					<Button url={data.repository.html_url} style={ButtonStyle.Link}>
						Open repository
					</Button>
				</ActionRow>
			</>
		),
	};
}
