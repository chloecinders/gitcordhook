import { WebhookEvent } from "@octokit/webhooks-types";
import Br from "../components/Br";

export function getGithubUser(data: WebhookEvent & { sender: any }): {
    username: string;
    avatar_url: string;
} {
    return {
        username: data.sender.name || data.sender.login,
        avatar_url: data.sender.avatar_url,
    };
}

export function parseGithubContent(repo_url: string, content: string): string {
    // @TODO: Parse string for github issue/PR/whatever links, turn them into hypertext markup
    const issueRegex = /#(\d+)(?=\s|[.,;:!?)]|$)/g;
    content = content.replace(
        issueRegex,
        (_all, id: string) => `[#${id}](${repo_url}/issues/${id})`
    );

    content = content.replace(/\n/g, (_all) => <Br />);

    return content;
}
