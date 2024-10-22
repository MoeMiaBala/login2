import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Modal,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchUserdata, fetchJobData, fetchTags, handleUpdateJobStatus, fetchUserApplications } from '../utils/dbActions';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig'; // Adjust path as needed


const EmployerDashboard = ({ navigation, route }) => {
  const { uid } = route.params; // Get the user UID passed from login
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(''); // For greeting
  const [totalApplicants, setTotalApplicants] = useState(0); // For total applicants
  const [jobPosts, setJobPosts] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [applicantsData, setApplicantsData] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch employer (user) data
        const userData = await fetchUserdata({ uid });
        if (userData) {
          setUserName(userData.name); // Set employer name for greeting
        }

        // Fetch jobs posted by the current employer
        const jobsSnapshot = await getDocs(
          query(collection(db, 'jobs'), where('employerId', '==', uid))
        );

        let total = 0;
        const jobsList = jobsSnapshot.docs.map((doc) => {
          const job = doc.data();
          total += job.applicants || 0; // Accumulate total applicants
          return {
            id: doc.id,
            title: job.jobTitle,
            applicants: job.applicants || 0,
            status: job.status || 'Active', 
            applicantlist: job.applicantsList || []// Default to 'Active' if no status
          };
        });

        setJobPosts(jobsList); // Set job posts for rendering
        setTotalApplicants(total); // Set total applicants
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      setLoading(false);
    };

    fetchData();
  }, [uid]);

  const filteredJobPosts = jobPosts.filter((post) => {
    //console.log(post);
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || post.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const toggleModal = (job) => {
    setSelectedJob(job);
    if (job) {
      fetchApplicantsData(job.applicantlist, job.id); // Fetch applicants' data when a job is selected
    }
    setModalVisible(!isModalVisible);
  };

  const fetchApplicantsData = async (applicantUids, jobId) => {
    const applicantsList = [];
    for (const uid of applicantUids) {
      const userData = await fetchUserdata({ uid });
      if (userData) {
        const userApplications = await fetchUserApplications(uid);     
        const jobApplication = userApplications.find(app => app.jobId === jobId);
        applicantsList.push({
          id: uid, // Use UID as the key
          name: userData.name,
          image: userData.image || 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg', // Assuming you have an image field in the user data
          status: jobApplication.status || 'Applied', // Replace with the appropriate status
          jobId: jobApplication.jobId
        });
      }
    }
    setApplicantsData(applicantsList); // Store fetched applicants' data in state
  };

  const renderJobPost = ({ item }) => (
    <View style={[styles.jobCard, item.status === 'Active' ? styles.active : styles.closed]}>
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => toggleModal(item)}>
          <Ionicons name="information-circle-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.jobDetails}>Applicants: {item.applicants}</Text>
      <Text style={styles.jobDetails}>Status: {item.status}</Text>
    </View>
  );

  const renderModal = () => (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => toggleModal(null)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={() => toggleModal(null)}>
            <Ionicons name="close-outline" size={24} color="black" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>{selectedJob?.title} - Applicants</Text>

          <FlatList
            data={applicantsData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const statusStyle = getJobStatusStyle(item.status);
              return (
                <TouchableOpacity onPress={() => navigation.navigate('ApplicantProfile',{ uid: item.id, jobId: item.jobId})}>
                  <View  style={[styles.applicantCard, statusStyle]}>
                    <Image source={{ uri: item.image }} style={styles.applicantImage} />
                    <View style={styles.applicantInfo}>
                      <Text style={styles.applicantName}>{item.name}</Text>
                      <Text style={[styles.applicantStatus, { color: statusStyle.color }]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                
              );
            }}
          />

          <View style={styles.modalHeaderContainer}>
        
            {/* Touchable Badge with Icon */}
            <TouchableOpacity style={styles.infoButton} onPress={() => console.log("More Info Pressed")}>
              <Ionicons name="information-circle-outline" size={18} color="#fff" style={styles.infoIcon} />
              <Text style={styles.statusBadge}>Detailed view</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.updateButton} onPress={() => handleUpdateJobStatus(selectedJob.id, setJobPosts, toggleModal, jobPosts)}>
              <Ionicons name="document-lock-outline" size={18} color="#fff" style={styles.infoIcon} />
              <Text style={styles.statusBadge}>Close job status</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </View>
    </Modal>
  );

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Greeting */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>Hello, {userName}</Text>
      </View>

      {/* Dashboard Overview */}
      <View style={styles.overview}>
        <Text style={styles.overviewTitle}>Dashboard Overview</Text>
        <View style={styles.metrics}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{jobPosts.length}</Text>
            <Text style={styles.metricLabel}>Jobs Posted</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{totalApplicants}</Text>
            <Text style={styles.metricLabel}>Total Applicants</Text>
          </View>
        </View>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search jobs..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchIcon}>
          <Ionicons name="search-outline" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={[styles.filterButton, selectedStatus === 'All' && styles.selectedFilter]}
            onPress={() => setSelectedStatus('All')}
          >
            <Text style={styles.filterText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedStatus === 'Active' && styles.selectedFilter]}
            onPress={() => setSelectedStatus('Active')}
          >
            <Text style={styles.filterText}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedStatus === 'Closed' && styles.selectedFilter]}
            onPress={() => setSelectedStatus('Closed')}
          >
            <Text style={styles.filterText}>Closed</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Post a Job Button */}
      <TouchableOpacity style={styles.postJobButton} onPress={() => navigation.navigate('JobForm')}>
        <Text style={styles.postJobButtonText}>Post a Job</Text>
      </TouchableOpacity>

      {renderModal()}

      {/* Job Posts */}
      {loading ? (
        <ActivityIndicator size="large" color="#3F6CDF" />
      ) : (
        <ScrollView contentContainerStyle={styles.jobPostsContainer}>
          <FlatList
            data={filteredJobPosts}
            renderItem={renderJobPost}
            keyExtractor={(item) => item.id}
          />
        </ScrollView>
      )}

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('EmployerDashboard', {uid: auth.currentUser.uid})}>
          <Ionicons name="home-outline" size={28} color="#3F6CDF" />
          <Text style={{ color: '#3F6CDF' }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity>
            <Ionicons name="chatbubble-outline" size={28} color="#999" />
            <Text style={{ color: '#999' }}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Profile', {uid: auth.currentUser.uid})}>
          <Ionicons name="person-outline" size={28} color="#999" />
          <Text style={{ color: '#999' }}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Settings', {uid: auth.currentUser.uid})}>
          <Ionicons name="settings-outline" size={28} color="#999" />
          <Text style={{ color: '#999' }}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  topIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingContainer: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconButton: {
    padding: 8,
  },
  overview: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metricCard: {
    backgroundColor: '#f4f4f4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '600',
  },
  metricLabel: {
    fontSize: 14,
    color: '#555',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  searchIcon: {
    padding: 8,
  },
  filtersContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  filterButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  selectedFilter: {
    backgroundColor: '#3F6CDF',
  },
  filterText: {
    color: '#000',
  },
  postJobButton: {
    backgroundColor: '#3F6CDF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  postJobButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  jobPostsContainer: {
    flexGrow: 1,
  },
  jobCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  active: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  closed: {
    borderColor: '#F44336',
    borderWidth: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  jobDetails: {
    fontSize: 14,
    color: '#555',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  navButton: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  applicantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  applicantImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  applicantInfo: {
    flex: 1,
  },
  applicantName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  applicantStatus: {
    fontSize: 14,
  },
  updateButton: {
    backgroundColor: '#3F6CDF',
    flexDirection: 'row', // Align the icon and text side by side
    alignItems: 'center', // Vertically center align the text and icon
    backgroundColor: '#d32f2f', // Background color for the button
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20, // Rounded button
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  statusBadge: {
    color: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalHeaderContainer: {
    flexDirection: 'row', // Align badge and close button in the same row
    alignItems: 'center', // Vertically align items in the center
    justifyContent: 'space-between', // Add space between the badge and the close button
    padding: 1,
    backgroundColor: '#fff', // Optional background color for the container
  },
  infoButton: {
    flexDirection: 'row', // Align the icon and text side by side
    alignItems: 'center', // Vertically center align the text and icon
    backgroundColor: '#4CAF50', // Background color for the button
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20, // Rounded button
  },
});

export default EmployerDashboard;
