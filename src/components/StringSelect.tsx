import { APIStringSelectComponent, ComponentType } from "discord-api-types/v10";
import { childrenToArray } from "./utils";

export type StringSelectProps = Omit<
	APIStringSelectComponent,
	"type" | "options"
> & { children: APIStringSelectComponent["options"] };

export function StringSelect({
	children,
	...props
}: StringSelectProps): APIStringSelectComponent {
	return {
		type: ComponentType.StringSelect,
		options: childrenToArray(children),
		...props,
	};
}
