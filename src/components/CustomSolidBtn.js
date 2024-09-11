import { View, Text ,TouchableOpacity, StyleSheet} from 'react-native'
import React from 'react'
import { moderateScale,moderateVerticalScale, verticalScale } from 'react-native-size-matters'

const CustomSolidBtn = ({title,onClick}) => {
  return (
    <TouchableOpacity style={styles.btn} onPress={() => {
      onClick()
    }}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomSolidBtn;

const styles = StyleSheet.create({
  btn:{
    width: '90%',
    height: verticalScale(40),
    borderRadius: moderateScale(5),
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:moderateVerticalScale(20),
  },
  title:{
    color: 'white',
    fontWeight:"500",
    fontSize: moderateScale(16),
  }
})