'use client';

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
  Dimensions,
  AppState,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { StorageService } from "../services/StorageService"

const { width } = Dimensions.get("window")

interface LoginScreenProps {
  navigation: any
  onLogin: () => void
}

export default function LoginScreen({ navigation, onLogin }: LoginScreenProps) {
  const [numeroTenda, setNumeroTenda] = useState("")
  const [senha, setSenha] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const configureStatusBar = () => {
      if (Platform.OS === "android") {
        StatusBar.setBackgroundColor("#F9F7F3", true)
        StatusBar.setBarStyle("dark-content", true)
        StatusBar.setTranslucent(false)
      } else {
        StatusBar.setBarStyle("dark-content", true)
      }
    }
    configureStatusBar()
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "active") {
        setTimeout(configureStatusBar, 100)
      }
    }

    const subscription = AppState.addEventListener("change", handleAppStateChange)

    return () => {
      subscription?.remove()
    }
  }, [])

  const handleLogin = async () => {
    if (!numeroTenda.trim() || !senha.trim()) {
      Alert.alert("Atencao", "Por favor, preencha todos os campos")
      return
    }

    setLoading(true)
    try {
      const response = await StorageService.login(numeroTenda, senha)

      if (response.success) {
        await AsyncStorage.setItem("produtos", JSON.stringify(response.produtos || []))
        await AsyncStorage.setItem("numeroTenda", numeroTenda)

        if (!response.produtos || response.produtos.length === 0) {
          Alert.alert("Aviso", "Login realizado com sucesso, mas nao ha produtos cadastrados.", [
            {
              text: "Continuar",
              onPress: () => onLogin(),
            },
          ])
        } else {
          onLogin()
        }
      } else {
        Alert.alert("Erro", response.message || "Credenciais invalidas")
      }
    } catch (error) {
      Alert.alert("Erro", "Falha no login. Tente novamente.")
      console.error("Erro no login:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F7F3" translucent={false} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View style={styles.backgroundElements}>
            <View style={[styles.decorElement, styles.decorElement1]} />
            <View style={[styles.decorElement, styles.decorElement2]} />
            <View style={[styles.decorElement, styles.decorElement3]} />
          </View>

          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoIcon}>🌾</Text>
              </View>
              <Text style={styles.appName}>Loja Agricultura</Text>
              <Text style={styles.tagline}>Colheita de resultados</Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Bem-vindo de volta</Text>
              <Text style={styles.formSubtitle}>Use tenda: 123, senha: 123</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Numero da Tenda</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputIcon}>🏪</Text>
                  <TextInput
                    style={styles.input}
                    value={numeroTenda}
                    onChangeText={setNumeroTenda}
                    placeholder="Digite o numero"
                    placeholderTextColor="#A8A29E"
                    keyboardType="numeric"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Senha</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputIcon}>🔒</Text>
                  <TextInput
                    style={styles.input}
                    value={senha}
                    onChangeText={setSenha}
                    placeholder="Digite sua senha"
                    placeholderTextColor="#A8A29E"
                    keyboardType="numeric"
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={styles.loginButtonText}>Entrar</Text>
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.footer}>
              <Text style={styles.footerText}>EMPRESANAME - {new Date().getFullYear()}</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9F7F3",
  },
  container: {
    flex: 1,
  },
  backgroundElements: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorElement: {
    position: "absolute",
    borderRadius: 100,
    opacity: 0.1,
  },
  decorElement1: {
    width: 200,
    height: 200,
    backgroundColor: "#4D7C0F",
    top: -100,
    right: -50,
  },
  decorElement2: {
    width: 150,
    height: 150,
    backgroundColor: "#B45309",
    bottom: 100,
    left: -75,
  },
  decorElement3: {
    width: 120,
    height: 120,
    backgroundColor: "#65A30D",
    top: "40%",
    right: -60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ECFCCB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#84CC16",
  },
  logoIcon: {
    fontSize: 36,
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#365314",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: "#78716C",
    fontWeight: "500",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#365314",
    marginBottom: 8,
    textAlign: "center",
  },
  formSubtitle: {
    fontSize: 14,
    color: "#78716C",
    marginBottom: 24,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#365314",
    marginBottom: 8,
    paddingLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F4",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E7E5E4",
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#44403C",
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#65A30D",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#65A30D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    backgroundColor: "#A3A3A3",
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    color: "#78716C",
    fontSize: 14,
  },
})
