import { APISeparatorComponent, ComponentType } from "discord-api-types/v10";

export type SeparatorProps = Omit<APISeparatorComponent, "type">;

export function Separator(props: SeparatorProps): APISeparatorComponent {
    return {
        type: ComponentType.Separator,
        ...props,
    };
}
