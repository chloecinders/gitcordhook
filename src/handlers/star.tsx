import { StarEvent } from "@octokit/webhooks-types";
import { TextDisplay } from "../components";
import { WebhookBody } from "../types";
import { getGithubUser } from "../utils/data";

export default function handleStar(data: StarEvent): WebhookBody {
    switch (data.action) {
        case "created": {
            return starAdded(data);
        }

        case "deleted": {
            return starRemoved(data);
        }
    }
}

function starAdded(data: StarEvent): WebhookBody {
    return {
        ...getGithubUser(data),
        components: (
            <>
                <TextDisplay>⭐</TextDisplay>
            </>
        ),
    };
}

function starRemoved(data: StarEvent): WebhookBody {
    return {
        ...getGithubUser(data),
        components: (
            <>
                <TextDisplay>💫</TextDisplay>
            </>
        ),
    };
}
