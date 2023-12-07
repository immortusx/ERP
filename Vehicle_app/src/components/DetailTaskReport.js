import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

const DetailTaskReport = ({ route }) => {
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [startDate, setstartDate] = useState('');
  const [EndDate, setEndDate] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    if (route) {
      const { taskreport } = route.params;
      console.log(taskreport, 'taskreport');
      setData(taskreport);
      setstartDate(moment(taskreport.startdate).format('YYYY-MM-DD'));
      setEndDate(moment(taskreport.enddate).format('YYYY-MM-DD'));
    }
  }, [route]);

  const handleCalendarDate = selectedDate => {
    const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
    console.log(formattedDate, 'deliverydgkgr');
    setstartDate(formattedDate);
    setOpenStartDate(false);
  };

  const handleEndDate = selectedDate => {
    const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
    console.log(formattedDate, 'deliverydate');
    setEndDate(formattedDate);
    setOpenEndDate(false);
  };
  return (
    <View style={styles.modalContainer}>
      <View style={styles.textStyle}>
        <View style={styles.touchableOpacityStyle}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
            }}
            onPress={() => {
              setOpenStartDate(true);
            }}>
            <Text style={styles.label}>
              Start Date {':- '}
              {startDate === ''
                ? new Date().toISOString().slice(0, 10)
                : startDate}
            </Text>
            <Image
              style={styles.dateImg}
              source={require('../../assets/date.png')}
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={openStartDate}
            onConfirm={handleCalendarDate}
            mode="date"
            // handleCalendarDate={handleCalendarDate}
            onCancel={() => setOpenStartDate(false)}
          />
        </View>
        <View style={styles.touchableOpacityStyle}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
            }}
            onPress={() => {
              setOpenEndDate(true);
            }}>
            <Text style={styles.label}>
              End Date {':- '}{' '}
              {EndDate === '' ? new Date().toISOString().slice(0, 10) : EndDate}
            </Text>
            <Image
              style={styles.dateImg}
              source={require('../../assets/date.png')}
            />
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={openEndDate}
            onConfirm={handleEndDate}
            mode="date"
            onCancel={() => setOpenStartDate(false)}
          />
        </View>
      </View>
      <View style={styles.modalContent}>
        <TouchableOpacity style={styles.taskStyle}>
          <Text style={styles.taskTitle}>{data.employee}</Text>
          <Text style={styles.taskTitle}>{data.task_name}</Text>
        </TouchableOpacity>
        <View style={styles.dataContainer}>
          <View style={styles.leftContainer}>
            <Text style={styles.taskLabel}>Task Type:</Text>
            <Text style={styles.taskLabel}>Tasks Period:</Text>
            <Text style={styles.taskLabel}>Start Date:</Text>
            <Text style={styles.taskLabel}>End Date:</Text>
            <Text style={styles.taskLabel}>TaskPerformed:</Text>
          </View>
          <View style={styles.rightContainer}>
            <Text style={styles.listStyle}>{data.tasktype_name}</Text>
            <Text style={styles.listStyle}>{data.period_name}</Text>
            <Text style={styles.listStyle}>
              {moment(data.startdate).format('YYYY-MM-DD')}
            </Text>
            <Text style={styles.listStyle}>
              {moment(data.enddate).format('YYYY-MM-DD')}
            </Text>
            <TouchableOpacity style={styles.perfomedTaskBtn}>
              <Text style={[styles.listStyle, styles.taskPerformed]}>
                {data.taskCompleted}/{data.taskcount}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DetailTaskReport;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5EEF8',
  },
  touchableOpacityStyle: {
    backgroundColor: '#2471A3',
    padding: 10,
    borderRadius: 20,
    marginVertical: 8,
  },
  label: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textStyle: {
    backgroundColor: 'white',
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  dateImg: {
    width: 20,
    height: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    elevation: 4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginVertical: 0.9,
  },
  taskStyle: {
    backgroundColor: '#2471A2',
    padding: 10,
    borderRadius: 4,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  dataContainer: {
    flexDirection: 'row',
    marginHorizontal: 12,
    paddingRight: 100,
  },
  leftContainer: {
    alignItems: 'flex-start',
    marginRight: 10,
  },
  rightContainer: {
    alignItems: 'flex-start',
  },
  listStyle: {
    color: '#2C3E50',
    fontWeight: '500',
  },
  taskLabel: {
    fontWeight: '600',
  },
  taskPerformed: {
    color: 'green',
  },
  perfomedTaskBtn: {
    backgroundColor: 'lightblue',
    paddingHorizontal: 12,
    borderRadius: 20,
    marginVertical: 1.5,
  },
});
