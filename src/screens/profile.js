import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import { launchImageLibrary } from 'react-native-image-picker';
import CustomTextInput from "../components/CustomTextInput";
import CustomSolidBtn from "../components/CustomSolidBtn";
import CustomBorderBtn from "../components/CustomBorderBtn";
import { useNavigation } from "@react-navigation/native";
import { moderateScale, moderateVerticalScale, scale } from "react-native-size-matters";

const Profile = () => {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    age: '',
    idNumber: '',
    role: '',
    profilePhoto: null,
  });

  const [errors, setErrors] = useState({
    age: '',
    idNumber: '',
    role: '',
  });

  const validate = () => {
    let valid = true;
    const newErrors = { age: '', idNumber: '', role: '' };

    if (form.age === '') {
      newErrors.age = 'Please enter your age';
      valid = false;
    }

    if (form.idNumber === '') {
      newErrors.idNumber = 'Please enter your ID number';
      valid = false;
    }

    if (form.role === '') {
      newErrors.role = 'Please select your role';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const handlePhotoUpload = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, response => {
      if (response.didCancel) {
        console.log('User canceled image picker');
      } else if (response.errorCode) {
        console.error(response.errorMessage);
      } else {
        setForm({
          ...form,
          profilePhoto: response.assets[0].uri,
        });
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Complete Your Profile</Text>

        <TouchableOpacity onPress={handlePhotoUpload} style={styles.photoContainer}>
          {form.profilePhoto ? (
            <Image source={{ uri: form.profilePhoto }} style={styles.profilePhoto} />
          ) : (
            <Text style={styles.photoPlaceholder}>Add Profile Photo</Text>
          )}
        </TouchableOpacity>

        <CustomTextInput
          value={form.age}
          onChangeText={txt => handleChange('age', txt)}
          title={"Age"}
          placeholder={"30"}
          keyboardType={"number-pad"}
          bad={errors.age !== ''}
        />
        {errors.age !== '' && <Text style={styles.errorMsg}>{errors.age}</Text>}

        <CustomTextInput
          value={form.idNumber}
          onChangeText={txt => handleChange('idNumber', txt)}
          title={"ID Number"}
          placeholder={"1234567890"}
          keyboardType={"number-pad"}
          bad={errors.idNumber !== ''}
        />
        {errors.idNumber !== '' && <Text style={styles.errorMsg}>{errors.idNumber}</Text>}

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Role</Text>
          <RNPickerSelect
            onValueChange={(value) => handleChange('role', value)}
            items={[
              { label: 'Select Role', value: '' },
              { label: 'Employer', value: 'employer' },
              { label: 'Employee', value: 'employee' },
            ]}
            style={pickerStyles}
          />
          {errors.role !== '' && <Text style={styles.errorMsg}>{errors.role}</Text>}
        </View>

        <View style={styles.buttonContainer}>
          <CustomSolidBtn
            title={"Save"}
            onClick={() => {
              if (validate()) {
                console.log("Profile validated successfully");
                // Proceed with profile update logic
              }
            }}
          />
          <CustomBorderBtn
            title={"Cancel"}
            onClick={() => {
              navigation.goBack();
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const pickerStyles = StyleSheet.create({
  inputIOS: {
    height: moderateVerticalScale(50),
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: moderateScale(10),
    backgroundColor: '#fff',
  },
  inputAndroid: {
    height: moderateVerticalScale(50),
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: moderateScale(10),
    backgroundColor: '#fff',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    alignItems: "center",
    paddingBottom: moderateVerticalScale(20),
    paddingHorizontal: moderateScale(20),
  },
  title: {
    fontWeight: "600",
    marginTop: moderateVerticalScale(30),
    fontSize: 25,
    alignSelf: 'center',
  },
  errorMsg: {
    alignSelf: "flex-start",
    marginLeft: moderateScale(25),
    color: "red",
    marginBottom: moderateVerticalScale(5),
  },
  buttonContainer: {
    marginTop: moderateVerticalScale(30),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    width: '100%',
    marginVertical: moderateVerticalScale(10),
  },
  label: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    marginBottom: moderateVerticalScale(5),
  },
  photoContainer: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginBottom: moderateVerticalScale(20),
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
    borderRadius: scale(50),
  },
  photoPlaceholder: {
    fontSize: moderateScale(14),
    color: '#aaa',
  },
});

export default Profile;
