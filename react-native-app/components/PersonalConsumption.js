
import React, { Component } from 'react'
import {
    View,
    Text,
    Dimensions,
    Picker,
    TextInput,
    StyleSheet,
    Button
} from 'react-native';

import CheckBox from 'react-native-check-box'
import Slider from '@react-native-community/slider';


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

            workPlaceDistanceFromHome:1




        }
    }

    handleButtonPressing() {
        let booleanDataPayload = {
            doesHouseholdHaveInfraredHeater: this.state.doesHouseHoldHaveInfraredHeater,
            isDarModeUsed: this.state.isDarModeUsed,
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
            workPlaceDistanceFromHome:this.state.workPlaceDistanceFromHome

        }

        this.props.personalConsumptionPageDataCallback(this.state.foodConsumptions, booleanDataPayload, this.state.plasticConsumptions, otherDataPayload)

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
                <Text>Heti fogyasztás: {sliderValue} kg</Text>
                <Slider
                    style={{ width: Math.round(Dimensions.get('window').width) * 0.95, height: 40 }}
                    step={0.1}
                    minimumValue={0.1}
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
                <Text>{this.state.tvConsumption} Watt</Text>
            </>)
        } else {
            return (<>
                <Text>{this.props.pcConsumptionData.hardwareDailyUseInHours} óra alatt {this.state.monitorConsumption} Watt-ot fogyaszt</Text>
            </>)
        }


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
                <Text>Milyen típusú TV-je van? {this.state.selectedTvType}</Text>
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


                <Text>Hány colos TV-je van?   {this.state.selectedTvSize}"</Text>
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

            </>)
        }
    }



    loadMonitorOptions() {
        if (this.props.pcConsumptionData.hardwareDailyUseInHours !== 0) {
            return (<>

                <Text>Hány colos monitorja van?   {this.state.selectedMonitorSize}"</Text>
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
                    style={styles.checkboxStyle}
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
                <Text>Az alábbi húsok közül miből szokott fogyasztani?</Text>

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
                {this.loadMeatSlider(this.state.doesPersonConsumeBeef, "BEEF")}

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

                {this.loadMeatSlider(this.state.doesPersonConsumeLamb, "LAMB")}

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

                {this.loadMeatSlider(this.state.doesPersonConsumePork, "PORK")}

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

                {this.loadMeatSlider(this.state.doesPersonConsumeChicken, "CHICKEN")}

                {this.loadEggConsumptionPicker()}

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
            <Text>Naponta hány tojást eszik meg átlagosan?</Text>
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
            <Text style={styles.consumptionsHeaderText}>Palackozott ital heti fogyasztás</Text>
            <View style={styles.plasticConsumptionViewStyle}>
                <Text>Kóla:</Text>
                <TextInput
                    style={styles.TextInputStyle}
                    placeholder="palack"
                    keyboardType="numeric"
                    onChangeText={(number) => this.onChanged(number, "KOLA")}
                    value={this.state.plasticConsumptions.BottledCola}
                    maxLength={1}
                />
                <Text>Víz:</Text>
                <TextInput
                    style={styles.TextInputStyle}
                    placeholder="palack"
                    keyboardType="numeric"
                    onChangeText={(number) => this.onChanged(number, "VIZ")}
                    value={this.state.plasticConsumptions.BottledWater}
                    maxLength={1}
                />
            </View>
            <Text style={styles.consumptionsHeaderText}>Élelmiszervásárlás</Text>
            <View style={styles.plasticConsumptionViewStyle}>
                <Text style={{ flex: 3 }}>Heti vásárlás</Text>
                <TextInput
                    style={styles.TextInputStyle}
                    placeholder="alkalom"
                    keyboardType="numeric"
                    onChangeText={(number) => this.setState({ weeklyGroceryShoppingsCount: number.replace(/[^0-9]/g, '') })}
                    value={this.state.weeklyGroceryShoppingsCount}
                    maxLength={1}
                />
                <Text style={{ flex: 3 }}>Egy alkalomkor vásárolt műanyag szatyrok:</Text>
                <TextInput
                    style={styles.TextInputStyle}
                    placeholder="darab"
                    keyboardType="numeric"
                    onChangeText={(number) => this.onChanged(number, "SZATYOR")}
                    value={this.state.plasticConsumptions.BottledWater}
                    maxLength={1}
                />
            </View>

            <CheckBox
                style={styles.checkboxStyle}
                onClick={() => {
                    this.setState({
                        doesPersonGoToFastFoodRestaurants: !this.state.doesPersonGoToFastFoodRestaurants
                    })
                }}
                isChecked={this.state.doesPersonGoToFastFoodRestaurants}
                leftText={"Szokott gyorséttermekbe járni?"}
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
                leftText={"Szokott moziba járni?"}
            />

            {this.loadMovieOptions()}


        </>)
    }

    loadFastFoodOptions() {
        if (this.state.doesPersonGoToFastFoodRestaurants) {
            return (<>
                <Text>Havonta hány alkalommal?</Text>
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
                <Text>Évente hány alkalommal?</Text>
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
                    style={styles.checkboxStyle}
                    onClick={() => {
                        this.setState({
                            doesPersonBuyFoodForMovie: !this.state.doesPersonBuyFoodForMovie
                        })
                    }}
                    isChecked={this.state.doesPersonBuyFoodForMovie}
                    leftText={"Vásárol nasit a filmnézéshez?"}
                />
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
                <Text>Légkondicionáló</Text>
                <View style={styles.plasticConsumptionViewStyle}>
                    <Text style={{ flex: 3 }}>Évente körülbelül hány napot használja?</Text>
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
                    <Text style={{ flex: 3 }}>Naponta körülbelül hány órát használja?</Text>
                    <TextInput
                        style={styles.TextInputStyle}
                        placeholder="óra"
                        keyboardType="numeric"
                        onChangeText={(number) => this.setState({ airConditionerHoursUsedADay: this.getConstrainedValue(number, 24) })}
                        value={this.state.airConditionerHoursUsedADay}
                        maxLength={2}
                    />
                </View>

                <Text>Hősugárzó</Text>
                <View style={styles.plasticConsumptionViewStyle}>
                    <Text style={{ flex: 3 }}>Évente körülbelül hány napot használja?</Text>
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
                    <Text style={{ flex: 3 }}>Naponta körülbelül hány órát használja?</Text>
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
                    style={styles.checkboxStyle}
                    onClick={() => {
                        this.setState({
                            doesHouseHoldHaveInfraredHeater: !this.state.doesHouseHoldHaveInfraredHeater
                        })
                    }}
                    isChecked={this.state.doesHouseHoldHaveInfraredHeater}
                    leftText={"A fűtőtest infrás?"}
                />

            </>)
        }
    }

    loadClothesAndPhonesBuyingOptions() {
        return (<>
            <Text>Milyen gyakran vásárol ÚJ ruhákat?</Text>
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
                style={styles.checkboxStyle}
                onClick={() => {
                    this.setState({
                        doesPersonBuySeconHandClothesToo: !this.state.doesPersonBuySeconHandClothesToo
                    })
                }}
                isChecked={this.state.doesPersonBuySeconHandClothesToo}
                leftText={"Használt ruhákat is szokott vásárolni?"}
            />


            <Text>Új telefont milyen gyakran vásárol?</Text>
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
                style={styles.checkboxStyle}
                onClick={() => {
                    this.setState({
                        doesPersonBuySecondHandPhonesToo: !this.state.doesPersonBuySeconHandPhonesToo
                    })
                }}
                isChecked={this.state.doesPersonBuySecondHandPhonesToo}
                leftText={"Használt telefont is szokott vásárolni?"}
            />

        </>)
    }

    loadTravellingOptions() {
        if (this.state.doesPersonOwnACar) {
            return (<>
                <View style={styles.plasticConsumptionViewStyle}>
                    <Text style={{ flex: 3 }}>Évente körülbelül hány ezer km-t utazik autóval?</Text>
                    <TextInput
                        style={styles.TextInputStyle}
                        placeholder="km"
                        keyboardType="numeric"
                        onChangeText={(number) => this.setState({ yearlyDistanceTravelledWithCar: this.getConstrainedValue(number, 60) })}
                        value={this.state.yearlyDistanceTravelledWithCar}
                        maxLength={2}
                    />
                </View>

                <CheckBox
                    style={styles.checkboxStyle}
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
                style={styles.checkboxStyle}
                onClick={() => {
                    this.setState({
                        isGoingToWorkPossibleWithPublicTransport: !this.state.isGoingToWorkPossibleWithPublicTransport
                    })
                }}
                isChecked={this.state.isGoingToWorkPossibleWithPublicTransport}
                leftText={"Megoldható lenne tömegközlekedéssel és/vagy biciklivel a munkába járás?"}
            />
        let workPlaceDistanceComponent = <>
            <Text>Hány kilométerre van a lakásától a munkahelye? {this.state.workPlaceDistanceFromHome} km</Text>
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
                    style={styles.checkboxStyle}
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
                leftText={"Szokott TV-zni, vagy TV-t használni?"}
            />

            {this.loadTvOptions()}

            {this.loadMonitorOptions()}

            <CheckBox
                style={styles.checkboxStyle}
                onClick={() => {
                    this.setState({
                        doesHouseholdHaveAirConditionerOrHeater: !this.state.doesHouseholdHaveAirConditionerOrHeater
                    })
                }}
                isChecked={this.state.doesHouseholdHaveAirConditionerOrHeater}
                leftText={"Van az otthonában légkondicionáló és/vagy elektromos fűtőtest?"}
            />

            {this.loadAirConditionerAndHeaterOptions()}

            <CheckBox
                style={styles.checkboxStyle}
                onClick={() => {
                    this.setState({
                        isPersonVegetarian: !this.state.isPersonVegetarian
                    })
                }}
                isChecked={this.state.isPersonVegetarian}
                leftText={"Vegetáriánus vagy vegán?"}
            />

            {this.loadMeatConsumptionDatas()}

            <Text>Napi kávéfogyasztás</Text>
            {this.loadCoffeConsumptionPicker()}

            <Text>Heti csokoládé fogyasztás</Text>
            {this.loadChocolateConsumptionPicker()}


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
                leftText={"Rendelkezik autóval?"}
            />
            {this.loadTravellingOptions()}

            <Button
                title="Adatok mentése"
                onPress={() => this.handleButtonPressing()}
            />



        </>)
    }

}

const styles = StyleSheet.create({
    consumptionsHeaderText: {
        textAlign: "center"
    },
    plasticConsumptionViewStyle: {
        flex: 1,
        flexDirection: "row"
    },
    TextInputStyle: {
        textAlign: 'center',
        height: 40,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#009688',
        marginBottom: 10,
        flex: 1
    },
    checkboxStyle: {
        flex: 1,
        padding: 10
    },
    meatsCheckboxStyle: {
        flex: 2,
        padding: 10
    }
});

export default PersonalConsumption