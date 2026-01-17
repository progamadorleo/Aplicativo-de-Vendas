import { useEffect, useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import AsyncStorage from "@react-native-async-storage/async-storage"
import LoginScreen from "./screens/LoginScreen"
import ProductsScreen from "./screens/ProductsScreen"

const Stack = createStackNavigator()

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    initializeApp()
  }, [])

  const initializeApp = async () => {
    try {
      await checkLoginStatus()
      console.log("App iniciado")
    } catch (error) {
      console.error("Erro na inicializacao:", error)
      setIsLoggedIn(false)
    }
  }

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("token")
      const produtos = await AsyncStorage.getItem("produtos")
      setIsLoggedIn(!!(token && produtos))
    } catch (error) {
      console.error("Erro ao verificar status de login:", error)
      setIsLoggedIn(false)
    }
  }

  const updateLoginStatus = () => {
    checkLoginStatus()
  }

  if (isLoggedIn === null) {
    return null
  }

  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="Products">
            {(props) => <ProductsScreen {...props} onLogout={updateLoginStatus} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Login">{(props) => <LoginScreen {...props} onLogin={updateLoginStatus} />}</Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
