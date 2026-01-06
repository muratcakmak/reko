import { StyleSheet, View, Text, ScrollView, Pressable, ImageBackground, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import Ionicons from "@expo/vector-icons/Ionicons";

// Demo future events
const demoEvents = [
  {
    id: "1",
    title: "Forest hiking",
    date: new Date(2026, 1, 8), // Feb 8, 2026
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
  },
];

function formatDate(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return `Starts ${date.toLocaleDateString("en-US", options)}`;
}

function getDaysUntil(date: Date) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
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

// Event card with image background
function EventCard({
  title,
  date,
  image,
  onPress,
}: {
  title: string;
  date: Date;
  image: string;
  onPress?: () => void;
}) {
  const daysUntil = getDaysUntil(date);

  return (
    <Pressable onPress={onPress}>
      <ImageBackground
        source={{ uri: image }}
        style={styles.eventCard}
        imageStyle={styles.eventCardImage}
      >
        <View style={styles.eventCardOverlay}>
          <View style={styles.eventCardContent}>
            <Text style={styles.eventDaysText}>In {daysUntil} days</Text>
            <Text style={styles.eventDateText}>{formatDate(date)}</Text>
            <Text style={styles.eventTitleText}>{title}</Text>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

export default function AheadScreen() {
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
        <HeaderPillButton>
          <Ionicons name="options-outline" size={20} color={colors.text} />
        </HeaderPillButton>

        <Text style={[styles.headerTitle, { color: colors.text }]}>Time ahead</Text>

        <HeaderPillButton style={styles.rightPillButton}>
          <Ionicons name="calendar-outline" size={20} color={colors.text} />
          <Text style={[styles.plusBadge, { color: colors.text }]}>+</Text>
          <View style={styles.buttonDivider} />
          <Ionicons name="add" size={24} color={colors.text} />
        </HeaderPillButton>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {demoEvents.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            date={event.date}
            image={event.image}
          />
        ))}
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
  rightPillButton: {
    gap: 4,
  },
  plusBadge: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: -4,
    marginTop: -8,
  },
  buttonDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#C7C7CC",
    marginHorizontal: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
  },
  eventCard: {
    height: 160,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
  },
  eventCardImage: {
    borderRadius: 20,
  },
  eventCardOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "flex-end",
  },
  eventCardContent: {
    padding: 16,
  },
  eventDaysText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  eventDateText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  eventTitleText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
