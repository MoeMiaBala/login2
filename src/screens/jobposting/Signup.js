import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from "react-native-size-matters";
import CustomTextInput from "../../components/CustomTextInput";
import CustomSolidBtn from "../../components/CustomSolidBtn";
import CustomBorderBtn from "../../components/CustomBorderBtn";
import { useNavigation } from "@react-navigation/native";

const Signup = () => {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    name: '',
    email: '', // Ensure email is initialized as an empty string
    password: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: ''
  });

  const validate = () => {
    let valid = true;
    const newErrors = { name: '', email: '', password: '' };
  
    // Name validation
    if (form.name === '') {
      newErrors.name = 'Please enter a name';
      valid = false;
    } else if (form.name.length < 3) {
      newErrors.name = 'Please enter a valid name';
      valid = false;
    }
  
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = form.email?.trim() || '';  // Use optional chaining and fallback to an empty string
    if (trimmedEmail === '') {
      newErrors.email = 'Please enter an email';
      valid = false;
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }
  
    // Password validation
    if (form.password === '') {
      newErrors.password = 'Please enter a password';
      valid = false;
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
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

        <CustomSolidBtn
          title={"Sign Up"}
          onClick={() => {
            if (validate()) {
              // proceed with signup
              console.log("Signup validated successfully");
            }
          }}
        />
        <CustomBorderBtn
          title={"Login"}
          onClick={() => {
            navigation.goBack();
          }}
        />
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
  logo: {
    width: scale(100),
    height: scale(100),
    alignSelf: "center",
    marginTop: moderateVerticalScale(40),
  },
  title: {
    fontWeight: "600",
    marginTop: moderateVerticalScale(50),
    alignSelf: "center",
    fontSize: 25,
  },
  errorMsg: {
    marginLeft: moderateScale(20),
    color: "red",
  },
});
