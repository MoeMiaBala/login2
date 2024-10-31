import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator
} from 'react-native';
import Slider from '@react-native-community/slider';
import { fetchUserData , fetchUserApplications, fetchUserdata} from '../utils/dbActions';

const JobDetailScreen = ({ navigation, route }) => {
  const [applicants, setApplicants] = useState([]);
  const [ appD, setAppD ] = useState()
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [viewingApplicant, setViewingApplicant] = useState(null);
  const [currentTab, setCurrentTab] = useState('Profile');
  const [applicantsData, setApplicantsData] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const { selectedJob } = route.params;
  const pipeline = {
    'Applied': applicants.filter(app => app.status === 'Applied'),
    'In Review': applicants.filter(app => app.status === 'In Review'),
    'Interview Scheduled': applicants.filter(app => app.status === 'Interview Scheduled'),
    'Rejected': applicants.filter(app => app.status === 'Rejected'),
    'Accepted': applicants.filter(app => app.status === 'Accepted'),
  };
 //console.log(selectedJob);
  useEffect(() => {
    // Fetch applicants data when component mounts
    //setLoading(true);
    if (selectedJob && selectedJob.applicantlist) {
      fetchApplicantsData(selectedJob.applicantlist, selectedJob.id);
      //console.log(applicants);
      setLoading(false);
    }
  }, [selectedJob]);
  

  const handleSelectApplicant = (applicant) => {
    if (selectedApplicants.length < 2 && !selectedApplicants.includes(applicant)) {
      setSelectedApplicants([...selectedApplicants, applicant]);
    } else {
      alert('You can only compare two applicants at a time.');
    }
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
          jobId: jobApplication.jobId,
          experience: userData.experience || 0,
          skills: 'No skills listed',
          rating: jobApplication.rating || 0,
          notes: jobApplication.notes || ''
        });
      }
    }
    setApplicantsData(applicantsList); // Store fetched applicants' data in state
    setApplicants(applicantsList);

  };

  const handleDeselectApplicant = (applicantId) => {
    setSelectedApplicants(selectedApplicants.filter((app) => app.id !== applicantId));
  };

  const handleExportData = () => {
    alert('Exporting selected applicants to PDF...');
  };

  const handleRatingChange = (id, newRating) => {
    setApplicants((prevApplicants) => prevApplicants.map(app => 
      app.id === id ? { ...app, rating: newRating } : app
    ));
  };

  const handleNotesChange = (id, newNotes) => {
    setApplicants((prevApplicants) => prevApplicants.map(app => 
      app.id === id ? { ...app, notes: newNotes } : app
    ));
  };

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
      case 'Accepted':
        return { backgroundColor: '#e0f2f1', color: '#004d40' }; // Colors for Accepted status
      default:
        return { backgroundColor: '#f4f4f4', color: 'gray' };
    }
  };  

  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={{ padding: 100}}/>;
  }
  
  return (
    <ScrollView style={styles.container}>
      {/* Header and Export Button */}
      <View style={styles.header}>
        <Text style={styles.title}>Employer Dashboard</Text>
        <TouchableOpacity style={{ backgroundColor: "#007aff", borderRadius: 10}} onPress={handleExportData}>
            <Text style={{ fontWeight: 'bold', padding: 10, textAlign: 'center', color: '#fff'}}>Export Findings</Text>
        </TouchableOpacity>
      </View>

      {/* Applicant List */}
      <Text style={styles.sectionTitle}>Applicants</Text>
      <FlatList
        data={applicants}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.applicantCard} onPress={() => navigation.navigate('ApplicantProfile',{ uid: item.id, jobId: item.jobId})}>
            <Text style={styles.applicantName}>{item.name}</Text>
            <Text style={styles.applicantDetails}>{item.experience} years - {item.skills}</Text>
            <Text style={styles.applicantRating}>Rating: {item.rating} 🌟</Text>
            <TouchableOpacity style={{ backgroundColor: "#007aff", borderRadius: 10, marginTop: 6}} onPress={() => handleSelectApplicant(item)}>
                <Text style={{ fontWeight: 'bold', padding: 10, textAlign: 'center', color: '#fff'}}>Compare</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false} // Hide horizontal scroll bar
        showsVerticalScrollIndicator={false}  
      />

      {/* Viewing Applicant Detail Tabs */}
      {viewingApplicant && (
        <View style={styles.detailsContainer}>
          <Text style={styles.applicantHeader}>{viewingApplicant.name}</Text>
          <View style={styles.tabBar}>
            <TouchableOpacity onPress={() => setCurrentTab('Profile')}><Text style={currentTab === 'Profile' ? styles.activeTab : styles.tab}>Profile</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentTab('Rating')}><Text style={currentTab === 'Rating' ? styles.activeTab : styles.tab}>Rating</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentTab('Notes')}><Text style={currentTab === 'Notes' ? styles.activeTab : styles.tab}>Notes</Text></TouchableOpacity>
          </View>

          {currentTab === 'Profile' && (
            <View style={styles.profileTab}>
              <Text>Experience: {viewingApplicant.experience} years</Text>
              <Text>Skills: {viewingApplicant.skills}</Text>
            </View>
          )}

          {currentTab === 'Rating' && (
            <View style={styles.ratingTab}>
              <Text>Rating: {viewingApplicant.rating}</Text>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={5}
                step={0.1}
                value={viewingApplicant.rating}
                onValueChange={(value) => handleRatingChange(viewingApplicant.id, value)}
              />
            </View>
          )}

          {currentTab === 'Notes' && (
            <TextInput
              style={styles.notesInput}
              placeholder="Write notes here..."
              value={viewingApplicant.notes}
              onChangeText={(text) => handleNotesChange(viewingApplicant.id, text)}
              multiline
            />
          )}
        </View>
      )}

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Interview Pipeline</Text>
        {Object.entries(pipeline).map(([status, list]) => (
          <View key={status}>
            <Text style={[styles.pipelineTitle, getJobStatusStyle(status)]}>{status}</Text>

            {list.length > 0 ? (
              <FlatList
                data={list}
                horizontal
                renderItem={({ item }) => (
                  <TouchableOpacity style={[styles.applicantCard, styles.applicantCardI]} onPress={() => navigation.navigate('ApplicantProfile',{ uid: item.id, jobId: item.jobId})}>
                    <View style={{ borderRadius: 25, height: 50, height: 50, backgroundColor: '#000', overflow: 'hidden', marginRight: 6}}>
                      <Image
                        source={{uri: item.image}}
                        style={{  width: 50, height: 50}}
                        resizeMode="cover"
                      />
                    </View>
                    <View>
                      <Text style={styles.applicantName}>{item.name}</Text>
                      <Text style={styles.applicantRating}>Rating: {item.rating} 🌟</Text>
                    </View>
                    
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <Text style={styles.emptyText}>No applicants in this stage.</Text>
            )}
          </View>
        ))}
      </View>

      {/* Comparison Section */}
      {selectedApplicants.length > 0 && (
        <View style={styles.comparisonSection}>
          <Text style={styles.comparisonTitle}>Comparison</Text>
          <View style={styles.compareCardsContainer}>
            {selectedApplicants.map((applicant) => (
              <View key={applicant.id} style={styles.compareCard}>
                <Text style={[ styles.applicantName, styles.applicantNamec ]}>{applicant.name}</Text>
                <Text>Experience: {applicant.experience} years</Text>
                <Text>Skills: {applicant.skills}</Text>
                <Text>Rating: {applicant.rating}</Text>
                <TouchableOpacity style={{ backgroundColor: "#ffebee", borderRadius: 10, marginTop: 2}} onPress={() => handleDeselectApplicant(applicant.id)}>
                    <Text style={{ fontWeight: 'bold', padding: 10, textAlign: 'center', color: '#d32f2f'}}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <TouchableOpacity style={{ backgroundColor: "#333", borderRadius: 10, marginTop: 8}} onPress={() => setSelectedApplicants([])}>
                <Text style={{ fontWeight: 'bold', padding: 10, textAlign: 'center', color: '#fff'}}>Clear comparison</Text>
            </TouchableOpacity>
                  
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f6', padding: 16 , marginTop: 10},
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#007aff', marginVertical: 10 },
  applicantCard: { backgroundColor: '#fff', padding: 10, borderRadius: 10, marginRight: 10, elevation: 0, width: 220, justifyContent: 'space-between', borderWidth: 0.3, borderColor : '#007aff' },
  applicantCardI: { flexDirection: 'row', flex: 1, justifyContent: 'flex-start' },
  applicantName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  applicantNamec: { color: '#007aff'},
  applicantDetails: { fontSize: 14, color: '#666' },
  applicantRating: { color: '#007aff', fontWeight: 'bold' },
  detailsContainer: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginVertical: 10, elevation: 3 },
  applicantHeader: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  tab: { fontSize: 16, color: '#666' },
  activeTab: { fontSize: 16, color: '#007aff', fontWeight: 'bold' },
  profileTab: { padding: 10 },
  ratingTab: { padding: 10 },
  notesInput: { height: 80, borderColor: '#ccc', borderWidth: 1, padding: 8, borderRadius: 8 },
  comparisonSection: { marginTop: 20, padding: 16, backgroundColor: '#e6e6e6', borderRadius: 10, borderWidth: 0.3 },
  comparisonTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  compareCardsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  compareCard: { width: '48%', padding: 16, backgroundColor: '#fff', borderRadius: 8, elevation: 2 },
  pipelineTitle: { fontSize: 16, fontWeight: '600', marginVertical: 5, marginRight: 'auto', paddingHorizontal: 10, borderRadius: 6 },
  emptyText: { color: '#888', fontStyle: 'italic' },
  communicationItem: { marginVertical: 5, padding: 10, backgroundColor: '#eee', borderRadius: 8 },
  viewAllLink: { color: '#007aff', fontWeight: 'bold', textAlign: 'right', margin: 10 }
});

export default JobDetailScreen;
