import { Commit, PushEvent } from "@octokit/webhooks-types";
import { ButtonStyle } from "discord-api-types/v10";
import {
    ActionRow,
    Button,
    Container,
    ContainerProps,
    Section,
    TextDisplay,
} from "../components";
import Br from "../components/Br";
import { WebhookBody } from "../types";
import { getGithubUser } from "../utils/data";
import { getTimestamp, send } from "../utils/discord";

export default async function handlePush(
    data: PushEvent
): Promise<WebhookBody> {
    // @TODO: check if this is really necessary
    if (data.commits.length !== 0) {
        return commitsPushed(data);
    }

    return { default: data };
}

async function commitsPushed(data: PushEvent): Promise<WebhookBody> {
    const commits = data.commits;
    const windows = Array.from(
        { length: Math.ceil(commits.length / 3) },
        (_, i) => commits.slice(i * 3, i * 3 + 3)
    );

    const commitToContainer = (commit: Commit): ContainerProps => {
        const commitTextSplit = commit.message.split("\n");
        const commitTitle = commitTextSplit.shift();
        const commitBody = commitTextSplit.join(<Br />);

        return (
            <Container>
                <Section
                    accessory={
                        <Button url={commit.url} style={ButtonStyle.Link}>
                            Open commit
                        </Button>
                    }
                >
                    <TextDisplay>
                        ## {commit.author.username || commit.author.name}:{" "}
                        {commitTitle}
                        {...!!commitBody ? (
                            <>
                                <Br />
                                {commitBody}
                                <Br />
                            </>
                        ) : (
                            <></>
                        )}
                        <Br />
                        ID: `{commit.id.slice(0, 7)}` Tree: `
                        {commit.tree_id.slice(0, 7)}` At:{" "}
                        {getTimestamp(commit.timestamp)}
                        <Br />
                        ```diff
                        <Br />
                        {commit.added.length &&
                            commit.added.map((a) => `+${a}`).join(<Br />) +
                            <Br />}
                        {commit.modified.length &&
                            commit.modified.map((m) => `~${m}`).join(<Br />) +
                            <Br />}
                        {commit.removed.map((r) => `-${r}`).join(<Br />)}
                        ```
                    </TextDisplay>
                </Section>
            </Container>
        );
    };

    const firstMessage = {
        ...getGithubUser(data),
        components: (
            <>
                <TextDisplay>
                    # Pushed: {data.repository.full_name}
                    <Br />`{data.ref}`: `{data.before.slice(0, 7)}` -&gt; `
                    {data.after.slice(0, 7)}`
                </TextDisplay>

                {...windows.shift()?.map((commit) => {
                    return commitToContainer(commit);
                }) ?? <></>}
            </>
        ),
    };

    if (windows.length == 0) {
        firstMessage.components.push(
            <ActionRow>
                <Button url={data.compare} style={ButtonStyle.Link}>
                    Compare
                </Button>

                <Button url={data.repository.html_url} style={ButtonStyle.Link}>
                    Open repository
                </Button>
            </ActionRow>
        );

        return firstMessage;
    } else {
        await send(globalThis.DiscordWebhookURL, firstMessage);
    }

    const lastCommitBatch = windows.pop() ?? [];
    const promises = [] as Promise<any>[];

    windows.forEach((commits) => {
        const req = send(globalThis.DiscordWebhookURL, {
            ...getGithubUser(data),
            components: (
                <>{...commits.map((commit) => commitToContainer(commit))}</>
            ),
        });
        promises.push(req);
    });

    await Promise.all(promises);

    return {
        ...getGithubUser(data),
        components: (
            <>
                {...lastCommitBatch.map((commit) => commitToContainer(commit))}

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
