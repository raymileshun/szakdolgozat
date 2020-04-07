import React from 'react';
import App from './App';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TextInput,
    Button,
    Alert
} from 'react-native';
import 'react-native-gesture-handler';

import { createAppContainer } from 'react-navigation'
import { NavigationContainer } from '@react-navigation/native';





class EntryPoint extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ipAddress: '192.168.1.113',
            isButtonpressed: false
        }
    }

    handleButtonPressing(){
        if(this.state.ipAddress!==''){
            this.setState({
                isButtonpressed: true
            })
        } else {
            Alert.alert("Írd be az Ip címet és a portot")
        }
    }


    render() {
        if (!this.state.isButtonpressed) {
            return (
                <View style={styles.ipContainer}>
                    <TextInput
                        style={styles.ipInput}
                        placeholder="IP cím"
                        onChangeText={(ipAddress) => this.setState({ ipAddress })}
                        value={this.state.ipAddress}
                    />
                    <Button
                        title="Belépés"
                        onPress={() => this.handleButtonPressing()}
                    />
                </View>
            )
        }

        return (
            <View>
                <App ipAddress={String(this.state.ipAddress)} />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    ipContainer: {
        flex: 1,
        justifyContent: "center"
    },
    ipInput: {
        backgroundColor: "white",
        alignSelf: "center",
        fontSize: 20
    }
})


export default EntryPoint;