# Product Specification: "Reko" – Liquid Glass Time Visualization

**PROJECT:** Build "Reko" - A Liquid Glass Time Visualization App

**INSPIRATION:** [Left - Widgets for Time Left](https://apps.apple.com/us/app/left-widgets-for-time-left/id6740155884) - A widget-first time tracking app that inspired the core concept.

**ROLE:**
Act as a Staff Mobile Engineer specializing in **React Native (Expo)**, **UI/UX Motion Design**, and **Graphics Programming (Skia/Shaders)**.

**KEY TECHNOLOGIES:**
- **Navigation:** `expo-router` version 7 beta (for native stack navigation with transparent glass headers)
- **Glass UI:** `@expo/ui/swift-ui` (for Apple's native glass components - tab bar, headers, buttons)
- **Graphics:** `@shopify/react-native-skia` (for liquid time visualizations with custom shaders)
- **Animations:** `react-native-reanimated` (for layout transitions)
- **Sensors:** `react-native-sensors` (for gyroscope parallax)
- **Haptics:** `expo-haptics` (for tactile feedback)

**CRITICAL:** We use Apple's actual glass components via `@expo/ui/swift-ui`, not custom implementations. This ensures perfect system integration and native performance.

---

## 1. Product Vision & Core Concept

**Reko** is a time-tracking app that visualizes time in three directions:
1. **Left:** Time remaining until a future event (Countdowns).
2. **Since:** Time elapsed since a past event (Habits/Streaks).
3. **Ahead:** Intentional focus on future events and milestones.

**Core Philosophy: Time as Physical Element**

Reko treats time as a refractive material that lives inside the device's display. It isn't an app you "open"; it's a layer of the system you "reveal." The app moves away from tracking and toward **presence**.

---

## 2. Design Philosophy (CRITICAL)

The app must not look like a standard 3rd-party app. It must feel like a "System App" native to iOS—vanilla, minimal, and premium.

### Visual Style: "Liquid Glass"
- **Refractive Surfaces:** Every UI element is a native glass primitive with real-time light refraction from the background.
- **Specular Fidelity:** Use the device's gyroscope so that as the user tilts their phone, the highlights on glass elements shift dynamically, mimicking high-end physical glass.
- **Fluid Textures:** No flat colors. The UI should feel like expensive crystal with refractive, glossy, and fluid textures.
- **Liquid Motion:** The liquid level inside cards represents the % of time. It should not be a straight line; it must be a sine wave that gently ripples.

### Motion & Interaction
- **Non-Linear Transitions:** Avoid standard slide transitions. Views "coalesce" and "dissolve" into one another, maintaining a feeling of liquid continuity.
- **Gyroscope Parallax:** Everything must float and flow. Glass elements should shimmer when the phone tilts.
- **Native Physics:** Use native-feeling over-scroll and inter-element physics that create subtle wave-like ripples across glass surfaces.

### "Vanilla" Minimalism
- **Zero Clutter:** No unnecessary icons, no heavy text blocks. Just the time and the visual.
- **System Fonts:** Use San Francisco on iOS. Large, thin weights for numbers.
- **Deep Background:** OLED black (`#000000`). The glass elements should pop against this.

---

## 3. Technical Strategy: Hybrid Visual Engine

To achieve high-density visualization while maintaining system-native UI, we use a tiered rendering approach.

### 3.1. High-Density Material Rendering (React Native Skia)

- **Graphics/Visuals:** `@shopify/react-native-skia` (REQUIRED for the Liquid Glass shaders).
- **The Lifespan Canvas:** High-density grids and visualizations are rendered as GPU-accelerated layers using Skia.
- **Liquid Magnification & Hover:** Custom shaders create "mercury-like" swells when users interact with specific nodes.
- **Inter-Node Physics:** Using Skia's physics engine, interactions with one element cause subtle wave-like ripples across the entire glass grid.
- **Shader Effects:** Write Skia shaders that simulate frosted glass with "liquid" edges. They should distort background content slightly (refraction).

### 3.2. Native Interface Synthesis (Apple's Glass Components)

- **Framework:** React Native (Expo Managed Workflow).
- **Language:** TypeScript.
- **Navigation:** `expo-router` (version 7 beta) with native glass tab bar and headers. Using Expo Router 7 beta enables truly transparent navigation headers that allow Skia-rendered content to bleed into the status bar area.
- **Glass Elements:** Use `@expo/ui/swift-ui` for all glass UI components. This provides access to Apple's actual glass effects:
  - Native glass tab bar (using Apple's `UITabBar` with glass effect)
  - Native glass headers (using Apple's `UINavigationBar` with glass effect)
  - Native glass buttons (using Apple's `UIButton` with glass effect)
  - Native glass input fields and cards (using Apple's `UIVisualEffectView`)
- **No Imitation:** We use Apple's actual glass components, not custom implementations that try to mimic them. This ensures perfect system integration and native performance.
- **SF Symbols:** Utilize variable-color SF Symbols that "glow" through the glass layers based on event urgency.

### 3.3. Animation & Interaction

- **Animations:** `react-native-reanimated` (for layout transitions) and `react-native-sensors` (for gyroscope parallax).
- **Haptics:** `expo-haptics` (heavy use of tactile feedback).
- **Performance:** Ensure all animations run on the UI thread (Reanimated) or GPU (Skia) to maintain 60/120 FPS.

---

## 4. The Three Views

| View | Design Objective | Core Tech |
| --- | --- | --- |
| **The "Left"** | Macro-visualization of time remaining. Liquid vessel showing % full. | `react-native-skia` (Custom Shaders) |
| **The "Since"** | Reflective streaks and milestones. Flow stream showing accumulation. | Native Glass + Skia (Hybrid) |
| **The "Ahead"** | Intentional focus on future events and milestones. | Native Stack + Glass Cards |

### 4.1. Screen: "Left" (Future)

- **Input:** Users add a "Date Ahead" (e.g., "Trip to Tokyo").
- **Visualization:** Render a **Liquid Vessel**.
  - If 30 days are left, the vessel is 30% full of "liquid time."
  - The liquid color should be a subtle gradient (e.g., Cyan to Blue).
  - The liquid level should be a sine wave that gently ripples, not a straight line.
- **Text:** Use the system font (San Francisco on iOS). Large, thin weights for the numbers.

### 4.2. Screen: "Since" (Past)

- **Input:** Users add a "Date Since" (e.g., "Quit Smoking").
- **Visualization:** A "Flow" stream. The liquid should appear to be slowly flowing *upwards* or filling a pool, symbolizing accumulation.
- **Counter:** A minimalist ticker that updates seconds in real-time.
- **Milestones:** Reflective streaks showing key moments in the timeline.

### 4.3. Screen: "Ahead" (Future Intentions)

- **Focus:** Intentional focus on future events and milestones.
- **Visualization:** Glass cards with liquid glass effects showing upcoming events.
- **Interaction:** Gyroscope-based highlights that shift as the phone tilts.

---

## 5. Step-by-Step Implementation Plan

### 5.1. The "Liquid Glass" Component (Core Asset)

Create a reusable `<LiquidCard />` component using Skia Canvas for liquid visualizations.

**Note:** This component is specifically for the liquid time visualizations (vessels, flow streams). For UI glass elements (tab bar, headers, buttons), use `@expo/ui/swift-ui` native components.

- **Shader:** Write a Skia shader that simulates frosted glass with a "liquid" edge. It should distort the background content slightly (refraction).
- **Fluidity:** The liquid level inside the card represents the % of time. It should not be a straight line; it must be a sine wave that gently ripples.
- **Gyroscope:** Bind the "light source" of the glass reflection to the phone's accelerometer/gyro. When the phone tilts, the shine on the glass should move.
- **Performance:** Use Skia `BlurMask` or `Shadow` for soft, high-performance glows (not standard `View` shadows).

### 5.2. Navigation & Layout

- **Navigation Framework:** Use `expo-router` version 7 beta for native stack navigation with glass effects.
- **Bottom Navigation:** Use `@expo/ui/swift-ui` to implement Apple's native glass tab bar. It should be a floating "glass pill" at the bottom center, containing three tabs: "Left", "Since", and "Ahead". This uses Apple's actual `UITabBar` with glass effect, not a custom implementation.
- **Headers:** Use `@expo/ui/swift-ui` for native glass navigation headers. Navigation headers should be truly transparent (enabled by Expo Router 7 beta), allowing Skia-rendered content to bleed into the status bar area.
- **Glass Buttons:** All interactive elements (buttons, inputs) should use `@expo/ui/swift-ui` glass components for native iOS glass effects.
- **Background:** Deep, OLED black (`#000000`). The glass elements should pop against this.

### 5.3. Screen Implementation Order

1. **"Left" Screen:** Implement the liquid vessel visualization first.
2. **"Since" Screen:** Implement the flow stream and real-time counter.
3. **"Ahead" Screen:** Implement the glass cards with future events.

### 5.4. "Vanilla" Polish & Haptics

- **Scroll Physics:** Use native-feeling over-scroll.
- **Haptics:**
  - Tick haptic when the second changes (optional setting).
  - Heavy "thud" haptic when the liquid hits the top of the container (100% complete).
  - "Soft" haptic when switching tabs.
- **Motion:** Implement coalesce/dissolve transitions between views using Reanimated.

---

## 6. Code Generation Rules

1. **Glass UI Components:** Always use `@expo/ui/swift-ui` for glass elements (tab bar, headers, buttons, inputs). These are Apple's actual glass components, not imitations. Reference: [Expo UI SwiftUI Documentation](https://docs.expo.dev/versions/latest/sdk/ui/swift-ui/)
2. **Navigation:** Use `expo-router` version 7 beta for native stack navigation with transparent glass headers.
3. **Do not use** standard `View` shadows. Use Skia `BlurMask` or `Shadow` for soft, high-performance glows in Skia-rendered content.
4. **Do not use** external UI libraries (like NativeBase or Paper). Use Apple's native components via `@expo/ui/swift-ui` to ensure the "System/Vanilla" look.
5. **Strict Typing:** Use strict TypeScript interfaces for all Time Event data models.
6. **Performance:** Ensure the liquid animation runs on the UI thread (Reanimated) or GPU (Skia) to maintain 60/120 FPS.
7. **Hybrid Rendering:** Use Skia for high-density visualizations (liquid vessels, flow streams) and Apple's native glass components (via `@expo/ui/swift-ui`) for system UI elements.
8. **Shader Quality:** All liquid visualizations must use custom Skia shaders for true refractive properties. Glass UI elements use Apple's native glass effects.

---

## 7. Success Criteria

- **The "Vanilla" Test:** If a user didn't know they downloaded it, they should assume it was a new feature in the iOS update.
- **Performance:** Persistent 120fps interaction, even during complex glass-refraction animations.
- **Visual Fidelity:** Glass elements must respond to gyroscope input with realistic specular highlights.
- **Liquid Motion:** All liquid visualizations must use sine wave ripples, not static lines.

---

## 8. Immediate Starting Point

**START IMMEDIATE TASK:**
Initialize the project structure and build the **`<LiquidCard />`** component first. The glass shader and the liquid wave animation must be working before building the rest of the app.

**Priority Order:**
1. Set up Expo Router 7 beta and `@expo/ui/swift-ui` integration
2. Implement native glass tab bar using `@expo/ui/swift-ui`
3. Implement native glass headers using `@expo/ui/swift-ui` with Expo Router 7 beta
4. Core `<LiquidCard />` component with Skia shader (for liquid visualizations)
5. Gyroscope integration for glass highlights
6. Liquid wave animation (sine wave ripple)
7. "Left" screen with liquid vessel
8. "Since" screen with flow stream
9. "Ahead" screen with glass cards (using native glass components)
10. Haptics integration
11. Polish and performance optimization

