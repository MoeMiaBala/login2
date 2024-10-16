import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { fetchJobData, applyForJob, fetchUserApplications } from '../utils/dbActions';
import { auth } from '../../firebaseConfig';

const JobPostsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [bookmarkedJobs, setBookmarkedJobs] = useState({});
  const user = auth.currentUser;
  
  useEffect(() => {
    const loadJobData = async () => {
      try {
        const jobsList = await fetchJobData();
        setJobs(jobsList);
      } catch (error) {
        Alert.alert('Error', error.message); // Handle error here
      }
    };

    loadJobData();
  }, []);

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleBookmark = (jobId) => {
    setBookmarkedJobs((prevBookmarks) => ({
      ...prevBookmarks,
      [jobId]: !prevBookmarks[jobId],
    }));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.topIcons}>
          <TouchableOpacity>
            <Ionicons name="menu-outline" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Job Posts</Text>
          <TouchableOpacity>
            <Ionicons name="chatbubble-outline" size={24} color="white" />
          </TouchableOpacity>
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
        renderItem={({ item }) => (
          <View style={styles.jobCard}>
            {/* Top section: Date posted and bookmark */}
            <View style={styles.topRow}>
              <Text style={styles.posted}>{item.timestamp}</Text>
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

            {/* Action buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.buttonText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => applyForJob(user.uid, item.id)} style={styles.applyButton}>
                <Text style={styles.buttonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
        <TouchableOpacity onPress={() => navigation.navigate('Profile', {uid: user.uid})}>
          <Ionicons name='person-outline' size={28} color='#999' />
          <Text style={{ color: '#999' }}>Profile</Text>
        </TouchableOpacity>
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
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
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
});

export default JobPostsScreen;
