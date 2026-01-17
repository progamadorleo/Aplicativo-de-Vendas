import { View, Text, TouchableOpacity, StyleSheet } from "react-native"

interface CartSummaryProps {
  totalItens: number
  valorTotal: number
  onFinalizarVenda: () => void
}

export default function CartSummary({ totalItens, valorTotal, onFinalizarVenda }: CartSummaryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Text style={styles.iconText}>🛒</Text>
          </View>
          <Text style={styles.headerTitle}>Resumo da Compra</Text>
        </View>

        <View style={styles.summaryContent}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>🌾 Total de itens:</Text>
            <Text style={styles.summaryValue}>{totalItens} un.</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>💰 Valor total:</Text>
            <Text style={styles.summaryPrice}>R$ {(valorTotal || 0).toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.checkoutButton, totalItens === 0 && styles.checkoutButtonDisabled]}
          onPress={onFinalizarVenda}
          disabled={totalItens === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.checkoutButtonText}>{totalItens === 0 ? "Adicione produtos" : "Finalizar Venda"}</Text>
          <View style={styles.buttonIcon}>
            <Text style={styles.buttonIconText}>🚜</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 8,
    backgroundColor: "#F9F7F3",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#F5F5F4",
    borderTopWidth: 4,
    borderTopColor: "#65A30D",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ECFCCB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#BEF264",
  },
  iconText: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#365314",
  },
  summaryContent: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: "#365314",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#65A30D",
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#65A30D",
  },
  checkoutButton: {
    backgroundColor: "#65A30D",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#65A30D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutButtonDisabled: {
    backgroundColor: "#D6D3D1",
    shadowOpacity: 0,
    elevation: 0,
  },
  checkoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  buttonIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonIconText: {
    fontSize: 14,
  },
})
