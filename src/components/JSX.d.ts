type IndexImports = typeof import("./index");
type FirstParam<T> = T extends (arg1: infer A, ...args: any[]) => any
	? A
	: never;
type IntrinsicElements = {
	[K in keyof typeof IndexImports]: FirstParam<(typeof IndexImports)[K]>;
};

declare namespace JSX {
	interface ElementChildrenAttribute {
		children: {};
	}

	IntrinsicElements;
}
