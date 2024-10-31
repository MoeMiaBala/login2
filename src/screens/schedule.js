import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  Image
} from 'react-native';
import moment from 'moment';
import Swiper from 'react-native-swiper';
import { auth } from '../../firebaseConfig';
import { updateUserSchedule, fetchUserData, fetchScheduleEvents, updateApplicationStatus } from '../utils/dbActions';

const { width } = Dimensions.get('window');

const TimePickerModal = ({ isVisible, onConfirm, onCancel }) => {
  const [selectedHour, setSelectedHour] = useState(new Date().getHours());
  const [selectedMinute, setSelectedMinute] = useState(new Date().getMinutes());

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  //console.log(hours);

  const renderItem = (item, selected, setSelected) => (
    <TouchableOpacity onPress={() => setSelected(item)}>
      <Text
        style={[
          styles.timeText,
          selected === item && styles.selectedText,
        ]}>
        {item < 10 ? `0${item}` : item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal transparent={true} visible={isVisible} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Time</Text>

          <View style={styles.timePickerContainer}>
            
            <FlatList
              data={hours}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => renderItem(item, selectedHour, setSelectedHour)}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollPicker}
            />
            <Text style={styles.colon}>:</Text>
            <FlatList
              data={minutes}             
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => renderItem(item, selectedMinute, setSelectedMinute)}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollPicker}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onConfirm(selectedHour.toString().padStart(2, '0'), selectedMinute.toString().padStart(2, '0'))}
              style={styles.confirmButton}>
              <Text style={styles.confirmText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function ScheduleScreen({ navigation, route }) {
  const swiper = useRef();
  const [value, setValue] = useState(new Date());
  const [week, setWeek] = useState(0);
  const [ time, setTime ] = useState('');
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [scheduleEvents, setScheduleEvents] = useState([]);
  const { applicantUid } = route.params;

  const user = auth.currentUser;

  useEffect(() => {
    console.log(moment(value).format('ddd MMM DD YYYY'))
    fetchScheduleEvents(user.uid, value, setScheduleEvents, moment); // Fetch schedule events on date change
    //console.log(scheduleEvents);
  }, [value]);

  const handleAddSchedule = async () => {
    const uid = user.uid;  // Current user ID
    const scheduleEntry = {
      date: value.toDateString(),              // Define your selected date
      time: time,              // Define your selected time
      applicantUid: applicantUid       // Define the applicant's UID
    };
    //console.log(scheduleEntry);
  
    try {
      await updateUserSchedule(uid, scheduleEntry);
      await updateApplicationStatus(applicantUid, )
      console.log('Schedule added successfully!');
    } catch (error) {
      console.error('Failed to add schedule:', error);
    }
  };

  const weeks = React.useMemo(() => {
    const start = moment().add(week, 'weeks').startOf('week');

    return [-1, 0, 1].map(adj => {
      return Array.from({ length: 7 }).map((_, index) => {
        const date = moment(start).add(adj, 'week').add(index, 'day');

        return {
          weekday: date.format('ddd'),
          date: date.toDate(),
        };
      });
    });
  }, [week]);

  const handleConfirm = (hour, minute) => {
    //console.log('Selected Time:', `${hour}:${minute}`);
    setTime(`${hour}:${minute}`);
    setIsTimePickerVisible(false);
    // Logic to add the selected time to the schedule
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Schedule</Text>
        </View>

        <View style={styles.picker}>
          <Swiper
            index={1}
            ref={swiper}
            loop={false}
            showsPagination={false}
            onIndexChanged={ind => {
              if (ind === 1) {
                return;
              }
              setTimeout(() => {
                const newIndex = ind - 1;
                const newWeek = week + newIndex;
                setWeek(newWeek);
                setValue(moment(value).add(newIndex, 'week').toDate());
                swiper.current.scrollTo(1, false);
              }, 100);
            }}>
            {weeks.map((dates, index) => (
              <View style={styles.itemRow} key={index}>
                {dates.map((item, dateIndex) => {
                  const isActive =
                    value.toDateString() === item.date.toDateString();
                  return (
                    <TouchableWithoutFeedback
                      key={dateIndex}
                      onPress={() => setValue(item.date)}>
                      <View
                        style={[
                          styles.item,
                          isActive && {
                            backgroundColor: '#111',
                            borderColor: '#111',
                          },
                        ]}>
                        <Text
                          style={[
                            styles.itemWeekday,
                            isActive && { color: '#fff' },
                          ]}>
                          {item.weekday}
                        </Text>
                        <Text
                          style={[
                            styles.itemDate,
                            isActive && { color: '#fff' },
                          ]}>
                          {item.date.getDate()}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                })}
              </View>
            ))}
          </Swiper>
        </View>

        <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 24 }}>
          <Text style={styles.subtitle}>{value.toDateString()}</Text>
          <View style={styles.placeholder}>
            <View style={styles.placeholderInset}>
              {/* Replace with your content */}
              <TouchableOpacity onPress={() => setIsTimePickerVisible(true)}>
                <Text style={styles.addSchedule}>Add Schedule</Text>
              </TouchableOpacity>
              {scheduleEvents.length > 0 ? (
                <FlatList
                  data={scheduleEvents}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.scheduleItem}>
                      <Image source={{ uri: item.image }} style={styles.applicantImage} />
                      <View style={styles.scheduleDetails}>
                        <Text style={styles.applicantName}>{item.name}</Text>
                        <Text style={styles.scheduleTime}>Time scheduled: {item.time}</Text>
                      </View>
                    </View>
                  )}
                />
              ) : (
                <Text style={styles.noEventsText}>No scheduled events</Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => handleAddSchedule()}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Schedule</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TimePickerModal
          isVisible={isTimePickerVisible}
          onConfirm={handleConfirm}
          onCancel={() => setIsTimePickerVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
  },
  header: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  picker: {
    flex: 1,
    maxHeight: 74,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#999999',
    marginBottom: 12,
  },
  footer: {
    marginTop: 'auto',
    paddingHorizontal: 16,
  },
  /** Item */
  item: {
    flex: 1,
    height: 50,
    marginHorizontal: 4,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#e3e3e3',
    flexDirection: 'column',
    alignItems: 'center',
  },
  itemRow: {
    width: width,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  itemWeekday: {
    fontSize: 13,
    fontWeight: '500',
    color: '#737373',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  /** Placeholder */
  placeholder: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    height: 400,
    marginTop: 0,
    padding: 0,
    backgroundColor: 'transparent',
  },
  placeholderInset: {
    borderWidth: 4,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 9,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    TimePickerModal: 10
  },
  addSchedule: {
    backgroundColor: '#e5e7eb', 
    color: '#333',
    padding: 7,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    marginHorizontal: 'auto',
    elevation: 5, borderWidth: 0.3, borderColor : '#000'
  },
  flatListContent: {
    padding: 10, // Add padding to the content
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f2ff', 
    borderRadius: 12,
    padding: 10,
    marginVertical: 10,
    elevation: 2, // Add shadow for elevation
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    margin: 5, borderWidth: 0.5, borderColor : '#007aff'
  },
  applicantImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Circle shape for the image
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#007aff', // Match with add button color
  },
  scheduleDetails: {
    flex: 1,
  },
  applicantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', // Dark gray for text
  },
  scheduleTime: {
    fontSize: 14,
    color: '#666', // Medium gray for time
  },
  noEventsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#f4511e',
    marginTop: 20,
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    borderWidth: 0.7,
    borderColor: '#007aff'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  scrollPicker: {
    
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 18,
    color: '#888',
    marginVertical: 10,
  },
  selectedText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  colon: {
    fontSize: 24,
    color: '#333',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
    borderWidth: 0.7,
    borderColor: '#000'
  },
  confirmButton: {
    backgroundColor: '#e6f2ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 0.7,
    borderColor: '#007aff'
  },
  cancelText: {
    color: 'white',
    fontSize: 16,
  },
  confirmText: {
    color: '#333',
    fontSize: 16,
  },
});