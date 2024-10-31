import React ,{ useState, useEffect} from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchUserTags, fetchRecentListings, fetchRecommendations, fetchUserdata, fetchJobData,  fetchUserData, applyForJob, fetchUserApplications } from '../utils/dbActions';
import { auth } from '../../firebaseConfig';

const JobSearchingNav = ({ route, navigation }) => {
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [userTags, setUserTags] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [bookmarkedJobs, setBookmarkedJobs] = useState({});
  const [jobDetails, setJobDetails] = useState(null);
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [ loading, setLoading ] = useState(true);
  const user = auth.currentUser

  useEffect(() => {
    const fetchData = async () => {
      const tags = await fetchUserTags(user); // Fetch user tags
      setUserTags(tags); // Set user tags
      const username = await fetchUserdata(user);
      setName(username.name);
      setImage(username.image);
      setLoading(false);    

      //console.log(image);
      if (tags.length > 0) {
        await fetchRecommendations(tags, setRecommendedJobs); // Pass userTags and setter
        await fetchRecentListings(tags, setRecentJobs); // Pass userTags and setter
        
      }
    };
  
    fetchData();
  }, []);

  const openJobModal = async (job) => {
    try {
      const jobData = await fetchJobData(); // Fetch job details
      const userData = await fetchUserData(job.employerId); // Fetch user details who posted the job
      const filteredJobData = jobData.find(data => data.id === job.id);
      const checkIfApplied = async () => {
        const applications = await fetchUserApplications(user.uid);
        const appliedJobIds = applications.map(application => application.jobId); // Map job IDs
        setAppliedJobs(appliedJobIds);
      };
      //console.log(appliedJobs);
      checkIfApplied();
      if (filteredJobData) {
        setJobDetails(filteredJobData); // Set the details if the job exists
      } else {
        console.error("Job not found with the provided ID.");
      }
      //console.log("dob detailes =",jobDetails);
      setUserData(userData);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching job or user data:', error);
    }
  };

  const closeJobModal = () => {
    setModalVisible(false);
  };

  const filteredJobs = recentJobs.filter(job =>
    job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApplyForJob = (job) => {
    applyForJob(user.uid, job);
    setModalVisible(false); // Optionally close the modal after applying
  };

  const renderJobCard = (job) => (
    <View key={job.id}  style={{
      backgroundColor: "#e6f2ff",
      padding: 16,
      borderRadius: 15,
      width: 300,
      marginRight: 16,
      elevation: 3,
      marginBottom: 16, // Added margin at the bottom
      minHeight: 115, 
      maxHeight: 165,
      overflow: 'hidden',
      borderWidth: 0.5, borderColor : '#007aff'
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: image }} style={{ width: 50, height: 50, borderRadius: 50 }} />
          <View style={{ marginLeft: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#171716' }}>{job.companyName}</Text>
            <Text style={{ fontSize: 12, color: '#999' }}>{job.location}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => toggleBookmark(job.id)} style={{ padding: 10}}>
                  <Ionicons
                    name={bookmarkedJobs[job.id] ? 'bookmark' : 'bookmark-outline'}
                    size={24}
                    color={bookmarkedJobs[job.id] ? '#3F6CDF' : 'black'}
                  />
        </TouchableOpacity>
      </View>
  
      <Text style={{ marginTop: 1, fontSize: 18, fontWeight: '600', color: '#171716' }}>{job.jobTitle}</Text>
      <Text style={{ fontSize: 12, color: '#999', marginBottom: 40 }}>{job.jobType}</Text>
  
      
    </View>
  );

  const renderJobModal = () => {
    //const hasApplied = appliedJobs.includes(jobDetails.id); // Check if the user has applied for this job
    const hasApplied = jobDetails ? appliedJobs.includes(jobDetails.id) : false
    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={closeJobModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.headerContainer}>
              <Ionicons name="briefcase-outline" size={28} color="#3F6CDF" style={styles.icon} />
              <Text style={styles.modalTitle}>Job Details</Text>
            </View>
  
            {jobDetails && userData ? (
              <View>
                <View style={styles.detailRow}>
                  <Ionicons name="business-outline" size={16} color="#3F6CDF" style={styles.iconDetail} />
                  <Text style={styles.detailKey}>Company:</Text>
                  <Text style={styles.detailValue}>{jobDetails.company}</Text>
                </View>
  
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={16} color="#3F6CDF" />
                  <Text style={styles.detailKey}>Location:</Text>
                  <Text style={styles.detailValue}>{jobDetails.location}</Text>
                </View>
  
                <View style={styles.detailRow}>
                  <Ionicons name="document-outline" size={16} color="#3F6CDF" style={styles.iconDetail} />
                  <Text style={styles.detailKey}>Job Title:</Text>
                  <Text style={styles.detailValue}>{jobDetails.title}</Text>
                </View>
  
                <View style={styles.detailRow}>
                  <Ionicons name="cash-outline" size={16} color="#3F6CDF" style={styles.iconDetail} />
                  <Text style={styles.detailKey}>Salary:</Text>
                  <Text style={styles.detailValue}>{jobDetails.salary}</Text>
                </View>
  
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color="#3F6CDF" style={styles.iconDetail} />
                  <Text style={styles.detailKey}>Job Type:</Text>
                  <Text style={styles.detailValue}>{jobDetails.type}</Text>
                </View>
  
                <View style={styles.detailRow}>
                  <Ionicons name="person-outline" size={16} color="#3F6CDF" />
                  <Text style={styles.detailKey}>Posted By:</Text>
                  <Text style={styles.detailValue}>{userData.name}</Text>
                </View>
  
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color="#3F6CDF" />
                  <Text style={styles.detailKey}>Posted On:</Text>
                  <Text style={styles.detailValue}>{jobDetails.posted}</Text>
                </View>
  
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={closeJobModal} style={styles.closeButton}>
                    <Ionicons name="close-outline" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => handleApplyForJob(jobDetails.id)} // Pass correct job ID
                    style={[styles.applyButton, hasApplied && styles.disabledButton]} 
                    disabled={hasApplied} // Disable if already applied
                  >
                    <Ionicons name="checkmark-outline" size={20} color="#fff" />
                    <Text style={styles.buttonText}>
                      {hasApplied ? 'Already Applied' : 'Apply'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text>Loading job details...</Text>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  const renderJobList = (job) => (
    <TouchableOpacity onPress={() => openJobModal(job)} key={job.id} style={{
      backgroundColor: '#e6f2ff',
      padding: 16,
      borderRadius: 9,
      marginBottom: 16,
      elevation: 2, borderWidth: 0.5, borderColor : '#007aff'
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: image }} style={{ width: 50, height: 50, borderRadius: 50 }} />
          <View style={{ marginLeft: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#171716' }}>{job.jobTitle}</Text>
            <Text style={{ fontSize: 12, color: '#999' }}>{job.jobType}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => toggleBookmark(job.id)} style={{ padding: 10}}>
                  <Ionicons
                    name={bookmarkedJobs[job.id] ? 'bookmark' : 'bookmark-outline'}
                    size={24}
                    color={bookmarkedJobs[job.id] ? '#3F6CDF' : 'black'}
                  />
        </TouchableOpacity>
      </View>
  
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
      }}>
        <Text style={{ fontSize: 14, color: '#999' }}>{job.companyName}</Text>
        <Text style={{ fontSize: 14, color: '#171716', fontWeight: '600' }}>{job.salary}</Text>
      </View>
    </TouchableOpacity>
  );

  const toggleBookmark = (jobId) => {
    setBookmarkedJobs((prevBookmarks) => ({
      ...prevBookmarks,
      [jobId]: !prevBookmarks[jobId],
    }));
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={{ padding: 100}}/>; // Show loading indicator while fetching
  }

  return (
    <View style={{ flex: 1, marginTop: 6, backgroundColor: '#F5F6FA' }}>
      
      {/* Header Section */}
      <View style={{
        flex: 0.2,
        backgroundColor: '#3F6CDF',
        paddingHorizontal: 20,
        paddingTop: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
      }}>
        {/* Greeting & Notification Icon */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <View>
            <Text style={{
              color: '#fff',
              fontSize: 18,
              fontWeight: '400',
            }}>Hello,</Text>
            <Text style={{
              color: '#fff',
              fontSize: 28,
              fontWeight: '700',
            }}>{name}</Text>
          </View>
          <Ionicons name='notifications-outline' size={28} color='#fff' />
        </View>

        {/* Search Bar */}
        <View style={{
          backgroundColor: '#fff',
          padding: 14,
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          position: 'absolute',
          bottom: -20,
          width: '90%',
          alignSelf: 'center',
          elevation: 5,
        }}>
          <Ionicons name='search' size={24} color='#171716' />
          <TextInput
            placeholder='Search job, company...'
            placeholderTextColor={'#999'}
            style={{
              marginLeft: 10,
              flex: 1,
              fontSize: 16,
              color: '#333',
            }}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Body Section */}
      <View style={{ flex: 0.8, paddingHorizontal: 20, paddingTop: 40 }}>
        {/* Recommendations Section */}
        <Text style={{
          marginVertical: 16,
          fontSize: 24,
          fontWeight: '700',
          color: '#3F6CDF'
        }}>Recommended Jobs</Text>
        
        {/* Horizontal Scroll View for Recommendations */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recommendedJobs.length > 0 ? recommendedJobs.map(renderJobCard) : <Text>No Recommendations</Text>}
        </ScrollView>

        {/* Recent Job Listings Section */}
        <Text style={{
          marginVertical: 16,
          fontSize: 24,
          fontWeight: '700',
          color: '#3F6CDF'
        }}>Recent Listings</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredJobs.length > 0 ? filteredJobs.map(renderJobList) : <Text>No Recent Listings</Text>}
        </ScrollView>
      </View>

      {/* Navigation Area */}
      <View style={{
        height: 70,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ddd',
        elevation: 5,
      }}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name='home-outline' size={28} color='#3F6CDF' />
          <Text style={{ color: '#3F6CDF' }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Posts')}>
          <Ionicons name='briefcase-outline' size={28} color='#999' />
          <Text style={{ color: '#999' }}>Jobs</Text>
        </TouchableOpacity>
        <TouchableOpacity>
            <Ionicons name="chatbubble-outline" size={28} color="#999" />
            <Text style={{ color: '#999' }}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile', {uid: user.uid})}>
          <Ionicons name='person-outline' size={28} color='#999' />
          <Text style={{ color: '#999' }}>Profile</Text>
        </TouchableOpacity>
      </View>

      {renderJobModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '85%',
    alignItems: 'center',
    elevation: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3F6CDF',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
  },
  detailKey: {
    fontSize: 16,
    fontWeight: '600',
    color: '#171716',
    width: '40%',
    paddingLeft: 6,
    marginRight: 8,
  },
  detailValue: {
    fontSize: 16,
    color: '#666',
    width: '60%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  closeButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButton: {
    backgroundColor: '#4CD964',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#D3D3D3', // Grey out the button when disabled
    marginLeft: 12
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
});

export default JobSearchingNav
