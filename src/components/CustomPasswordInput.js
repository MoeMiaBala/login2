import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters';
import { Ionicons } from '@expo/vector-icons';

const CustomPasswordInput = ({ title, placeholder, value, onChangeText, bad }) => {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  return (
    <View style={[styles.input, { borderColor: bad ? 'red' : 'grey' }]}>
      {/* Title for input */}
      <Text style={styles.title}>{title}</Text>

      {/* Container for TextInput and Eye Icon */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText} // Simplified change handler
          style={styles.textInput}
          secureTextEntry={!showPassword} // Toggle based on showPassword
        />

        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Ionicons 
            name={showPassword ? 'eye' : 'eye-off'} 
            size={18} 
            color="grey" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomPasswordInput;

const styles = StyleSheet.create({
  input: {
    width: "90%",
    height: moderateVerticalScale(42),
    borderWidth: 0.4,
    alignSelf: "center",
    marginTop: moderateVerticalScale(20),
    borderRadius: moderateScale(10),
    justifyContent: "center",
  },
  title: {
    alignSelf: 'flex-start',
    marginLeft: moderateScale(20),
    top: -moderateVerticalScale(8),
    position: 'absolute',
    paddingLeft: moderateScale(10),
    paddingRight: moderateScale(10),
    backgroundColor: 'white',
    color: "black"
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Align items vertically
  },
  textInput: {
    paddingLeft: moderateScale(10),
    color: "black",
    flex: 1, // Make the text input fill available space
  },
  eyeIcon: {
    paddingRight: moderateScale(10), // Space from the text input
  }
});
