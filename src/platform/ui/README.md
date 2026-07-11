# Platform UI ownership

Platform UI owns reusable, application-neutral mechanics and primitive contracts.
`ScreenScaffold` provides a themed screen root, top and bottom safe-area handling,
fixed header and footer slots, and either scrolling or fill content behavior.

Applications own their opinionated screen scaffolds and visual page policy. An app
scaffold may compose `ScreenScaffold` with its branding, typography, titles, gutters,
maximum widths, navigation policy, and app-specific spacing. Those decisions do
not belong in `ScreenScaffold` or another platform-level app scaffold.

```tsx
import { ScreenScaffold } from "@appforge/platform/ui";

<ScreenScaffold header={<AppHeader />} scroll contentContainerStyle={appContentStyle}>
  <ScreenContent />
</ScreenScaffold>;
```
