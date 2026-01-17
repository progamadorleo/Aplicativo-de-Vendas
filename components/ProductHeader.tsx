import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native"

const truncateText = (text: string, maxLength = 23): string => {
  if (!text) return ""
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

interface ProductHeaderProps {
  proprietario: string
  tendaInfo: string
  isOnline: boolean
  loading: boolean
  onRefresh: () => void
  onLogout: () => void
}

export default function ProductHeader({
  proprietario,
  tendaInfo,
  isOnline,
  loading,
  onRefresh,
  onLogout,
}: ProductHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconContainer}>
            <Text style={styles.headerIcon}>🌾</Text>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{truncateText(proprietario) || "Produtos"}</Text>
            <View style={styles.headerSubtitleContainer}>
              <Text style={styles.headerSubtitle}>
                {tendaInfo ? `Tenda ${truncateText(tendaInfo, 10)}` : "Agricultura Familiar"}
              </Text>
              <View style={styles.connectionStatus}>
                <View style={[styles.connectionDot, { backgroundColor: isOnline ? "#22C55E" : "#EF4444" }]} />
                <Text style={styles.connectionText}>{isOnline ? "Online" : "Offline"}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.refreshActionButton]}
            onPress={onRefresh}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? <ActivityIndicator color="#65A30D" size="small" /> : <Text style={styles.refreshIcon}>🔄</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={onLogout} activeOpacity={0.7}>
            <Text style={styles.logoutIcon}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E7E5E4",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ECFCCB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#BEF264",
    shadowColor: "#65A30D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerIcon: {
    fontSize: 22,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#365314",
    marginBottom: 4,
    lineHeight: 22,
  },
  headerSubtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#78716C",
    fontWeight: "500",
  },
  connectionStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  connectionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#78716C",
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  refreshActionButton: {
    backgroundColor: "#ECFCCB",
    borderWidth: 2,
    borderColor: "#BEF264",
  },
  logoutButton: {
    backgroundColor: "#FEE2E2",
    borderWidth: 2,
    borderColor: "#FECACA",
  },
  refreshIcon: {
    fontSize: 20,
    color: "#65A30D",
  },
  logoutIcon: {
    fontSize: 20,
    color: "#DC2626",
  },
})
