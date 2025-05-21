import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    const { error } = await signIn({ email, password });
    setLoading(false);
    if (error) {
      Alert.alert('Login Failed', error.message);
    }
    // AuthContext will handle navigation via App.js listener
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BookHive Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={COLORS.mediumGray}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={COLORS.mediumGray}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primaryRed} />
      ) : (
        <Button title="Login" onPress={handleLogin} color={COLORS.primaryRed} />
      )}
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account? </Text>
        <Text
          style={styles.signUpLink}
          onPress={() => navigation.navigate('SignUp')}
        >
          Sign Up
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: COLORS.dirtyWhite,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primaryRed,
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    color: COLORS.darkGray,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signUpText: {
    color: COLORS.mediumGray,
  },
  signUpLink: {
    color: COLORS.accentRed,
    fontWeight: 'bold',
  },
});

export default LoginScreen;