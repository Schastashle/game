import { z } from 'zod'

export const SignInSchema = z.object({
  login: z
    .string()
    .nonempty('Поле не должно быть пустым')
    .min(3, 'Должно быть минимум 3 символа')
    .max(20, 'Должно быть максимум 20 символа')
    .regex(
      /^(?!\\d+$)[a-zA-Z0-9_-]+$/,
      'Логин должен содержать только латинские буквы, цифры и символы _ и -'
    ),
  password: z
    .string()
    .nonempty('Поле не должно быть пустым')
    .min(8, 'Должно быть минимум 8 символов')
    .max(40, 'Должно быть максимум 40 символа'),
})

type SignInSchemaType = z.infer<typeof SignInSchema>

export const SignUpSchema = z
  .object({
    email: z
      .string()
      .nonempty('Поле не должно быть пустым')
      .email('Некорректный email'),
    first_name: z
      .string()
      .nonempty('Поле не должно быть пустым')
      .min(1, 'Должно быть минимум 1 символ')
      .max(50, 'Должно быть максимум 50 символов')
      .regex(
        /^[A-ZА-ЯЁ][A-Za-zА-ЯЁа-яё-]+$/u,
        'Должно начинаться с заглавной буквы и содержать только буквы и символ -'
      ),
    second_name: z
      .string()
      .nonempty('Поле не должно быть пустым')
      .min(1, 'Должно быть минимум 1 символ')
      .max(50, 'Должно быть максимум 50 символов')
      .regex(
        /^[A-ZА-ЯЁ][A-Za-zА-ЯЁа-яё-]+$/u,
        'Должно начинаться с заглавной буквы и содержать только буквы и символ -'
      ),
    phone: z
      .string()
      .nonempty('Поле не должно быть пустым')
      .regex(/^\+?\d{10,15}$/, 'Некорректный номер телефона'),
    login: z
      .string()
      .nonempty()
      .min(3, 'Должно быть минимум 3 символа')
      .max(20, 'Должно быть максимум 20 символа')
      .regex(
        /^(?!\\d+$)[a-zA-Z0-9_-]+$/,
        'Логин должен содержать только латинские буквы, цифры и символы _ и -'
      ),
    password: z
      .string()
      .nonempty('Поле не должно быть пустым')
      .min(8, 'Должно быть минимум 8 символов')
      .max(40, 'Должно быть максимум 40 символа')
      .regex(
        /(?=.*\d)(?=.*[A-Z])/,
        'Пароль должен содержать хотя бы одну заглавную букву и цифру'
      ),
    confirm_password: z
      .string()
      .nonempty('Поле не должно быть пустым')
      .min(8, 'Должно быть минимум 8 символов')
      .max(40, 'Должно быть максимум 40 символа')
      .regex(
        /(?=.*\d)(?=.*[A-Z])/,
        'Пароль должен содержать хотя бы одну заглавную букву и цифру'
      ),
  })
  .refine(data => data.password === data.confirm_password, {
    message: 'Пароли не совпадают',
    path: ['confirm_password'],
  })

type SignUpSchemaType = z.infer<typeof SignUpSchema>

export type LoginSchemas = z.ZodType<SignInSchemaType | SignUpSchemaType>
