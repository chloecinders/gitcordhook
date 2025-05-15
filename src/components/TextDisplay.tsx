import { APITextDisplayComponent, ComponentType } from "discord-api-types/v10";
import { childrenToString } from "./utils";

export interface TextDisplayProps {
	children: string | string[];
	id?: number;
}

export function TextDisplay({
	children,
	id,
}: TextDisplayProps): APITextDisplayComponent {
	children = childrenToString("TextDisplay", children)!;

	if (!children) {
		throw new Error("TextDisplay requires at least one child");
	}

	return {
		type: ComponentType.TextDisplay,
		content: children,
		id,
	};
}
