import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EmployerDashboard = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [loading, setLoading] = useState(false);

  // Sample job postings data
  const jobPosts = [
    { id: '1', title: 'Senior Developer', applicants: 25, status: 'Active' },
    { id: '2', title: 'Project Manager', applicants: 10, status: 'Closed' },
    // Add more job posts as needed
  ];

  const filteredJobPosts = jobPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || post.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const renderJobPost = ({ item }) => (
    <View style={[styles.jobCard, item.status === 'Active' ? styles.active : styles.closed]}>
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('JobDetails', { jobId: item.id })}>
          <Ionicons name="information-circle-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.jobDetails}>Applicants: {item.applicants}</Text>
      <Text style={styles.jobDetails}>Status: {item.status}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Icons */}
      <View style={styles.topIcons}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Ionicons name="menu-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Chats')}>
          <Ionicons name="chatbubble-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Dashboard Overview */}
      <View style={styles.overview}>
        <Text style={styles.overviewTitle}>Dashboard Overview</Text>
        <View style={styles.metrics}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>50</Text>
            <Text style={styles.metricLabel}>Jobs Posted</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>120</Text>
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
      <TouchableOpacity style={styles.postJobButton} onPress={() => navigation.navigate('PostJob')}>
        <Text style={styles.postJobButtonText}>Post a Job</Text>
      </TouchableOpacity>

      {/* Job Posts */}
      {loading ? (
        <ActivityIndicator size="large" color="#3F6CDF" />
      ) : (
        <ScrollView contentContainerStyle={styles.jobPostsContainer}>
          <FlatList
            data={filteredJobPosts}
            renderItem={renderJobPost}
            keyExtractor={item => item.id}
          />
        </ScrollView>
      )}
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
    fontSize: 18,
    fontWeight: '600',
  },
  jobDetails: {
    fontSize: 14,
    color: '#555',
  },
});

export default EmployerDashboard;
