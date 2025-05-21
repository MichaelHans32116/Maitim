import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';

import LoginScreen from '../screens/LogInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import BookListScreen from '../screens/BookListScreen'; // We'll create this next
import AddBookModal from '../screens/AddBookModal'; // Import the modal
import { COLORS } from '../constants/Color'; // Import COLORS
import { Platform } from 'react-native'; // For platform specific styling


// ... AuthStack definition ...

const MainStack = createNativeStackNavigator(); // Rename for clarity

const MainAppScreens = () => ( // This is the stack for regular screens
  <MainStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primaryRed },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <MainStack.Screen name="BookList" component={BookListScreen} options={{ title: 'My Books' }}/>
    {/* Other main screens would go here if not modals */}
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
              presentation: 'modal', // This makes it a modal
              headerStyle: { backgroundColor: COLORS.primaryRed },
              headerTintColor: COLORS.white,
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          />
        </RootStack.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;