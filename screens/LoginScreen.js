import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import auth from '/Users/saarth2712/tind3r-15/firebase.js';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Check if a user is already signed in
    const authInstance = getAuth(auth);
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      if (user) {
        // User is signed in, navigate to HomeScreen
        navigation.navigate('Home');
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    const authInstance = getAuth(auth);
    signInWithEmailAndPassword(authInstance, email, password)
      .then((userCredential) => {
        // Signed in successfully
        const user = userCredential.user;
        navigation.navigate('Home');
      })
      .catch((error) => {
        // Handle errors
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert('Error', errorMessage);
      });
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default LoginScreen;
