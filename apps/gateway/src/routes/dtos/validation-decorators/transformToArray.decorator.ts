import { Transform } from 'class-transformer';

export function TransformToArray() {
    return Transform(({ value }) => {
        if (value === undefined || value === null) return undefined;
        if (Array.isArray(value)) return value;
        return [String(value)];
    });
}
