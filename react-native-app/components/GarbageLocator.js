
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

            challengeObject: ""
        }
    }

    async handleChallengeUpdates(response) {
        if (response.statusCode === 200) {
            await getChallengeById(this.props.ipAddress, response.challengeId)
                //ide jön a push üzenet majd a response.challengeDescriptionnal
                .then(responseJson => this.setState({ challengeObject: responseJson }))
            // this.props.createPushNotification(this.state.challengeObject.challengeDescription);

            setTimeout(() => {
                this.props.createPushNotification(this.state.challengeObject.challengeDescription);
            }, 3500)
        }
    }

    componentDidUpdate(prevProps, prevState) {

        if ((this.state.garbageMarkers.length !== 0 && prevState.garbageMarkers.length !== 0) && this.state.garbageMarkers !== prevState.garbageMarkers) {
            getDailyChallengeResponse(this.props.ipAddress, this.state, prevState)
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
                this.setState({ isImageProcessingPending: true })
                sendGarbageImage(this.props.ipAddress, data)
                    .then(responseJson => {
                        if (responseJson.isItGarbage === "true") {
                            saveGarbageMarker(this.props.ipAddress, responseJson.imagePath, this.state.locationDatas)
                                .then(responseJson => this.handleGarbageSaveResponse(responseJson))
                        } else{
                            this.setState({ isImageProcessingPending: false })
                            return;
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


    handleGarbageSaveResponse = (response) => {
        if (response.statusCode === 200) {
            this.setState({ isImageProcessingPending: false })
            this.onMarkerUpdate();
        }
    }


    render() {
        if (this.state.locationDatas.latitude === 0 || !this.state.loadMap) {
            return (
                <><View>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Térkép betöltés alatt. Kérem Várjon</Text>
                    <Image source={require('../assets/spinner.gif')} style={{ alignSelf: 'center' }} />
                </View></>
            )
        }

        if (this.state.isImageProcessingPending) {
            return (<>
                <Text>Feldolgozás...</Text>
            </>)
        }

        return (
            <>
                <View>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Saját koordináták: </Text>
                    <Text style={{ textAlign: 'center' }}>{this.state.locationDatas.latitude},  {this.state.locationDatas.longitude}</Text>
                </View >

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}>
                    <TouchableHighlight
                        onPress={() => {
                            this.setModalVisible(!this.state.modalVisible);
                        }}
                        style={styles.backModalButton}
                    >
                        <Text style={styles.backModalButtonText}>{"<"} VISSZA</Text>
                    </TouchableHighlight>
                    <View style={{ marginTop: 22 }}>
                        <View style={styles.pictureView}>
                            <Text style={{ fontWeight: 'bold' }}>Feltöltés dátuma:</Text>
                            <Text>{this.state.selectedMarker.uploadDate}</Text>
                            <Image
                                // key={'http://' + this.props.ipAddress + ':8080/getimage/' + this.state.selectedMarker.id}
                                style={styles.garbageImage}
                                source={{ uri: 'http://' + this.props.ipAddress + ':8080/getimage/' + this.state.selectedMarker.id + "?random_number=" + Date.now() }}
                            />

                            <View style={styles.summaryView}>
                                <TouchableHighlight
                                    onPress={() => {
                                        this.state.selectedMarker.isItCollected === "false" ? this.prepareAndSendMarkerUpdateRequest(this.state.selectedMarker.id) : "null"
                                    }}
                                    style={styles.updateButton}
                                >
                                    <Text style={styles.summaryText}>HELY FRISSÍTÉSE</Text>
                                </TouchableHighlight>
                            </View>
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
                            title={"Az ön pozíciója"}
                            description={""}
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
                                        <Text>{marker.latitude}</Text>
                                        <Text>{marker.longitude}</Text>
                                    </View>
                                </Callout>

                            </Marker>


                        )}


                    </MapView>
                </View>

                <View style={styles.summaryView}>
                    <TouchableHighlight
                        onPress={this.handleChoosePhoto}
                        style={styles.summaryButton}>
                        <Text style={styles.summaryText}>KÉP FELTÖLTÉSE</Text>
                    </TouchableHighlight>
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
        width: Math.round(Dimensions.get('window').width),
        height: Math.round(Dimensions.get('window').height) * 0.7
        //...StyleSheet.absoluteFillObject,
    },
    infoWindow: {
        backgroundColor: 'white'
    },
    summaryView: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    summaryButton: {
        backgroundColor: '#ff5722',
        width: '50%',
        borderRadius: 20,
        paddingTop: 5,
        paddingBottom: 5,
    },
    summaryText: {
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
    },
    pictureView: {
        marginTop: 20
    },
    garbageImage: {
        width: 400,
        height: 300,
        alignSelf: 'center'
    },
    updateButton: {
        backgroundColor: '#8ac24a',
        width: '50%',
        borderRadius: 20,
        paddingTop: 5,
        paddingBottom: 5,
    },
    backModalButton: {
        width: '100%',
        backgroundColor: '#0a83a8'
    },
    backModalButtonText: {
        padding: 25,
        marginLeft: '10%',
        color: 'white'
    }
});

export default GarbageLocator