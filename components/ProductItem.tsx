import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import type { Product } from "../types"

interface ProductItemProps {
  produto: Product
  quantidade: number
  onUpdateQuantidade: (produtoId: string, quantidade: number) => void
}

export default function ProductItem({ produto, quantidade, onUpdateQuantidade }: ProductItemProps) {
  const incrementar = () => {
    onUpdateQuantidade(produto.id, quantidade + 1)
  }

  const decrementar = () => {
    if (quantidade > 0) {
      onUpdateQuantidade(produto.id, quantidade - 1)
    }
  }

  const precoUnitario =
    produto.preco_unitario !== undefined ? produto.preco_unitario : produto.preco !== undefined ? produto.preco : 0

  return (
    <View style={styles.container}>
      <View style={styles.productInfo}>
        <View style={styles.info}>
          <Text style={styles.nome}>{produto.nome}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.preco}>R$ {precoUnitario.toFixed(2)}</Text>
            <Text style={styles.unit}>/ unidade</Text>
          </View>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.decrementButton, quantidade === 0 && styles.buttonDisabled]}
          onPress={decrementar}
          disabled={quantidade === 0}
        >
          <Text style={styles.controlButtonText}>−</Text>
        </TouchableOpacity>

        <View style={styles.quantityContainer}>
          <Text style={styles.quantidade}>{quantidade}</Text>
        </View>

        <TouchableOpacity style={[styles.controlButton, styles.incrementButton]} onPress={incrementar}>
          <Text style={styles.controlButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F5F5F4",
  },
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: "600",
    color: "#365314",
    marginBottom: 4,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  preco: {
    fontSize: 14,
    color: "#65A30D",
    fontWeight: "700",
  },
  unit: {
    fontSize: 12,
    color: "#78716C",
    marginLeft: 4,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F4",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "#E7E5E4",
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  incrementButton: {
    backgroundColor: "#65A30D",
  },
  decrementButton: {
    backgroundColor: "#EF4444",
  },
  buttonDisabled: {
    backgroundColor: "#D6D3D1",
  },
  controlButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  quantityContainer: {
    width: 32,
    alignItems: "center",
  },
  quantidade: {
    fontSize: 16,
    fontWeight: "600",
    color: "#365314",
  },
})
