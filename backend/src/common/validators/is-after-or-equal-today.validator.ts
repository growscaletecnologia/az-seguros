import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator'

export function IsAfterOrEqualToday(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAfterOrEqualToday',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          if (!value) return false

          const [year, month, day] = value.split('-').map(Number)
          const inputDate = new Date(year, month - 1, day)

          const today = new Date()
          today.setHours(0, 0, 0, 0)
          inputDate.setHours(0, 0, 0, 0)

          return inputDate >= today
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} deve ser hoje ou uma data futura.`
        },
      },
    })
  }
}
