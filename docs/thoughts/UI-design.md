AppForge Theme & Primitive Architecture

Goal

AppForge is a UI framework, not a design system.

Applications own their visual language.
AppForge owns component behavior and rendering contracts.
Tamagui owns rendering implementation.

Application
    defines:
        tokens
        variants
        ↓
AppForge
    defines:
        primitive APIs
        variant contracts
        behavior
        composition
        ↓
Tamagui

⸻

1. Primitive Definitions

A primitive defines:

* which props are supported
* component behavior
* accessibility
* state handling
* rendering lifecycle

A primitive never defines:

* colors
* spacing values
* border radius values
* typography values
* shadows

Example:

type ButtonProps = {
    variant: string;
    size?: string;
    disabled?: boolean;
    loading?: boolean;
    children?: ReactNode;
}

Allowed:

<Button variant="meditate" />
<Button variant="danger" />
<Button variant="save" />

Forbidden:

<Button
    backgroundColor="red"
    borderRadius={12}
    padding={16}
    fontSize={18}
/>

⸻

2. Variant Contracts

AppForge defines what a valid variant must provide.

Example:

type ButtonVariantContract = {
    backgroundColor: TokenRef;
    textColor: TokenRef;
    paddingX: TokenRef;
    paddingY: TokenRef;
    borderRadius: TokenRef;
    fontSize: TokenRef;
    fontWeight: TokenRef;
    borderWidth?: TokenRef;
    borderColor?: TokenRef;
    shadow?: TokenRef;
}

AppForge does NOT define:

primary
secondary
danger
action
neutral
ghost

Those belong to the application.

⸻

3. Token Contracts

Applications define tokens.

Example:

tokens = {
    colors: {
        primary,
        secondary,
        background,
        surface,
        text,
        error,
        success,
    },
    spacing: {
        xs,
        sm,
        md,
        lg,
        xl,
    },
    radii: {
        sm,
        md,
        lg,
        pill,
    },
    typography: {
        body,
        heading,
        title,
        display,
    },
    shadows: {
        sm,
        md,
        lg,
    },
}

Tokens define values.
Variants reference tokens.

⸻

4. Application Theme

Applications define their own visual language.

Example:

theme.shapes.button = {
    meditate: {
        backgroundColor: "colors.primary",
        textColor: "colors.text",
        borderRadius: "radii.pill",
        paddingX: "spacing.lg",
        paddingY: "spacing.md",
        fontSize: "typography.body",
        fontWeight: "typography.heading",
    },
    breathing: {
        ...
    },
    warning: {
        ...
    },
}

⸻

5. Runtime Resolution

<Button variant="meditate" />

resolves:

Button
    ↓
theme.shapes.button.mediate
    ↓
token references
    ↓
token values
    ↓
Tamagui props

⸻

6. AppForge Responsibilities

AppForge owns:

* primitive APIs
* accessibility
* interaction behavior
* focus handling
* loading states
* disabled states
* variant contracts
* rendering
* composition

AppForge does NOT own:

* color systems
* typography systems
* spacing systems
* button variants
* badge variants
* application semantics

⸻

7. Application Responsibilities

Applications own:

* tokens
* semantic variants
* visual language
* branding
* density
* typography
* spacing
* radii
* color hierarchy

Examples:

Meditation:
    meditate
    breathing
    session
CAAPID:
    primary
    success
    warning
IDE:
    run
    selected
    ghost

⸻

8. Design Rule

The only invariant is:

Raw visual values must never appear in application code.

Good:

<Button variant="meditate" />

Bad:

<Button
    backgroundColor="#D97706"
    borderRadius={9999}
    padding={18}
/>

Applications may invent any semantic vocabulary they want, provided those semantics are defined centrally in their theme.
