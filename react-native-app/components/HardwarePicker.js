import React, { Component } from 'react'
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    Picker,
    TextInput,
    TouchableOpacity,
    Button,
    Image,
    TouchableHighlight
} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import HardwareSearchSuggestions from './HardwareSearchSuggestions';
import { text } from '@fortawesome/fontawesome-svg-core';

//Későbbiekben refaktorálom majd, mert ráfér
class HardwarePicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            areSuggestionsVisible: 'true',
            searchedCpu: "",
            searchedGpu: "",
            filteredCpuArray: [],
            filteredGpuArray: [],
            selectedCpu: "",
            selectedGpu: "",
            selectedRam: "",
            selectedWaterCooler: "",
            selectedDiscWriter: "",
            selectedGamingconsole: "",
            gpuAmount: 1,
            ramAmount: 1,
            discWriterAmount: 0,
            waterCoolerAmount: 0,
            totalConsumption: 0,
            motherBoardConsumption: 60,
            hddConsumption: 20,
            normalVentillatorConsumption: 6,
            hoursUsedADay: 4,
            consoleHoursUsedADay: 3,
            kwhPriceInHuf: 38,

            areDataSaved: false,

            renderPCInfos: false,
            renderConsoleInfos: false
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.areDataSaved && prevState.areDataSaved) {
            this.setState({ areDataSaved: false })
        }
    }

    handleButtonPressing() {
        let consumption = parseInt(this.state.selectedCpu.hardwareConsumption) + parseInt(this.state.selectedGpu.hardwareConsumption) + (parseInt(this.state.ramAmount) * parseInt(this.state.selectedRam.hardwareConsumption)) +
            (parseInt(this.state.discWriterAmount) * parseInt(this.state.selectedDiscWriter.hardwareConsumption)) + (parseInt(this.state.waterCoolerAmount) * parseInt(this.state.selectedWaterCooler.hardwareConsumption)) +
            parseInt(this.state.motherBoardConsumption) + parseInt(this.state.motherBoardConsumption) + parseInt(this.state.normalVentillatorConsumption)
        let mean = Math.floor(consumption * this.state.hoursUsedADay * this.state.kwhPriceInHuf / 1000);

        this.props.consumptionCallback(consumption, consumption * this.state.hoursUsedADay, mean, mean * 365, this.state.hoursUsedADay, "PC")

        let dailyPrice = Math.ceil((this.state.selectedGamingconsole.hardwareConsumption * this.state.consoleHoursUsedADay) / 1000 * this.state.kwhPriceInHuf)
        this.props.consumptionCallback(this.state.selectedGamingconsole.hardwareConsumption,
            this.state.selectedGamingconsole.hardwareConsumption * this.state.consoleHoursUsedADay,
            dailyPrice,
            dailyPrice * 365,
            this.state.consoleHoursUsedADay,
            "CONSOLE")

        this.setState({ areDataSaved: true })
    }


    renderTotalConsumption() {
        let consumption = parseInt(this.state.selectedCpu.hardwareConsumption) + parseInt(this.state.selectedGpu.hardwareConsumption) + (parseInt(this.state.ramAmount) * parseInt(this.state.selectedRam.hardwareConsumption)) +
            (parseInt(this.state.discWriterAmount) * parseInt(this.state.selectedDiscWriter.hardwareConsumption)) + (parseInt(this.state.waterCoolerAmount) * parseInt(this.state.selectedWaterCooler.hardwareConsumption)) +
            parseInt(this.state.motherBoardConsumption) + parseInt(this.state.motherBoardConsumption) + parseInt(this.state.normalVentillatorConsumption)

        return (
            <View>
                <Text style={styles.consumptionText}>Gép fogyasztása: <Text style={styles.highlitedText}>{consumption} W</Text></Text>
                <Text style={styles.consumptionText}>Napi átlagfogyasztás: <Text style={styles.highlitedText}>{consumption * this.state.hoursUsedADay} Wh</Text></Text>
                <Text style={styles.consumptionText}>Napi üzemeltetési költség (átlag): <Text style={styles.highlitedText}>{Math.floor(consumption * this.state.hoursUsedADay * this.state.kwhPriceInHuf / 1000)} Ft</Text></Text>
                <Text style={styles.consumptionText}>Évi üzemeltetési költség (átlag): <Text style={styles.highlitedText}>{Math.floor(consumption * this.state.hoursUsedADay * 365 * this.state.kwhPriceInHuf / 1000)} Ft</Text></Text>
            </View>)
    }

    //ha több videókártyával rendelkezne az illető
    renderGpuPickers() {
        let element = [];
        for (let i = 0; i < this.state.gpuAmount; i++) {
            element.push(<>
                <Picker
                    key={'GPUS' + this.props.gpus.length}
                    selectedValue={this.state.selectedGpu}
                    onValueChange={(gpu) =>
                        this.setState({ selectedGpu: gpu })}
                >
                    {this.props.gpus.map((gpu) =>
                        <Picker.Item key={'GPU' + gpu.hardwareId} label={gpu.hardwareName} value={gpu}
                        />
                    )}
                </Picker>
                <Autocomplete
                    data={this.state.filteredGpuArray}
                    defaultValue={this.state.filteredGpuArray[0]}
                    onChangeText={(searchedGpu) => this.filterHardwareList({ searchedGpu })}
                    renderItem={({ item, i }) => (
                        <TouchableOpacity onPress={() => {
                            this.setState({ selectedGpu: item })
                            this.setState({ filteredGpuArray: [] })
                        }}>
                            <Text>{item.hardwareName}</Text>
                        </TouchableOpacity>
                    )}
                />

            </>
            )
        }
        return element;
    }

    filterHardwareList(searchedHardware) {
        let hardwareName = Object.keys(searchedHardware)[0]
        let searchedText = Object.values(searchedHardware)[0]

        if (hardwareName === 'searchedCpu') {
            this.setState({ filteredCpuArray: this.props.cpus.filter(cpu => (cpu.hardwareName.toUpperCase()).includes(searchedText.toUpperCase())) }, () => { });
        } else if (hardwareName === 'searchedGpu') {
            this.setState({ filteredGpuArray: this.props.gpus.filter(gpu => (gpu.hardwareName.toUpperCase()).includes(searchedText.toUpperCase())) }, () => { });

        }
    }

    getSelectedHardwareFromSuggestion = (selectedHardware, hardwareType) => {
        if (hardwareType === 'CPU') {
            this.setState({ selectedCpu: selectedHardware })
        } else if (hardwareType === 'GPU') {
            this.setState({ selectedGpu: selectedHardware })
        }
        /**this.setState({selectedCpu: suggestedHardware})*/
    }
    promisedSetState = (newState) => {
        return new Promise((resolve) => {
            this.setState(newState, () => {
                resolve()
            });
        });
    }


    renderConsolePickers() {
        return (<>
            <Text style={styles.sectionText}>Milyen konzolja van?</Text>
            <Picker
                key={'CONSOLES' + this.props.gamingConsoles.length}
                selectedValue={this.state.selectedGamingconsole}
                onValueChange={(console) =>
                    this.setState({ selectedGamingconsole: console })}
            >
                {this.props.gamingConsoles.map((console) =>
                    <Picker.Item key={'CONSOLE' + console.hardwareId} label={console.hardwareName} value={console}
                    />
                )}
            </Picker>
            <View style={styles.hardwareTypeSection}>
                <Text style={styles.hardwareTypeText}>ÁLTALÁBAN NAPONTA HÁNY ÓRÁT HASZNÁLJA?</Text>
            </View>
            <Picker
                key="consoleHoursAmount"
                selectedValue={this.state.consoleHoursUsedADay}
                onValueChange={(item) =>
                    this.setState({ consoleHoursUsedADay: item })}
            >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map(item => (
                    <Picker.Item key={'CONSOLE_HOURS' + parseInt(item)} label={String(item) + " óra"} value={parseInt(item)}
                    />
                ))}
            </Picker>
        </>)
    }

    renderConsoleInfos() {
        let energyUsedADay = this.state.selectedGamingconsole.hardwareConsumption * this.state.consoleHoursUsedADay
        return (<>
            <View style={styles.consumptionSection}>
                <Text style={styles.consumptionText}>Konzol fogyasztása: <Text style={styles.highlitedText}>{this.state.selectedGamingconsole.hardwareConsumption} W</Text></Text>
                <Text style={styles.consumptionText}>Napi átlagfogyasztás: <Text style={styles.highlitedText}>{energyUsedADay} Wh</Text></Text>
                <Text style={styles.consumptionText}>Napi üzemeltetési költség (átlag): <Text style={styles.highlitedText}>{Math.ceil(energyUsedADay / 1000 * this.state.kwhPriceInHuf)} Huf</Text></Text>
                <Text style={styles.consumptionText}>Évi üzemeltetési költség (átlag): <Text style={styles.highlitedText}>{Math.ceil(energyUsedADay / 1000 * this.state.kwhPriceInHuf) * 365} Huf</Text></Text>
            </View>

        </>)
    }

    getSaveButtonColor() {
        if (!this.state.areDataSaved) {
            return 'red'
        } else {
            return "#66ff99"
        }
    }

    renderPCInformations() {
        if (this.state.renderPCInfos) {
            return (<>
                <View style={styles.pcContainer}>
                    <Text style={styles.sectionText}>Milyen processzor és videókártya van a gépében?</Text>
                    <View style={styles.pcPickers}>

                        <View style={styles.cpuPicker}>
                            <View style={styles.autocompleteContainer}>
                                <Picker
                                    key={'CPUS' + this.props.cpus.length}
                                    selectedValue={this.state.selectedCpu}
                                    onValueChange={(cpu) =>
                                        this.setState({ selectedCpu: cpu })}
                                >
                                    {this.props.cpus.map((cpu) =>
                                        <Picker.Item key={'CPU' + cpu.hardwareId} label={cpu.hardwareName} value={cpu}
                                        />
                                    )}
                                </Picker>
                                <Autocomplete
                                    data={this.state.filteredCpuArray}
                                    defaultValue={this.state.filteredCpuArray[0]}
                                    onChangeText={(searchedCpu) => this.filterHardwareList({ searchedCpu })}
                                    renderItem={({ item, i }) => (
                                        <TouchableOpacity onPress={() => {
                                            this.setState({ selectedCpu: item })
                                            this.setState({ filteredCpuArray: [] })
                                        }}>
                                            <Text>{item.hardwareName}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </View>

                        <View style={styles.gpuPicker}>
                            <View style={styles.autocompleteContainer}>
                                {this.renderGpuPickers()}
                            </View>
                        </View>
                    </View>

                    <View style={styles.otherPickers}>
                        <Text style={styles.sectionText}>Gép egyéb paraméterei</Text>
                        <View style={styles.hardwareTypeSection}>
                            <Text style={styles.hardwareTypeText}>RAM MENNYISÉGE ÉS TÍPUSA</Text>
                        </View>
                        <View style={styles.pickerTable}>
                            <View style={styles.amountStyle}>
                                <Picker
                                    key={"RAMAMOUNTS" + this.props.rams.length}
                                    selectedValue={this.state.ramAmount}
                                    onValueChange={(item) =>
                                        this.setState({ ramAmount: item })}
                                >
                                    {[1, 2, 3, 4].map(item => (
                                        <Picker.Item key={'RAMAMOUNT' + parseInt(item)} label={String(item) + " X"} value={parseInt(item)}
                                        />
                                    ))}
                                </Picker>
                            </View>
                            <View style={styles.otherPickerStyle}>
                                <Picker
                                    key={'RAMS' + this.props.rams.length}
                                    selectedValue={this.state.selectedRam}
                                    onValueChange={(ram) =>
                                        this.setState({ selectedRam: ram })}
                                >
                                    {this.props.rams.map((ram) =>
                                        <Picker.Item key={'RAM' + ram.hardwareId} label={ram.hardwareName} value={ram}
                                        />
                                    )}
                                </Picker>
                            </View>
                        </View>
                        <View style={styles.hardwareTypeSection}>
                            <Text style={styles.hardwareTypeText}>LEMEZ ÍRÓ</Text>
                        </View>
                        <View style={styles.pickerTable}>
                            <View style={styles.amountStyle}>
                                <Picker
                                    key={"DSCWRITERAMOUNTS" + this.props.discWriters.length}
                                    selectedValue={this.state.discWriterAmount}
                                    onValueChange={(item) =>
                                        this.setState({ discWriterAmount: item })}
                                >
                                    {[0, 1, 2, 3].map(item => (
                                        <Picker.Item key={'DSCWRITERAMOUNT' + parseInt(item)} label={String(item) + " X"} value={parseInt(item)}
                                        />
                                    ))}
                                </Picker>
                            </View>
                            <View style={styles.otherPickerStyle}>
                                <Picker
                                    key={'DSCSWRITERS' + this.props.discWriters.length}
                                    selectedValue={this.state.selectedDiscWriter}
                                    onValueChange={(discWriter) =>
                                        this.setState({ selectedDiscWriter: discWriter })}
                                >
                                    {this.props.discWriters.map((discWriter) =>
                                        <Picker.Item key={'WRITER' + discWriter.hardwareId} label={discWriter.hardwareName} value={discWriter}
                                        />
                                    )}
                                </Picker>
                            </View>
                        </View>
                        <View style={styles.hardwareTypeSection}>
                            <Text style={styles.hardwareTypeText}>VÍZHŰTÉS</Text>
                        </View>
                        <View style={styles.pickerTable}>
                            <View style={styles.amountStyle}>
                                <Picker
                                    key={"waterCoolerAmount" + this.props.waterCoolers.length}
                                    selectedValue={this.state.waterCoolerAmount}
                                    onValueChange={(item) =>
                                        this.setState({ waterCoolerAmount: item })}
                                >
                                    {[0, 1, 2].map(item => (
                                        <Picker.Item key={'COOLERAMOUNT' + parseInt(item)} label={String(item) + " X"} value={parseInt(item)}
                                        />
                                    ))}
                                </Picker>
                            </View>
                            <View style={styles.otherPickerStyle}>
                                <Picker
                                    key={'COOLERS' + this.props.waterCoolers.length}
                                    selectedValue={this.state.selectedWaterCooler}
                                    onValueChange={(waterCooler) =>
                                        this.setState({ selectedWaterCooler: waterCooler })}
                                >
                                    {this.props.waterCoolers.map((waterCooler) =>
                                        <Picker.Item key={'COOLER' + waterCooler.hardwareId} label={waterCooler.hardwareName} value={waterCooler}
                                        />
                                    )}
                                </Picker>
                            </View>
                        </View>

                    </View>
                    <View style={styles.hardwareTypeSection}>
                        <Text style={styles.hardwareTypeText}>NAPI HASZNÁLATI IDŐ (AMIT NEM MUNKÁVAL TÖLT)</Text>
                    </View>
                    <Picker
                        key="hoursAmount"
                        selectedValue={this.state.hoursUsedADay}
                        onValueChange={(item) =>
                            this.setState({ hoursUsedADay: item })}
                    >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map(item => (
                            <Picker.Item key={'PCHOURS' + parseInt(item)} label={String(item) + " óra"} value={parseInt(item)}
                            />
                        ))}
                    </Picker>

                    <View style={styles.divisionLine} />

                    <View style={styles.consumptionSection}>
                        {this.renderTotalConsumption()}
                    </View>
                </View>
            </>)
        }
    }

    renderMenuBar(type) {
        switch (type) {
            case "PC":
                return (<>
                    <View style={styles.menuBar}>
                        <Image source={require('../assets/icons/pc.png')} style={styles.pcIcon} />
                        <View style={{ flex: 8, }}>
                            <Text
                                onPress={() => {
                                    this.setState({
                                        renderPCInfos: !this.state.renderPCInfos
                                    })
                                }}
                                style={styles.menuText}
                            >
                                PC
                        </Text></View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            {this.state.renderPCInfos ? <Text style={{ transform: [{ rotate: "-90deg" }] }}>{"<"}</Text> : <Text>{"<"} </Text>}
                        </View>
                    </View>
                </>)
                break;
            case "CONSOLE":
                return (<>
                    <View style={styles.menuBar}>
                        <Image source={require('../assets/icons/console.png')} style={styles.consoleIcon} />
                        <View style={{ flex: 8 }}>
                            <Text
                                onPress={() => {
                                    this.setState({
                                        renderConsoleInfos: !this.state.renderConsoleInfos
                                    })
                                }}
                                style={styles.menuText}
                            >
                                KONZOL
                        </Text></View>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            {this.state.renderConsoleInfos ? <Text style={{ transform: [{ rotate: "-90deg" }] }}>{"<"}</Text> : <Text>{"<"} </Text>}
                        </View>
                    </View>

                </>)

            default:
                break;
        }
    }

    renderConsoleInformations() {
        if (this.state.renderConsoleInfos) {
            return (<>
                <View>

                    {this.renderConsolePickers()}
                    <View style={styles.divisionLine} />
                    {this.renderConsoleInfos()}

                </View>
            </>)
        }
    }


    render() {
        return (
            <>
                {this.renderMenuBar("PC")}

                {this.renderPCInformations()}

                {this.renderMenuBar("CONSOLE")}

                {this.renderConsoleInformations()}


                {/* <Button
                    title="Adatok mentése"
                    color={this.getSaveButtonColor()}
                    onPress={() => this.handleButtonPressing()}
                    style={styles.saveButton}
                /> */}


                <View style={styles.saveButtonView}>
                    <TouchableHighlight
                        onPress={() => {
                            this.handleButtonPressing();
                        }}
                        style={this.state.areDataSaved ? styles.saveButton : styles.saveButtonDone}
                    >
                        <Text style={styles.buttonText}>ADATOK MENTÉSE</Text>
                    </TouchableHighlight>
                </View>

            </>
        )
    }

}

const styles = StyleSheet.create({
    autocompleteContainer: {
        flex: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1
    },
    pcContainer: {

        flex: 1,
        flexDirection: 'column',
    },
    pcPickers: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    cpuPicker: {
        flex: 1,
    },
    gpuPicker: {
        flex: 1
    },
    otherPickers: {
        flex: 1,
        paddingTop: 100
    },
    sectionText: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    pickerTable: {
        flexDirection: 'row'
    },
    amountStyle: {
        flex: 1
    },
    otherPickerStyle: {
        flex: 2
    },
    hardwareTypeSection: {
        marginTop: 10,
        paddingTop: 5,
        paddingBottom: 5,
        // backgroundColor: '#d6d6d6',
        backgroundColor: '#f0f0f0',
        borderWidth:1,
        borderColor:'grey',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0.65,
        shadowRadius: 3.84,
        elevation: 5,
        width: '95%',
        alignSelf: 'center'
    },
    hardwareTypeText: {
        color: 'black',
        fontWeight: 'bold',
        marginLeft: 5
    },
    divisionLine: {
        backgroundColor: 'white',
        borderBottomColor: '#ebcc8f',
        borderBottomWidth: 6,
        borderRadius: 10,
        width: '80%',
        alignSelf: 'center',
        marginBottom: 5
    },
    consumptionSection: {
        paddingTop: 10,
        backgroundColor: 'white',
        paddingBottom: 10,
        borderColor:'grey',
        borderWidth:1,
        borderRadius: 10,
        width: '90%',
        alignSelf: 'center',
        marginBottom: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0.65,
        shadowRadius: 3.84,
        elevation: 5,
    },
    consumptionText: {
        textAlign: 'center'
    },
    highlitedText: {
        fontWeight: 'bold'
    },
    menuBar: {
        flexDirection: 'row',
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: '#b33900',
        borderBottomWidth: 1
    },
    menuText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
        color: 'white'
    },
    pcIcon: {
        flex: 1,
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
    consoleIcon: {
        flex: 1,
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
    // saveButton: {
    //     marginTop: 20,
    //     paddingTop: 5,
    //     paddingBottom: 5
    // },
    saveButtonView: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    saveButton: {
        backgroundColor: 'green',
        width: '50%',
        borderRadius: 20,
        paddingTop: 5,
        paddingBottom: 5,
    },
    saveButtonDone: {
        backgroundColor: 'red',
        width: '50%',
        borderRadius: 20,
        paddingTop: 5,
        paddingBottom: 5,
    },
    buttonText: {
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
    },
});


export default HardwarePicker