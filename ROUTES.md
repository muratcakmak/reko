# Project Directory Structure

The following structure organizes **Reko** into its three core "Trinity" views while maintaining the "Vanilla" system feel.

```text
/app
  ├── _layout.tsx       # Root layout: Configures the Native Stack & Skia Provider
  ├── index.tsx         # The "Left" View: Lifespan Grid (Skia Canvas)
  ├── since.tsx         # The "Since" View: Milestones (SwiftUI Glass)
  ├── ahead.tsx         # The "Ahead" View: Countdowns (SwiftUI Glass)
  └── profile/
      └── setup.tsx     # The "You" View: Lifespan & Insights Profile

```

---

### 1. Root Layout (`app/_layout.tsx`)

This file initializes the **Native Stack** and ensures the header is transparent to allow the Liquid Glass effects to bleed through.

```tsx
import { Stack } from 'expo-router';
import { Host } from '@expo/ui/swift-ui'; // Native SwiftUI bridge
import { SkiaDomView } from '@shopify/react-native-skia';

export default function RootLayout() {
  return (
    <Host> {/* Ensures all children can use native glassEffect modifiers */}
      <Stack
        screenOptions={{
          headerTransparent: true, // Required for Vanilla system look
          headerBlurEffect: 'systemUltraThinMaterial', // Liquid Glass header
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Left' }} />
        <Stack.Screen name="since" options={{ title: 'Since' }} />
        <Stack.Screen name="ahead" options={{ title: 'Ahead' }} />
      </Stack>
    </Host>
  );
}

```

### 2. The "Left" View (`app/index.tsx`)

This view uses **react-native-skia** to render the high-density life-grid with a GPU-accelerated "Liquid Hover" shader.

```tsx
import { Canvas, Points, vec } from '@shopify/react-native-skia';
import { useWindowDimensions } from 'react-native';

export default function LeftScreen() {
  const { width, height } = useWindowDimensions();
  // Physics-based points for 4,000 weeks
  const points = Array.from({ length: 4000 }).map((_, i) => vec((i % 50) * 8, Math.floor(i / 50) * 8));

  return (
    <Canvas style={{ flex: 1 }}>
      {/* Skia handles the intensive grid rendering at 120Hz */}
      <Points
        points={points}
        mode="points"
        color="rgba(255, 255, 255, 0.3)"
        strokeWidth={4}
      />
    </Canvas>
  );
}

```

### 3. The "Since" View (`app/since.tsx`)

This view leverages **@expo/ui/swift-ui** to create native glass cards for milestones.

```tsx
import { View, Text } from '@expo/ui/swift-ui'; // Native SwiftUI components

export default function SinceScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Native glassEffect modifier for the 'Vanilla' feel */}
      <View glassEffect="prominent" style={{ borderRadius: 20, padding: 16 }}>
        <Text variant="title">Running</Text>
        <Text variant="subheadline">12 days since Dec 5, 2025</Text>
      </View>
    </View>
  );
}

```

