import {
	APIButtonComponent,
	APISelectMenuComponent,
	ComponentType,
} from "discord-api-types/v10";
import { childrenToArray } from "./utils";
import { APIActionRowComponent } from "discord-api-types/payloads";

type MessageActionRowComponent = APIButtonComponent | APISelectMenuComponent;

export type ActionRowProps = Omit<
	APIActionRowComponent<MessageActionRowComponent>,
	"type" | "components"
> & {
	children: MessageActionRowComponent | MessageActionRowComponent[];
};

export function ActionRow({
	children,
	...props
}: ActionRowProps): APIActionRowComponent<MessageActionRowComponent> {
	return {
		type: ComponentType.ActionRow,
		components: childrenToArray(children),
		...props,
	};
}
