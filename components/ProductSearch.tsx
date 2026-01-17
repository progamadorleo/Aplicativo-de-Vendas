import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"

interface ProductSearchProps {
  searchText: string
  setSearchText: (text: string) => void
  clearSearch: () => void
  resultsCount: number
}

export default function ProductSearch({ searchText, setSearchText, clearSearch, resultsCount }: ProductSearchProps) {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produtos..."
          placeholderTextColor="#A8A29E"
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchText.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      {searchText.length > 0 && (
        <Text style={styles.searchResultText}>
          {resultsCount} produto{resultsCount !== 1 ? "s" : ""} encontrado
          {resultsCount !== 1 ? "s" : ""}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F4",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E7E5E4",
    marginTop: 8,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
    color: "#78716C",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#44403C",
    fontWeight: "500",
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#D6D3D1",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 12,
    color: "#78716C",
    fontWeight: "600",
  },
  searchResultText: {
    fontSize: 12,
    color: "#78716C",
    fontWeight: "500",
    marginTop: 8,
    textAlign: "center",
  },
})
