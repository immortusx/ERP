import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {FlatList} from 'react-native-gesture-handler';

const SearchEnquiryFieldList = () => {
  const navigation = useNavigation();
   const [isFocus, setIsFocus] = useState(false);
  const listdata = useSelector(state => state.listdata.listdata);
  console.log(listdata, '**********************');

  const itemsToDisplay =
    Array.isArray(listdata) && listdata.length > 0 ? listdata[0] : [];

  return (
    <View style={styles.container}>
      {itemsToDisplay.length > 0 && (
        <FlatList
          data={itemsToDisplay}
          style={[
            styles.dropdown,
            isFocus && {borderColor: 'blue'},
            {paddingHorizontal: 5},
          ]}
          renderItem={({item, index}) => (
            <TouchableOpacity
              // onPress={() => {
              //   openCategory(item);
              // }}
              key={index}
              style={styles.categoryItem}>
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

export default SearchEnquiryFieldList;

const styles = StyleSheet.create({
  container: {
    marginBottom:5,
    height:100,
    backgroundColor: 'white',
  },
  
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
 
});
