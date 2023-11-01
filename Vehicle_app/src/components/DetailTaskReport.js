import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import moment from 'moment';

const DetailTaskReport = ({route}) => {
    const [employee, setEmployee] = useState('');
    const [taskTypeName, setTaskTypeName] = useState('');
    const [taskName, setTaskName] = useState('');
    const [period, setPeriod] = useState('');
    const [startdate,setStartDate] = useState('')
    const [enddate,setEndDate] = useState('')
    const [taskcount,setTaskCount] = useState('')
    const [taskcompleted,setTaskCompleted] = useState('')
useEffect(() => {
  if (route) {
    const {taskreport} = route.params;
    console.log(taskreport, 'taskreport');
   const  Employee = taskreport.employee;
   const  TaskTypeName = taskreport.tasktype_name;
   const  TaskName = taskreport.task_name;
const Period = taskreport.period_name;
const StartDate = moment(taskreport.startdate).format('YYYY-MM-DD');
const enddate = moment(taskreport.enddate).format('YYYY-MM-DD');
const taskcount = taskreport.taskcount;
const taskcompleted = taskreport.taskCompleted;
     setEmployee(Employee);
     setTaskTypeName(TaskTypeName);
     setTaskName(TaskName);
     setPeriod(Period);
     setStartDate(StartDate);
     setEndDate(enddate);
     setTaskCount(taskcount);
     setTaskCompleted(taskcompleted);
    }
}, [route]);


  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <TouchableOpacity style={styles.taskStyle}>
          <Text style={styles.taskTitle}>{employee}</Text>
          <Text style={styles.taskTitle}>{taskName}</Text>
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
            <Text style={styles.listStyle}>{taskTypeName}</Text>
            <Text style={styles.listStyle}>{period}</Text>
            <Text style={styles.listStyle}>{startdate}</Text>
            <Text style={styles.listStyle}>{enddate}</Text>
            <TouchableOpacity
              style={styles.perfomedTaskBtn}
            //   onPress={() => {
            //     openTaskDetails(item);
            //    }}
                >
              <Text style={[styles.listStyle, styles.taskPerformed]}>
                {taskcompleted}/{taskcount}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DetailTaskReport

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5EEF8',
  },
  modalContent: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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