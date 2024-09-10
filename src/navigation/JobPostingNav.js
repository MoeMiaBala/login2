import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Login from '../screens/jobposting/Login'
import Signup from '../screens/jobposting/Signup'

const STACK=createStackNavigator() 
const JobPostingNav = () => {
  return (
    <STACK.Navigator>
        <STACK.Screen 
        name='Login' 
        component={Login} 
        options={{headerShown:false}} />

        <STACK.Screen 
        name='Signup' 
        component={Signup} 
        options={{headerShown:false}} />


      {/* Add screens here for other screens */}
    </STACK.Navigator>
  )
}

export default JobPostingNav