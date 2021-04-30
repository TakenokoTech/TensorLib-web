export {};

type Key = string | number

declare global {
    interface Array<T> {
        associate<V>(block: (it: T) => [Key, V]): { [key in Key]: V }
    }
}

Array.prototype.associate = function <T, V>(block: (it: T) => [Key, V]): { [key in Key]: V } {
    let result: { [key in Key]: V } = {}
    for (const a of this) {
        const r = block(a)
        result[r[0]] = r[1]
    }
    return result
};
