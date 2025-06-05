import { PushEvent } from "@octokit/webhooks-types";
import { ButtonStyle } from "discord-api-types/v10";
import {
    ActionRow,
    Button,
    Container,
    Section,
    TextDisplay,
} from "../components";
import Br from "../components/Br";
import { WebhookBody } from "../types";
import { getGithubUser } from "../utils/data";
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
        components: (
            <>
                <TextDisplay>
                    # Pushed: {data.repository.full_name}
                    <Br />`{data.ref}`: `{data.before.slice(0, 7)}` -&gt; `
                    {data.after.slice(0, 7)}`
                </TextDisplay>

                {...data.commits.map((commit) => (
                    <Container>
                        <Section
                            accessory={
                                <Button
                                    url={commit.url}
                                    style={ButtonStyle.Link}
                                >
                                    Open commit
                                </Button>
                            }
                        >
                            <TextDisplay>
                                ##{" "}
                                {commit.author.username || commit.author.name}:{" "}
                                {commit.message}
                                <Br />
                                ID: `{commit.id.slice(0, 7)}` Tree:{" "}
                                {commit.tree_id.slice(0, 7)} At:{" "}
                                {getTimestamp(commit.timestamp)}
                                <Br />
                                ```diff
                                <Br />
                                {commit.added.map((a) => `+${a}\n`)}
                                {commit.modified.map((m) => `~${m}\n`)}
                                {commit.removed.map((r) => `-${r}\n`)}
                                ```
                            </TextDisplay>
                        </Section>
                    </Container>
                ))}

                <ActionRow>
                    <Button url={data.compare} style={ButtonStyle.Link}>
                        Compare
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
