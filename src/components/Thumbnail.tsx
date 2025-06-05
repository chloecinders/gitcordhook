import { APIThumbnailComponent, ComponentType } from "discord-api-types/v10";

export type ThumbnailProps = Omit<APIThumbnailComponent, "type" | "media"> & {
    children: APIThumbnailComponent["media"];
};

export function Thumbnail({
    children,
    ...props
}: ThumbnailProps): APIThumbnailComponent {
    return {
        type: ComponentType.Thumbnail,
        media: children,
        ...props,
    };
}
