import { registerDecorator, ValidationArguments } from 'class-validator';

export function IsValidDate() {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsValidDate',
            target: object.constructor,
            propertyName: propertyName,
            validator: {
                validate(value: []) {
                    const regex =
                        /^(0[1-9]|[12][0-9]|3[01])\-(0[1-9]|1[0-2])\-\d{4}$/;
                    return !value.some((valueArray) => !regex.test(valueArray));
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} dates must follow dd-mm-yyyy format`;
                },
            },
        });
    };
}
