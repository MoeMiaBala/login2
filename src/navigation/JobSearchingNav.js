import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons' // fixed import and usage

const JobSearchingNav = ({ route, navigation }) => {
  return (
    <View style={{ flex: 1, marginTop: 35 }}>

      <View style={{
        flex: 0.18,
        backgroundColor: '#3F6CDF',
        padding: 16
      }}>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center', // alignItems instead of alignContent for proper alignment
          marginTop: 32
        }}>

          <View>
            <Text style={{
              color: '#fff'
            }}>Hello</Text>
            <Text style={{
              color: '#fff', // Changed from View to Text
              fontSize: 24,
              fontWeight: '600'
            }}>User name</Text>
          </View>
          <Ionicons name='notifications-outline' size={24} color='#fff' />
        </View>

        <View style={{
          backgroundColor: '#fff',
          padding: 12,
          borderRadius: 9,
          flexDirection: 'row',
          alignItems: 'center',
          position: 'absolute',
          bottom: -25,
          width: 350,
          alignSelf: 'center'
        }}>
          <Ionicons name='search' size={24} color='#171716' />
          <TextInput
            placeholder='search job, company etc...'
            placeholderTextColor={'#171718'}
            style={{
              marginLeft: 8,
              flex: 1
            }}
          />
        </View>
      </View>

      <View style={{ flex: 0.82, padding: 16 }}>
        <Text style={{
          marginVertical: 32,
          fontSize: 24,
          fontWeight: '600'
        }}>Recommendations</Text>

        <View style={{ height: 200 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{
              backgroundColor: "#fff",
              padding: 16,
              borderRadius: 15,
              width: 300,
              marginRight: 16
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../images/logo.png')} style={{ width: 50, height: 50, borderRadius: 50 }} />{/* Image placeholder */}
                  <View style={{ marginLeft: 8 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>Company name</Text>
                    <Text style={{ fontSize: 12, fontWeight: '400' }}>Company Location</Text>
                  </View>
                </View>
                <Ionicons name='bookmark-outline' size={24} color='#000' />
              </View>

              <Text style={{ marginTop: 16, fontSize: 18, fontWeight: '600' }}>The job title</Text>
              <Text style={{ fontSize: 12, fontWeight: '400' }}>Senior - remote - fulltime</Text>

              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 16,
                justifyContent: 'space-between'
              }}>
                <TouchableOpacity style={{
                  backgroundColor: '#3f6cdf',
                  padding: 12,
                  borderRadius: 16
                }}>
                  <Text style={{ color: '#fff' }}>Apply Now</Text>
                </TouchableOpacity>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '500'
                }}> Salary a year</Text>
              </View>
            </View>

            <View style={{
              backgroundColor: "#fff",
              padding: 16,
              borderRadius: 15,
              width: 300,
              marginRight: 16
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../images/logo.png')} style={{ width: 50, height: 50, borderRadius: 50 }} />{/* Image placeholder */}
                  <View style={{ marginLeft: 8 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>Company name</Text>
                    <Text style={{ fontSize: 12, fontWeight: '400' }}>Company Location</Text>
                  </View>
                </View>
                <Ionicons name='bookmark-outline' size={24} color='#000' />
              </View>

              <Text style={{ marginTop: 16, fontSize: 18, fontWeight: '600' }}>The job title</Text>
              <Text style={{ fontSize: 12, fontWeight: '400' }}>Senior - remote - fulltime</Text>

              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 16,
                justifyContent: 'space-between'
              }}>
                <TouchableOpacity style={{
                  backgroundColor: '#3f6cdf',
                  padding: 12,
                  borderRadius: 16
                }}>
                  <Text style={{ color: '#fff' }}>Apply Now</Text>
                </TouchableOpacity>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '500'
                }}> Salary a year</Text>
              </View>
            </View>
          </ScrollView>
        </View>

        <Text style={{ marginVertical: 32, fontSize: 24, fontWeight: '600' }}>Recent Job Listings</Text>
        <ScrollView showsVerticalScrollIndicator={false}>

          <TouchableOpacity style={{ backgroundColor: '#fff', padding: 16, borderRadius: 9, marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../images/logo.png')} style={{ width: 50, height: 50, borderRadius: 50 }} />{/* Image placeholder */}
                <View style={{ marginLeft: 8 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>Security Engineering</Text>
                  <Text style={{ fontSize: 12, fontWeight: '400' }}>Senior - remote - fulltime</Text>
                </View>
              </View>
              <Ionicons name='bookmark-outline' size={24} color='#000' />
            </View>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 16
            }}>
              <Text style={{ fontSize: 18, fontWeight: '500' }}>Salary a year</Text>
              <Text style={{ fontSize: 12, fontWeight: '400' }}>min ago posted</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ backgroundColor: '#fff', padding: 16, borderRadius: 9, marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../images/logo.png')} style={{ width: 50, height: 50, borderRadius: 50 }} />{/* Image placeholder */}
                <View style={{ marginLeft: 8 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>Security Engineering</Text>
                  <Text style={{ fontSize: 12, fontWeight: '400' }}>Senior - remote - fulltime</Text>
                </View>
              </View>
              <Ionicons name='bookmark-outline' size={24} color='#000' />
            </View>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 16
            }}>
              <Text style={{ fontSize: 18, fontWeight: '500' }}>Salary a year</Text>
              <Text style={{ fontSize: 12, fontWeight: '400' }}>min ago posted</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ backgroundColor: '#fff', padding: 16, borderRadius: 9, marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../images/logo.png')} style={{ width: 50, height: 50, borderRadius: 50 }} />{/* Image placeholder */}
                <View style={{ marginLeft: 8 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>Security Engineering</Text>
                  <Text style={{ fontSize: 12, fontWeight: '400' }}>Senior - remote - fulltime</Text>
                </View>
              </View>
              <Ionicons name='bookmark-outline' size={24} color='#000' />
            </View>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 16
            }}>
              <Text style={{ fontSize: 18, fontWeight: '500' }}>Salary a year</Text>
              <Text style={{ fontSize: 12, fontWeight: '400' }}>min ago posted</Text>
            </View>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </View>
  )
}

export default JobSearchingNav
