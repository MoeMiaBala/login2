import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Animated, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur'; // For the blur effect
import { Easing } from 'react-native';

const SettingsScreen = ({ navigation }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('Light');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isNotificationsExpanded, setNotificationsExpanded] = useState(false);
  const [isPrivacyExpanded, setPrivacyExpanded] = useState(false);
  const [isAccountExpanded, setAccountExpanded] = useState(false);

  const slideAnim = useState(new Animated.Value(-250))[0]; // Sidebar sliding animation

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

  // Options for themes and languages
  const themes = ['Light', 'Dark', 'Blue'];
  const languages = ['English', 'Spanish', 'French'];

  // Render theme and language options
  const renderOption = (item, type) => (
    <TouchableOpacity
      style={styles.optionContainer}
      onPress={() => {
        if (type === 'Theme') setSelectedTheme(item);
        else setSelectedLanguage(item);
      }}
    >
      <Text style={styles.optionText}>{item}</Text>
      {type === 'Theme' && selectedTheme === item && (
        <Ionicons name="checkmark-circle" size={24} color="green" />
      )}
      {type === 'Language' && selectedLanguage === item && (
        <Ionicons name="checkmark-circle" size={24} color="green" />
      )}
    </TouchableOpacity>
  );

  // Toggle sections
  const toggleSection = (section) => {
    switch (section) {
      case 'Notifications':
        setNotificationsExpanded(!isNotificationsExpanded);
        break;
      case 'Privacy':
        setPrivacyExpanded(!isPrivacyExpanded);
        break;
      case 'Account':
        setAccountExpanded(!isAccountExpanded);
        break;
      default:
        break;
    }
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
        <TouchableOpacity onPress={toggleSidebar}>
          <Ionicons name="menu-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Settings Content */}
      <ScrollView contentContainerStyle={styles.settingsContainer}>
        <Text style={styles.sectionTitle}>Select Theme:</Text>
        <FlatList
          data={themes}
          renderItem={({ item }) => renderOption(item, 'Theme')}
          keyExtractor={(item) => item}
        />

        <Text style={styles.sectionTitle}>Select Language:</Text>
        <FlatList
          data={languages}
          renderItem={({ item }) => renderOption(item, 'Language')}
          keyExtractor={(item) => item}
        />

        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('Notifications')}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <Ionicons name={isNotificationsExpanded ? "chevron-up" : "chevron-down"} size={24} color="black" />
        </TouchableOpacity>
        {isNotificationsExpanded && (
          <View style={styles.dropdownContainer}>
            <TouchableOpacity style={styles.optionContainer}>
              <Text style={styles.optionText}>Email Notifications</Text>
              <Ionicons name="notifications-outline" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionContainer}>
              <Text style={styles.optionText}>Push Notifications</Text>
              <Ionicons name="notifications-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('Privacy')}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <Ionicons name={isPrivacyExpanded ? "chevron-up" : "chevron-down"} size={24} color="black" />
        </TouchableOpacity>
        {isPrivacyExpanded && (
          <View style={styles.dropdownContainer}>
            <TouchableOpacity style={styles.optionContainer}>
              <Text style={styles.optionText}>Account Privacy</Text>
              <Ionicons name="lock-closed-outline" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionContainer}>
              <Text style={styles.optionText}>Data Protection</Text>
              <Ionicons name="shield-checkmark-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('Account')}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Ionicons name={isAccountExpanded ? "chevron-up" : "chevron-down"} size={24} color="black" />
        </TouchableOpacity>
        {isAccountExpanded && (
          <View style={styles.dropdownContainer}>
            <TouchableOpacity style={styles.optionContainer}>
              <Text style={styles.optionText}>Manage Account</Text>
              <Ionicons name="person-outline" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionContainer}>
              <Text style={styles.optionText}>Security Settings</Text>
              <Ionicons name="shield-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  settingsContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dropdownContainer: {
    paddingVertical: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
  },
  optionText: {
    fontSize: 16,
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

export default SettingsScreen;
