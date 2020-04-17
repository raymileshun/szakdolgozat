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

import { fetchHardwareJson } from '../Requests'

class Challenges extends Component {

    constructor(props) {
        super(props)
        this.state = {
            challenges: []
        }
    }

    async componentDidMount() {
        await fetchHardwareJson(this.props.ipAddress, 'challenges')
            .then(response => this.setState({ challenges: response }))
    }


    render() {
        return (<>
            <View style={styles.challengesView}>
                {this.state.challenges.map((challenge) =>
                    <View style={challenge.isItCompleted?styles.challengeCompletedContainer:styles.challengeNotCompletedContainer}>
                        <Text style={challenge.isItCompleted?styles.challengeCompletedText:styles.challengeText}>{String(challenge.challengeDescription).toUpperCase()}</Text>
                        {challenge.isItCompleted?<Image source={require('../assets/icons/checkmark.png')} style={styles.icon} />:null}
                    </View>
                )}
            </View>

        </>)
    }
}

const styles = StyleSheet.create({
    challengesView: {
        padding: 20
    },
    challengeCompletedContainer:{
        borderWidth: 4,
        borderRadius: 20,
        borderColor: '#00c230',
        paddingTop:10,
        paddingBottom:10,
        marginBottom:20,
        flex:1,
        flexDirection:'row'
    },
    challengeNotCompletedContainer:{
        borderWidth: 4,
        borderRadius: 20,
        borderColor: '#c20000',
        paddingTop:10,
        paddingBottom:10,
        marginBottom:20
    },
    challengeText:{
        textAlign:'center'
    },
    challengeCompletedText:{
        flex:2,
        marginTop:5,
        marginLeft:10
    },
    icon:{
        width:30,
        height:30,
        flex:1,
        marginTop:0,
        resizeMode:'contain'
    }
})

export default Challenges