import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { moderateScale, scale } from "react-native-size-matters";
import CustomTextInput from "../../components/CustomTextInput";
import CustomSolidBtn from "../../components/CustomSolidBtn";
import CustomBorderBtn from "../../components/CustomBorderBtn";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker'; 
import { auth, db } from '../../../firebaseConfig'; // Assuming your Firebase config file is in the root directory
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import crypto from 'crypto'; // Use crypto module

const Signup = () => {
  const navigation = useNavigation();

  const [selectedOption, setSelectedOption] = useState('Applicant');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });

  const validate = () => {
    let valid = true;
    const newErrors = { name: '', email: '', password: '', confirmPassword: '', phone: '', address: '', role: '' };

    if (form.name === '') {
      newErrors.name = 'Please enter a name';
      valid = false;
    } else if (form.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = form.email?.trim() || '';
    if (trimmedEmail === '') {
      newErrors.email = 'Please enter an email';
      valid = false;
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }

    if (form.password === '') {
      newErrors.password = 'Please enter a password';
      valid = false;
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (form.confirmPassword === '') {
      newErrors.confirmPassword = 'Please confirm your password';
      valid = false;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    const phoneRegex = /^[0-9]{10}$/; // Example for 10-digit phone numbers
    if (form.phone === '') {
      newErrors.phone = 'Please enter a phone number';
      valid = false;
    } else if (!phoneRegex.test(form.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      valid = false;
    }

    if (form.address === '') {
      newErrors.address = 'Please enter an address';
      valid = false;
    }

    if (selectedOption === '') {
      newErrors.role = 'Please select a country option';
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

  const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
    return { salt, hash };
  };

  const verifyPassword = (password, salt, hash) => {
    const newHash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
    return newHash === hash;
  };

  const handleSignup = async () => {
    if (!validate()) return;

    try {
      // Hash the password with crypto
      const { salt, hash } = hashPassword(form.password);

      // Firebase Auth: Sign up the user
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      // Store additional user information in Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        role: selectedOption,
        passwordSalt: salt, // Store the salt
        passwordHash: hash   // Store the hash
      });

      Alert.alert("Signup successful", "Account created successfully!");
      navigation.navigate("Profile");

    } catch (error) {
      Alert.alert("Signup Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={require("../../images/logo.png")} style={styles.logo} />
        <Text style={styles.title}>Create Account</Text>

        <CustomTextInput
          value={form.name}
          onChangeText={txt => handleChange('name', txt)}
          title={"Name"}
          placeholder={"John Doe"}
          bad={errors.name !== ''}
        />
        {errors.name !== '' && <Text style={styles.errorMsg}>{errors.name}</Text>}

        <CustomTextInput
          value={form.email}
          onChangeText={txt => handleChange('email', txt)}
          title={"Email"}
          placeholder={"john.doe@example.com"}
          bad={errors.email !== ''}
        />
        {errors.email !== '' && <Text style={styles.errorMsg}>{errors.email}</Text>}

        <CustomTextInput
          value={form.password}
          onChangeText={txt => handleChange('password', txt)}
          title={"Password"}
          placeholder={"••••••"}
          secureTextEntry={true}
          bad={errors.password !== ''}
        />
        {errors.password !== '' && <Text style={styles.errorMsg}>{errors.password}</Text>}

        <CustomTextInput
          value={form.confirmPassword}
          onChangeText={txt => handleChange('confirmPassword', txt)}
          title={"Confirm Password"}
          placeholder={"••••••"}
          secureTextEntry={true}
          bad={errors.confirmPassword !== ''}
        />
        {errors.confirmPassword !== '' && <Text style={styles.errorMsg}>{errors.confirmPassword}</Text>}

        <CustomTextInput
          value={form.phone}
          onChangeText={txt => handleChange('phone', txt)}
          title={"Phone Number"}
          placeholder={"1234567890"}
          keyboardType={"phone-pad"}
          bad={errors.phone !== ''}
        />
        {errors.phone !== '' && <Text style={styles.errorMsg}>{errors.phone}</Text>}

        <CustomTextInput
          value={form.address}
          onChangeText={txt => handleChange('address', txt)}
          title={"Address"}
          placeholder={"123 Main St"}
          bad={errors.address !== ''}
        />
        {errors.address !== '' && <Text style={styles.errorMsg}>{errors.address}</Text>}

        <Text style={styles.inputTitle}>Role</Text>
        <Picker
          value={form.role}
          selectedValue={selectedOption}
          onValueChange={(itemValue) => setSelectedOption(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Applicant" value="Applicant" />
          <Picker.Item label="Employer" value="Employer" />
        </Picker>
        {errors.country !== '' && <Text style={styles.errorMsg}>{errors.country}</Text>}

        <View style={styles.buttonContainer}>
          <CustomSolidBtn
            title={"Sign Up"}
            onClick={handleSignup}
          />
          <CustomBorderBtn
            title={"Login"}
            onClick={() => {
              navigation.goBack();
            }}
          />

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => console.log("Google sign-in")}
          >
            <Icon name="google" size={scale(24)} color="#DD4B39" />
            <Text style={styles.socialButtonText}>Sign up with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => console.log("Facebook sign-in")}
          >
            <Icon name="facebook" size={scale(24)} color="#3b5998" />
            <Text style={styles.socialButtonText}>Sign up with Facebook</Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export default Signup;

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
  logo: {
    width: scale(100),
    height: scale(100),
    alignSelf: "center",
    marginTop: moderateVerticalScale(40),
    borderRadius: 9,
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
  picker: {
    width: '90%',
    alignSelf: 'center',
    height: moderateVerticalScale(40),
    marginBottom: moderateVerticalScale(10),
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
  },
  socialButtonsContainer: {
    marginTop: moderateVerticalScale(20),
    width: '100%',
    alignItems: 'center',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: moderateVerticalScale(10),
    paddingHorizontal: moderateScale(20),
    borderRadius: 5,
    marginBottom: moderateVerticalScale(10),
    width: '80%',
    justifyContent: 'center',
  },
  socialButtonText: {
    marginLeft: moderateScale(10),
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: moderateVerticalScale(30),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
