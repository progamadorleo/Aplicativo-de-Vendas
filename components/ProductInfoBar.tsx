import { View, Text, StyleSheet } from "react-native"

interface ProductInfoBarProps {
  lastUpdateFormatted: string
}

export default function ProductInfoBar({ lastUpdateFormatted }: ProductInfoBarProps) {
  return (
    <View style={styles.infoContainer}>
      <Text style={styles.updateText}>Última sincronização: {lastUpdateFormatted}</Text>
      <View style={styles.deviceInfoRow}></View>
    </View>
  )
}

const styles = StyleSheet.create({
  infoContainer: {
    paddingHorizontal: 24,
    alignItems: "center",
  },
  updateText: {
    fontSize: 11,
    color: "#78716C",
    fontWeight: "500",
    marginBottom: 8,
  },
  deviceInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  deviceText: {
    fontSize: 10,
    color: "#78716C",
    fontWeight: "500",
  },
})
