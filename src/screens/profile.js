import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchUserdata, fetchTags, saveTags, fetchUserTags, fetchUserApplications } from '../utils/dbActions';
import { auth } from '../../firebaseConfig';

const ProfileScreen = ({ navigation, route }) => {
  const { uid } = route.params; // Get the UID passed from Login
  const [userData, setUserData] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [jobApplications, setJobApplications] = useState([]);
  const user = auth.currentUser;

  const userInfo = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    profileImage: 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg',
  };

  useEffect(() => {
    const fetchData = async () => {
      const userD = await fetchUserdata(user);
      setUserData(userD);
      const fetchedTags = await fetchTags(); // Fetch tags from DB
      //console.log(fetchedTags[0])
      const tagsArray = fetchedTags[0].split(',').map(tag => tag.trim()); // Assuming the tags are stored as a comma-separated string
      setTags(tagsArray);
      //console.log("tags array", tagsArray);
      const useTag = await fetchUserTags(user);
      setSelectedTags(useTag);

      const applications = await fetchUserApplications(uid);
      setJobApplications(applications);
    };
  
    fetchData();
  }, []);

  //const tags = ['hello','there'];

  const toggleTag = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
    );
  };

  const renderSelectedTags = () => {
    const displayedTags = selectedTags.slice(0, 5);
    return (
      <View style={styles.selectedTagsContainer}>
        {displayedTags.map((tag, index) => (
          <View key={index} style={styles.tagContainer}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
        {selectedTags.length > 5 && (
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.tagContainer}>
            <Text style={styles.tagText}>...</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderTagModal = () => {
    // Ensure unique tags
    const uniqueTags = [...new Set(tags)];
  
    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Tags</Text>
            <FlatList
              data={uniqueTags}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => toggleTag(item)} style={styles.tagItem}>
                  <Text style={styles.modalTagText}>{item}</Text>
                  {selectedTags.includes(item) && (
                    <Ionicons name="checkmark-circle" size={20} color="green" />
                  )}
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => item + index} // Ensure a unique key
            />
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => saveTags(uid, selectedTags)} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderJobApplications = () => {
    return jobApplications.length > 0 ? (
      <FlatList
        data={jobApplications}
        renderItem={({ item }) => (
          <View style={styles.jobApplicationContainer}>
            <Text style={styles.jobTitle}>{item.jobTitle}</Text>
            <Text style={styles.jobStatus}>{item.status}</Text>
          </View>
        )}
        keyExtractor={(item) => item.jobId} // Use a unique identifier for each job
      />
    ) : (
      <Text style={styles.noApplicationsText}>No applications found.</Text>
    );
  };
  
  
  const jobStatus = [
    { jobTitle: 'Frontend Developer', status: 'Applied' },
    { jobTitle: 'UI Designer', status: 'In Review' },
    { jobTitle: 'Backend Developer', status: 'Interview Scheduled' },
    { jobTitle: 'Data Scientist', status: 'Rejected' }
  ];

  // Color coding job status
  const getJobStatusStyle = (status) => {
    switch (status) {
      case 'Applied':
        return { backgroundColor: '#e0f7fa', color: '#00796b' };
      case 'In Review':
        return { backgroundColor: '#fff8e1', color: '#ffb300' };
      case 'Interview Scheduled':
        return { backgroundColor: '#e8f5e9', color: '#388e3c' };
      case 'Rejected':
        return { backgroundColor: '#ffebee', color: '#d32f2f' };
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

      {/* Top Icons */}
      <View style={styles.topIcons}>
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
        {renderSelectedTags()}
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

      {renderTagModal()}
      
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    padding: 20
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
    marginBottom: 8
  },
  tagText: {
    color: 'white',
  },
  modalTagText: {
    color: "#000",
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
  tagsSection: {
    marginVertical: 20,
  },
  selectedTagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    height: '50%'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tagItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#00796b',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: 'blue', // Customize your button color
    padding: 10,
    borderRadius: 5,
    marginLeft: 10
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
