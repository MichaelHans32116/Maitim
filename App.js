// File: BookHive/App.js
import React from 'react';
import { AuthProvider } from './src/contexts/AuthContext'; // Corrected path
import AppNavigator from './src/navigation/AppNavigator';  // Corrected path
import { COLORS } from './src/constants/Colors';        // Corrected path
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
      <StatusBar style="light" backgroundColor={COLORS.primaryRed} />
    </AuthProvider>
  );
}