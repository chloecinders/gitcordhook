import {
	APIMentionableSelectComponent,
	ComponentType,
} from "discord-api-types/v10";

export type MentionableSelectProps = Omit<
	APIMentionableSelectComponent,
	"type"
>;

export function MentionableSelect(
	props: MentionableSelectProps
): APIMentionableSelectComponent {
	return {
		type: ComponentType.MentionableSelect,
		...props,
	};
}
