import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur'; // For the blur effect
import { Easing } from 'react-native';
import { query, where, getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const ProfileScreen = ({ navigation, route }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(-250))[0]; // Sidebar sliding animation
  const { uid } = route.params; // Get the UID passed from Login
  const [userData, setUserData] = useState(null);

  const userInfo = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    profileImage: 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg',
  };

  useEffect(() => {
    // Fetch user data from Firestore using the uid field
    const fetchUserData = async () => {
      try {
        console.log('UID:', uid); // Log the UID to ensure it's correct
        
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where('uid', '==', uid));
        const querySnapshot = await getDocs(q); // Query based on uid field
  
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0]; // Get the first matching document
          setUserData(userDoc.data()); // Set user data if found
          console.log('User data:', userData);
        } else {
          console.log('No such user found!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    if (uid) {
      fetchUserData(); // Call the function only if uid is available
    }
  }, [uid]);

  const tags = ['hello','there'];

  const jobStatus = [
    { jobTitle: 'Frontend Developer', status: 'Applied' },
    { jobTitle: 'UI Designer', status: 'In Review' },
    { jobTitle: 'Backend Developer', status: 'Interview Scheduled' },
  ];

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: isSidebarVisible ? -250 : 0, // Sidebar width
      duration: 300,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
    setSidebarVisible(!isSidebarVisible);
  };

  // Color coding job status
  const getJobStatusStyle = (status) => {
    switch (status) {
      case 'Applied':
        return { backgroundColor: '#e0f7fa', color: '#00796b' };
      case 'In Review':
        return { backgroundColor: '#fff8e1', color: '#ffb300' };
      case 'Interview Scheduled':
        return { backgroundColor: '#e8f5e9', color: '#388e3c' };
      default:
        return { backgroundColor: '#f4f4f4', color: 'gray' };
    }
  };

  // Render each tag or a prompt to add tags
  const renderTag = (tag) => (
    <View style={styles.tagContainer}>
      <Text style={styles.tagText}>{tag}</Text>
    </View>
  );

  const renderJobStatus = ({ item }) => {
    const jobStyle = getJobStatusStyle(item.status);
    return (
      <View style={[styles.jobStatusContainer, { backgroundColor: jobStyle.backgroundColor }]}>
        <Text style={[styles.jobTitle, { color: jobStyle.color }]}>{item.jobTitle}</Text>
        <Text style={[styles.jobStatus, { color: jobStyle.color }]}>{item.status}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Blur the screen when sidebar is visible */}
      {isSidebarVisible && <BlurView intensity={50} style={styles.absoluteBlur} />}

      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.closeSidebar}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem}>
          <Ionicons name="home-outline" size={24} color="white" />
          <Text style={styles.sidebarText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem}>
          <Ionicons name="chatbubble-outline" size={24} color="white" />
          <Text style={styles.sidebarText}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem}>
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text style={styles.sidebarText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Top Icons */}
      <View style={styles.topIcons}>
        <TouchableOpacity>
          <Ionicons name="menu-outline" size={24} color="black" onPress={toggleSidebar} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="black" onPress={() => {navigation.navigate('Settings')}}/>
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image source={{ uri: userInfo.profileImage }} style={styles.profileImage} />
        <View style={styles.userInfo}>
          {userData ? ( // Check if userData is available
          <>
            <Text style={styles.userName}>{userData.name}</Text> 
            <Text style={styles.userEmail}>{userData.email}</Text>
          </>
          ) : (
            <Text style={styles.loadingText}>Loading user data or no user found</Text> // Display message when userData is not available
          )}
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfileScreen')}>
          <Ionicons name="create-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Tags Section */}
      <View style={styles.tagsSection}>
        <Text style={styles.sectionTitle}>Your Interests:</Text>
        {tags.length === 0 ? (
          <View style={styles.noTags}>
            <Text style={styles.noTagsText}>No interests yet. Add one!</Text>
            <TouchableOpacity>
              <Ionicons name="add-circle-outline" size={30} color="black" />
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={tags}
            horizontal
            renderItem={({ item }) => renderTag(item)}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>

      {/* Job Status Section */}
      <View style={styles.jobStatusSection}>
        <Text style={styles.sectionTitle}>Job Application Status:</Text>
        <FlatList
          data={jobStatus}
          renderItem={renderJobStatus}
          keyExtractor={(item) => item.jobTitle}
        />
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  topIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    color: 'gray',
  },
  tagsSection: {
    marginVertical: 20,
  },
  noTags: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noTagsText: {
    fontSize: 16,
    color: 'gray',
    marginRight: 10,
  },
  tagContainer: {
    backgroundColor: '#007BFF',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  tagText: {
    color: 'white',
  },
  jobStatusSection: {
    marginVertical: 20,
  },
  jobStatusContainer: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  jobStatus: {
    fontSize: 14,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0, // Adjust this to zero so SafeAreaView handles the safe area.
    width: 250,
    height: '100%',
    backgroundColor: '#333',
    zIndex: 10,
    padding: 20,
    borderTopRightRadius: 20, // Adds the border radius to the top-right corner
    overflow: 'hidden', // Ensure content respects the border radius
  },  
  closeSidebar: {
    alignSelf: 'flex-end',
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  sidebarText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 18,
  },
  absoluteBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9,
  },
});

export default ProfileScreen;
