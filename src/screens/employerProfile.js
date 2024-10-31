import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Modal, ScrollView, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import Swiper from 'react-native-swiper';
import { fetchUserdata, fetchTags, saveTags, fetchUserTags, fetchUserApplications, fetchScheduleEvents, fetchAllSchedules } from '../utils/dbActions';
import { auth } from '../../firebaseConfig';

const EmployerProfileScreen = ({ navigation, route }) => {
  const { uid } = route.params; // Get the UID passed from Login
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [jobApplications, setJobApplications] = useState([]);
  const [image, setImage] = useState(null);
  const [week, setWeek] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduleEvents, setScheduleEvents] = useState([]);

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
      setImage(userD.image);

      const applications = await fetchUserApplications(uid);
      setJobApplications(applications);
      //fetchScheduleEvents(uid, selectedDate, setScheduleEvents);
      fetchAllSchedules(user.uid, setScheduleEvents, getCurrentWeekDates);
      
    };
  
    fetchData();
  }, []);

  //console.log(scheduleEvents);
  const renderSchedule = () => (
    <FlatList
      data={scheduleEvents}
      renderItem={({ item, index }) => (
        <View style={styles.scheduleItem}>
          <Image source={item.image || {uri : ''}} style={styles.profileImage2} />
          <View style={styles.scheduleDetails}>
            <Text style={styles.scheduleText}>{item.name}</Text>
            <Text style={styles.jobText}>{item.JobName}</Text>
            <Text style={styles.timeText}>{item.time}</Text>
            <Text style={styles.timeText}>{item.date}</Text>
          </View>
          <TouchableOpacity onPress={() => {/* Add Contact Navigation */}}>
            <Ionicons name="call-outline" size={20} color="#3F6CDF" />
          </TouchableOpacity>
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
  
  const getCurrentWeekDates = () => {
    const startOfWeek = moment().startOf('isoWeek');
    return Array.from({ length: 7 }, (_, i) => startOfWeek.clone().add(i, 'days').format('ddd MMM DD YYYY'));
  };
  

  const renderJobApplications = () => {
    // Use a Set to filter out unique job applications based on their ID
    const uniqueApplications = Array.from(new Set(jobApplications.map(app => app.id)))
      .map(id => jobApplications.find(app => app.id === id)); // Get unique application objects
    
    return uniqueApplications.length > 0 ? (
      <FlatList
        data={uniqueApplications}
        renderItem={({ item }) => {
          const jobStyle = getJobStatusStyle(item.status); // Get style based on status
          return (
            <View style={[styles.jobApplicationContainer, { backgroundColor: jobStyle.backgroundColor }]}>
              <Text style={[styles.jobTitle, { color: jobStyle.color }]}>{item.jobTitle}</Text>
              <Text style={[styles.jobStatus, { color: jobStyle.color }]}>{item.status}</Text>
            </View>
          );
        }}
        keyExtractor={(item) => `${item.id}-${item.status}`} // Ensure a unique key
      />
    ) : (
      <Text style={styles.noApplicationsText}>No applications found.</Text>
    );
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
      case 'Rejected':
        return { backgroundColor: '#ffebee', color: '#d32f2f' };
      default:
        return { backgroundColor: '#f4f4f4', color: 'gray' };
    }
  };

  const renderJobStatus = ({ item }) => {
    const jobStyle = getJobStatusStyle(item.status);
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.jobStatusContainer, { backgroundColor: jobStyle.backgroundColor }]}>
          <Text style={[styles.jobTitle, { color: jobStyle.color }]}>{item.jobTitle}</Text>
          <Text style={[styles.jobStatus, { color: jobStyle.color }]}>{item.status}</Text>
        </View>
      </ScrollView>      
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Top Icons */}
      <View style={styles.topIcons}>
        
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
         <Image 
          style={styles.profileImage}
          source={image ? { uri: image } : { uri : 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg' }}
        />
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
        <TouchableOpacity onPress={() => navigation.navigate('EditProfileScreen', { uid })}>
          <Ionicons name="create-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      
      {/* Schedule Section */}
      <Text style={{fontSize: 18}}>My Schedule</Text>
      {renderSchedule()}
      
      {/* Navigation Area */}
      <View style={{
        height: 70,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ddd',
        elevation: 0,
        marginTop: 'auto',
        
      }}>
        <TouchableOpacity onPress={() => navigation.navigate('EmployerDashboard', {uid: auth.currentUser.uid})}>
          <Ionicons name='home-outline' size={28} color='#999' />
          <Text style={{ color: '#999' }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity>
            <Ionicons name="chatbubble-outline" size={28} color="#999" />
            <Text style={{ color: '#999' }}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile', {uid: user.uid})}>
          <Ionicons name='person-outline' size={28} color='#3F6CDF' />
          <Text style={{ color: '#3F6CDF' }}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Settings', {uid: auth.currentUser.uid})}>
          <Ionicons name="settings-outline" size={28} color="#999" />
          <Text style={{ color: '#999' }}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    padding: 20,
    backgroundColor: "#fff"
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
  scheduleContainer: { paddingHorizontal: 16, paddingVertical: 20, flex: 1 },
  scheduleTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  dayContainer: { alignItems: 'center', margin: 10, backgroundColor: '#000' },
  dayText: { fontSize: 16, color: '#333' },
  dateText: { fontSize: 14, color: '#888' },
  selectedDate: { fontSize: 16, fontWeight: 'bold', marginVertical: 10 },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#e6f2ff',
    marginBottom: 10,
    elevation: 1,
  },
  profileImage2: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  scheduleDetails: { flex: 1, marginLeft: 10 },
  scheduleText: { fontSize: 16, fontWeight: '600', color: '#333' },
  jobText: { fontSize: 14, color: '#888' },
  timeText: { fontSize: 14, color: '#3F6CDF' },
});

export default EmployerProfileScreen;
