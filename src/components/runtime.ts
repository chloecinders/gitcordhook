const Fragment = Symbol("ComponentsJsx.Fragment");

type FunctionComponent = (props: any) => any;

function normalizeChild(child: any) {
	if (!child) return null;

	if (
		typeof child === "string" ||
		(typeof child === "object" && child !== null)
	) {
		return child;
	}

	return null;
}

function jsx(type: typeof Fragment | FunctionComponent, props: any) {
	if (props.children && Array.isArray(props.children)) {
		props.children = props.children
			.map((c: any) => normalizeChild(c))
			.filter((c: any) => c !== null);
	}

	if (type === Fragment) {
		if (!Array.isArray(props.children)) {
			return [props.children];
		}

		return props.children;
	}

	props ??= {};
	return type(props);
}

export { Fragment, jsx, jsx as jsxDEV, jsx as jsxs };
