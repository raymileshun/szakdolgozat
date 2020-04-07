import React, { Component } from 'react'
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    Picker,
    TextInput,
    TouchableOpacity,
    Button
} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import HardwareSearchSuggestions from './HardwareSearchSuggestions';

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

            areDataSaved:false
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(this.state.areDataSaved && prevState.areDataSaved){
            this.setState({areDataSaved:false})
        } 
    }

    handleButtonPressing() {
        let consumption = parseInt(this.state.selectedCpu.hardwareConsumption) + parseInt(this.state.selectedGpu.hardwareConsumption) + (parseInt(this.state.ramAmount) * parseInt(this.state.selectedRam.hardwareConsumption)) +
            (parseInt(this.state.discWriterAmount) * parseInt(this.state.selectedDiscWriter.hardwareConsumption)) + (parseInt(this.state.waterCoolerAmount) * parseInt(this.state.selectedWaterCooler.hardwareConsumption)) +
            parseInt(this.state.motherBoardConsumption) + parseInt(this.state.motherBoardConsumption) + parseInt(this.state.normalVentillatorConsumption)
        let mean = Math.floor(consumption * this.state.hoursUsedADay * this.state.kwhPriceInHuf / 1000);

        this.props.consumptionCallback(consumption, consumption * this.state.hoursUsedADay, mean, mean * 365, this.state.hoursUsedADay,"PC")

        let dailyPrice=Math.ceil((this.state.selectedGamingconsole.hardwareConsumption * this.state.consoleHoursUsedADay)/1000*this.state.kwhPriceInHuf)
        this.props.consumptionCallback(this.state.selectedGamingconsole.hardwareConsumption, 
                                       this.state.selectedGamingconsole.hardwareConsumption * this.state.consoleHoursUsedADay, 
                                       dailyPrice, 
                                       dailyPrice* 365,
                                       this.state.consoleHoursUsedADay,
                                       "CONSOLE")

        this.setState({areDataSaved:true})
    }


    renderTotalConsumption() {
        let consumption = parseInt(this.state.selectedCpu.hardwareConsumption) + parseInt(this.state.selectedGpu.hardwareConsumption) + (parseInt(this.state.ramAmount) * parseInt(this.state.selectedRam.hardwareConsumption)) +
            (parseInt(this.state.discWriterAmount) * parseInt(this.state.selectedDiscWriter.hardwareConsumption)) + (parseInt(this.state.waterCoolerAmount) * parseInt(this.state.selectedWaterCooler.hardwareConsumption)) +
            parseInt(this.state.motherBoardConsumption) + parseInt(this.state.motherBoardConsumption) + parseInt(this.state.normalVentillatorConsumption)

        return (
            <View>
                <Text>Gép fogyasztása: {consumption} W</Text>
                <Text>Napi átlagfogyasztás: {consumption * this.state.hoursUsedADay} W</Text>
                <Text>Napi üzemeltetési költség (átlag): {Math.floor(consumption * this.state.hoursUsedADay * this.state.kwhPriceInHuf / 1000)} Ft</Text>
                <Text>Évi üzemeltetési költség (átlag): {Math.floor(consumption * this.state.hoursUsedADay * 365 * this.state.kwhPriceInHuf / 1000)} Ft</Text>
            </View>)
    }

    renderGpuPickers() {
        let element = [];
        for (let i = 0; i < this.state.gpuAmount; i++) {
            element.push(<>
                <Autocomplete
                    data={this.state.filteredGpuArray}
                    defaultValue={this.state.filteredGpuArray[0]}
                    onChangeText={(searchedGpu) => this.filterHardwareList({ searchedGpu })}
                    renderItem={({ item, i }) => (
                        <TouchableOpacity onPress={() => this.setState({ selectedGpu: item })}>
                            <Text>{item.hardwareName}</Text>
                        </TouchableOpacity>
                    )}
                />
                <Picker
                    key={this.props.gpus.length}
                    selectedValue={this.state.selectedGpu}
                    onValueChange={(gpu) =>
                        this.setState({ selectedGpu: gpu })}
                >
                    {this.props.gpus.map((gpu) =>
                        <Picker.Item key={gpu.hardwareId} label={gpu.hardwareName} value={gpu}
                        />
                    )}
                </Picker>
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
            <Picker
                key={this.props.gamingConsoles.length}
                selectedValue={this.state.selectedGamingconsole}
                onValueChange={(console) =>
                    this.setState({ selectedGamingconsole: console })}
            >
                {this.props.gamingConsoles.map((console) =>
                    <Picker.Item key={console.hardwareId} label={console.hardwareName} value={console}
                    />
                )}
            </Picker>

            <Picker
                key="consoleHoursAmount"
                selectedValue={this.state.consoleHoursUsedADay}
                onValueChange={(item) =>
                    this.setState({ consoleHoursUsedADay: item })}
            >
                {[0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map(item => (
                    <Picker.Item key={parseInt(item)} label={String(item) + " óra"} value={parseInt(item)}
                    />
                ))}
            </Picker>
        </>)
    }

    renderConsoleInfos() {
        let energyUsedADay=this.state.selectedGamingconsole.hardwareConsumption*this.state.consoleHoursUsedADay
        return (<>
            <View>
                <Text>Konzol fogyasztása: {this.state.selectedGamingconsole.hardwareConsumption} W</Text>
                <Text>Napi átlagfogyasztás: {energyUsedADay} W</Text>
                <Text>Napi üzemeltetési költség (átlag): {Math.ceil(energyUsedADay/1000*this.state.kwhPriceInHuf)} Huf</Text>
                <Text>Évi üzemeltetési költség (átlag): {Math.ceil(energyUsedADay/1000*this.state.kwhPriceInHuf)*365} Huf</Text>
            </View>

        </>)
    }

    getSaveButtonColor(){
        if(!this.state.areDataSaved){
            return null
        } else {
            return "#66ff99"
        }
    }


    render() {
        return (
            <>
                <View>
                    <Autocomplete
                        data={this.state.filteredCpuArray}
                        defaultValue={this.state.filteredCpuArray[0]}
                        onChangeText={(searchedCpu) => this.filterHardwareList({ searchedCpu })}
                        renderItem={({ item, i }) => (
                            <TouchableOpacity onPress={() => this.setState({ selectedCpu: item })}>
                                <Text>{item.hardwareName}</Text>
                            </TouchableOpacity>
                        )}
                    />

                    <Picker
                        key={this.props.cpus.length}
                        selectedValue={this.state.selectedCpu}
                        onValueChange={(cpu) =>
                            this.setState({ selectedCpu: cpu })}
                    >
                        {this.props.cpus.map((cpu) =>
                            <Picker.Item key={cpu.hardwareId} label={cpu.hardwareName} value={cpu}
                            />
                        )}
                    </Picker>


                    {this.renderGpuPickers()}

                    <Picker
                        key="ramAmount"
                        selectedValue={this.state.ramAmount}
                        onValueChange={(item) =>
                            this.setState({ ramAmount: item })}
                    >
                        {[1, 2, 3, 4].map(item => (
                            <Picker.Item key={parseInt(item)} label={String(item) + " X"} value={parseInt(item)}
                            />
                        ))}
                    </Picker>
                    <Picker
                        key={this.props.rams.length}
                        selectedValue={this.state.selectedRam}
                        onValueChange={(ram) =>
                            this.setState({ selectedRam: ram })}
                    >
                        {this.props.rams.map((ram) =>
                            <Picker.Item key={ram.hardwareId} label={ram.hardwareName} value={ram}
                            />
                        )}
                    </Picker>
                    <Picker
                        key="discWriterAmount"
                        selectedValue={this.state.discWriterAmount}
                        onValueChange={(item) =>
                            this.setState({ discWriterAmount: item })}
                    >
                        {[0,1, 2, 3].map(item => (
                            <Picker.Item key={parseInt(item)} label={String(item) + " X"} value={parseInt(item)}
                            />
                        ))}
                    </Picker>
                    <Picker
                        key={this.props.discWriters.length}
                        selectedValue={this.state.selectedDiscWriter}
                        onValueChange={(discWriter) =>
                            this.setState({ selectedDiscWriter: discWriter })}
                    >
                        {this.props.discWriters.map((discWriter) =>
                            <Picker.Item key={discWriter.hardwareId} label={discWriter.hardwareName} value={discWriter}
                            />
                        )}
                    </Picker>

                    <Picker
                        key="waterCoolerAmount"
                        selectedValue={this.state.waterCoolerAmount}
                        onValueChange={(item) =>
                            this.setState({ waterCoolerAmount: item })}
                    >
                        {[0, 1, 2].map(item => (
                            <Picker.Item key={parseInt(item)} label={String(item) + " X"} value={parseInt(item)}
                            />
                        ))}
                    </Picker>
                    <Picker
                        key={this.props.waterCoolers.length}
                        selectedValue={this.state.selectedWaterCooler}
                        onValueChange={(waterCooler) =>
                            this.setState({ selectedWaterCooler: waterCooler })}
                    >
                        {this.props.waterCoolers.map((waterCooler) =>
                            <Picker.Item key={waterCooler.hardwareId} label={waterCooler.hardwareName} value={waterCooler}
                            />
                        )}
                    </Picker>

                    <Picker
                        key="hoursAmount"
                        selectedValue={this.state.hoursUsedADay}
                        onValueChange={(item) =>
                            this.setState({ hoursUsedADay: item })}
                    >
                        {[0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map(item => (
                            <Picker.Item key={parseInt(item)} label={String(item) + " óra"} value={parseInt(item)}
                            />
                        ))}
                    </Picker>
                </View>
                {this.renderTotalConsumption()}

                {this.renderConsolePickers()}

                {this.renderConsoleInfos()}

                <Button
                    title="Adatok mentése"
                    color={this.getSaveButtonColor()}
                    onPress={() => this.handleButtonPressing()}
                />

            </>
        )
    }

}

const styles = StyleSheet.create({
    autocompleteInput: {
        height: 20
    }
});


export default HardwarePicker