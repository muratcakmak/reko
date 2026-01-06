import { StyleSheet, View, Text, ScrollView, Pressable, ImageBackground, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import Ionicons from "@expo/vector-icons/Ionicons";
import Svg, { Circle } from "react-native-svg";

// Demo since events
const demoEvents = [
  {
    id: "1",
    title: "Running",
    startDate: new Date(2025, 11, 5), // Dec 5, 2025
    image: "https://images.unsplash.com/photo-1556836459-d03e8a7c9c1c?w=800",
    showProgress: true,
  },
  {
    id: "2",
    title: "Not drinking",
    startDate: new Date(2025, 10, 25), // Nov 25, 2025
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800",
    showProgress: false,
  },
];

function formatDate(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

function getDaysSince(date: Date) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

// Progress ring component
function ProgressRing({ progress, size = 44 }: { progress: number; size?: number }) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Svg width={size} height={size}>
      <Circle
        stroke="rgba(255, 255, 255, 0.3)"
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
      />
      <Circle
        stroke="#FFFFFF"
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
}

// Header pill button
function HeaderPillButton({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
}) {
  const isGlassAvailable = isLiquidGlassAvailable();

  if (isGlassAvailable) {
    return (
      <Pressable onPress={onPress}>
        <GlassView style={[styles.pillButton, style]} isInteractive>
          {children}
        </GlassView>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={[styles.pillButton, styles.pillButtonFallback, style]}>
      {children}
    </Pressable>
  );
}

// Info banner component
function InfoBanner({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.infoBanner}>
        {/* Decorative circles */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        <View style={styles.decorativeCircle3} />

        <View style={styles.infoBannerContent}>
          <View style={styles.infoBannerText}>
            <Text style={styles.infoBannerTitle}>What is Time Since?</Text>
            <Text style={styles.infoBannerSubtitle}>
              Learn about how to build habits and streaks with Time Since
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.7)" />
        </View>
      </View>
    </Pressable>
  );
}

// Event card with image background
function SinceCard({
  title,
  startDate,
  image,
  showProgress,
  onPress,
}: {
  title: string;
  startDate: Date;
  image: string;
  showProgress: boolean;
  onPress?: () => void;
}) {
  const daysSince = getDaysSince(startDate);

  return (
    <Pressable onPress={onPress} style={styles.sinceCardWrapper}>
      <ImageBackground
        source={{ uri: image }}
        style={styles.sinceCard}
        imageStyle={styles.sinceCardImage}
      >
        <View style={styles.sinceCardOverlay}>
          <View style={styles.sinceCardContent}>
            <Text style={styles.sinceDaysText}>{daysSince} days</Text>
            <Text style={styles.sinceDateText}>{formatDate(startDate)}</Text>
            <Text style={styles.sinceTitleText}>{title}</Text>
          </View>
          {showProgress && (
            <View style={styles.progressContainer}>
              <ProgressRing progress={0} />
            </View>
          )}
        </View>
      </ImageBackground>
    </Pressable>
  );
}

export default function SinceScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const colors = {
    background: isDark ? "#000000" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#000000",
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <HeaderPillButton>
            <Ionicons name="options-outline" size={20} color={colors.text} />
          </HeaderPillButton>
          <HeaderPillButton>
            <Ionicons name="chatbubble-outline" size={18} color={colors.text} />
            <Text style={[styles.exclamationMark, { color: colors.text }]}>!</Text>
          </HeaderPillButton>
        </View>

        <Text style={[styles.headerTitle, { color: colors.text }]}>Time since</Text>

        <HeaderPillButton>
          <Ionicons name="add" size={24} color={colors.text} />
        </HeaderPillButton>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Banner */}
        <InfoBanner />

        {/* Cards Grid */}
        <View style={styles.cardsGrid}>
          {demoEvents.map((event) => (
            <SinceCard
              key={event.id}
              title={event.title}
              startDate={event.startDate}
              image={event.image}
              showProgress={event.showProgress}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    gap: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  pillButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  pillButtonFallback: {
    backgroundColor: "#F2F2F7",
  },
  exclamationMark: {
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 1,
    marginTop: -6,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
  },
  // Info Banner
  infoBanner: {
    backgroundColor: "#FF6B6B",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    overflow: "hidden",
  },
  decorativeCircle1: {
    position: "absolute",
    right: -20,
    top: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  decorativeCircle2: {
    position: "absolute",
    right: 20,
    bottom: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  decorativeCircle3: {
    position: "absolute",
    right: 60,
    top: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  infoBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoBannerText: {
    flex: 1,
    marginRight: 16,
  },
  infoBannerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  infoBannerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 20,
  },
  // Cards Grid
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  sinceCardWrapper: {
    width: "48%",
    marginBottom: 16,
  },
  sinceCard: {
    height: 160,
    borderRadius: 20,
    overflow: "hidden",
  },
  sinceCardImage: {
    borderRadius: 20,
  },
  sinceCardOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 12,
    justifyContent: "space-between",
  },
  sinceCardContent: {
    flex: 1,
  },
  sinceDaysText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  sinceDateText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.85)",
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  sinceTitleText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  progressContainer: {
    position: "absolute",
    bottom: 12,
    right: 12,
  },
});
