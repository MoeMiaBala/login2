import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../../firebaseConfig'; // Adjust path as needed
import { fetchUserdata, fetchJobData, handleUpdateJobStatus, fetchUserApplications } from '../utils/dbActions';


const ApplicantProfile = ({ navigation, route }) => {
  const [ activeTab, setActiveTab ] = useState('resume');
  const [loading, setLoading] = useState(false);
  const { uid } = route.params; // Get the user UID passed from login
  const { jobId } = route.params;
  const [ applicantD, setApplactD ] = useState([]);
  const [ job, setJob ] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch employer (user) data
        const userData = await fetchUserdata({ uid });
        if (userData) {
          setApplactD(userData);
          const userApplications = await fetchUserApplications(userData.uid);    
          jobApplication = userApplications.find(app => app.jobId === jobId);
          setJob(jobApplication);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      setLoading(false);
    };

    fetchData();
  }, [uid]);

  // Hardcoded demo data
  const applicant = {
    name: applicantD.name,
    jobTitle: job.jobTitle,
    image: applicantD.image,
    email: applicantD.email,
    phone: applicantD.phone,
    experience: '5+ years in Full Stack Development',
    qualifications: 'B.Sc. in Computer Science',
    resumeLink: 'https://example.com/resume.pdf',
    interviewNotes: 'Strong technical skills, needs to improve communication.',
    status: job.status,
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
      default:
        return { backgroundColor: '#f4f4f4', color: 'gray' };
    }
  };

  // Tab content logic
  const renderTabContent = () => {
    switch (activeTab) {
      case 'resume':
        return (
          <View>
            <Text style={styles.tabContentText}>
              Resume available here: <Text style={styles.link}>{applicant.resumeLink}</Text>
            </Text>
          </View>
        );
      case 'info':
        return (
          <View>
            <Text style={styles.tabContentText}>Email: {applicant.email}</Text>
            <Text style={styles.tabContentText}>Phone: {applicant.phone}</Text>
            <Text style={styles.tabContentText}>Experience: {applicant.experience}</Text>
            <Text style={styles.tabContentText}>Qualifications: {applicant.qualifications}</Text>
          </View>
        );
      case 'notes':
        return (
          <View>
            <Text style={styles.tabContentText}>{applicant.interviewNotes}</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}></Text>
        <Text style={[styles.statusBadge, getJobStatusStyle(applicant.status)]}>
        {applicant.status}
        </Text>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image source={{ uri: applicant.image }} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{applicant.name}</Text>
          <Text style={styles.profileJobTitle}>{applicant.jobTitle}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'resume' && styles.activeTab]}
          onPress={() => setActiveTab('resume')}
        >
          <Text style={styles.tabText}>Resume</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'info' && styles.activeTab]}
          onPress={() => setActiveTab('info')}
        >
          <Text style={styles.tabText}>Personal Info</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'notes' && styles.activeTab]}
          onPress={() => setActiveTab('notes')}
        >
          <Text style={styles.tabText}>Interview Notes</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {renderTabContent()}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="cloud-download" size={24} color="white" />
          <Text style={styles.actionButtonText}>Download Resume</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="calendar-outline" size={24} color="white" />
          <Text style={styles.actionButtonText}>Schedule Interview</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="close-outline" size={24} color="white" />
          <Text style={styles.actionButtonText}>Reject with Feedback</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ApplicantProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    color: 'white',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 14,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  profileJobTitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 20,
  },
  tab: {
    paddingBottom: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3F6CDF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  tabContent: {
    marginBottom: 30,
  },
  tabContentText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  link: {
    color: '#3F6CDF',
    textDecorationLine: 'underline',
  },
  actionButtons: {
    flexDirection: 'column', // Stack buttons vertically
    justifyContent: 'space-between',
    alignItems: 'center', // Center the buttons horizontally
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3F6CDF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15, // Add margin between the buttons
    width: '80%', // Ensure buttons are not too wide
    justifyContent: 'center', // Center the text and icon
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },

});
