/** 
 * Itt komponens nélkül van kiszervezve a fetch. Először jobbnak gondoltam ezt a megoldást, viszont akkor a hibakezelést mindig az adott komponensnél
 * kell megcsinálni a catch ágnál. Ezért szerintem egyszerűbb lesz hogy van egy külön komponens (Requests.js), amiben elég egyszer implementálni a hibakezelést
*/
import { Alert } from 'react-native'

const fetchHardwareJson = async (ipAddress, hardwareName) => {
    return fetch('http://' + ipAddress + ':8080/' + hardwareName, {
        method: 'GET'
    })
        .then((response) => response.json())
        .catch((error) => {
            Alert.alert('Az adatbázis nem elérhető!')
        });
}

const updateMarker = (ipAddress, markerId) => {
    return fetch('http://' + ipAddress + ':8080/updateMarker/' + markerId, {
        method: 'PUT'
    })

        .catch((error) => {
            Alert.alert('Hiba történt a frissítéskor!')
        });
}

const sendGarbageImage = (ipAddress, imageData) => {
    return fetch('http://' + ipAddress + ':8090/submitOwnImage', {
        method: 'POST',
        body: (imageData)
    })
        .then((response) => response.json())
        // .then(responseJson => {
        //     if(responseJson.isItGarbage==="false"){
        //         saveGarbageMarker(ipAddress,imageData)
        //     }
        // })
        // .then(responseJson => console.log(responseJson))

        .catch((error) => {
            Alert.alert(error.message)
        });
}

const saveGarbageMarker = (ipAddress, imagePath, markerData) => {
    return fetch('http://' + ipAddress + ':8080/saveMarker/' + (parseFloat(markerData.latitude)) + "/" + (parseFloat(markerData.longitude)), {
        method: 'POST',
        body: imagePath
    })
        .then((response) => response.json())
        // .then(responseJson => console.log(responseJson))
        // .then(responseJson => console.log(responseJson))

        .catch((error) => {
            Alert.alert(error.message)
        });
}

const getDailyChallengeResponse = (ipAddress, currentState, previousState) => {
    return fetch('http://' + ipAddress + ':8080/getChallengeResponse', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentState: currentState,previousState:previousState })
    })
        .then((response) => response.json())
    
    // .then(responseJson => console.log(responseJson))
}

const getChallengeById = async (ipAddress, id) => {
    return fetch('http://' + ipAddress + ':8080/challenges/' + id, {
        method: 'GET'
    })
        .then((response) => response.json())
        .catch((error) => {
            Alert.alert('Az adatbázis nem elérhető!')
        });
}




export { fetchHardwareJson, updateMarker, sendGarbageImage, saveGarbageMarker, getDailyChallengeResponse, getChallengeById }