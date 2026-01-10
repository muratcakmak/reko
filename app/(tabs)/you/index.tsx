import { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Text, Pressable, ScrollView, Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SymbolView } from "expo-symbols";
import { router, Stack } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { getUserProfile, useAccentColor, getLifespan } from "../../../utils/storage";
import { useUnistyles } from "react-native-unistyles";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { LifeInsights } from "../../../components/LifeInsights";

// Precise Countdown Component
function PreciseCountdown({
  birthDate,
  lifespan,
  textColor,
  secondaryTextColor
}: {
  birthDate: Date;
  lifespan: number;
  textColor: string;
  secondaryTextColor: string;
}) {
  const { theme } = useUnistyles();
  const styles = createStyles(theme);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const endOfLife = new Date(birthDate);
      endOfLife.setFullYear(birthDate.getFullYear() + lifespan);

      const diffMs = endOfLife.getTime() - now.getTime();
      const yearsLeft = diffMs / (1000 * 60 * 60 * 24 * 365.25);

      setTimeLeft(yearsLeft.toFixed(2));
    };

    update();
    // Update once per second - sufficient for 2 decimal precision
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [birthDate, lifespan]);

  return (
    <View style={styles.countdownContainer}>
      {Platform.OS === "ios" ? (
        <SymbolView
          name="laurel.leading"
          size={40}
          tintColor={secondaryTextColor}
          style={styles.laurelIcon}
        />
      ) : (
        <Ionicons name="leaf-outline" size={24} color={secondaryTextColor} style={styles.laurelIcon} />
      )}
      <View style={styles.countdownContent}>
        <Text style={[styles.countdownValue, { color: textColor }]}>{timeLeft}</Text>
        <Text style={[styles.countdownLabel, { color: secondaryTextColor }]}>years left</Text>
      </View>
      {Platform.OS === "ios" ? (
        <SymbolView
          name="laurel.trailing"
          size={40}
          tintColor={secondaryTextColor}
          style={styles.laurelIcon}
        />
      ) : (
        <Ionicons name="leaf-outline" size={24} color={secondaryTextColor} style={[styles.laurelIcon, { transform: [{ scaleX: -1 }] }]} />
      )}
    </View>
  );
}

export default function YouScreen() {
  const { theme } = useUnistyles();
  const styles = createStyles(theme);
  const isDark = theme.isDark;

  // Local accent color logic
  const accentColorName = useAccentColor();
  const accent = theme.colors.accent[accentColorName];
  const accentColor = isDark ? accent.secondary : accent.primary;
  // Initialize state synchronously to prevent CLS (flash of "No Profile")
  const [profile, setProfile] = useState<{ name: string; birthDate: Date | null }>(() => {
    const stored = getUserProfile();
    return stored ? { name: stored.name, birthDate: stored.birthDate ? new Date(stored.birthDate) : null } : { name: "", birthDate: null };
  });

  // Initialize lifespan synchronously
  const [lifespan, setLifespanValue] = useState(() => getLifespan());

  const lastLoadedProfileRef = useRef<string | null>(null);

  // Haptic feedback helper
  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Still use FocusEffect to update if changed (e.g. returning from Settings)
  useFocusEffect(() => {
    // We fetch again to check for updates
    const storedProfile = getUserProfile();
    const storedLifespan = getLifespan();

    // Always sync lifespan if changed
    setLifespanValue(prev => prev !== storedLifespan ? storedLifespan : prev);

    if (storedProfile) {
      const profileKey = `${storedProfile.name}-${storedProfile.birthDate || ''}-${storedLifespan}`;
      if (lastLoadedProfileRef.current !== profileKey) {
        lastLoadedProfileRef.current = profileKey;
        // Only set state if actually different to avoid unnecessary re-renders
        setProfile(prev => {
          const newDate = storedProfile.birthDate ? new Date(storedProfile.birthDate) : null;
          if (prev.name === storedProfile.name && prev.birthDate?.getTime() === newDate?.getTime()) {
            return prev;
          }
          return {
            name: storedProfile.name,
            birthDate: newDate,
          };
        });
      }
    } else {
      lastLoadedProfileRef.current = null;
      setProfile(prev => prev.name ? { name: "", birthDate: null } : prev);
    }
  });

  const hasProfile = profile.name && profile.birthDate;

  // Animated values for profile card
  const cardRotation = useSharedValue(-5);
  const cardScale = useSharedValue(1);

  // Animated style for profile card
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: cardScale.value },
      { rotate: `${cardRotation.value}deg` },
    ],
  }));

  const triggerAnimation = () => {
    // Reset rotation if needed, or just leave it. 
    // For a clean pulse, we probably want 0 rotation.
    cardRotation.value = withSpring(0);

    // Simple pulse animation
    cardScale.value = withSequence(
      withTiming(1.05, { duration: 150 }),
      withSpring(1, { damping: 12, stiffness: 150 })
    );
  };

  // Handle card tap - random tilt with spring animation
  const handleCardTap = () => {
    triggerHaptic();
    // Use the same animation or custom for tap? 
    // User asked for "one pulse" for the visibility animation.
    // I'll use the new pulse for consistency or keep tap fun?
    // "one pulse would be ok" likely refers to the auto-animation.
    // I will use the triggerAnimation for both for now to be safe, 
    // or arguably keep tap interactive. The user said "one pulse" in context of the auto-trigger.
    // I'll stick to making triggerAnimation do the pulse.
    triggerAnimation();
  };

  useFocusEffect(() => {
    // Trigger animation every time the screen comes into focus
    // Small delay to make it feel natural as the screen transition completes
    const timeout = setTimeout(() => {
      triggerAnimation();
    }, 100);
    return () => clearTimeout(timeout);
  });

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const calculateExactAge = (birthDate: Date) => {
    const today = new Date();
    const diff = today.getTime() - birthDate.getTime();
    return diff / (1000 * 60 * 60 * 24 * 365.25);
  };

  const openSettings = () => {
    router.push("/settings");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Native header with liquid glass - title and settings button */}
      <Stack.Header>
        <Stack.Header.Title>You</Stack.Header.Title>
        <Stack.Header.Right>
          <Stack.Header.Button
            icon="gearshape"
            onPress={openSettings}
          />
        </Stack.Header.Right>
      </Stack.Header>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
        alwaysBounceVertical={true}
      >
        <View style={styles.profileSection}>
          {/* Profile Card */}
          <Pressable onPress={handleCardTap}>
            <Animated.View style={[styles.profileCard, { backgroundColor: accentColor }, cardAnimatedStyle]}>
              <Ionicons name="person" size={80} color={theme.colors.onImage.faint} />
            </Animated.View>
          </Pressable>

          {hasProfile && profile.birthDate ? (
            <>
              <Text style={[styles.profileName, { color: theme.colors.textPrimary }]}>{profile.name}</Text>

              {/* Precise Countdown */}
              <PreciseCountdown
                birthDate={profile.birthDate}
                lifespan={lifespan}
                textColor={theme.colors.textPrimary}
                secondaryTextColor={theme.colors.textSecondary}
              />

              {/* Graphs */}
              <View style={styles.graphsContainer}>
                <LifeInsights
                  ageYears={calculateExactAge(profile.birthDate)}
                  lifespan={lifespan}
                  accentColor={accentColor}
                />
              </View>
            </>
          ) : (
            <>
              <Text style={[styles.descriptionText, { color: theme.colors.textSecondary }]}>
                Set up your profile to unlock personalized insights and visual reflections based on your age and lifespan.
              </Text>
              <Pressable style={[styles.setupButton, { backgroundColor: accentColor }]} onPress={openSettings}>
                <Text style={styles.setupButtonText}>Set up your profile</Text>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: "center",
    paddingTop: 20,
  },
  profileCard: {
    width: 140, // Smaller profile card to fit charts
    height: 140,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    ...theme.effects.shadow.card,
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  profileAge: {
    fontSize: 17,
    marginTop: 8,
    marginBottom: 24,
  },
  descriptionText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  setupButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
  },
  setupButtonText: {
    color: theme.colors.onImage.primary,
    fontSize: 17,
    fontWeight: "600",
  },
  countdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 40,
  },
  countdownContent: {
    alignItems: "center",
  },
  countdownValue: {
    fontSize: 28, // Large ticker
    fontWeight: "800",
    fontVariant: ["tabular-nums"], // Monospaced numbers prevent jitter
  },
  countdownLabel: {
    fontSize: 15,
    fontWeight: "500",
    marginTop: 4,
  },
  laurelIcon: {
    opacity: 0.8,
  },
  graphsContainer: {
    width: "100%",
  }
});
