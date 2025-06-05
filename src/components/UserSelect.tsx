import { APIUserSelectComponent, ComponentType } from "discord-api-types/v10";

export type UserSelectProps = Omit<APIUserSelectComponent, "type">;

export function UserSelect(props: UserSelectProps): APIUserSelectComponent {
    return {
        type: ComponentType.UserSelect,
        ...props,
    };
}
