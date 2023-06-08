import { SafeAreaView, StyleSheet, View, ScrollView } from "react-native";
import { FontAwesome,Octicons,MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState,useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { DataTable } from "react-native-paper";
import { Icon,Text, HStack, Pressable, VStack, StatusBar, Divider } from "native-base";

const numberOfItemsPerPageList = [2, 3, 4];
const items = [
  {
    key: 1,
    name: "Page 1",
  },
  {
    key: 2,
    name: "Page 2",
  },
  {
    key: 3,
    name: "Page 3",
  },
];
const Enquiry = () => {
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );
  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, items.length);

  useEffect(() => {
    if (page !== 0) {
      setPage(0);
    }
  }, [numberOfItemsPerPage]);

  const navigation = useNavigation();
  const pressnewEnquiry = () => {
    navigation.navigate("newenquiry");
  };

  return (
   
      <SafeAreaView style={styles.content}>
        <View>
          <Pressable onPress={pressnewEnquiry}>
            <HStack mt="5" mb="5" justifyContent="flex-end">
            <Icon as={MaterialCommunityIcons} size="5" name="plus-circle-outline"  style={[styles.icon,{ color: 'black' }]}  />    
              <Text>Add Enqiury</Text>
            </HStack>
          </Pressable>
        </View>
        <View style={styles.enquirycontent}>
          <StatusBar />
          <HStack
            px="1"
            py="3"
            justifyContent="space-between"
            alignItems="center"
          >
            <HStack alignItems="center" marginRight={2}>
              <Octicons
                name="columns"
                size={20}
                color="black"
                marginRight={2}
              />
              <Text fontSize={13} >
                COLUMNS
              </Text>
            </HStack>
            <HStack alignItems="center" marginRight={2}>
              <Octicons name="filter" size={20} color="black" marginRight={2} />
              <Text fontSize={13} >
                FILTERS
              </Text>
            </HStack>
            <HStack alignItems="center" marginRight={2}>
              <FontAwesome
                name="bars"
                size={20}
                color="black"
                marginRight={2}
              />
              <Text fontSize={13} >
                DENSITY
              </Text>
            </HStack>
            <HStack alignItems="center" marginRight={2}>
              <MaterialCommunityIcons
                name="export-variant"
                size={20}
                color="black"
                marginRight={2}
              />
              <Text fontSize={13} >
                EXPORT
              </Text>
            </HStack>
          </HStack>
          <DataTable>
          <DataTable.Header>
          <DataTable.Title>No</DataTable.Title>
          <DataTable.Title>First Name</DataTable.Title>
          <DataTable.Title>Last Name</DataTable.Title>
          <DataTable.Title>Phone Number</DataTable.Title>
          <DataTable.Title>Email</DataTable.Title>
          <DataTable.Title>Product</DataTable.Title>
          </DataTable.Header>
            <VStack alignItems="center">
              <Text style={styles.enquirytext}>
                There is no Enquiry with current branch
              </Text>
            </VStack>
            <Divider/>
            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(items.length / numberOfItemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${items.length}`}
              showFastPaginationControls
              numberOfItemsPerPageList={numberOfItemsPerPageList}
              numberOfItemsPerPage={numberOfItemsPerPage}
              onItemsPerPageChange={onItemsPerPageChange}
              selectPageDropdownLabel={"Rows per page"}
            />
            </DataTable>
        </View>
      </SafeAreaView>
  );
};

export default Enquiry;

const styles = StyleSheet.create({
  enquirycontent: {
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingTop: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },

  enquirytext: {
    marginVertical:150,
  },
});
