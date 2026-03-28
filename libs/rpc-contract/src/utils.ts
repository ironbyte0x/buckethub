import { ORPCError } from '@orpc/contract';

export function createError<const TCode extends string>(options: {
  code: TCode;
  message: string;
  status: number;
}) {
  return class extends ORPCError<TCode, undefined> {
    public static code = options.code;
    public static status = options.status;

    constructor() {
      super(options.code, { message: options.message, status: options.status });
    }
  };
}

type ErrorDefinition = ReturnType<typeof createError>;

type NormalizedErrorMap<T extends ErrorDefinition[]> = {
  [E in T[number] as E['code']]: { status: E['status'] };
};

export function defineErrors<T extends ErrorDefinition[]>(...errors: T) {
  return errors.reduce((accumulator, ErrorClass) => {
    (accumulator as Record<string, unknown>)[ErrorClass.code] = {
      status: ErrorClass.status
    };

    return accumulator;
  }, {} as NormalizedErrorMap<T>);
}
