import { WatchEvent } from "@octokit/webhooks-types";
import { WebhookBody } from "../types";

export default function handleWatch(data: WatchEvent): WebhookBody {
    switch (data.action) {
        case "started": {
            return watchStarted(data);
        }
    }
}

function watchStarted(_data: WatchEvent): WebhookBody {
    return {
        none: true,
        reason: "Already handled by star.created",
    };
}
