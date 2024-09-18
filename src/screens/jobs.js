import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, SafeAreaView, Animated, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const JobPostsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobId, setSelectedJobId] = useState(null); // To track the selected job for details
  const [bookmarkedJobs, setBookmarkedJobs] = useState({}); // To track bookmarked jobs

  // Hardcoded job data
  const jobData = [
    {
      id: '1',
      company: 'Company A',
      location: 'Location A',
      title: 'Senior Developer',
      type: 'Full-time',
      salary: '$100,000/year',
      image: require('../images/logo.png'),
      posted: '5 min ago',
      deadline: '7 days'
    },
    {
      id: '2',
      company: 'Company B',
      location: 'Location B',
      title: 'Project Manager',
      type: 'Part-time',
      salary: '$80,000/year',
      image: require('../images/logo.png'),
      posted: '20 min ago',
      deadline: '3 days'
    },
    // Add more hardcoded jobs as needed
  ];

  const filteredJobs = jobData.filter(job => 
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
          <TouchableOpacity
            style={styles.jobCard}
            onPress={() => setSelectedJobId(item.id)}
          >
            <View style={styles.jobInfo}>
              <Image source={item.image} style={styles.companyLogo} />
              <View style={styles.jobDetails}>
                <Text style={styles.jobTitle}>{item.title}</Text>
                <Text style={styles.jobType}>{item.type}</Text>
                <Text style={styles.companyName}>{item.company}</Text>
                <Text style={styles.location}>{item.location}</Text>
                {selectedJobId === item.id && (
                  <>
                    <Text style={styles.salary}>{item.salary}</Text>
                    <Text style={styles.posted}>{item.posted}</Text>
                    <Text style={styles.deadline}>{item.deadline}</Text>
                  </>
                )}
              </View>
            </View>
            <TouchableOpacity onPress={() => toggleBookmark(item.id)}>
              <Ionicons
                name={bookmarkedJobs[item.id] ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color={bookmarkedJobs[item.id] ? 'blue' : 'black'}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  jobDetails: {
    marginLeft: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  jobType: {
    fontSize: 12,
    fontWeight: '400',
    color: '#888',
  },
  companyName: {
    fontSize: 14,
    fontWeight: '500',
  },
  location: {
    fontSize: 12,
    color: '#888',
  },
  salary: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 4,
  },
  posted: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  deadline: {
    fontSize: 12,
    color: 'red',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
});

export default JobPostsScreen;
