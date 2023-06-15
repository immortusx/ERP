import { StyleSheet } from "react-native";

const style = StyleSheet.create({
    content: {
        marginTop:30,
        marginHorizontal:10,
        backgroundColor: "white",
        paddingVertical: 50,
        paddingHorizontal: 20,
        flex: 1,
        justifyContent: "center",
      },
      inputstyel: {
        marginHorizontal: 10,
        marginBottom: 30,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "black",
      },
      input: {
        paddingVertical: 6,
        paddingHorizontal: 6,
      },
      circleicon:{
          borderRadius: 50,
          width: 50, 
          height: 50, 
          textAlign:"center",
          padding: 10,
          fontSize:20, 
        },
        line: {
          marginTop:22,
          width: 10,
          height:0,
          borderWidth: 1,
          color:"black",
        },
      animatednav:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"center",
        marginTop:30,
      },
      btn:{
        backgroundColor: "blue",
        color: "white",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "black",
      },
})


export default style

