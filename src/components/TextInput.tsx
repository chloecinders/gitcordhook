import { APITextInputComponent, ComponentType } from "discord-api-types/v10";

export type TextInputProps = Omit<APITextInputComponent, "type">;

export function TextInput(props: TextInputProps): APITextInputComponent {
    return {
        type: ComponentType.TextInput,
        ...props,
    };
}
