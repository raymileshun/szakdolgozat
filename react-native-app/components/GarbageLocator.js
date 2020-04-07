
import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    Modal,
    TouchableHighlight
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';

import GetLocation from 'react-native-get-location'
import ImagePicker from 'react-native-image-picker'
// import { TouchableOpacity } from 'react-native-gesture-handler';

import { fetchHardwareJson, updateMarker, sendGarbageImage, saveGarbageMarker, getDailyChallengeResponse, getChallengeById } from '../Requests'


class GarbageLocator extends Component {
    constructor(props) {
        super(props)
        this.state = {
            garbageMarkers: [],
            locationDatas: {
                latitude: 0,
                longitude: 0
            },
            modalVisible: false,
            loadMap: true,
            selectedMarker: [],
            predictions: "",
            isImageProcessingPending: false,

            challengeObject:""
        }
    }

    async handleChallengeUpdates(response){
        if(response.statusCode===200){
           await getChallengeById(this.props.ipAddress,response.challengeId)
                //ide jön a push üzenet majd a response.challengeDescriptionnal
                .then(responseJson=>this.setState({challengeObject:responseJson}))
            // this.props.createPushNotification(this.state.challengeObject.challengeDescription);

            setTimeout(()=>{
                this.props.createPushNotification(this.state.challengeObject.challengeDescription);
              }, 3500)
        }
    }

    componentDidUpdate(prevProps,prevState){
        
        if((this.state.garbageMarkers.length!==0 && prevState.garbageMarkers.length!==0) && this.state.garbageMarkers!==prevState.garbageMarkers){
            getDailyChallengeResponse(this.props.ipAddress,this.state,prevState)
            .then(responseJson => this.handleChallengeUpdates(responseJson))
        }
    }

    async componentDidMount() {
        await fetchHardwareJson(this.props.ipAddress, 'garbagemarkers')
            .then(response => this.setState({ garbageMarkers: response }))

        this.getLocationDatas()
    }


    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    getLocationDatas() {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
        })
            .then(location => {
                let locationDatas = { ...this.state.locationDatas }
                locationDatas.latitude = location.latitude
                locationDatas.longitude = location.longitude
                this.setState({ locationDatas })
            })
            .catch(error => {
                const { code, message } = error;
                console.warn(code, message);
            })
    }

    prepareAndSendMarkerUpdateRequest(markerId) {
        updateMarker(this.props.ipAddress, markerId)
            .then(async () => await this.onMarkerUpdate())
        // await this.onMarkerUpdate()

    }


    async onMarkerUpdate() {
        this.setModalVisible("false")
        this.setState({ loadMap: false })
        await fetchHardwareJson(this.props.ipAddress, 'garbagemarkers')
            .then(response => this.setState({ garbageMarkers: response }))
        this.setState({ loadMap: true })

    }

    handleChoosePhoto = async () => {
        const options = {
            noData: true,
        }
        ImagePicker.launchImageLibrary(options, response => {
            if (response.uri) {
                let data = this.createFormData(response)
                this.setState({isImageProcessingPending: true})
                sendGarbageImage(this.props.ipAddress, data)
                    .then(responseJson => {
                        if (responseJson.isItGarbage === "false") {
                            saveGarbageMarker(this.props.ipAddress, responseJson.imagePath, this.state.locationDatas)
                            .then(responseJson => this.handleGarbageSaveResponse(responseJson))
                        }
                    })
                // .then(responseJson => this.setState({predictions:responseJson}))
            }
        })
    }

    createFormData = (photo) => {
        const data = new FormData();

        data.append("photo", {
            name: String(photo.fileName),
            type: String(photo.type),
            uri:
                photo.uri
        });

        return data;
    }


    handleGarbageSaveResponse = (response) =>{
        if(response.statusCode===200){
            this.setState({isImageProcessingPending:false})
            this.onMarkerUpdate();
        }
    }


    render() {
        if (this.state.locationDatas.latitude === 0 || !this.state.loadMap) {
            return (
                <><View>
                    <Text>Térkép betöltés alatt</Text>
                </View></>
            )
        }

        if(this.state.isImageProcessingPending){
            return(<>
                <Text>Feldolgozás...</Text>
            </>)
        }

        return (
            <>
                <View>
                    <Text>Saját koordináták: {this.state.locationDatas.latitude},  {this.state.locationDatas.longitude}</Text>
                </View >

                <TouchableHighlight onPress={this.handleChoosePhoto}>
                    <Text>Kép feltöltése</Text>
                </TouchableHighlight>


                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}>
                    <View style={{ marginTop: 22 }}>
                        <View>
                            <Text>{this.state.selectedMarker.latitude}</Text>
                            <Image
                                // key={'http://' + this.props.ipAddress + ':8080/getimage/' + this.state.selectedMarker.id}
                                style={{ width: 250, height: 250 }}
                                source={{ uri: 'http://' + this.props.ipAddress + ':8080/getimage/' + this.state.selectedMarker.id+"?random_number="+Date.now()}} 
                                />

                            <TouchableHighlight
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                }}>
                                <Text>Modal bezárása</Text>
                            </TouchableHighlight>

                            <TouchableHighlight
                                onPress={() => {
                                    this.state.selectedMarker.isItCollected === "false" ? this.prepareAndSendMarkerUpdateRequest(this.state.selectedMarker.id) : "null"
                                }}>
                                <Text>Marker frissítése</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>




                <View style={styles.container}>
                    <MapView
                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={styles.map}
                        region={{
                            latitude: this.state.locationDatas.latitude,
                            longitude: this.state.locationDatas.longitude,
                            latitudeDelta: 0.015,
                            longitudeDelta: 0.0121,
                        }}
                    >

                        <Marker
                            coordinate={{
                                latitude: this.state.locationDatas.latitude,
                                longitude: this.state.locationDatas.longitude
                            }}
                            title={"Initial marker title"}
                            description={"fos"}
                        >
                            <Image source={require('../assets/you-are-here.png')} style={{ height: 40, width: 40 }} />
                        </Marker>

                        {this.state.garbageMarkers.map((marker) =>

                            <Marker
                                coordinate={{
                                    latitude: parseFloat(marker.latitude),
                                    longitude: parseFloat(marker.longitude)
                                }}
                                pinColor={marker.isItCollected === "true" ? "green" : "red"}
                            // title={"talicska"}
                            // description={"fos"}
                            >
                                <Callout tooltip onPress={() => {
                                    this.setState({ selectedMarker: marker }),
                                        this.setModalVisible(true)
                                }}>
                                    <View style={styles.infoWindow}>
                                        <Text>{marker.id}</Text>
                                        <Text>{marker.latitude}</Text>
                                        <Text>{marker.longitude}</Text>
                                    </View>
                                </Callout>

                            </Marker>


                        )}


                    </MapView>
                </View>
            </>
        )
    }

}

const styles = StyleSheet.create({
    container: {

        height: Math.round(Dimensions.get('window').height) * 0.7,
        width: Math.round(Dimensions.get('window').width),
        //justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        width: Math.round(Dimensions.get('window').height) * 0.7,
        height: Math.round(Dimensions.get('window').width)
        //...StyleSheet.absoluteFillObject,
    },
    infoWindow: {
        backgroundColor: 'white'
    }
});

export default GarbageLocator