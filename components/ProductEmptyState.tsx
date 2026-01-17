import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native"

interface ProductEmptyStateProps {
  searchText: string
  loading: boolean
  onRefresh: () => void
}

export default function ProductEmptyState({ searchText, loading, onRefresh }: ProductEmptyStateProps) {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyIcon}>🌱</Text>
      </View>
      <Text style={styles.emptyTitle}>{searchText ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}</Text>
      <Text style={styles.emptySubtitle}>
        {searchText
          ? `Não encontramos produtos com "${searchText}"`
          : "Esta tenda ainda não possui produtos cadastrados"}
      </Text>
      {!searchText && (
        <TouchableOpacity style={styles.emptyRefreshButton} onPress={onRefresh} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={styles.emptyRefreshButtonText}>Atualizar Produtos</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ECFCCB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 3,
    borderColor: "#BEF264",
    shadowColor: "#65A30D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#365314",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 28,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#78716C",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
    maxWidth: 280,
  },
  emptyRefreshButton: {
    backgroundColor: "#65A30D",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: "#65A30D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 180,
  },
  emptyRefreshButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
})
