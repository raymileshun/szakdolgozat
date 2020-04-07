
import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Button
} from 'react-native';


class HardwareSearchSuggestions extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        if (this.props.filteredArray.length === 0 || this.props.visible === 'false') {
            return (<></>)
        }

        return (
            <View>
                {this.props.filteredArray.map((hardware) =>
                    <TouchableOpacity onPress={() => this.props.selectedHardwareCallback(hardware, this.props.hardwareType)}>
                        <Text>{hardware.hardwareName}</Text>
                    </TouchableOpacity>
                )}
            </View >
        )
    }

}

export default HardwareSearchSuggestions