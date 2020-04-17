
import React, { Component } from 'react'
import {
    View,
    Text,
    Dimensions,
    Picker,
    TextInput,
    StyleSheet,
    Button,
    ImageBackground,
    Image,
    TouchableHighlight
} from 'react-native';

import CheckBox from 'react-native-check-box'
import Slider from '@react-native-community/slider';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTv, faMugHot } from '@fortawesome/free-solid-svg-icons'

const kwhPrice = 38

//Erre azért ráférne egy NAGY refaktorálás, mert minden résznek külön létrehoztam checkboxot meg pickert meg stb, és lehetett volna egy templatet készíteni
class PersonalConsumption extends Component {
    constructor(props) {
        super(props)
        this.state = {
            doesHouseHoldHaveInfraredHeater: false,

            airConditionerHoursUsedADay: 0,
            airConditionersDaysUsedAYear: 0,

            heaterHoursUsedADay: 0,
            heaterDaysUsedAYear: 0,

            selectedTvSize: 42,
            selectedTvType: "Led",
            areTvOptionsChecked: false,
            tvSizeMinimumValue: 32,
            tvSizeMaximumValue: 75,
            tvConsumption: 0,
            averageDailyTvHoursWatched: 1,

            //itt nem kell a típust is lementeni mert monitorokból már manapság LCD-s van (de majd LED-esnél is megnézem a későbbiekben az értéket)
            //a napi monitorhasználatot a HardwarePicker oldalról kapjuk meg
            selectedMonitorSize: 16,
            monitorSizeMinimumValue: 14,
            monitorSizeMaximumValue: 20,
            monitorConsumption: 0,

            doesHouseholdHaveAirConditionerOrHeater: false,


            isDarModeUsed: false,
            isPersonVegetarian: false,

            energyPercentageSavedWithDarkMode: 12,

            //attól függően, hogy milyen típusú TV-je van valakinek, meg lehet határozni a TV méretéből hogy hány Wattot fogyaszt
            //(mondjuk nem teljesen, de most durva becslésszámításra jó lesz) - majd később a fogyasztásokat pontosítom méretre lebontva
            displayTypeMultipliers: {
                OLed: 1.78571428571,
                Led: 1.7413,
                LCD: 4.8421,
                Plasma: 6.62,
                CRT: 4.34
            },
            displayTypes: ["OLed", "Led", "LCD", "Plasma", "CRT"],


            foodConsumptions: {
                Beef: 0,
                Chocolate: 0,
                Coffee: 0,
                Lamb: 0,
                Pork: 0,
                Chicken: 0,
                Eggs: 0,
                Vegetables: 0
            },


            plasticConsumptions: {
                BottledCola: 0,
                BottledWater: 0,
                ShoppingBag: 0,
                Straw: 0
            },

            clothesBuyingTypes: ["hetente", "havonta", "félévente", "évente", "nem szoktam"],
            phoneBuyingTypes: ["évente", "kétévente", "háromévente", "amikor elromlik az eddigi"],


            doesPersonConsumeBeef: false,
            doesPersonConsumeLamb: false,
            doesPersonConsumePork: false,
            doesPersonConsumeChicken: false,

            doesPersonUsePaperbags: false,
            weeklyGroceryShoppingsCount: 0,
            doesPersonGoToFastFoodRestaurants: false,
            monthlyFastFoodVisitCount: 0,
            doesPersonGoToTheCinema: false,
            yearlyCinemaVisitCount: 0,
            doesPersonBuyFoodForMovie: false,

            presonsClothesBuyingHabit: "hetente",
            doesPersonBuySeconHandClothesToo: false,

            personsPhoneBuyingHabit: "évente",
            doesPersonBuySecondHandPhonesToo: false,


            doesPersonOwnACar: true,
            //ezer km-ben
            yearlyDistanceTravelledWithCar: 0,
            doesPersonHaveElectricCar: false,
            doesPersonGoToWorkWithCar: true,
            isGoingToWorkPossibleWithPublicTransport: false,

            workPlaceDistanceFromHome: 1,
            airConditionerConsumption: 1500,
            normalHeaterConsumption: 1200,
            infraredHeaterConsumption: 500,

            areDataSaved: false




        }
    }
    getSaveButtonColor() {
        if (!this.state.areDataSaved) {
            return 'red'
        } else {
            return "#66ff99"
        }
    }

    handleButtonPressing() {
        let booleanDataPayload = {
            doesHouseholdHaveInfraredHeater: this.state.doesHouseHoldHaveInfraredHeater,
            isDarkModeUsed: this.state.isDarModeUsed,
            doesPersonBuyFoodForMovie: this.state.doesPersonBuyFoodForMovie,
            doesPersonBuySecondHandClothesToo: this.state.doesPersonBuySeconHandClothesToo,
            doesPersonBuySecondHandPhonesToo: this.state.doesPersonBuySeconHandPhonesToo,
            doesPersonHaveElectricCar: this.state.doesPersonHaveElectricCar,
            doesPersonGoToWorkWithCar: this.state.doesPersonGoToWorkWithCar,
            isGoingToWorkPossibleWithPublicTransport: this.state.isGoingToWorkPossibleWithPublicTransport
        }
        let otherDataPayload = {
            airConditionerHoursUsedADay: this.state.airConditionerHoursUsedADay,
            airConditionersDaysUsedAYear: this.state.airConditionersDaysUsedAYear,
            heaterHoursUsedADay: this.state.heaterHoursUsedADay,
            heaterDaysUsedAYear: this.state.heaterDaysUsedAYear,
            tvConsumption: this.state.tvConsumption,
            averageDailyTvHoursWatched: this.state.averageDailyTvHoursWatched,
            monitorConsumption: this.state.monitorConsumption,
            weeklyGroceryShoppingsCount: this.state.weeklyGroceryShoppingsCount,
            monthlyFastFoodVisitCount: this.state.monthlyFastFoodVisitCount,
            yearlyCinemaVisitCount: this.state.yearlyCinemaVisitCount,
            yearlyDistanceTravelledWithCar: this.state.yearlyDistanceTravelledWithCar,
            personsClothesBuyingHabit: this.state.presonsClothesBuyingHabit,
            personsPhoneBuyingHabit: this.state.personsPhoneBuyingHabit,
            workPlaceDistanceFromHome: this.state.workPlaceDistanceFromHome

        }

        this.props.personalConsumptionPageDataCallback(this.state.foodConsumptions, booleanDataPayload, this.state.plasticConsumptions, otherDataPayload)
        this.setState({ areDataSaved: true })

    }

    loadMeatSlider(loadGivenSlider, meatType) {
        if (loadGivenSlider) {
            let sliderValue;
            switch (meatType) {
                case "BEEF":
                    sliderValue = this.state.foodConsumptions.Beef
                    break;
                case "LAMB":
                    sliderValue = this.state.foodConsumptions.Lamb
                    break;
                case "PORK":
                    sliderValue = this.state.foodConsumptions.Pork
                    break;
                case "CHICKEN":
                    sliderValue = this.state.foodConsumptions.Chicken
                    break;
                default:
                    break;
            }
            return (<>

                <Text style={styles.meatSliderText}>Heti fogyasztás: {sliderValue} kg</Text>
                <Slider
                    style={{ width: Math.round(Dimensions.get('window').width) * 0.95, height: 40 }}
                    step={0.1}
                    minimumValue={0}
                    maximumValue={4}
                    minimumTrackTintColor="#2CE85F"
                    maximumTrackTintColor="#BB6A03"
                    value={parseFloat(sliderValue)}
                    onValueChange={sliderValue => {
                        this.setState({ foodConsumptions: this.getMeatConsumptions(meatType, parseFloat(sliderValue).toFixed(1)) })
                    }}
                />
            </>)
        }
    }

    getMeatConsumptions(meatType, sliderValue) {
        let consumptionDatas = { ...this.state.foodConsumptions }
        switch (meatType) {
            case "BEEF":
                consumptionDatas.Beef = sliderValue
                break;
            case "LAMB":
                consumptionDatas.Lamb = sliderValue
                break;
            case "PORK":
                consumptionDatas.Pork = sliderValue
                break;
            case "CHICKEN":
                consumptionDatas.Chicken = sliderValue
                break;
            default:
                break;
        }
        return consumptionDatas
    }




    componentDidMount() {
        this.setTvConsumption()
        this.setMonitorConsumption()
    }

    setTvConsumption() {
        this.setState({ tvConsumption: Math.ceil(this.state.selectedTvSize * this.getDisplayMultiplier(this.state.selectedTvType)) * this.state.averageDailyTvHoursWatched })
    }

    setMonitorConsumption() {
        if (this.state.isDarModeUsed) {
            let electricityUsage = parseInt(this.state.selectedMonitorSize) * 1.3 * this.props.pcConsumptionData.hardwareDailyUseInHours
            this.setState({ monitorConsumption: Math.ceil(electricityUsage - electricityUsage * this.state.energyPercentageSavedWithDarkMode / 100) })
        } else {
            this.setState({ monitorConsumption: Math.ceil(parseInt(this.state.selectedMonitorSize) * 1.3 * this.props.pcConsumptionData.hardwareDailyUseInHours) })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.selectedTvType !== prevState.selectedTvType) {
            if (this.state.selectedTvType === "CRT") {
                this.setState({ tvSizeMinimumValue: 15 })
                this.setState({ selectedTvSize: 15 })
                this.setState({ tvSizeMaximumValue: 24 })
            } else {
                this.setState({ tvSizeMinimumValue: 32 })
                this.setState({ selectedTvSize: 42 })
                this.setState({ tvSizeMaximumValue: 75 })
            }
            this.setTvConsumption()
        }

        if (this.state.selectedTvSize !== prevState.selectedTvSize) {
            this.setTvConsumption()
        }

        if (this.state.averageDailyTvHoursWatched !== prevState.averageDailyTvHoursWatched) {
            this.setTvConsumption()
        }

        if (this.state.selectedMonitorSize !== prevState.selectedMonitorSize) {
            this.setMonitorConsumption()
        }

        if (this.state.isDarModeUsed !== prevState.isDarModeUsed) {
            this.setMonitorConsumption()
        }
    }


    renderDisplayConsumption(displayType) {
        if (displayType === "TV") {
            return (<>
                <View style={styles.consumptionSection}>
                    <Text style={styles.consumptionText}>Napi fogyasztása: <Text style={styles.consumptionHighlitedText}>{this.state.tvConsumption} Wh</Text></Text>
                    <Text style={styles.consumptionText}>Ez naponta <Text style={styles.consumptionHighlitedText}>{parseFloat(this.state.tvConsumption / 1000 * kwhPrice).toFixed(2)} Ft</Text></Text>
                    <Text style={styles.consumptionText}>Évente <Text style={styles.consumptionHighlitedText}>{parseInt(this.state.tvConsumption / 1000 * 365 * kwhPrice)} Ft</Text></Text>
                </View>
            </>)
        } else {
            return (<>
                <View style={styles.consumptionSection}>
                    <Text style={styles.consumptionText}>Monitor fogyasztása: {this.props.pcConsumptionData.hardwareDailyUseInHours} óra alatt <Text style={styles.consumptionHighlitedText}>{this.state.monitorConsumption} Wh</Text></Text>
                    <Text style={styles.consumptionText}>Naponta: <Text style={styles.consumptionHighlitedText}>{parseFloat(this.state.monitorConsumption / 1000 * kwhPrice).toFixed(2)} Ft</Text></Text>
                    <Text style={styles.consumptionText}>Évente: <Text style={styles.consumptionHighlitedText}>{parseFloat(this.state.monitorConsumption / 1000 * 365 * kwhPrice).toFixed(2)} Ft</Text></Text>
                </View>
            </>)
        }
    }

    renderAirConditionerAndHeaterConsumption() {
        let heaterConsumption = this.state.doesHouseHoldHaveInfraredHeater ? this.state.infraredHeaterConsumption : this.state.normalHeaterConsumption
        return (<>
            <View style={styles.airConditionerHeaterConsumptionSection}>
                <View style={styles.airConditionerHeaterConsumptionPart}>
                    <Text style={styles.consumptionText}>Légkondi átlag napi fogyasztás: <Text style={styles.consumptionHighlitedText}>{this.state.airConditionerHoursUsedADay * this.state.airConditionerConsumption} Wh</Text></Text>
                    <Text style={styles.consumptionText}>Naponta ez <Text style={styles.consumptionHighlitedText}>{parseFloat(this.state.airConditionerHoursUsedADay * this.state.airConditionerConsumption / 1000 * kwhPrice).toFixed(2)} Ft</Text></Text>
                    <Text style={styles.consumptionText}>Évente <Text style={styles.consumptionHighlitedText}>{parseFloat(this.state.airConditionerHoursUsedADay * this.state.airConditionersDaysUsedAYear * this.state.airConditionerConsumption / 1000 * kwhPrice).toFixed(2)} Ft</Text></Text>
                </View>
                <View style={styles.airConditionerHeaterConsumptionPart}>
                    <Text style={styles.consumptionText}>Hősugárzó átlag napi fogyasztás: <Text style={styles.consumptionHighlitedText}>{this.state.heaterHoursUsedADay * heaterConsumption} Wh</Text></Text>
                    <Text style={styles.consumptionText}>Naponta ez <Text style={styles.consumptionHighlitedText}>{parseFloat(this.state.heaterHoursUsedADay * heaterConsumption / 1000 * kwhPrice).toFixed(2)} Ft</Text></Text>
                    <Text style={styles.consumptionText}>Évente <Text style={styles.consumptionHighlitedText}>{parseFloat(this.state.heaterHoursUsedADay * this.state.heaterDaysUsedAYear * heaterConsumption / 1000 * kwhPrice).toFixed(2)} Ft</Text></Text>
                </View>
            </View>
        </>)
    }

    getDisplayMultiplier(displayType) {
        let multiplier;
        switch (displayType.toUpperCase()) {
            case "OLED":
                multiplier = this.state.displayTypeMultipliers.OLed
                break;
            case "LED":
                multiplier = this.state.displayTypeMultipliers.Led
                break;
            case "LCD":
                multiplier = this.state.displayTypeMultipliers.LCD
                break;
            case "PLASMA":
                multiplier = this.state.displayTypeMultipliers.Plasma
                break;
            case "CRT":
                multiplier = this.state.displayTypeMultipliers.CRT
                break;

            default: multiplier = this.state.displayTypeMultipliers.Led
                break;
        }
        return multiplier;
    }


    loadTvOptions() {
        if (this.state.areTvOptionsChecked) {
            return (<>
                <View style={styles.questionSection}>
                    <Text style={styles.questionText}>Milyen típusú TV-je van?</Text>
                    <FontAwesomeIcon style={styles.icon} icon={faTv} size={iconSize} />
                </View>
                <Picker
                    key="TV_Típus"
                    selectedValue={this.state.selectedTvType}
                    onValueChange={(type) =>
                        this.setState({ selectedTvType: type })}
                >
                    {this.state.displayTypes.map((type) =>
                        <Picker.Item key={type} label={type} value={type}
                        />
                    )}
                </Picker>


                <Text style={styles.questionText}>Hány colos TV-je van?</Text>
                <Text style={styles.infoText}>{this.state.selectedTvSize}"</Text>
                <Slider
                    style={{ width: Math.round(Dimensions.get('window').width) * 0.95, height: 40 }}
                    step={1}
                    minimumValue={this.state.tvSizeMinimumValue}
                    maximumValue={this.state.tvSizeMaximumValue}
                    minimumTrackTintColor="#2CE85F"
                    maximumTrackTintColor="#BB6A03"
                    value={this.state.selectedTvSize}
                    onValueChange={selectedTvSize => {
                        this.setState({ selectedTvSize })
                    }}
                />
                <Text style={styles.questionText}>Naponta átlag mennyit nézi?</Text>
                <Picker
                    key="tvConsumptionInHours"
                    selectedValue={this.state.averageDailyTvHoursWatched}
                    onValueChange={(hour) =>
                        this.setState({ averageDailyTvHoursWatched: hour })}
                >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map(hour => (
                        <Picker.Item key={parseInt(hour)} label={String(hour) + " óra"} value={parseInt(hour)}
                        />
                    ))}
                </Picker>
                {this.renderDisplayConsumption("TV")}
                <View style={styles.divisionLine} />

            </>)
        }
    }



    loadMonitorOptions() {
        if (this.props.pcConsumptionData.hardwareDailyUseInHours !== 0) {
            return (<>
                <View style={styles.questionSection}>
                    <Text style={styles.questionText}>Hány colos monitorja van?</Text>
                </View>
                <Text style={styles.infoText}>{this.state.selectedMonitorSize}"</Text>
                <Slider
                    style={{ width: Math.round(Dimensions.get('window').width) * 0.95, height: 40 }}
                    step={1}
                    minimumValue={this.state.monitorSizeMinimumValue}
                    maximumValue={this.state.monitorSizeMaximumValue}
                    minimumTrackTintColor="#2CE85F"
                    maximumTrackTintColor="#BB6A03"
                    value={this.state.selectedMonitorSize}
                    onValueChange={selectedMonitorSize => {
                        this.setState({ selectedMonitorSize })
                    }}
                />
                <CheckBox
                    style={styles.normalCheckboxStyle}
                    onClick={() => {
                        this.setState({
                            isDarModeUsed: !this.state.isDarModeUsed
                        })
                    }}
                    isChecked={this.state.isDarModeUsed}
                    leftText={"Szokott dark mode-ot használni?"}
                />

                {this.renderDisplayConsumption("MONITOR")}

            </>)
        }
    }

    loadMeatConsumptionDatas() {
        if (!this.state.isPersonVegetarian) {
            return (<>
                <View style={styles.questionSection}>
                    <Text style={styles.questionText}>Az alábbi húsok közül miből szokott fogyasztani?</Text>
                </View>
                <View style={styles.meatSectionRow}>
                    <View style={styles.meatIcon}>
                        <Image source={require('../assets/icons/beef.png')} style={styles.customIcon} />
                    </View>
                    <View style={styles.meatElement}>
                        <CheckBox
                            style={styles.meatCheckboxStyle}
                            onClick={() => {
                                this.setState({
                                    doesPersonConsumeBeef: !this.state.doesPersonConsumeBeef
                                })
                            }}
                            isChecked={this.state.doesPersonConsumeBeef}
                            leftText={"Marha"}
                        />
                    </View>
                </View>
                {this.loadMeatSlider(this.state.doesPersonConsumeBeef, "BEEF")}

                <View style={styles.meatSectionRow}>
                    <View style={styles.meatIcon}>
                        <Image source={require('../assets/icons/lamb.png')} style={styles.customIcon} />
                    </View>
                    <View style={styles.meatElement}>
                        <CheckBox
                            style={styles.meatCheckboxStyle}
                            onClick={() => {
                                this.setState({
                                    doesPersonConsumeLamb: !this.state.doesPersonConsumeLamb
                                })
                            }}
                            isChecked={this.state.doesPersonConsumeLamb}
                            leftText={"Bárány"}
                        />
                    </View>
                </View>

                {this.loadMeatSlider(this.state.doesPersonConsumeLamb, "LAMB")}

                <View style={styles.meatSectionRow}>
                    <View style={styles.meatIcon}>
                        <Image source={require('../assets/icons/pork.png')} style={styles.customIcon} />
                    </View>
                    <View style={styles.meatElement}>
                        <CheckBox
                            style={styles.meatCheckboxStyle}
                            onClick={() => {
                                this.setState({
                                    doesPersonConsumePork: !this.state.doesPersonConsumePork
                                })
                            }}
                            isChecked={this.state.doesPersonConsumePork}
                            leftText={"Sertés"}
                        />
                    </View>
                </View>

                {this.loadMeatSlider(this.state.doesPersonConsumePork, "PORK")}

                <View style={styles.meatSectionRow}>
                    <View style={styles.meatIcon}>
                        <Image source={require('../assets//icons/chicken.png')} style={styles.customIcon} />
                    </View>
                    <View style={styles.meatElement}>
                        <CheckBox
                            style={styles.meatCheckboxStyle}
                            onClick={() => {
                                this.setState({
                                    doesPersonConsumeChicken: !this.state.doesPersonConsumeChicken
                                })
                            }}
                            isChecked={this.state.doesPersonConsumeChicken}
                            leftText={"Csirke"}
                        />
                    </View>
                </View>

                {this.loadMeatSlider(this.state.doesPersonConsumeChicken, "CHICKEN")}

                <View style={styles.pickerSection}>
                    {this.loadEggConsumptionPicker()}
                </View>

            </>)
        }
    }

    loadCoffeConsumptionPicker() {
        let consumptionDatas = { ...this.state.foodConsumptions }
        return (<>
            <Picker
                key="dailyCoffeeConsumption"
                selectedValue={consumptionDatas.Coffee}
                onValueChange={(cup) => {
                    consumptionDatas.Coffee = cup;
                    this.setState({ foodConsumptions: consumptionDatas })
                }
                }
            >
                {[0, 1, 2, 3, 4, 5].map(cup => (
                    <Picker.Item key={parseInt(cup)} label={String(cup) + " pohár"} value={parseInt(cup)}
                    />
                ))}
            </Picker>

        </>)
    }

    loadChocolateConsumptionPicker() {
        let consumptionDatas = { ...this.state.foodConsumptions }
        return (<>
            <Picker
                key="weeklyChocolateConsumption"
                selectedValue={consumptionDatas.Chocolate}
                onValueChange={(table) => {
                    consumptionDatas.Chocolate = table;
                    this.setState({ foodConsumptions: consumptionDatas })
                }
                }
            >
                {[0, 1, 2, 3, 4, 5, 6, 7].map(table => (
                    <Picker.Item key={parseInt(table)} label={String(table) + " tábla"} value={parseInt(table)}
                    />
                ))}
            </Picker>

        </>)
    }

    loadEggConsumptionPicker() {
        let consumptionDatas = { ...this.state.foodConsumptions }
        return (<>
            <View style={styles.pickerQuestion}>
                <Text style={styles.pickerQuestionText}>Naponta hány tojást eszik meg átlagosan?</Text>
                <Image source={require('../assets/icons/egg.png')} style={styles.custompPickerIcon} />
            </View>
            <Picker
                key="dailyEggConsumption"
                selectedValue={consumptionDatas.Eggs}
                onValueChange={(egg) => {
                    consumptionDatas.Eggs = egg;
                    this.setState({ foodConsumptions: consumptionDatas })
                }
                }
            >
                {[0, 1, 2, 3, 4, 5].map(egg => (
                    <Picker.Item key={parseInt(egg)} label={String(egg) + " tojás"} value={parseInt(egg)}
                    />
                ))}
            </Picker>

        </>)
    }

    loadPlasticPollutionOptions() {
        return (<>
            <View style={styles.pickerQuestion}>
                <Text style={styles.consumptionsHeaderText}>Palackozott ital heti fogyasztás</Text>
                <Image source={require('../assets/icons/plastic-bottle.png')} style={styles.plasticIcon} />
            </View>
            <View style={styles.plasticConsumptionViewStyle}>
                <View style={styles.flexView}>
                    <Text style={{ textAlign: 'center' }}>Kóla:</Text>
                    <TextInput
                        style={styles.TextInputStyle}
                        placeholder="palack"
                        keyboardType="numeric"
                        onChangeText={(number) => this.onChanged(number, "KOLA")}
                        value={this.state.plasticConsumptions.BottledCola}
                        maxLength={1}
                    />
                </View>
                <View style={styles.flexView}>
                    <Text style={{ textAlign: 'center' }}>Víz:</Text>
                    <TextInput
                        style={styles.TextInputStyle}
                        placeholder="palack"
                        keyboardType="numeric"
                        onChangeText={(number) => this.onChanged(number, "VIZ")}
                        value={this.state.plasticConsumptions.BottledWater}
                        maxLength={1}
                    />
                </View>
            </View>
            <View style={styles.pickerQuestion}>
                <Text style={styles.groceryHeaderText}>Élelmiszervásárlás</Text>
                <Image source={require('../assets/icons/shopping.png')} style={styles.groceryIcon} />
            </View>
            <View style={styles.plasticConsumptionViewStyle}>
                <View style={styles.flexView}>
                    <Text style={{ textAlign: 'center', marginBottom: 20 }}>Heti vásárlás:</Text>
                    <TextInput
                        style={styles.groceryTextInputStyle}
                        placeholder="alkalom"
                        keyboardType="numeric"
                        onChangeText={(number) => this.setState({ weeklyGroceryShoppingsCount: number.replace(/[^0-9]/g, '') })}
                        value={this.state.weeklyGroceryShoppingsCount}
                        maxLength={1}
                    />
                </View>
                <View style={styles.flexView}>
                    <Text style={{ textAlign: 'center' }}>Egy alkalomkor vásárolt műanyag szatyrok:</Text>
                    <TextInput
                        style={styles.groceryTextInputStyle}
                        placeholder="darab"
                        keyboardType="numeric"
                        onChangeText={(number) => this.onChanged(number, "SZATYOR")}
                        value={this.state.plasticConsumptions.ShoppingBag}
                        maxLength={1}
                    />
                </View>
            </View>

            <CheckBox
                style={styles.checkboxStyle}
                onClick={() => {
                    this.setState({
                        doesPersonGoToFastFoodRestaurants: !this.state.doesPersonGoToFastFoodRestaurants
                    })
                }}
                isChecked={this.state.doesPersonGoToFastFoodRestaurants}
                leftText={("Szokott gyorséttermekbe járni?").toUpperCase()}
                leftTextStyle={styles.checkboxText}
            />

            {this.loadFastFoodOptions()}

            <CheckBox
                style={styles.checkboxStyle}
                onClick={() => {
                    this.setState({
                        doesPersonGoToTheCinema: !this.state.doesPersonGoToTheCinema
                    })
                }}
                isChecked={this.state.doesPersonGoToTheCinema}
                leftText={("Szokott moziba járni?").toUpperCase()}
                leftTextStyle={styles.checkboxText}
            />

            {this.loadMovieOptions()}


        </>)
    }

    loadFastFoodOptions() {
        if (this.state.doesPersonGoToFastFoodRestaurants) {
            return (<>
                <Text style={styles.pickerQuestionText}>Havonta hány alkalommal?</Text>
                <Picker
                    key="Etterembejaras"
                    selectedValue={this.state.monthlyFastFoodVisitCount}
                    onValueChange={(visitCount) =>
                        this.setState({ monthlyFastFoodVisitCount: visitCount })}
                >
                    {[1, 2, 3, 4, 5, 6].map((visitCount) =>
                        <Picker.Item key={parseInt(visitCount)} label={String(visitCount)} value={parseInt(visitCount)}
                        />
                    )}
                </Picker>
            </>)
        }
    }

    loadMovieOptions() {
        if (this.state.doesPersonGoToTheCinema) {
            return (<>
                <Text style={styles.pickerQuestionText}>Évente hány alkalommal?</Text>
                <Picker
                    key="Mozibajaras"
                    selectedValue={this.state.yearlyCinemaVisitCount}
                    onValueChange={(visitCount) =>
                        this.setState({ yearlyCinemaVisitCount: visitCount })}
                >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map((visitCount) =>
                        <Picker.Item key={parseInt(visitCount)} label={String(visitCount)} value={parseInt(visitCount)}
                        />
                    )}
                </Picker>
                <CheckBox
                    style={styles.normalCheckboxStyle}
                    onClick={() => {
                        this.setState({
                            doesPersonBuyFoodForMovie: !this.state.doesPersonBuyFoodForMovie
                        })
                    }}
                    isChecked={this.state.doesPersonBuyFoodForMovie}
                    leftText={"Vásárol nasit a filmnézéshez?"}
                />
                <View style={styles.divisionLine}></View>
            </>)
        }
    }

    onChanged(number, plasticType) {
        let plasticConsumption = { ...this.state.plasticConsumptions }
        switch (plasticType) {
            case "KOLA":
                plasticConsumption.BottledCola = number.replace(/[^0-9]/g, '')
                break;
            case "VIZ":
                plasticConsumption.BottledWater = number.replace(/[^0-9]/g, '')
                break;
            case "SZATYOR":
                plasticConsumption.ShoppingBag = number.replace(/[^0-9]/g, '')
                break;

            default:
                break;
        }

        this.setState({ plasticConsumptions: plasticConsumption })
    }


    loadAirConditionerAndHeaterOptions() {
        if (this.state.doesHouseholdHaveAirConditionerOrHeater) {
            return (<>
                <Text style={styles.airConditionerHeaterSectionText}>Légkondicionáló</Text>
                <View style={styles.airConditionerAndHeaterView}>
                    <View style={styles.airConditionerHeaterSection}>
                        <Text style={{ textAlign: 'center' }}>Évente körülbelül hány napot használja?</Text>
                        <TextInput
                            style={styles.TextInputStyle}
                            placeholder="nap"
                            keyboardType="numeric"
                            onChangeText={(number) =>
                                this.setState({ airConditionersDaysUsedAYear: this.getConstrainedValue(number, 365) })
                            }
                            value={this.state.airConditionersDaysUsedAYear}
                            maxLength={3}
                        />
                    </View>
                    <View style={styles.airConditionerHeaterSection}>
                        <Text style={{ textAlign: 'center' }}>Naponta körülbelül hány órát használja?</Text>
                        <TextInput
                            style={styles.TextInputStyle}
                            placeholder="óra"
                            keyboardType="numeric"
                            onChangeText={(number) => this.setState({ airConditionerHoursUsedADay: this.getConstrainedValue(number, 24) })}
                            value={this.state.airConditionerHoursUsedADay}
                            maxLength={2}
                        />
                    </View>
                </View>

                <Text style={styles.airConditionerHeaterSectionText}>Hősugárzó</Text>
                <View style={styles.plasticConsumptionViewStyle}>
                    <Text style={{ flex: 3, textAlign: 'center' }}>Évente körülbelül hány napot használja?</Text>
                    <TextInput
                        style={styles.TextInputStyle}
                        placeholder="nap"
                        keyboardType="numeric"
                        onChangeText={(number) =>
                            this.setState({ heaterDaysUsedAYear: this.getConstrainedValue(number, 365) })
                        }
                        value={this.state.heaterDaysUsedAYear}
                        maxLength={3}
                    />
                    <Text style={{ flex: 3, textAlign: 'center' }}>Naponta körülbelül hány órát használja?</Text>
                    <TextInput
                        style={styles.TextInputStyle}
                        placeholder="óra"
                        keyboardType="numeric"
                        onChangeText={(number) => this.setState({ heaterHoursUsedADay: this.getConstrainedValue(number, 24) })}
                        value={this.state.heaterHoursUsedADay}
                        maxLength={2}
                    />
                </View>
                <CheckBox
                    style={styles.normalCheckboxStyle}
                    onClick={() => {
                        this.setState({
                            doesHouseHoldHaveInfraredHeater: !this.state.doesHouseHoldHaveInfraredHeater
                        })
                    }}
                    isChecked={this.state.doesHouseHoldHaveInfraredHeater}
                    leftText={"A fűtőtest infrás?"}
                />

                {this.renderAirConditionerAndHeaterConsumption()}

            </>)
        }
    }

    loadClothesAndPhonesBuyingOptions() {
        return (<>
            <View style={styles.flexTemplate}>
                <Text style={styles.clothesText}>Milyen gyakran vásárol ÚJ ruhákat?</Text>
                <Image source={require('../assets/icons/clothes.png')} style={styles.custompPickerIcon} />
            </View>
            <Picker
                key="ruhavasarlas"
                selectedValue={this.state.presonsClothesBuyingHabit}
                onValueChange={(buyingType) =>
                    this.setState({ presonsClothesBuyingHabit: buyingType })}
            >
                {this.state.clothesBuyingTypes.map((buyingType) =>
                    <Picker.Item key={buyingType} label={buyingType} value={buyingType}
                    />
                )}
            </Picker>

            <CheckBox
                style={styles.normalCheckboxStyle}
                onClick={() => {
                    this.setState({
                        doesPersonBuySeconHandClothesToo: !this.state.doesPersonBuySeconHandClothesToo
                    })
                }}
                isChecked={this.state.doesPersonBuySeconHandClothesToo}
                leftText={"Használt ruhákat is szokott vásárolni?"}
            />
            <View style={styles.divisionLine}></View>


            <View style={styles.flexTemplate}>
                <Text style={styles.clothesText}>Új telefont milyen gyakran vásárol?</Text>
                <Image source={require('../assets/icons/smartphone.png')} style={styles.custompPickerIcon} />
            </View>
            <Picker
                key="telefonvasarlas"
                selectedValue={this.state.personsPhoneBuyingHabit}
                onValueChange={(buyingType) =>
                    this.setState({ personsPhoneBuyingHabit: buyingType })}
            >
                {this.state.phoneBuyingTypes.map((buyingType) =>
                    <Picker.Item key={buyingType} label={buyingType} value={buyingType}
                    />
                )}
            </Picker>

            <CheckBox
                style={styles.normalCheckboxStyle}
                onClick={() => {
                    this.setState({
                        doesPersonBuySecondHandPhonesToo: !this.state.doesPersonBuySeconHandPhonesToo
                    })
                }}
                isChecked={this.state.doesPersonBuySecondHandPhonesToo}
                leftText={"Használt telefont is szokott vásárolni?"}
            />
            <View style={styles.divisionLine}></View>

        </>)
    }

    loadTravellingOptions() {
        if (this.state.doesPersonOwnACar) {
            return (<>
                <View style={styles.plasticConsumptionViewStyle}>
                    <Text style={{ flex: 3, paddingTop: 3 }}>Évente körülbelül hány ezer km-t utazik autóval?</Text>
                    <TextInput
                        style={styles.travellingTextInputStyle}
                        placeholder="km"
                        keyboardType="numeric"
                        onChangeText={(number) => this.setState({ yearlyDistanceTravelledWithCar: this.getConstrainedValue(number, 60) })}
                        value={this.state.yearlyDistanceTravelledWithCar}
                        maxLength={2}
                    />
                </View>

                <CheckBox
                    style={styles.normalCheckboxStyle}
                    onClick={() => {
                        this.setState({
                            doesPersonHaveElectricCar: !this.state.doesPersonHaveElectricCar
                        })
                    }}
                    isChecked={this.state.doesPersonHaveElectricCar}
                    leftText={"Elektromos autója van?"}
                />

                {this.loadWorkGoingOptions()}

            </>)
        }
    }

    loadWorkGoingOptions() {
        let publicTransportCheckBoxComponent =
            <CheckBox
                style={styles.normalCheckboxStyle}
                onClick={() => {
                    this.setState({
                        isGoingToWorkPossibleWithPublicTransport: !this.state.isGoingToWorkPossibleWithPublicTransport
                    })
                }}
                isChecked={this.state.isGoingToWorkPossibleWithPublicTransport}
                leftText={"Megoldható lenne tömegközlekedéssel és/vagy biciklivel a munkába járás?"}
            />
        let workPlaceDistanceComponent = <>
            <Text style={styles.questionText}>Hány kilométerre van a lakásától a munkahelye?</Text>
            <Text style={styles.infoText}>{this.state.workPlaceDistanceFromHome} km</Text>
            <Slider
                style={{ width: Math.round(Dimensions.get('window').width) * 0.95, height: 40 }}
                step={1}
                minimumValue={1}
                maximumValue={50}
                minimumTrackTintColor="#2CE85F"
                maximumTrackTintColor="#BB6A03"
                value={this.state.workPlaceDistanceFromHome}
                onValueChange={workPlaceDistanceFromHome => {
                    this.setState({ workPlaceDistanceFromHome })
                }}
            />
        </>


        if (!this.state.doesPersonHaveElectricCar) {
            return (<>
                <CheckBox
                    style={styles.normalCheckboxStyle}
                    onClick={() => {
                        this.setState({
                            doesPersonGoToWorkWithCar: !this.state.doesPersonGoToWorkWithCar
                        })
                    }}
                    isChecked={this.state.doesPersonGoToWorkWithCar}
                    leftText={"Munkába is autóval jár?"}
                />
                {this.state.doesPersonGoToWorkWithCar ? workPlaceDistanceComponent : null}
                {this.state.doesPersonGoToWorkWithCar ? publicTransportCheckBoxComponent : null}
            </>)
        }
    }

    getConstrainedValue(number, maximumConstraint) {
        if (number === '') {
            return 0
        }
        let value = parseInt(number.replace(/[^0-9]/g, ''))
        if (value > maximumConstraint) {
            return String(maximumConstraint)
        }
        return String(value)
    }



    render() {

        return (<>
            <CheckBox
                style={styles.checkboxStyle}
                onClick={() => {
                    this.setState({
                        ...this.state.booleanData,
                        areTvOptionsChecked: !this.state.areTvOptionsChecked
                    })
                }}
                isChecked={this.state.areTvOptionsChecked}
                leftText={("Szokott TV-zni, vagy TV-t használni?").toUpperCase()}
                leftTextStyle={styles.checkboxText}
            />
            <View style={styles.divisionLine} />

            {this.loadTvOptions()}


            {this.loadMonitorOptions()}
            <View style={styles.divisionLine} />

            <CheckBox
                style={styles.checkboxStyle}
                onClick={() => {
                    this.setState({
                        doesHouseholdHaveAirConditionerOrHeater: !this.state.doesHouseholdHaveAirConditionerOrHeater
                    })
                }}
                isChecked={this.state.doesHouseholdHaveAirConditionerOrHeater}
                leftText={("Van az otthonában légkondicionáló   és/vagy elektromos fűtőtest?").toUpperCase()}
                leftTextStyle={styles.checkboxText}
            />

            {this.loadAirConditionerAndHeaterOptions()}
            <View style={styles.divisionLine} />

            <CheckBox
                style={styles.checkboxStyle}
                onClick={() => {
                    this.setState({
                        isPersonVegetarian: !this.state.isPersonVegetarian
                    })
                }}
                isChecked={this.state.isPersonVegetarian}
                leftText={("Vegetáriánus vagy vegán?").toUpperCase()}
                leftTextStyle={styles.checkboxText}
            />

            {this.loadMeatConsumptionDatas()}

            <View style={styles.pickerQuestion}>
                <Text style={styles.pickerQuestionText}>Napi kávéfogyasztás</Text>
                <Image source={require('../assets/icons/coffee.png')} style={styles.customCoffeeIcon} />
            </View>
            {this.loadCoffeConsumptionPicker()}

            <View style={styles.pickerQuestion}>
                <Text style={styles.pickerQuestionText}>Heti csokoládé fogyasztás</Text>
                <Image source={require('../assets/icons/chocolate.png')} style={styles.customChocolateIcon} />
            </View>
            {this.loadChocolateConsumptionPicker()}

            <View style={styles.divisionLine}></View>


            {this.loadPlasticPollutionOptions()}

            {this.loadClothesAndPhonesBuyingOptions()}

            <CheckBox
                style={styles.checkboxStyle}
                onClick={() => {
                    this.setState({
                        doesPersonOwnACar: !this.state.doesPersonOwnACar
                    })
                }}
                isChecked={this.state.doesPersonOwnACar}
                leftText={("Rendelkezik autóval?").toUpperCase()}
                leftTextStyle={styles.checkboxText}
            />
            {this.loadTravellingOptions()}

            {/* <Button
                title="Adatok mentése"
                onPress={() => this.handleButtonPressing()}
                color={this.getSaveButtonColor()}
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



        </>)
    }

}

const iconSize = 23;

const styles = StyleSheet.create({
    consumptionsHeaderText: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 10,
        marginLeft: 50
    },
    groceryHeaderText: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 10,
        marginLeft: 110
    },
    clothesText: {
        textAlign: "center",
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 10,
        marginLeft: 20
    },
    plasticConsumptionViewStyle: {
        flex: 1,
        flexDirection: "row",
    },
    flexView: {
        flex: 1
    },
    TextInputStyle: {
        textAlign: 'center',
        height: 40,
        width: '95%',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#009688',
        marginBottom: 10,
        flex: 1,
        marginLeft: 3,
        marginRight: 5
    },
    groceryTextInputStyle: {
        textAlign: 'center',
        height: 40,
        width: '95%',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#d6ac13',
        marginBottom: 10,
        flex: 1,
        marginLeft: 3,
        marginRight: 5
    },
    travellingTextInputStyle: {
        textAlign: 'center',
        height: 40,
        width: '95%',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#d67813',
        marginBottom: 10,
        flex: 1,
        marginLeft: 3,
        marginRight: 10,
        marginTop: 5
    },
    normalCheckboxStyle: {
        flex: 1,
        padding: 10,
        backgroundColor: '#e6e6e6'
    },
    checkboxStyle: {
        flex: 1,
        padding: 10,
        backgroundColor: '#2096f3',
    },
    meatCheckboxStyle: {
        padding: 10,
        paddingRight: 20
    },
    questionSection: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#f2cece'
    },
    questionText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold'
    },
    icon: {
        marginTop: 2,
        marginRight: 130,
        flex: 1,
        color: 'black',
    },
    questionIcon: {
        marginLeft: 10,
        paddingBottom: 5,
    },
    infoText: {
        marginTop: 5,
        textAlign: 'center'
    },
    // airConditionerHeaterConsumptionSection: {
    //     flex: 1,
    //     paddingTop: 5,
    //     paddingBottom: 5,
    //     backgroundColor: '#99ad9b',
    //     flexDirection: 'row'
    // },
    airConditionerHeaterConsumptionSection: {
        flex: 1,
        flexDirection: 'row',

        marginTop: 10,
        marginBottom:10,
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
        width: '100%',
        alignSelf: 'center'
    },
    airConditionerHeaterConsumptionPart: {
        flex: 1
    },
    // consumptionSection: {
    //     paddingTop: 5,
    //     paddingBottom: 5,
    //     backgroundColor: '#99ad9b',
    // },
    consumptionSection: {
        marginTop: 10,
        marginBottom:10,
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
    consumptionText: {
        textAlign: 'center',
    },
    consumptionHighlitedText: {
        fontWeight: 'bold'
    },
    divisionLine: {
        borderBottomWidth: 1
    },

    airConditionerAndHeaterView: {
        flex: 1,
        flexDirection: 'row',
    },
    airConditionerHeaterSection: {
        flex: 1
    },
    airConditionerHeaterSectionText: {
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 5,
        padding: 10,
        fontSize: 16
    },
    checkboxText: {
        color: 'white',
        fontWeight: 'bold'
    },
    meatSectionRow: {
        flex: 1,
        flexDirection: 'row'
    },
    meatElement: {
        flex: 2
    },
    meatIcon: {
        flex: 0.1,
        paddingLeft: 10,
        paddingTop: 10,
    },
    customIcon: {
        width: 25,
        height: 25
    },
    custompPickerIcon: {
        width: 25,
        height: 25,
        marginLeft: 15,
    },
    plasticIcon: {
        width: 25,
        height: 25,
        marginLeft: 15,
        marginTop: 5,
        transform: [{
            rotate: '45deg'
        }]
    },
    groceryIcon: {
        width: 25,
        height: 25,
        marginLeft: 15,
        marginTop: 2
    },
    customCoffeeIcon: {
        width: 20,
        height: 20,
        marginLeft: 15,
    },
    customChocolateIcon: {
        width: 20,
        height: 20,
        marginLeft: 15,
        transform: [{
            rotate: '-45deg'
        }]
    },
    meatSliderText: {
        fontWeight: 'bold',
        padding: 10
    },
    pickerQuestion: {
        flex: 1,
        flexDirection: 'row'
    },
    pickerQuestionText: {
        paddingLeft: 10,
        fontWeight: 'bold',
        fontSize: 14
    },
    pickerSection: {
        paddingTop: 10
    },
    saveButton: {
        backgroundColor: 'red'
    },
    flexTemplate: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 10
    },
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

export default PersonalConsumption