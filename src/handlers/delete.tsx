import { DeleteEvent } from "@octokit/webhooks-types";
import { ButtonStyle, SeparatorSpacingSize } from "discord-api-types/v10";
import { Button, TextDisplay } from "../components";
import { ActionRow } from "../components/ActionRow";
import { Separator } from "../components/Separator";
import { WebhookBody } from "../types";
import { getGithubUser } from "../utils/data";

export default function handleDelete(data: DeleteEvent): WebhookBody {
    switch (data.ref_type) {
        case "branch": {
            return branchDelete(data);
        }
    }

    return { default: data };
}

function branchDelete(data: DeleteEvent): WebhookBody {
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
