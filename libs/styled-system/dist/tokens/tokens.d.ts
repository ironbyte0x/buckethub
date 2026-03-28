/* eslint-disable */
export type Token = `colors.${ColorToken}` | `fonts.${FontToken}` | `radii.${RadiusToken}` | `durations.${DurationToken}` | `easings.${EasingToken}` | `animations.${AnimationToken}` | `sizes.${SizeToken}` | `spacing.${SpacingToken}` | `breakpoints.${BreakpointToken}` | `borders.${BorderToken}` | `shadows.${ShadowToken}`

export type ColorPalette = "grey" | "info" | "success" | "warning" | "error" | "background-base" | "background-secondary" | "background-surface" | "background-subtle" | "background-surface-error" | "background-surface-warning" | "background-surface-info" | "background-surface-success" | "background-button-primary" | "background-button-primary-hover" | "background-button-primary-disabled" | "background-button-secondary" | "background-button-secondary-hover" | "background-button-secondary-disabled" | "background-button-destructive" | "background-button-destructive-hover" | "background-button-destructive-disabled" | "background-input" | "text-base" | "text-subtle" | "text-muted" | "text-base-error" | "text-base-warning" | "text-base-info" | "text-base-success" | "text-placeholder" | "text-button-primary" | "text-button-secondary" | "text-button-destructive" | "border-base" | "border-surface" | "border-input" | "border-input-focus" | "border-mark-input" | "border-active" | "border-button-primary" | "border-button-secondary" | "border-button-destructive" | "border-error" | "border-warning" | "border-info" | "border-success"

export type ColorToken = "grey.50" | "grey.100" | "grey.200" | "grey.300" | "grey.400" | "grey.500" | "grey.600" | "grey.700" | "grey.800" | "grey.900" | "grey.950" | "info.50" | "info.100" | "info.200" | "info.300" | "info.400" | "info.500" | "info.600" | "info.700" | "info.800" | "info.900" | "info.950" | "success.50" | "success.100" | "success.200" | "success.300" | "success.400" | "success.500" | "success.600" | "success.700" | "success.800" | "success.900" | "success.950" | "warning.50" | "warning.100" | "warning.200" | "warning.300" | "warning.400" | "warning.500" | "warning.600" | "warning.700" | "warning.800" | "warning.900" | "warning.950" | "error.50" | "error.100" | "error.200" | "error.300" | "error.400" | "error.500" | "error.600" | "error.700" | "error.800" | "error.900" | "error.950" | "background-base" | "background-secondary" | "background-surface" | "background-subtle" | "background-surface-error" | "background-surface-warning" | "background-surface-info" | "background-surface-success" | "background-button-primary" | "background-button-primary-hover" | "background-button-primary-disabled" | "background-button-secondary" | "background-button-secondary-hover" | "background-button-secondary-disabled" | "background-button-destructive" | "background-button-destructive-hover" | "background-button-destructive-disabled" | "background-input" | "text-base" | "text-subtle" | "text-muted" | "text-base-error" | "text-base-warning" | "text-base-info" | "text-base-success" | "text-placeholder" | "text-button-primary" | "text-button-secondary" | "text-button-destructive" | "border-base" | "border-surface" | "border-input" | "border-input-focus" | "border-mark-input" | "border-active" | "border-button-primary" | "border-button-secondary" | "border-button-destructive" | "border-error" | "border-warning" | "border-info" | "border-success" | "colorPalette.50" | "colorPalette.100" | "colorPalette.200" | "colorPalette.300" | "colorPalette.400" | "colorPalette.500" | "colorPalette.600" | "colorPalette.700" | "colorPalette.800" | "colorPalette.900" | "colorPalette.950" | "colorPalette"

export type FontToken = "sans"

export type RadiusToken = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"

export type DurationToken = "1" | "2" | "3" | "4" | "5" | "6"

export type EasingToken = "ease-out-quart" | "ease-out-quint"

export type AnimationToken = "collapsible-down" | "collapsible-up" | "slide-in-from-left" | "slide-out-to-left" | "slide-in-from-right" | "slide-out-to-right" | "slide-in-from-top" | "slide-out-to-top" | "slide-in-from-bottom" | "slide-out-to-bottom" | "popover-in" | "popover-out" | "modal-in" | "modal-out" | "overlay-in" | "overlay-out"

export type SizeToken = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "14" | "16" | "20" | "24" | "28" | "32" | "36" | "40" | "44" | "48" | "52" | "56" | "60" | "64" | "72" | "80" | "96" | "0.5" | "1.5" | "2.5" | "3.5" | "4.5" | "5.5" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "prose" | "full" | "min" | "max" | "fit" | "breakpoint-sm" | "breakpoint-md" | "breakpoint-lg" | "breakpoint-xl" | "breakpoint-2xl" | "input-height-large" | "input-height-default" | "button-height-lg" | "button-height-md" | "button-height-sm" | "button-height-xs" | "button-height-2xs"

export type SpacingToken = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "14" | "16" | "20" | "24" | "28" | "32" | "36" | "40" | "44" | "48" | "52" | "56" | "60" | "64" | "72" | "80" | "96" | "0.5" | "1.5" | "2.5" | "3.5" | "4.5" | "5.5" | "-1" | "-2" | "-3" | "-4" | "-5" | "-6" | "-7" | "-8" | "-9" | "-10" | "-11" | "-12" | "-14" | "-16" | "-20" | "-24" | "-28" | "-32" | "-36" | "-40" | "-44" | "-48" | "-52" | "-56" | "-60" | "-64" | "-72" | "-80" | "-96" | "-0.5" | "-1.5" | "-2.5" | "-3.5" | "-4.5" | "-5.5"

export type BreakpointToken = "sm" | "md" | "lg" | "xl" | "2xl"

export type BorderToken = "base" | "surface" | "active"

export type ShadowToken = "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "inset-2xs" | "inset-xs" | "inset-sm"

export type Tokens = {
		colors: ColorToken
		fonts: FontToken
		radii: RadiusToken
		durations: DurationToken
		easings: EasingToken
		animations: AnimationToken
		sizes: SizeToken
		spacing: SpacingToken
		breakpoints: BreakpointToken
		borders: BorderToken
		shadows: ShadowToken
} & { [token: string]: never }

export type TokenCategory = "aspectRatios" | "zIndex" | "opacity" | "colors" | "fonts" | "fontSizes" | "fontWeights" | "lineHeights" | "letterSpacings" | "sizes" | "cursor" | "shadows" | "spacing" | "radii" | "borders" | "borderWidths" | "durations" | "easings" | "animations" | "blurs" | "gradients" | "breakpoints" | "assets"