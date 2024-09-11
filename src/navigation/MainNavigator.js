import { View, Text } from 'react-native'
import React from 'react'
import Splash from '../screens/onboarding/Splash'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import JobPostingNav from './JobPostingNav';
import JobSearching from './JobSearchingNav';
import Profile from '../screens/profile';
import SelectUser from '../screens/onboarding/SelectUser';

const Stack = createStackNavigator();


const MainNavigator = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name='Splash' 
            component={Splash} 
            options={{headerShown:false}}/>

            <Stack.Screen name='SelectUser' 
            component={SelectUser} 
            options={{headerShown:false}}/>

            <Stack.Screen name='JobPostingNav' 
            component={JobPostingNav} 
            options={{headerShown:false}}/>

            <Stack.Screen name='JobSearching' 
            component={JobSearching} 
            options={{headerShown:false}}/>

            <Stack.Screen name='Profile'
            component={Profile}
            options={{headerShown:false}}/>

        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigator