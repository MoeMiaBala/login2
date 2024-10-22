import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, SafeAreaView, Alert, Modal, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { fetchJobData, applyForJob, fetchUserApplications, fetchUserData } from '../utils/dbActions';
import { auth } from '../../firebaseConfig';

const JobPostsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [bookmarkedJobs, setBookmarkedJobs] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  //const [hasApplied, setHasApplied] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [userData, setUserData] = useState(null);
  const user = auth.currentUser;
  
  useEffect(() => {
    const loadJobData = async () => {
      try {
        setLoading(true);
        const jobsList = await fetchJobData();
        setJobs(jobsList);
        checkIfApplied();
      } catch (error) {
        Alert.alert('Error', error.message); // Handle error here
      }
    };

    loadJobData();
    setLoading(false);
  }, []);

  const checkIfApplied = async () => {
    const applications = await fetchUserApplications(user.uid);
    const appliedJobIds = applications.map(application => application.jobId); // Map job IDs
    setAppliedJobs(appliedJobIds);

  };

  const openJobModal = async (job) => {
    //console.log(job.employerId);
    try {
      const jobData = await fetchJobData(); // Fetch job details
      const userData = await fetchUserData(job.employerId); // Fetch user details who posted the job   
      const filteredJobData = jobData.find(data => data.id === job.id);
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

  const renderJobModal = () => {
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
                <View style={styles.detailModalRow}>
                  <Ionicons name="business-outline" size={16} color="#3F6CDF" style={styles.iconDetail} />
                  <Text style={styles.detailKey}>Company:</Text>
                  <Text style={styles.detailValue}>{jobDetails.company}</Text>
                </View>
  
                <View style={styles.detailModalRow}>
                  <Ionicons name="location-outline" size={16} color="#3F6CDF" />
                  <Text style={styles.detailKey}>Location:</Text>
                  <Text style={styles.detailValue}>{jobDetails.location}</Text>
                </View>
  
                <View style={styles.detailModalRow}>
                  <Ionicons name="document-outline" size={16} color="#3F6CDF" style={styles.iconDetail} />
                  <Text style={styles.detailKey}>Job Title:</Text>
                  <Text style={styles.detailValue}>{jobDetails.title}</Text>
                </View>
  
                <View style={styles.detailModalRow}>
                  <Ionicons name="cash-outline" size={16} color="#3F6CDF" style={styles.iconDetail} />
                  <Text style={styles.detailKey}>Salary:</Text>
                  <Text style={styles.detailValue}>{jobDetails.salary}</Text>
                </View>
  
                <View style={styles.detailModalRow}>
                  <Ionicons name="time-outline" size={16} color="#3F6CDF" style={styles.iconDetail} />
                  <Text style={styles.detailKey}>Job Type:</Text>
                  <Text style={styles.detailValue}>{jobDetails.type}</Text>
                </View>
  
                <View style={styles.detailModalRow}>
                  <Ionicons name="person-outline" size={16} color="#3F6CDF" />
                  <Text style={styles.detailKey}>Posted By:</Text>
                  <Text style={styles.detailValue}>{userData.name}</Text>
                </View>
  
                <View style={styles.detailModalRow}>
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

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //console.log(jobs[0]);

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
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.topIcons}>
          <Text style={styles.headerText}>Job Posts</Text>
        </View>
        <View style={styles.searchContainer}>
          <Ionicons name='search' size={24} color='#171716' />
          <TextInput
            placeholder='Search jobs...'
            placeholderTextColor={'#171718'}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Job Listings */}
      <FlatList
        data={filteredJobs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const hasApplied = appliedJobs.includes(item.id); // Check if user has applied for this job

          return (
            <View style={styles.jobCard}>
              {/* Top section: Date posted and bookmark */}
              <View style={styles.topRow}>
                <Text style={styles.posted}>{item.posted}</Text>
                <TouchableOpacity onPress={() => toggleBookmark(item.id)}>
                  <Ionicons
                    name={bookmarkedJobs[item.id] ? 'bookmark' : 'bookmark-outline'}
                    size={24}
                    color={bookmarkedJobs[item.id] ? 'blue' : 'black'}
                  />
                </TouchableOpacity>
              </View>

              {/* Job details */}
              <View style={styles.jobInfo}>
                <Image source={item.image} style={styles.companyLogo} />
                <View style={styles.jobDetails}>
                  <Text style={styles.jobTitle}>{item.title}</Text>
                  <Text style={styles.companyName}>{item.company}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <MaterialIcons name="work-outline" size={16} color="#888" />
                <Text style={styles.jobType}>{item.type}</Text>
                <MaterialIcons name="attach-money" size={16} color="#888" />
                <Text style={styles.salary}>{item.salary}</Text>
                <MaterialIcons name="location-on" size={16} color="#888" />
                <Text style={styles.location}>{item.location}</Text>
                <MaterialIcons name="schedule" size={16} color="#888" />
                <Text style={styles.contract}>{item.contract}</Text>
              </View>

              {/* Job description */}
              <Text style={styles.description}>{item.description}</Text>

              {/* Tags */}
              <View style={styles.tagContainer}>
                {item.tags.slice(0, 5).map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
                {item.tags.length > 5 && <Text style={styles.ellipsis}>...</Text>}
              </View>

              {/* Action buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.viewButton} onPress={() => openJobModal(item)}>
                  <Text style={styles.buttonText}>View Details</Text>
                </TouchableOpacity>

                {/* Apply Button - disabled if user has already applied */}
                <TouchableOpacity
                  onPress={() => {
                    if (!hasApplied) {
                      // Optimistically update the appliedJobs state to reflect the UI immediately
                      setAppliedJobs((prev) => [...prev, item.id]);

                      // Call the applyForJob function and handle errors if necessary
                      applyForJob(user.uid, item.id)
                        .then(() => {
                          // Optionally: Handle success response if needed
                          console.log('Successfully applied for the job');
                        })
                        .catch((error) => {
                          console.error('Failed to apply for the job:', error);

                          // Revert the optimistic update if there was an error
                          setAppliedJobs((prev) => prev.filter((jobId) => jobId !== item.id));
                        });
                    }
                  }}
                  style={[styles.applyButton, hasApplied && styles.disabledButton]} // Conditional styling for disabled button
                  disabled={hasApplied} // Disable button if already applied
                >
                  <Text style={styles.buttonText}>
                    {hasApplied ? 'Already Applied' : 'Apply'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        contentContainerStyle={styles.listContent}
      />

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
        <TouchableOpacity onPress={() => navigation.navigate('applicantJobSearch')}>
          <Ionicons name='home-outline' size={28} color='#999' />
          <Text style={{ color: '#999' }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Posts')}>
          <Ionicons name='briefcase-outline' size={28} color='#3F6CDF' />
          <Text style={{ color: '#3F6CDF' }}>Jobs</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#3F6CDF',
    padding: 16,
    justifyContent: 'center',
  },
  topIcons: {
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center'
  },
  searchContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
  },
  jobCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 9,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  posted: {
    fontSize: 12,
    color: '#888',
  },
  jobInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  jobDetails: {
    marginLeft: 12,
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  companyName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#888',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  jobType: {
    marginLeft: 4,
    marginRight: 8,
    color: '#888',
  },
  salary: {
    marginLeft: 4,
    marginRight: 8,
    color: '#888',
  },
  location: {
    marginLeft: 4,
    marginRight: 8,
    color: '#888',
  },
  contract: {
    marginLeft: 4,
    color: '#888',
  },
  description: {
    fontSize: 14,
    color: '#888',
    marginVertical: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#3F6CDF',
  },
  applyButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#28a745',
  },
  disabledButton: {
    backgroundColor: '#D3D3D3', // Grey out the button when disabled
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8, // Adjust spacing as needed
  },
  tag: {
    backgroundColor: '#D5D5D5', // Light grey background
    borderRadius: 5,
    padding: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    color: 'black', // Text color
    fontWeight: '600'
  },
  ellipsis: {
    color: '#888', // Color for the ellipsis
    marginLeft: 5,
  },
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
  detailModalRow: {
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

export default JobPostsScreen;
