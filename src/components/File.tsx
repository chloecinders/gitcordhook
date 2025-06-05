import { APIFileComponent, ComponentType } from "discord-api-types/v10";
import { MediaItem } from "./MediaItem";

interface FileProps {
    filename: string;
    id?: number;
    spoiler?: boolean;
}

export function File({ filename, id, spoiler }: FileProps): APIFileComponent {
    return {
        type: ComponentType.File,
        id,
        spoiler,
        file: <MediaItem url={`attachment://${filename}`} />,
    };
}
