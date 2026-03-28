import { type Mock, vi } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunctionSignature = (...arguments_: any[]) => any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = Record<any, any>;

export type MockObject<T> = {
  [K in keyof T]: T[K] extends AnyFunctionSignature
    ? Mock<T[K]>
    : T[K] extends AnyObject
      ? MockObject<T[K]>
      : never;
};

export function createMockObject<T extends MockObject<unknown>>() {
  const function_ = vi.fn();

  return new Proxy(function_, {
    get(target, property) {
      if (property in target) {
        return Reflect.get(target, property);
      }

      if (typeof property === 'string') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!target[property]) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          target[property] = createMockObject();
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return target[property];
      }

      return Reflect.get(target, property);
    }
  }) as unknown as T;
}

export function createMockClass<T>() {
  return createMockObject<MockObject<T> & T>();
}
