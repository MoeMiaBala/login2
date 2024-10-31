import { View, Text, SafeAreaView, } from 'react-native'
import React from 'react'
import Splash from '../screens/onboarding/Splash'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import JobPostingNav from './JobPostingNav';
import JobSearching from './JobSearchingNav';
import Profile from '../screens/profile';
import SelectUser from '../screens/onboarding/SelectUser';
import SettingsScreen from '../screens/settings';
import JobPostsScreen from '../screens/jobs';
import EmployerDashboard from '../screens/employerD';
import JobFormScreen from '../screens/jobform';
import JobSearchingNav from './JobSearchingNav';
import EditProfileScreen from '../screens/editProfile';
import ApplicantProfile from '../screens/applicantProfile';
import ScheduleScreen from '../screens/schedule';
import JobDetailScreen from '../screens/jobApplicant';
import EmployerProfileScreen from '../screens/employerProfile';

const Stack = createStackNavigator();


const MainNavigator = () => {
  return (
    <SafeAreaProvider style={{ flex: 1}}>
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

            <Stack.Screen name='Settings'
            component={SettingsScreen}
            options={{headerShown:false}}/>

            <Stack.Screen name='Posts'
            component={JobPostsScreen}
            options={{headerShown:false}}/>

            <Stack.Screen name='EmployerDashboard'
            component={EmployerDashboard}
            options={{headerShown:false}}/>

            <Stack.Screen name='JobForm'
            component={JobFormScreen}
            options={{headerShown:false}}/>

            <Stack.Screen name='applicantJobSearch'
            component={JobSearchingNav}
            options={{headerShown:false}}/>

            <Stack.Screen name='EditProfileScreen'
            component={EditProfileScreen}
            options={{headerShown:false}}/>

            <Stack.Screen name='ApplicantProfile'
            component={ApplicantProfile}
            options={{headerShown:false}}/>

            <Stack.Screen name='Schedule'
            component={ScheduleScreen}
            options={{headerShown:false}}/>

            <Stack.Screen name='JobDetail'
            component={JobDetailScreen}
            options={{headerShown:false}}/>

            <Stack.Screen name='EmployerP'
            component={EmployerProfileScreen}
            options={{headerShown:false}}/>

        </Stack.Navigator>
      </NavigationContainer>

    </SafeAreaProvider>
      
       
  )
};

export default MainNavigator