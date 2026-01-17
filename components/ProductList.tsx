import { FlatList, View, StyleSheet } from "react-native"
import ProductItem from "./ProductItem"
import type { Product } from "../types"

interface ProductListProps {
  produtos: Product[]
  getQuantidadeProduto: (produtoId: string) => number
  onUpdateQuantidade: (produtoId: string, quantidade: number) => void
}

export default function ProductList({ produtos, getQuantidadeProduto, onUpdateQuantidade }: ProductListProps) {
  return (
    <FlatList
      data={produtos}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ProductItem
          produto={item}
          quantidade={getQuantidadeProduto(item.id)}
          onUpdateQuantidade={onUpdateQuantidade}
        />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={8}
      windowSize={10}
      ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      contentInsetAdjustmentBehavior="automatic"
      bounces={true}
      bouncesZoom={false}
      decelerationRate="normal"
      keyboardShouldPersistTaps="handled"
    />
  )
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  itemSeparator: {
    height: 8,
  },
})
