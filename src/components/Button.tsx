import {
    APIButtonComponent,
    APIButtonComponentWithURL,
    ComponentType,
} from "discord-api-types/v10";
import { childrenToString } from "./utils";

type Button = Omit<APIButtonComponentWithURL, "type" | "label">;
export type ButtonProps = Button & { children?: string };

export function Button({
    children,
    ...props
}: ButtonProps): APIButtonComponent {
    return {
        type: ComponentType.Button,
        label: childrenToString("Button", children) ?? undefined,
        ...props,
    };
}
