import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';
import { ObjectId } from 'mongodb';

export function IsObjectId(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isObjectId',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (typeof value !== 'string') return false;
                    return ObjectId.isValid(value);
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be a valid ObjectId string`;
                },
            },
        });
    };
}
