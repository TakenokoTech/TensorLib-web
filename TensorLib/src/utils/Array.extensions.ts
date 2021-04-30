export {};

declare global {
    interface Array<T> {
        any(block: (it: T) => Boolean): Boolean;
        all(block: (it: T) => Boolean): Boolean;
        groupBy<K>(block: (it: T) => string | number): { [key: string]: Array<T> };
        runCatching<T, U>(block: (arg: Array<T>) => U): Promise<U>;
    }
}

Array.prototype.any = function<T>(block: (it: T) => Boolean): Boolean {
    for (const a of this) {
        if (block(a)) return true;
    }
    return false;
};

Array.prototype.all = function<T>(block: (it: T) => Boolean): Boolean {
    for (const a of this) {
        if (!block(a)) return false;
    }
    return true;
};

Array.prototype.groupBy = function<T, K>(block: (it: T) => string | number): { [key: string]: Array<T> } {
    const map: { [key: string]: Array<T> } = {};
    for (const a of this) {
        const key = block(a);
        if (!map[key]) map[key] = [];
        map[key].push(a);
    }
    return map;
};
