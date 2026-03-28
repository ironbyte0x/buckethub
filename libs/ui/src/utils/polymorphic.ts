import { Dict, JsxElement } from '@buckethub/styled-system/types';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-object-type
type AnyObject = {};

export interface AsPropUtility<C extends React.ElementType> {
  as?: C;
}

type PropsToOmit<C extends React.ElementType, P> = keyof (AsPropUtility<C> & P);

type PolymorphicComponentProp<
  T extends React.ElementType,
  Props = AnyObject
> = React.PropsWithChildren<Omit<Props, 'as'> & AsPropUtility<T>> &
  Omit<React.ComponentPropsWithoutRef<T>, PropsToOmit<T, Omit<Props, 'as'>>>;

export type PolymorphicComponentPropWithRefUtility<
  T extends React.ElementType,
  Props = AnyObject
> = PolymorphicComponentProp<T, Props> & { ref?: PolymorphicRefUtility<T> };

export type PolymorphicRefUtility<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>['ref'];

export interface PolymorphicComponentUtility<
  T extends React.ElementType,
  P extends Dict = AnyObject
> extends React.ForwardRefExoticComponent<PolymorphicComponentPropWithRefUtility<T, P>> {
  <E extends React.ElementType = T>(props: PolymorphicComponentProp<E, P>): JsxElement<E, P>;
}

export interface PolymorphicComponentWithRefUtility<
  T extends React.ElementType,
  P extends Dict = AnyObject
> extends React.ForwardRefExoticComponent<PolymorphicComponentPropWithRefUtility<T, P>> {
  <E extends React.ElementType = T>(
    props: PolymorphicComponentPropWithRefUtility<E, P>
  ): JsxElement<E, P>;
}

export function withPolymorphicProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  E extends React.ElementType | React.ForwardRefExoticComponent<any>
>(component: E) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return component as unknown as E extends React.ForwardRefExoticComponent<any>
    ? PolymorphicComponentWithRefUtility<E, React.ComponentProps<E>>
    : PolymorphicComponentUtility<E, React.ComponentProps<E>>;
}
