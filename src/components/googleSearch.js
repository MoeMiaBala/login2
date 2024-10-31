import React, { useEffect, useRef, useState } from 'react';
import { Text } from 'react-native-web';
import { verticalScale, moderateVerticalScale, moderateScale } from 'react-native-size-matters';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';

const GooglePlacesInput = () => {
  const ref = useRef();
  const [userLocation, setUserLocation] = useState(null);

  return (
    <GooglePlacesAutocomplete
      ref={ref}
      placeholder="Search"
      fetchDetails={true}  // Enable to retrieve detailed info
      onPress={(data, details = null) => {
        console.log('Place data:', data);
        console.log('Place details:', details); // Includes latitude and longitude
      }}
      query={{
        key: 'AIzaSyA7GjbU76fOo3IQs4i2cvpScDlyWxEBTfQ', // Make sure this is a valid key with Places API enabled
        language: 'en',           
        location: userLocation ? `${userLocation.latitude},${userLocation.longitude}` : null,
        radius: 10000, // 10 km radius in meters
      }}
      GooglePlacesDetailsQuery={{
        fields: 'formatted_address,name,geometry', // Fetches address, name, and geometry
      }}
      GooglePlacesSearchQuery={{
        rankby: 'distance',
        type: 'restaurant', // Example type; modify as needed
      }}
      GoogleReverseGeocodingQuery={{
        latlng: userLocation ? `${userLocation.latitude},${userLocation.longitude}` : null,
        result_type: 'street_address',
      }}
      requestUrl={{
        useOnPlatform: 'web',
        url: 'https://maps.googleapis.com/maps/api',
      }}
      debounce={200}             
      styles={{
        textInputContainer: {
          backgroundColor: '#e5e5e5',
          borderWidth: 1,
          borderRadius: moderateScale(10),
          width: '90%',
          margin: moderateVerticalScale(20),
          height: verticalScale(42),
          alignSelf: "center",
          borderColor: 'grey'
        },
        textInput: {
          color: '#333',
          fontSize: 16,
          borderRadius: 9
        },
        predefinedPlacesDescription: {
          color: '#1faadb',
          backgroundColor:'#000'
        },
        container: {
          flex: 1,
        },
        poweredContainer: {
          justifyContent: 'flex-end',
          alignItems: 'center',
          borderBottomRightRadius: 5,
          borderBottomLeftRadius: 5,
          borderColor: '#c8c7cc',
          borderTopWidth: 0.5,
        },
        loader: {
          flexDirection: 'row',
          justifyContent: 'flex-end',
          height: 20,
        },
      }}
    />
  );
};

export default GooglePlacesInput;
