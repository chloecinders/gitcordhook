import { APIContainerComponent, ComponentType } from "discord-api-types/v10";
import { childrenToArray } from "./utils";

export type ContainerProps = Omit<
    APIContainerComponent,
    "type" | "components"
> & {
    children: APIContainerComponent["components"];
};

export function Container({
    children,
    ...props
}: ContainerProps): APIContainerComponent {
    return {
        type: ComponentType.Container,
        components: childrenToArray(children),
        ...props,
    };
}
