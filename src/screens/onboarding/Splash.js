import { View, Text, StyleSheet, Image } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { BG_Color, Primary_Color, Secondary_Color } from '../../utils/Color';
import { moderateScale, moderateVerticalScale, scale, verticalScale } from 'react-native-size-matters';

const Splash = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('SelectUser');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require("../../images/logo.png")} style={styles.logo} />
      <Text style={styles.name}>HireHorizon</Text>
      <Text style={styles.slogan}>Connecting You to Flexible Work, One Job at a Time.</Text>
    </View>
  );
}

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BG_Color,
    padding: moderateScale(20),
  },
  logo: {
    width: scale(150),
    height: verticalScale(150),
    resizeMode: 'contain',
    marginBottom: moderateVerticalScale(20),
    borderRadius: 9,
  },
  name: {
    fontSize: moderateScale(40),
    fontWeight: '700',
    color: Primary_Color,
    marginVertical: moderateVerticalScale(10),
  },
  slogan: {
    fontSize: moderateScale(18),
    fontWeight: '400',
    fontStyle: 'italic',
    textAlign: 'center',
    color: Secondary_Color,
    marginTop: moderateVerticalScale(20),
  },
});
