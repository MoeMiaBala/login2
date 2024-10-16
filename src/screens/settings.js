import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = ({ navigation }) => {
  const [selectedTheme, setSelectedTheme] = useState('Light');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isNotificationsExpanded, setNotificationsExpanded] = useState(false);
  const [isPrivacyExpanded, setPrivacyExpanded] = useState(false);
  const [isAccountExpanded, setAccountExpanded] = useState(false);
  const [isThemeExpanded, setThemeExpanded] = useState(false);
  const [isLanguageExpanded, setLanguageExpanded] = useState(false);

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
      {((type === 'Theme' && selectedTheme === item) || (type === 'Language' && selectedLanguage === item)) && (
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
      case 'Theme':
        setThemeExpanded(!isThemeExpanded);
        break;
      case 'Language':
        setLanguageExpanded(!isLanguageExpanded);
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.settingsContainer}>
        <Text style={styles.headerTitle}>Settings</Text>

        {/* Theme Section */}
        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('Theme')}>
          <Text style={styles.sectionTitle}>Select Theme</Text>
          <Ionicons name={isThemeExpanded ? "chevron-up" : "chevron-down"} size={24} color="black" />
        </TouchableOpacity>
        {isThemeExpanded && (
          <FlatList
            data={themes}
            renderItem={({ item }) => renderOption(item, 'Theme')}
            keyExtractor={(item) => item}
            style={styles.dropdownContainer}
          />
        )}

        {/* Language Section */}
        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('Language')}>
          <Text style={styles.sectionTitle}>Select Language</Text>
          <Ionicons name={isLanguageExpanded ? "chevron-up" : "chevron-down"} size={24} color="black" />
        </TouchableOpacity>
        {isLanguageExpanded && (
          <FlatList
            data={languages}
            renderItem={({ item }) => renderOption(item, 'Language')}
            keyExtractor={(item) => item}
            style={styles.dropdownContainer}
          />
        )}

        {/* Notifications Section */}
        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('Notifications')}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <Ionicons name={isNotificationsExpanded ? "chevron-up" : "chevron-down"} size={24} color="black" />
        </TouchableOpacity>
        {isNotificationsExpanded && (
          <View style={styles.dropdownContainer}>
            <TouchableOpacity style={styles.optionContainer}>
              <Text style={styles.optionText}>Email Notifications</Text>
              <Ionicons name="mail-outline" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionContainer}>
              <Text style={styles.optionText}>Push Notifications</Text>
              <Ionicons name="notifications-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}

        {/* Privacy Section */}
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

        {/* Account Section */}
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

      {/* Navigation Area */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navButton}>
          <Ionicons name='home-outline' size={28} color='#3F6CDF' />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Jobs')} style={styles.navButton}>
          <Ionicons name='briefcase-outline' size={28} color='#999' />
          <Text style={styles.navText}>Jobs</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.navButton}>
          <Ionicons name='person-outline' size={28} color='#999' />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#3F6CDF',
  },
  settingsContainer: {
    flexGrow: 1,
    paddingBottom: 80, // Space for navigation bar
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3F6CDF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginVertical: 5,
    elevation: 2,
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
    backgroundColor: '#ffffff',
    marginVertical: 5,
    elevation: 1,
  },
  optionText: {
    fontSize: 16,
    color: '#555',
  },
  navigationContainer: {
    height: 70,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    elevation: 5,
  },
  navButton: {
    alignItems: 'center',
  },
  navText: {
    color: '#3F6CDF',
    fontSize: 12,
  },
});

export default SettingsScreen;
