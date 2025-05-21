import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import BookListScreen from '../screens/BookListScreen';
import AddBookModal from '../screens/AddBookModal';
import { COLORS } from '../constants/Colors';

const HEADER_STYLE = {
  backgroundColor: COLORS.primaryRed,
  ...(Constants.platform?.ios 
    ? {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      }
    : {
        elevation: 5,
      }
  ),
};

const styles = StyleSheet.create({
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerTintColor: COLORS.white,
});

// Auth Stack for login/signup screens
const AuthStack = createNativeStackNavigator();

const AuthScreens = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerStyle: HEADER_STYLE,
      headerTintColor: styles.headerTintColor,
      headerTitleStyle: styles.headerTitleStyle,
    }}
  >
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
  </AuthStack.Navigator>
);

// Main Stack for authenticated screens
const MainStack = createNativeStackNavigator();

const MainAppScreens = () => (
  <MainStack.Navigator
    screenOptions={{
      headerStyle: HEADER_STYLE,
      headerTintColor: styles.headerTintColor,
      headerTitleStyle: styles.headerTitleStyle,
    }}
  >
    <MainStack.Screen name="BookList" component={BookListScreen} options={{ title: 'My Books' }}/>
  </MainStack.Navigator>
);

// Root navigator to handle modals over the main app stack
const RootStack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Or a loading indicator
  }

  return (
    <NavigationContainer>
      {user ? (
        <RootStack.Navigator>
          <RootStack.Screen
            name="MainApp"
            component={MainAppScreens}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="AddBookModal"
            component={AddBookModal}
            options={{
              presentation: 'modal',
              headerStyle: HEADER_STYLE,
              headerTintColor: styles.headerTintColor,
              headerTitleStyle: styles.headerTitleStyle,
            }}
          />
        </RootStack.Navigator>
      ) : (
        <AuthScreens />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;