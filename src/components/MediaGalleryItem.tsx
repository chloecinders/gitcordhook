import { APIMediaGalleryItem } from "discord-api-types/v10";
import { MediaItem } from "./MediaItem";

export interface MediaGalleryItemProps {
    url: string;
    description?: string;
    spoiler?: boolean;
}

export function MediaGalleryItem({
    url,
    description,
    spoiler,
}: MediaGalleryItemProps): APIMediaGalleryItem {
    return {
        media: <MediaItem url={url} />,
        description,
        spoiler,
    };
}
