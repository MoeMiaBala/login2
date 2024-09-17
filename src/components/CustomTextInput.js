import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { moderateScale, moderateVerticalScale, verticalScale } from 'react-native-size-matters'
import { TextInput } from 'react-native-gesture-handler'

const CustomTextInput = ({title, placeholder, value, onChangeText, bad}) => {
  return (
    <View style={[styles.input, { borderColor: bad ? 'red' : '#e9e9e9' }]}>
        <Text style={styles.title}>{title}</Text>
        <TextInput 
        placeholder={placeholder} 
        value={value} 
        onChangeText={txt => onChangeText(txt)}  // fixed onChangeText
        style={styles.textInput}
        />
    </View>
  )
}

export default CustomTextInput;

const styles = StyleSheet.create({
    input: {
        width: "90%",
        height: verticalScale(42),
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
    },
    textInput: {
        paddingLeft: moderateScale(10),
    }
});
