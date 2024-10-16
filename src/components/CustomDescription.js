import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { moderateScale, moderateVerticalScale, verticalScale } from 'react-native-size-matters';
import { TextInput } from 'react-native-gesture-handler';

const CustomDescription = ({ title, placeholder, value, onChangeText, bad, multiline }) => {
  return (
    <View style={[styles.input, { borderColor: bad ? 'red' : '#e9e9e9', height: multiline ? verticalScale(120) : verticalScale(42) }]}>
      <Text style={styles.title}>{title}</Text>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={txt => onChangeText(txt)}
        style={[styles.textInput, multiline && styles.textArea]}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}  // Adjust number of lines for multiline
        textAlignVertical={multiline ? 'top' : 'center'}  // Align text to top if multiline
      />
    </View>
  );
};

export default CustomDescription;

const styles = StyleSheet.create({
  input: {
    width: '90%',
    borderWidth: 0.4,
    alignSelf: 'center',
    marginTop: moderateVerticalScale(20),
    borderRadius: moderateScale(10),
    justifyContent: 'center',
  },
  title: {
    alignSelf: 'flex-start',
    marginLeft: moderateScale(20),
    top: -moderateVerticalScale(8),
    position: 'absolute',
    paddingLeft: moderateScale(10),
    paddingRight: moderateScale(10),
    backgroundColor: 'white',
  },
  textInput: {
    paddingLeft: moderateScale(10),
  },
  textArea: {
    paddingTop: moderateVerticalScale(10), // Adds padding for multiline text input
    paddingBottom: moderateVerticalScale(10),
    textAlignVertical: 'top',  // Aligns text to the top for a text area
  }
});
