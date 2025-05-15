const Fragment = Symbol("ComponentsJsx.Fragment");

type FunctionComponent = (props: any) => any;

function jsx(type: typeof Fragment | FunctionComponent, props: any) {
	if (type === Fragment) {
		if (!Array.isArray(props.children)) {
			return [props.children];
		}

		return props.children;
	}

	props ??= {};
	return type(props);
}

export { jsx, jsx as jsxs, jsx as jsxDEV, Fragment };
