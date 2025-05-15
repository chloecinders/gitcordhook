import { APIMediaGalleryComponent, ComponentType } from "discord-api-types/v10";
import { childrenToArray } from "./utils";

export type MediaGalleryProps = Omit<
	APIMediaGalleryComponent,
	"type" | "items"
> & { children: APIMediaGalleryComponent["items"] };

export function MediaGallery({
	children,
	...props
}: MediaGalleryProps): APIMediaGalleryComponent {
	return {
		type: ComponentType.MediaGallery,
		items: childrenToArray(children),
		...props,
	};
}
