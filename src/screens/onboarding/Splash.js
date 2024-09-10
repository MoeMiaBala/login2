import { View, Text ,StyleSheet, Image} from 'react-native';
import React from 'react';
import { BG_Color } from '../../utils/Color';
import {moderateScale, moderateVerticalScale, scale, verticalScale} from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

const Splash = () => {
  const navigation=useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('SelectUser');
    }, 3000);
  }, []);
  return (
    <View style={styles.container}>
      {/* find logo and resize scale*/}
      <Image source={require("../../images/logo.png")} style={styles.logo} />
      <Text style={styles.name}>HireHorizon</Text>

      {/* add slogan*/}
      <Text style={styles.slogan}>Connecting You to Flexible Work, One Job at a Time.</Text>
    </View>
  )
}

export default Splash

const styles= StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BG_Color
  },
  logo:{
    width:scale(100),
    height:verticalScale(100)
  },
  name:{
    fontSize: moderateScale(35),
    fontWeight: '600',
    marginTop: moderateVerticalScale(10),
    color: 'black'
  },
  slogan:{
    fontSize: moderateScale(16),
    fontWeight: '600',
    fontStyle: 'italic',
    position:'absolute',
    bottom: moderateVerticalScale(80),
    textDecorationLine:'underline',
    color: 'black'
  }
})