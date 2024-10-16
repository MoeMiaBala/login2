import React ,{ useState, useEffect} from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchUserTags, fetchRecentListings, fetchRecommendations, fetchUserdata } from '../utils/dbActions';
import { auth } from '../../firebaseConfig';

const JobSearchingNav = ({ route, navigation }) => {
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [userTags, setUserTags] = useState([]);
  const [name, setName] = useState('');
  const user = auth.currentUser


  useEffect(() => {
    const fetchData = async () => {
      const tags = await fetchUserTags(user); // Fetch user tags
      setUserTags(tags); // Set user tags
      const username = await fetchUserdata(user);
      setName(username.name);

      if (tags.length > 0) {
        await fetchRecommendations(tags, setRecommendedJobs); // Pass userTags and setter
        await fetchRecentListings(tags, setRecentJobs); // Pass userTags and setter
      }
    };
  
    fetchData();
  }, []);

  return (
    <View style={{ flex: 1, marginTop: 35, backgroundColor: '#F5F6FA' }}>
      
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
          color: '#171716'
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
          color: '#171716'
        }}>Recent Listings</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {recentJobs.length > 0 ? recentJobs.map(renderJobList) : <Text>No Recent Listings</Text>}
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
        <TouchableOpacity onPress={() => navigation.navigate('Profile', {uid: user.uid})}>
          <Ionicons name='person-outline' size={28} color='#999' />
          <Text style={{ color: '#999' }}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const renderJobCard = (job) => (
  <View key={job.id} style={{
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 15,
    width: 300,
    marginRight: 16,
    elevation: 3,
  }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={{ uri: job.image }} style={{ width: 50, height: 50, borderRadius: 50 }} />
        <View style={{ marginLeft: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#171716' }}>{job.companyName}</Text>
          <Text style={{ fontSize: 12, color: '#999' }}>{job.location}</Text>
        </View>
      </View>
      <Ionicons name='bookmark-outline' size={24} color='#000' />
    </View>

    <Text style={{ marginTop: 16, fontSize: 18, fontWeight: '600', color: '#171716' }}>{job.jobTitle}</Text>
    <Text style={{ fontSize: 12, color: '#999' }}>{job.jobType}</Text>

    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 16
    }}>
      <TouchableOpacity style={{
        backgroundColor: '#3F6CDF',
        padding: 10,
        borderRadius: 12,
      }}>
        <Text style={{ color: '#fff' }}>Apply Now</Text>
      </TouchableOpacity>
      <Text style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#171716',
      }}>{job.salary}</Text>
    </View>
  </View>
);

const renderJobList = (job) => (
  <TouchableOpacity key={job.id} style={{
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 9,
    marginBottom: 16,
    elevation: 2,
  }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={{ uri: job.image }} style={{ width: 50, height: 50, borderRadius: 50 }} />
        <View style={{ marginLeft: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#171716' }}>{job.jobTitle}</Text>
          <Text style={{ fontSize: 12, color: '#999' }}>{job.jobType}</Text>
        </View>
      </View>
      <Ionicons name='bookmark-outline' size={24} color='#000' />
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

export default JobSearchingNav
