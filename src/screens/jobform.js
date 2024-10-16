import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Modal, FlatList } from 'react-native';
import CustomTextInput from '../components/CustomTextInput'; // Assuming this is similar to CustomDescription for single-line inputs
import CustomDescription from '../components/CustomDescription';
import CustomSolidBtn from '../components/CustomSolidBtn';
import { Ionicons } from '@expo/vector-icons'; // Using FontAwesome for icons
import { moderateScale, moderateVerticalScale, scale } from 'react-native-size-matters';
import { addJob, updateJob , fetchTags} from '../utils/dbActions';
import { auth } from '../../firebaseConfig';


const JobFormScreen = ({ route, navigation }) => {
  const [form, setForm] = useState({
    jobTitle: '',
    companyName: '',
    location: '',
    salary: '',
    jobType: '',
    description: '',
    responsibilities: '',
    requirements: '',
    tags: []
  });

  const [errors, setErrors] = useState({
    jobTitle: '',
    companyName: '',
    location: '',
    salary: '',
    jobType: '',
    description: '',
    responsibilities: '',
    requirements: '',
    tags: ''
  });

  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const isEdit = route.params?.edit;
  const jobId = route.params?.jobId; // Job ID for editing existing jobs
  const user = auth.currentUser;
  //console.log(user);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedTags = await fetchTags(); // Fetch tags from DB
      //console.log(fetchedTags[0])
      const tagsArray = fetchedTags[0].split(',').map(tag => tag.trim()); // Assuming the tags are stored as a comma-separated string
      setTags(tagsArray);
      //console.log("tags array", tagsArray);
    };
  
    fetchData();
  }, []);

  const toggleTag = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
    );
  };

  const renderSelectedTags = () => {
    const displayedTags = selectedTags.slice(0, 5); // Display the first 5 selected tags
    return (
      <View style={styles.selectedTagsContainer}>
        {displayedTags.map((tag, index) => (
          <View key={index} style={styles.tagContainer}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
        {selectedTags.length > 5 && (
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.tagContainer}>
            <Text style={styles.tagText}>...</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>
    );
  };
  
  const renderTagModal = () => {
    // Ensure unique tags and remove duplicates
    const uniqueTags = [...new Set(tags)];
  
    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Tags</Text>
            <FlatList
              data={uniqueTags}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => toggleTag(item)} style={styles.tagItem}>
                  <Text style={styles.modalTagText}>{item}</Text>
                  {selectedTags.includes(item) && (
                    <Ionicons name="checkmark-circle" size={20} color="green" />
                  )}
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => item + index} // Ensure a unique key for each item
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  
  const handleSaveTags = () => {
    if (selectedTags.length > 0) {
      saveTags(user.uid, selectedTags); // Assuming saveTags function stores tags for the user
      setModalVisible(false);
      Alert.alert('Success', 'Tags saved successfully.');
    } else {
      Alert.alert('Error', 'Please select at least one tag.');
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const validate = () => {
    const newErrors = { ...errors };
    let valid = true;

    if (!form.jobTitle.trim()) {
      newErrors.jobTitle = 'Job Title is required';
      valid = false;
    }

    if (!form.companyName.trim()) {
      newErrors.companyName = 'Company Name is required';
      valid = false;
    }

    if (!form.location.trim()) {
      newErrors.location = 'Location is required';
      valid = false;
    }

    if (!form.salary.trim()) {
      newErrors.salary = 'Salary is required';
      valid = false;
    }

    if (!form.description.trim()) {
      newErrors.description = 'Job Description is required';
      valid = false;
    }

    if (!form.responsibilities.trim()) {
      newErrors.responsibilities = 'Responsibilities are required';
      valid = false;
    }

    if (!form.requirements.trim()) {
      newErrors.requirements = 'Requirements are required';
      valid = false;
    }

    if (selectedTags.length === 0) {
      newErrors.tags = 'At least one tag must be selected';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (validate()) {
      const jobData = {
        jobTitle: form.jobTitle,
        companyName: form.companyName,
        location: form.location,
        salary: form.salary,
        jobType: form.jobType,
        description: form.description,
        responsibilities: form.responsibilities,
        requirements: form.requirements,
        applicants: 0,
        employerId: user.uid,
        timestamp: new Date(),
        tags: selectedTags,
        status: "Active"
      };

      try {
        if (isEdit && jobId) {
          await updateJob(jobId, jobData); // Update existing job
          Alert.alert('Success', 'Job updated successfully.');
        } else {
          await addJob(jobData); // Add new job
          Alert.alert('Success', 'Job added successfully.');
        }
        navigation.goBack(); // Go back to the previous screen
      } catch (error) {
        Alert.alert('Error', error.message);
        console.log(error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{isEdit ? 'Edit Job' : 'Post a Job'}</Text>

        <CustomTextInput
          value={form.jobTitle}
          onChangeText={(txt) => handleChange('jobTitle', txt)}
          title={'Job Title'}
          placeholder={'Enter Job Title'}
          bad={errors.jobTitle !== ''}
        />
        {errors.jobTitle !== '' && <Text style={styles.errorMsg}>{errors.jobTitle}</Text>}

        <CustomTextInput
          value={form.companyName}
          onChangeText={(txt) => handleChange('companyName', txt)}
          title={'Company Name'}
          placeholder={'Enter Company Name'}
          bad={errors.companyName !== ''}
        />
        {errors.companyName !== '' && <Text style={styles.errorMsg}>{errors.companyName}</Text>}

        <CustomTextInput
          value={form.location}
          onChangeText={(txt) => handleChange('location', txt)}
          title={'Location'}
          placeholder={'Enter Location'}
          bad={errors.location !== ''}
        />
        {errors.location !== '' && <Text style={styles.errorMsg}>{errors.location}</Text>}

        <CustomTextInput
          value={form.salary}
          onChangeText={(txt) => handleChange('salary', txt)}
          title={'Salary'}
          placeholder={'Enter Salary (e.g., 5000 - 7000 USD)'}
          bad={errors.salary !== ''}
        />
        {errors.salary !== '' && <Text style={styles.errorMsg}>{errors.salary}</Text>}

        <CustomTextInput
          value={form.jobType}
          onChangeText={(txt) => handleChange('jobType', txt)}
          title={'Job Type'}
          placeholder={'e.g., Full-time, Part-time'}
          bad={errors.jobType !== ''}
        />
        {errors.jobType !== '' && <Text style={styles.errorMsg}>{errors.jobType}</Text>}

        <CustomDescription
          title="Job Description"
          placeholder="Enter detailed job description..."
          value={form.description}
          onChangeText={(txt) => handleChange('description', txt)}
          bad={errors.description !== ''}
          multiline={true}
        />
        {errors.description !== '' && <Text style={styles.errorMsg}>{errors.description}</Text>}

        <CustomDescription
          title="Responsibilities"
          placeholder="Enter key responsibilities..."
          value={form.responsibilities}
          onChangeText={(txt) => handleChange('responsibilities', txt)}
          bad={errors.responsibilities !== ''}
          multiline={true}
        />
        {errors.responsibilities !== '' && <Text style={styles.errorMsg}>{errors.responsibilities}</Text>}

        <CustomDescription
          title="Requirements"
          placeholder="Enter requirements for the job..."
          value={form.requirements}
          onChangeText={(txt) => handleChange('requirements', txt)}
          bad={errors.requirements !== ''}
          multiline={true}
        />
        {errors.requirements !== '' && <Text style={styles.errorMsg}>{errors.requirements}</Text>}

        <View style={styles.tagsSection}>
          <Text style={styles.sectionTitle}>Your Interests:</Text>
          {renderSelectedTags()}
        </View>
        {errors.tags !== '' && <Text style={styles.errorMsg}>{errors.tags}</Text>}


        <CustomSolidBtn
          title={isEdit ? 'Update Job' : 'Post Job'}
          onClick={handleSubmit}
        />

        {renderTagModal()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default JobFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: moderateScale(20),
  },
  title: {
    fontSize: scale(22),
    fontWeight: 'bold',
    marginBottom: moderateVerticalScale(20),
    textAlign: 'center',
    color: '#333',
  },
  errorMsg: {
    color: 'red',
    marginBottom: moderateVerticalScale(10),
    marginLeft: moderateScale(5),
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
  selectedTagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
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
});
