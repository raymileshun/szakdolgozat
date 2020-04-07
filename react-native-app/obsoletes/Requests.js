/**
 * Ez az App.js-be kellett
 * 
  callbackFunction = (hardwareName, childData) => {
    console.log(hardwareName)
    this.setState({ [hardwareName]: childData })
  }
 */







import React, { Component } from 'react'
import { Alert } from 'react-native'

/**TODO: TIMEOUT */

class Requests extends Component {

   async fetchHardwareJson(hardwareName){
      await fetch('http://'+this.props.ipAddress +'/'+ hardwareName, {
         method: 'GET'
      })
         .then((response) => response.json())
         .then((responseJson) => {
            this.props.parentCallback(hardwareName,responseJson)
            /**this.setState({
               [hardwareName]: responseJson
            })*/
         })
         .catch((error) => {
            Alert.alert('Az adatbázis nem elérhető!')
         });
   }

   constructor(props) {
      super(props);
   }
   
   async componentDidMount() {
       await this.fetchHardwareJson('cpus')
       await this.fetchHardwareJson('gpus')
   }
   render(){
      return(<></>)
   }



 
}
export default Requests
