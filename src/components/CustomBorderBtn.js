import { View, Text ,TouchableOpacity, StyleSheet} from 'react-native'
import React from 'react'
import { moderateScale,moderateVerticalScale, verticalScale } from 'react-native-size-matters'

const CustomBorderBtn = ({title,onClick}) => {
  return (
    <TouchableOpacity style={styles.btn} onPress={() => {
      onClick()
    }}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomBorderBtn;

const styles = StyleSheet.create({
  btn:{
    width: '90%',
    height: verticalScale(40),
    borderRadius: moderateScale(5),
    backgroundColor:'white',
    borderColor: 'black',
    borderWidth:1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:moderateVerticalScale(20),
  },
  title:{
    color: 'black',
    fontWeight:"500",
    fontSize: moderateScale(16),
  }
})