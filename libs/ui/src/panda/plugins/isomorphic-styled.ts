import { definePlugin } from '@pandacss/dev';
import type { CodegenPrepareHookArgs } from '@pandacss/types';

const supportedJsxFrameworks = ['react'];

export function isomorphicPlugin() {
  return definePlugin({
    name: 'polymorphic-styled',
    hooks: {
      'config:resolved': (arguments_) => {
        const jsxFramework = arguments_.config.jsxFramework;

        if (!supportedJsxFrameworks.includes(jsxFramework as string)) {
          throw new Error(
            `[plugin:polymorphic-styled]: Unsupported jsxFramework: ${jsxFramework}. This Panda plugin only supports: ${supportedJsxFrameworks.join(
              ', '
            )}`
          );
        }
      },
      'codegen:prepare': async (arguments_) => {
        return addTypes(arguments_);
      }
    }
  });
}

function addTypes({ artifacts }: CodegenPrepareHookArgs) {
  const jsxTypes = artifacts
    .find((art) => art.id === 'types-jsx')
    ?.files.find((file) => file.file.includes('jsx'));

  if (!jsxTypes?.code) {
    return artifacts;
  }

  const types = `
type AsProp<C extends React.ElementType> = {
  as?: C;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProp<
  T extends React.ElementType,
  Props = {}
> = Omit<Props, 'as'> & AsProp<T> &
  Omit<React.ComponentPropsWithoutRef<T>, PropsToOmit<T, Omit<Props, 'as'>>>;

type PolymorphicComponentPropWithRef<
  T extends React.ElementType,
  Props = {}
> = PolymorphicComponentProp<T, Props> & { ref?: PolymorphicRef<T> };

type PolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>['ref'];

export interface StyledComponent<
  T extends React.ElementType,
  P extends Record<string, unknown> = {}
> extends React.FunctionComponent<
    Assign<JsxStyleProps, PolymorphicComponentPropWithRef<T, P>>
  > {
  <E extends React.ElementType = T>(
    props: Assign<JsxStyleProps, PolymorphicComponentPropWithRef<E, P>>
  ): JsxElement<E, P>;
  $$typeof: symbol;
  displayName?: string;
}`;

  const startIndex = jsxTypes.code.indexOf('export interface StyledComponent<');
  const endIndex = startIndex + jsxTypes.code.substring(startIndex).indexOf('}\n') + 3;

  jsxTypes.code =
    jsxTypes.code.substring(0, startIndex) + jsxTypes.code.substring(endIndex) + '\n' + types;

  return artifacts;
}
