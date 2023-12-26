import * as Y from 'yjs'

export type YFormTypes =
  | { type: 'string' }
  | { type: 'number' }
  | { type: 'array', of: YFormTypes }
  | { type: 'struct', of: Record<string, YFormTypes> };

export const YT = {
  String: { type: 'string' } as const,
  Number: { type: 'number' } as const,
  Array: <T extends YFormTypes>(type: T) => ({ type: 'array', of: type }) as const,
  Struct: <T extends Record<string, YFormTypes>>(props: T) => ({ type: 'struct', of: props }) as const,
} as const

export const formTypetoYType = <T extends YFormTypes>(typ: T, yType?: Y.AbstractType<any>) => {
  switch (typ.type) {
    case 'string':
      return yType as Y.Text ?? new Y.Text();
    case 'number':
      return yType as Y.Text ?? new Y.Text();
    case 'array':
      return yType as Y.Array<any> ?? new Y.Array();
    case 'struct':
      const struct = yType as Y.Map<any> ?? new Y.Map();
      yType?.doc?.transact(() => {
        for (const [field, fieldType] of Object.entries(typ.of)) {
          const val = struct.get(field);
          if (!val) {
            const ft = formTypetoYType(fieldType, val);
            struct.set(field, ft);
          }
        }
      })
      return struct;
    default:
      throw new Error('Unknown type: ' + typ);
  }
}

const PersonFormType = YT.Struct({
  name: YT.String,
  age: YT.Number,
  experience: YT.Array(
    YT.Struct({
      company: YT.String,
      years: YT.Number,
    })
  ),
})
