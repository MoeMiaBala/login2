import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // For image upload functionality
import { Ionicons } from '@expo/vector-icons';
import CustomTextInput from '../components/CustomTextInput';
import { fetchUserdata, updateUserData } from '../utils/dbActions';
const EditProfileScreen = ({ navigation, route }) => {
  const { uid } = route.params;
  const [form, setForm] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);

  useEffect(() => {
    // Fetch user data from db
    const getUserData = async () => {
      const userData = await fetchUserdata({ uid });
      if (userData) {
        setForm({
          name: userData.name || '',
          address: userData.address || '',
          phoneNumber: userData.phone || '',
          password: '', // Default placeholder data for job type
        });
        setImage(userData.image)
      }
    };
    getUserData();
  }, [uid]);

  const handleChange = (key, value) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  const handleImagePicker = async () => {
    // Request media library permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const handleSave = async () => {
    // Implement save functionality (e.g., update Firebase data)
    try {
      await updateUserData(uid, form, image);
      alert('Profile updated successfully!');
      navigation.navigate('Profile', { uid });
    } catch (error) {
      alert('Error saving profile: ' + error.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 , backgroundColor: "#fff"}}>
      {/* Profile Image */}
      <TouchableOpacity onPress={handleImagePicker}>
        <Image
          source={image ? { uri: image } : { uri : 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg' }}
          style={{ width: 120, height: 120, borderRadius: 60, alignSelf: 'center', marginBottom: 20 }}
        />
        <Ionicons name="camera-outline" size={24} color="black" style={{ alignSelf: 'center' }} />
      </TouchableOpacity>

      {/* Custom Text Inputs */}
      <CustomTextInput
        value={form.name}
        onChangeText={(txt) => handleChange('name', txt)}
        title={'Name'}
        placeholder={form.name || 'Enter your name'}
        bad={errors.name !== ''}
      />
      <CustomTextInput
        value={form.address}
        onChangeText={(txt) => handleChange('address', txt)}
        title={'Address'}
        placeholder={form.address || 'Enter your address'}
        bad={errors.address !== ''}
      />
      <CustomTextInput
        value={form.phoneNumber}
        onChangeText={(txt) => handleChange('phoneNumber', txt)}
        title={'Phone Number'}
        placeholder={form.phoneNumber || 'Enter your phone number'}
        bad={errors.phoneNumber !== ''}
      />
      <CustomTextInput
        value={form.password}
        onChangeText={(txt) => handleChange('password', txt)}
        title={'Password'}
        placeholder={'enter your new password'}
        bad={errors.password !== ''}
      />

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleSave}
        style={{
          backgroundColor: '#3F6CDF',
          padding: 12,
          borderRadius: 10,
          alignItems: 'center',
          marginTop: 20,
        }}>
        <Text style={{ color: '#fff', fontSize: 16 }}>Save Changes</Text>
      </TouchableOpacity>

      {/* Navigation Area */}
      <View style={{
        height: 70,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ddd',
        elevation: 0,
        marginTop: 'auto',
      }}>
        <TouchableOpacity onPress={() => navigation.navigate('JobSearching', [ uid ])}>
          <Ionicons name='home-outline' size={28} color='#999' />
          <Text style={{ color: '#999' }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Posts')}>
          <Ionicons name='briefcase-outline' size={28} color='#999' />
          <Text style={{ color: '#999' }}>Jobs</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile', { uid })}>
          <Ionicons name='person-outline' size={28} color='#3F6CDF' />
          <Text style={{ color: '#3F6CDF' }}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile', { uid })}>
          <Ionicons name='settings-outline' size={28} color='#999' />
          <Text style={{ color: '#999' }}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditProfileScreen;
