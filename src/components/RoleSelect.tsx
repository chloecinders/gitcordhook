import { APIRoleSelectComponent, ComponentType } from "discord-api-types/v10";

export type RoleSelectProps = Omit<APIRoleSelectComponent, "type">;

export function RoleSelect(props: RoleSelectProps): APIRoleSelectComponent {
    return {
        type: ComponentType.RoleSelect,
        ...props,
    };
}
