import {
	APIButtonComponent,
	APISectionComponent,
	APITextDisplayComponent,
	APIThumbnailComponent,
	ComponentType,
} from "discord-api-types/v10";
import { childrenToArray } from "./utils";

export interface SectionProps {
	children: APITextDisplayComponent[];
	accessory: APIThumbnailComponent | APIButtonComponent;
}

export function Section({
	children,
	...props
}: SectionProps): APISectionComponent {
	return {
		type: ComponentType.Section,
		components: childrenToArray(children),
		...props,
	};
}
