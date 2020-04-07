/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Picker,
  TouchableOpacity,
  Image,
  Modal,
  TouchableHighlight
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import PushNotification from "react-native-push-notification"

import { fetchHardwareJson } from './Requests'
import PersonalConsumption from './components/PersonalConsumption'
import HardwarePicker from './components/HardwarePicker'
import RenewableSimulation from './components/RenewableSimulation'
import GarbageLocator from './components/GarbageLocator'
import Challenges from './components/Challenges'
import TheKey from './components/TheKey'
 


class App extends React.Component {
  constructor(props) {
    PushNotification.configure({
      onRegister: function(token) {
        console.log("TOKEN:", token);
      },
      onNotification: function(notification) {
        console.log("NOTIFICATION:", notification);
        // notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      // senderID: "YOUR GCM (OR FCM) SENDER ID",
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },
      popInitialNotification: true,
      requestPermissions: true
    });

    super(props);
    this.state = {
      cpus: [],
      gpus: [],
      rams: [],
      waterCoolers: [],
      discWriters: [],
      gamingConsoles: [],
      datasAreFetched: false,
      activePage: '',
      activePageText: "",
      pcConsumptionData: {
        hardwareConsumptionInWatts: "",
        hardwareConsumptionPerDay: "",
        hardwareConsumptionPricePerDay: "",
        hardwareConsumptionPricePerYear: "",
        hardwareDailyUseInHours: 0
      },
      consoleConsumptionData: {
        hardwareConsumptionInWatts: "",
        hardwareConsumptionPerDay: "",
        hardwareConsumptionPricePerDay: "",
        hardwareConsumptionPricePerYear: "",
        hardwareDailyUseInHours: 0
      },

      personalConsumptionPageData:{
        foodConsumptions:"",
        booleanData:"",
        plasticConsumptions:"",
        otherData:""
      },

      modalVisible: false,

      pageTexts: {
        HardwarePicker: "Pc és konzol fogyasztásának kiszámítása",
        PersonalConsumption: "Saját fogyasztás kiszámítása",
        RenewableSimulation: "Megújuló energia-szimuláció",
        GarbageLocator: "Szemét térkép",
        TheKey: "...but first it must be found"
      }
    }

    this.consumptionCallback = this.consumptionCallback.bind(this);
    this.personalConsumptionPageDataCallback = this.personalConsumptionPageDataCallback.bind(this)
  }

createPushNotification=(challengeDescription)=>{
    PushNotification.localNotification({
      title: "Challenge teljesítve!", // (optional)
      message: challengeDescription, // (required)
  })
}

  async componentDidMount() {

    await fetchHardwareJson(this.props.ipAddress, 'cpus')
      .then(response => this.setState({ cpus: response }))
    await fetchHardwareJson(this.props.ipAddress, 'gpus')
      .then(response => this.setState({ gpus: response }))
    await fetchHardwareJson(this.props.ipAddress, 'rams')
      .then(response => this.setState({ rams: response }))
    await fetchHardwareJson(this.props.ipAddress, 'watercoolers')
      .then(response => this.setState({ waterCoolers: response }))
    await fetchHardwareJson(this.props.ipAddress, 'discwriters')
      .then(response => this.setState({ discWriters: response }))
    await fetchHardwareJson(this.props.ipAddress, 'consoles')
      .then(response => this.setState({ gamingConsoles: response }))

    this.setState({ datasAreFetched: true })

    this.setState({activePageText:this.state.pageTexts.HardwarePicker})
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.activePage !== prevState.activePage) {
      let pageName;
      switch (this.state.activePage) {
        case "Picker":
          pageName = this.state.pageTexts.HardwarePicker
          break;
        case "PersonalConsumption":
          pageName = this.state.pageTexts.PersonalConsumption
          break;
        case "RenewableSimulation":
          pageName = this.state.pageTexts.RenewableSimulation
          break;
        case "GarbageLocator":
          pageName = this.state.pageTexts.GarbageLocator
          break;
        case "Challenges":
          pageName = this.state.pageTexts.Challenges
          break;
        case "TheKey":
          pageName = this.state.pageTexts.TheKey
          break;
        default:
          break;
      }
      this.setState({ activePageText: pageName })
    }
  }

  renderPage(currentPage) {
    switch (currentPage) {
      case 'Picker':
        return this.loadHardwarePickerSite()
      case 'PersonalConsumption':
        return <PersonalConsumption pcConsumptionData={this.state.pcConsumptionData} consoleConsumptionData={this.state.consoleConsumptionData} personalConsumptionPageDataCallback={this.personalConsumptionPageDataCallback} />
        break;
      case 'RenewableSimulation':
        return <RenewableSimulation />
        break;
      case 'GarbageLocator':
        return <GarbageLocator ipAddress={this.props.ipAddress} createPushNotification={this.createPushNotification}/>
        break;
      case 'Challenges':
        return <Challenges ipAddress={this.props.ipAddress} />
        break;
      case 'TheKey':
        return <TheKey ipAddress={this.props.ipAddress} personalConsumptionData={this.state.personalConsumptionPageData} pcConsumptionData={this.state.pcConsumptionData} consoleConsumptionData={this.state.consoleConsumptionData} />
        break;
      default:
        return this.loadHardwarePickerSite()
        break;
    }
  }

  loadHardwarePickerSite() {
    return <HardwarePicker cpus={this.state.cpus} gpus={this.state.gpus} rams={this.state.rams} waterCoolers={this.state.waterCoolers} discWriters={this.state.discWriters} gamingConsoles={this.state.gamingConsoles} consumptionCallback={this.consumptionCallback} />
  }

  consumptionCallback(consumption, consumptionPerDay, pricePerDay, pricePerYear, dailyUsage, hardwareType) {
    //this.setState({ consumptionDatas: { ...this.state.someProperty, flag: false} });
    let consumptionDatas;
    if (hardwareType === "PC") {
      consumptionDatas = { ...this.state.pcConsumptionData }
    } else if (hardwareType === "CONSOLE") {
      consumptionDatas = { ...this.state.consoleConsumptionData }
    }
    consumptionDatas.hardwareConsumptionInWatts = consumption;
    consumptionDatas.hardwareConsumptionPerDay = consumptionPerDay;
    consumptionDatas.hardwareConsumptionPricePerDay = pricePerDay;
    consumptionDatas.hardwareConsumptionPricePerYear = pricePerYear;
    consumptionDatas.hardwareDailyUseInHours = dailyUsage;
    if (hardwareType === "PC") {
      this.setState({ pcConsumptionData: consumptionDatas })
    } else if (hardwareType === "CONSOLE") {
      this.setState({ consoleConsumptionData: consumptionDatas })
    }
  }


  personalConsumptionPageDataCallback(foodConsumptions,booleanData,plasticConsumptions,otherData){
    let personalConsumptionPageData = {...this.state.personalConsumptionPageData}
    personalConsumptionPageData.foodConsumptions=foodConsumptions
    personalConsumptionPageData.booleanData=booleanData
    personalConsumptionPageData.plasticConsumptions=plasticConsumptions
    personalConsumptionPageData.otherData=otherData

    this.setState({personalConsumptionPageData:personalConsumptionPageData})

  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  handleButtonPress(pageName) {
    this.setState({ activePage: pageName })
    this.setModalVisible(false)
  }

  loadHeader() {
    return (<>
      <Text>{this.state.activePageText}</Text>

    </>)
  }




  render() {
    if (!this.state.datasAreFetched) {
      return (
        <View style={styles.gifContainer}>
          <Image source={require('./assets/spinner.gif')} style={styles.gifImage} />
        </View>
      )
    }

    return (
      <>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.sectionContainer}>
            <TouchableHighlight
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}>
              <Text>{"<"} Vissza</Text>
            </TouchableHighlight>
            <Text style={styles.sectionTitle}></Text>
            <TouchableOpacity onPress={() => this.handleButtonPress("Picker")}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>HardwarePicker</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.handleButtonPress("PersonalConsumption")}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Személyes fogyasztás</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.handleButtonPress("RenewableSimulation")}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Szimuláció</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.handleButtonPress("GarbageLocator")}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Szemét térkép</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>


        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>

            {this.loadHeader()}

            {global.HermesInternal == null ? null : (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
            <View style={styles.body}>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}></Text>
                <TouchableOpacity onPress={() => this.setModalVisible(true)}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Modal</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState({ activePage: 'Picker' })}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>HardwarePicker</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState({ activePage: 'PersonalConsumption' })}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Személyes fogyasztás</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState({ activePage: 'RenewableSimulation' })}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Szimuláció</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState({ activePage: 'GarbageLocator' })}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Szemét térkép</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState({ activePage: 'Challenges' })}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Kihívások</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState({ activePage: 'TheKey' })}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Fogyasztás optimalizálás</Text>
                  </View>
                </TouchableOpacity>
              </View>


              {this.renderPage(this.state.activePage)}



            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  button: {
    marginBottom: 30,
    width: 260,
    alignItems: 'center',
    backgroundColor: '#2196F3'
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: 'white'
  },
  gifContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  gifImage: {
    alignSelf: 'center'
  }


});

export default App;
