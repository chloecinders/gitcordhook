import { CreateEvent } from "@octokit/webhooks-types";
import { WebhookBody } from "../types";
import { getGithubUser } from "../utils/data";
import { ButtonStyle } from "discord-api-types/v10";
import { ActionRow, Button, Separator, TextDisplay } from "../components";

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
        components: (
            <>
                <TextDisplay>
                    ## Created: {data.ref}:{data.repository.full_name}
                </TextDisplay>

                <Separator />

                <ActionRow>
                    <Button
                        url={`${data.repository.html_url}/tree/${data.ref}`}
                        style={ButtonStyle.Link}
                    >
                        Open branch
                    </Button>

                    <Button
                        url={`${data.repository.html_url}/branches`}
                        style={ButtonStyle.Link}
                    >
                        Open branch list
                    </Button>

                    <Button
                        url={data.repository.html_url}
                        style={ButtonStyle.Link}
                    >
                        Open repository
                    </Button>
                </ActionRow>
            </>
        ),
    };
}
