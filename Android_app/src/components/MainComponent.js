import { StyleSheet, View ,SafeAreaView, ScrollView} from 'react-native'
import React from 'react'
import Header from './Header'
import Section from './Section'
import InnerSection from './InnerSection'
import InputSection from './InputSection'
import Content from './Content'
const MainComponent = () => {
  return (
    <ScrollView>
    <SafeAreaView style={styles.content}>
    <View style={styles.main} >
    <Header/>
    <Section/>
    <InnerSection/>
    <InputSection/>
    </View>
    <View style={styles.main2}>
    <Content/>
    </View>
    </SafeAreaView>
    </ScrollView>
  )
}

export default MainComponent

const styles = StyleSheet.create({
content:{
  backgroundColor:'white',
},
  main:{
    marginHorizontal:10,
    marginVertical:10,
    padding:20,
    backgroundColor:'#E6E6FA',
  },
  main2:{
    padding:10,
  }
})




