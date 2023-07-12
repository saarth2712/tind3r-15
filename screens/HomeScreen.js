import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, child, get, update } from 'firebase/database';
import { auth } from '/Users/saarth2712/tind3r-15/firebase.js';

function HomeScreen() {
  const [userProfiles, setUserProfiles] = useState([]);

  useEffect(() => {
    // Fetch user profiles from the Firebase Realtime Database
    const fetchUserProfiles = async () => {
      try {
        const snapshot = await firebase.database().ref('users').once('value');
        const profiles = snapshot.val();
        if (profiles) {
          const profileList = Object.values(profiles);
          setUserProfiles(profileList);
        }
      } catch (error) {
        console.error('Error fetching user profiles: ', error);
      }
    };

    fetchUserProfiles();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen</Text>
      <View style={styles.profileList}>
        {userProfiles.map((profile) => (
          <View key={profile.username} style={styles.profileItem}>
            <Text>{profile.username}</Text>
            {/* Display other profile details as needed */}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileList: {
    marginTop: 20,
  },
  profileItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
});

export default HomeScreen;
