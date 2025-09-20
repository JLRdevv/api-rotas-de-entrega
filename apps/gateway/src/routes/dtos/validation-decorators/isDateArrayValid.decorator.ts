import { registerDecorator, ValidationArguments } from 'class-validator';

export function isDateArrayValid() {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isDateArrayValid',
            target: object.constructor,
            propertyName: propertyName,
            validator: {
                validate(value: any) {
                    if (!Array.isArray(value)) return false;
                    if (value.length < 1 || value.length > 2) return false;
                    return true;
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be an array with 1 or 2 dates`;
                },
            },
        });
    };
}
