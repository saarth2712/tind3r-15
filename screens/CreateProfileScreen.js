import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { auth, db } from '/Users/saarth2712/tind3r-15/firebase.js';

const niches = ['Fitness', 'Beauty', 'Fashion', 'Food', 'Travel', 'Lifestyle', 'Gaming', 'Tech'];

const CreateProfileScreen = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [bio, setBio] = useState('');
  const [isBrand, setIsBrand] = useState(false);
  const [audience, setAudience] = useState('');
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState('');
  const [town, setTown] = useState('');
  const [selectedNiches, setSelectedNiches] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    getMediaLibraryPermission();
    getLocationPermission(); 
  }, []);

  const getMediaLibraryPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant media library permission to upload a profile picture.');
    }
  };

  const getLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant location permission to access your GPS.');
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } else {
      Alert.alert('Permission required', 'Please grant media library permission to choose a profile picture.');
    }
  };

  const handleCreateProfile = async () => {    
    try {
      const user = auth.currentUser;
      const { uid } = user;

      const userData = {
        name,
        username,
        profileImage,
        bio,
        isBrand,
        audience,
        location,
        city,
        town,
        niches: selectedNiches,
      };

      let nodeRef;
      if (isBrand) {
        nodeRef = ref(db, 'users/brands/' + username);
      } else {
        nodeRef = ref(db, 'users/creators/' + username);
      }
  
      await set(nodeRef, userData);  

      Alert.alert('Profile created', 'Your profile has been created successfully.');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Failed to create your profile. Please try again.');
      console.error(error);
    }
  };

  const toggleNicheSelection = (niche) => {
    if (selectedNiches.includes(niche)) {
      setSelectedNiches(selectedNiches.filter((item) => item !== niche));
    } else {
      if (selectedNiches.length < 3) {
        setSelectedNiches([...selectedNiches, niche]);
      } else {
        Alert.alert('Maximum Niches Reached', 'You can select a maximum of 3 niches.');
      }
    }
  };

  const getLocationAsync = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setLocation({ latitude, longitude });
        const address = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (address.length > 0) {
          setCity(address[0].city || '');
          setTown(address[0].subregion || '');
        }
      } else {
        Alert.alert('Permission required', 'Please grant location permission to access your GPS.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Profile</Text>

      {profileImage && <Image source={{ uri: profileImage }} style={styles.profileImage} />}
      <Button title="Choose Profile Picture" onPress={pickImage} />

      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />

      {/* Username Input */}
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />

      <TextInput style={styles.input} placeholder="Bio" value={bio} onChangeText={setBio} />

      <View style={styles.roleContainer}>
        <Text style={styles.roleLabel}>Are you a:</Text>
        <View style={styles.roleButtonsContainer}>
          <Button
            title="Brand"
            onPress={() => setIsBrand(true)}
            color={isBrand ? '#888888' : undefined}
          />
          <Button
            title="Creator"
            onPress={() => setIsBrand(false)}
            color={!isBrand ? '#888888' : undefined}
          />
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="My Audience is..."
        value={audience}
        onChangeText={setAudience}
      />

      <Text style={styles.nicheTitle}>Select up to 3 Niches:</Text>
      <View style={styles.nicheContainer}>
        {niches.map((niche) => (
          <TouchableOpacity
            key={niche}
            style={[
              styles.nicheTile,
              selectedNiches.includes(niche) ? styles.selectedNicheTile : null,
            ]}
            onPress={() => toggleNicheSelection(niche)}
          >
            <Text style={styles.nicheText}>{niche}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Get Current Location" onPress={getLocationAsync} />
      {(city || town) && (
        <Text style={styles.locationText}>
          Location: {town && town + ', '}
          {city}
        </Text>
      )}

      <Button title="Create Profile" onPress={handleCreateProfile} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  roleLabel: {
    marginRight: 10,
  },
  roleButtonsContainer: {
    flexDirection: 'row',
  },
  nicheTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  nicheContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  nicheTile: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
  },
  selectedNicheTile: {
    backgroundColor: 'gray',
  },
  nicheText: {
    fontSize: 14,
  },
  locationText: {
    marginBottom: 10,
  },
});

export default CreateProfileScreen;
