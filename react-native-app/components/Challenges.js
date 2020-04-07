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

import {fetchHardwareJson} from '../Requests'

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
            {this.state.challenges.map((challenge) =>
                <Text>{challenge.challengeDescription}</Text>
            )}

        </>)
    }
}

export default Challenges