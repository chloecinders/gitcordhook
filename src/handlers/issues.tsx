import { IssuesEvent, IssuesOpenedEvent } from "@octokit/webhooks-types";
import { ButtonStyle, SeparatorSpacingSize } from "discord-api-types/v10";
import { ActionRow, Button, Separator, TextDisplay } from "../components";
import { WebhookBody } from "../types";
import { getGithubUser, parseGithubContent } from "../utils/data";

export default function handleIssues(data: IssuesEvent): WebhookBody {
    switch (data.action) {
        case "opened": {
            return issueOpen(data);
        }
    }

    return { default: data };
}

function issueOpen(data: IssuesOpenedEvent): WebhookBody {
    const issueBody = parseGithubContent(
        data.repository.html_url,
        (data.issue.body || "").slice(0, 1000)
    );

    return {
        ...getGithubUser(data),
        components: (
            <>
                <TextDisplay>
                    # Opened:{" "}
                    {parseGithubContent(
                        data.repository.html_url,
                        data.issue.title
                    )}{" "}
                    @ {data.repository.full_name}
                </TextDisplay>

                {data.issue.assignees.length && (
                    <TextDisplay>
                        Assigned:{" "}
                        {data.issue.assignees
                            .map(
                                (assignee) =>
                                    `[${assignee.name || assignee.login}](${
                                        assignee.html_url
                                    })`
                            )
                            .join(" ")}
                    </TextDisplay>
                )}

                {data.issue.labels?.length && (
                    <TextDisplay>
                        {data.issue.labels
                            .map((l) => `\`${l.name}\``)
                            .join(" ")}
                    </TextDisplay>
                )}

                {...issueBody.length ? (
                    <>
                        <Separator spacing={SeparatorSpacingSize.Large} />

                        <TextDisplay>
                            {parseGithubContent(
                                data.repository.html_url,
                                issueBody
                            )}
                            {parseGithubContent(
                                data.repository.html_url,
                                issueBody.length === 1000 ? "..." : ""
                            )}
                        </TextDisplay>
                    </>
                ) : (
                    <></>
                )}

                <Separator spacing={SeparatorSpacingSize.Large} />

                <ActionRow>
                    <Button url={data.issue.html_url} style={ButtonStyle.Link}>
                        Open issue
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
