const isFalseOrNullish = (value: any) => value === false || value == null;
const isNotFalseOrNullish = (value: any) => !isFalseOrNullish(value);

function applyReplace(str: string): string {
    return str.replace(/\n/g, "").replace(/<br>/g, "\n");
}

export function filterChildren(children: any[]) {
    return children.filter(isNotFalseOrNullish);
}

export function childrenToString(name: string, children: any) {
    if (Array.isArray(children)) {
        return applyReplace(filterChildren(children).join(""));
    }

    if (typeof children === "string") {
        return applyReplace(children);
    }

    if (isFalseOrNullish(children)) {
        return null;
    }

    throw new Error(`${name} children must be a string or an array of strings`);
}

export function childrenToArray(children: any) {
    if (Array.isArray(children)) {
        return filterChildren(children);
    }

    if (isFalseOrNullish(children)) {
        return [];
    }

    return [children];
}
