//Számításokat végezhetném majd úgy, hogy lesz egy limit minden termékre, hogy mi sok mi nem kevés (pl heti 4 kiló hús fogyasztása sok, vagy heti 25 pohár kávé vagy valami) és ezekhez
//a limitekhez képest mérem le, hogy mennyit tudna spórolni
//ha fogyaszt húst valaki akkor lehet ajánlani hogy műanyag zacskók helyett kiskosárba mérjék ki a húst (kisebb pluszköltség de kevesebb szennyezés)
//ha vesz akár 1 üveg palackozott vizet, akkor vízszűrő javaslata
//Mekifogyasztásnál vagy mozinál javasolni hogy a tetőt és szívószálat ne kérjék el (vagy mozinál saját újrafelhasználható szívószálat használjon)
//ha csak mekit eszik, akkor azt ajánlani hogy ne kérje a szívószálat és a tetőt, viszont ha moziban is szokott akkor újrafelhasználható szívószál ajánlása

//dark mode nem csak energiát spórol de a szemnek is jobb

//Ha fast foodba mondjuk havi 3-nál többször jár akkor valami tanács az egészségre nézve is 

//google helyett ecosia

//ha az ember kocsival jár (ÉS nem elektromos) munkába de megoldható lenne tömegközlekedéssel is akkor odaírni, hogy mennyi CO2-től szabadíthatja meg a Földet (és odaírni, hogy ha időben megoldható, akkor
//ez lenne javasolva)

//elektromos fűtésnél leírni hogy infrás fűtés is van és harmadannyit fogyaszt
import React, { Component } from 'react'
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Linking,
    TouchableHighlight,
    Modal,
    Image
} from 'react-native';
import { PieChart, } from "react-native-chart-kit";

import { fetchHardwareJson } from '../Requests'
import { Table, Row, Rows } from 'react-native-table-component';

class TheKey extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //Egy kilogramm termék hány kilogramm szennyezéssel jár
            foodPollutions: [],

            //kilogrammban megadva. 2010-es adat
            co2PollutionForOneKwhElectricity: 0.35,
            //kb olyan 160gramm/km
            co2PollutionForOneKmOfDistanceTravelledWithCar: 0.16,

            //itt adom meg, hogy melyik fogyasztás milyen érték után számít túl soknak. (pl. heti 1.5 kiló hús fogyasztása)
            thresholds: {
                //maximum érték darabban értve
                Eggs: 3,
                //maximum érték. Napi ennél több kávé már sok 
                Coffee: 3,
                //heti ennyi már sok
                weeklyChocolate: 1,
                //hetente ennél több kiló húsfogyasztás sok
                weeklyTotalMeatConsumption: 1.4,
                Pork: 0.5,


                //itt már 1 is sok szerintem
                bottledDrinks: 0,
                //Már 1-nél is tanácsolni, hogy ne vegye el a szívószálat és szedje le a tetejét, egyébként ennyi érték felett már valami health tanács is lehetne
                monthlyFastFoodVisit: 2,

                presonsClothesBuyingHabit: ["hetente", "havonta"],

                //ezer kilométerben
                // yearlyDistanceTravelledWithCar: 25,
                yearlyDistanceTravelledWithCar: 12,

                //maximum értékek
                tvHoursWatched: 5,
                pcHoursUsed: 6,
                consoleHoursUsed: 5,
                //szerintem az egy óra is sok
                airConditionerHoursUsed: 1,
                //ez jobban kellhet, de ezzel is lehet spórolni, ha nem infrás
                normalHeaterHoursUsed: 3,
                infraHeaterHoursUsed: 6
            },

            foodGrammsPerServings: {
                //poharanként
                Coffee: 10.5,
                //Táblánként
                Chocolate: 100,
                //Tojásonként
                Eggs: 63
            },

            plasticPollutions: {
                //palackos kóla, ásványvíz. Grammban mérve
                BottledBeverage: 10,
                ShoppingBag: 6,
                Straw: 2
            },



            airConditionerConsumption: 1500,
            normalHeaterConsumption: 1200,
            infraredHeaterConsumption: 500,
            energyPercentageSavedWithDarkMode: 12,
            kwhElectricityPriceInHuf: 38,


            messageRenderingBooleans: {
                Eggs: false,
                Coffee: false,
                Chocolate: false,
                WeeklyTotalMeatConsumpion: false,
                OtherMeatConsumption: false,
                Beef: false,
                Lamb: false,
                PorkGeneral: false,
                PorkOverconsumption: false,
                BottledDrinks: false,
                FastFoodGeneral: false,
                FastFoodOverconsumpiton: false,
                TV: false,
                PC: false,
                Console: false,
                AirConditioner: false,
                HeaterNormal: false,
                HeaterInfra: false,
                //akkor ha van sima fűtőtest és nagyobb annak a használata mint napi 0 óra és kiírni, hogy infrával mennyit spórolna
                HeaterInfraGeneral: false,
                CinemaFood: false,
                YearlyCarConsumption: false,
                WorkGoing: false,
                DarkModeNotUsed: false,
            },

            saveablePollutionValues: {
                Eggs: "",
                Coffee: "",
                Chocolate: "",
                Beef: "",
                Lamb: "",
                Pork: "",
                TV: "",
                PC: "",
                Console: "",
                AirConditioner: "",
                NormalHeater: "",
                InfraHeater: "",
                MonitorWithDarkMode: "",
                Car: "",

                totalCO2Pollution: "",
                totalMethanePollution: ""
            },

            foodTableHead: ['Étel neve', 'Mennyiség csökkentés', 'Elérhető CO2 csökkentés (kg)', 'Elérhető metán csökkentés (kg)'],
            foodTableData: [],

            electricityTableHead: ['Eszköz neve', 'Mennyiség csökkentés', 'Elérhető energiatakarékosság', 'CO2 csökkentés', 'Huf takarékosság'],
            electricityTableData: [],

            modalVisible: false,
            pieChartData: [],

            //kb 24 kg CO2-t nyel el évente egy fa
            averageCO2AbsorptionOfATreePerYear: 24,

            allDataLoaded: false

        }
    }

    async componentDidMount() {
        if(this.props.personalConsumptionData.foodConsumptions.Beef!==undefined){
        await fetchHardwareJson(this.props.ipAddress, 'foodpollutions')
            .then(response => this.setState({ foodPollutions: response }))
        this.determineRenderableMessages()
        this.calculateSaveablePollutions()

        this.loadDataForFoodType()
        this.loadDataForElectricityTable()

        this.calculateTotalSaveablePollution()

        this.populatePieChartData()
       
        this.setState({ allDataLoaded: true })
        }

    }

    //ezt lehetne úgy optimalizálni, hogy csak akkor töltse be a megfelelő értéket, hogyha az adott részt le kell renderelni (pl. marhatúlfogyasztás esetén, stb)
    //illetve kicsit hülyén csináltam, mert van olyan étel aminél csak a CO2 szennyezéscsökkentést mentettem le simán magába a változóba, máshol meg külön lementettem a metánt is 
    calculateSaveablePollutionForType(type, booleanValue) {
        let personalPollutions = { ...this.state.saveablePollutionValues }
        let foodObject;
        let tempObject;
        let whSavedPerDay
        if (booleanValue) {
            switch (type) {
                case "EGGS":
                    foodObject = this.state.foodPollutions.find(obj => { return obj.foodName === "Eggs" })
                    personalPollutions.Eggs = (((this.props.personalConsumptionData.foodConsumptions.Eggs - this.state.thresholds.Eggs) * this.state.foodGrammsPerServings.Eggs * 365) / 1000) * foodObject.co2Pollution
                    break;
                case "COFFEE":
                    foodObject = this.state.foodPollutions.find(obj => { return obj.foodName === "Coffee" })
                    personalPollutions.Coffee = (((this.props.personalConsumptionData.foodConsumptions.Coffee - this.state.thresholds.Coffee) * this.state.foodGrammsPerServings.Coffee * 365) / 1000) * foodObject.co2Pollution
                    break;
                case "CHOCOLATE":
                    foodObject = this.state.foodPollutions.find(obj => { return obj.foodName === "Chocolate" })
                    personalPollutions.Chocolate = (((this.props.personalConsumptionData.foodConsumptions.Chocolate - this.state.thresholds.weeklyChocolate) * this.state.foodGrammsPerServings.Chocolate * 48) / 1000) * foodObject.co2Pollution
                    break;
                case "BEEF":
                    foodObject = this.state.foodPollutions.find(obj => { return obj.foodName === "Beef" })
                    tempObject = {
                        co2Pollution: (((this.props.personalConsumptionData.foodConsumptions.Beef) * 48)) * foodObject.co2Pollution - this.getCO2PollutionForChicken((((this.props.personalConsumptionData.foodConsumptions.Beef) * 48))),
                        methanePollution: (((this.props.personalConsumptionData.foodConsumptions.Beef) * 48)) * foodObject.methanePollution
                    }
                    personalPollutions.Beef = tempObject
                    break;
                case "LAMB":
                    foodObject = this.state.foodPollutions.find(obj => { return obj.foodName === "Lamb" })
                    tempObject = {
                        co2Pollution: (((this.props.personalConsumptionData.foodConsumptions.Lamb) * 48)) * foodObject.co2Pollution - this.getCO2PollutionForChicken((((this.props.personalConsumptionData.foodConsumptions.Lamb) * 48))),
                        methanePollution: (((this.props.personalConsumptionData.foodConsumptions.Lamb) * 48)) * foodObject.methanePollution
                    }
                    personalPollutions.Lamb = tempObject
                    break;
                case "PORK_GENERAL":
                    foodObject = this.state.foodPollutions.find(obj => { return obj.foodName === "Pork" })
                    tempObject = {
                        co2Pollution: (((this.props.personalConsumptionData.foodConsumptions.Pork) * 48)) * foodObject.co2Pollution - this.getCO2PollutionForChicken((((this.props.personalConsumptionData.foodConsumptions.Pork) * 48))),
                        methanePollution: (((this.props.personalConsumptionData.foodConsumptions.Pork) * 48)) * foodObject.methanePollution
                    }
                    personalPollutions.Pork = tempObject
                    break;
                case "TV":
                    whSavedPerDay = (this.props.personalConsumptionData.otherData.averageDailyTvHoursWatched - this.state.thresholds.tvHoursWatched) * (this.props.personalConsumptionData.otherData.tvConsumption / this.props.personalConsumptionData.otherData.averageDailyTvHoursWatched)
                    personalPollutions.TV = ((whSavedPerDay * 365) / 1000) * this.state.co2PollutionForOneKwhElectricity
                    break;
                case "PC":
                    whSavedPerDay = (this.props.pcConsumptionData.hardwareDailyUseInHours - this.state.thresholds.pcHoursUsed) * this.props.pcConsumptionData.hardwareConsumptionInWatts
                    personalPollutions.PC = ((whSavedPerDay * 365) / 1000) * this.state.co2PollutionForOneKwhElectricity
                    break;
                case "CONSOLE":
                    whSavedPerDay = (this.props.consoleConsumptionData.hardwareDailyUseInHours - this.state.thresholds.consoleHoursUsed) * this.props.consoleConsumptionData.hardwareConsumptionInWatts
                    personalPollutions.Console = ((whSavedPerDay * 365) / 1000) * this.state.co2PollutionForOneKwhElectricity
                    break;
                case "AIRCONDITIONER":
                    whSavedPerDay = (this.props.personalConsumptionData.otherData.airConditionerHoursUsedADay - this.state.thresholds.airConditionerHoursUsed) * this.state.airConditionerConsumption
                    personalPollutions.AirConditioner = ((whSavedPerDay * this.props.personalConsumptionData.otherData.airConditionersDaysUsedAYear) / 1000) * this.state.co2PollutionForOneKwhElectricity
                    break;
                case "HEATER_NORMAL":
                    whSavedPerDay = (this.props.personalConsumptionData.otherData.heaterHoursUsedADay - this.state.thresholds.normalHeaterHoursUsed) * this.state.normalHeaterConsumption
                    personalPollutions.NormalHeater = ((whSavedPerDay * this.props.personalConsumptionData.otherData.heaterDaysUsedAYear) / 1000) * this.state.co2PollutionForOneKwhElectricity
                    break;
                case "HEATER_INFRA":
                    whSavedPerDay = (this.props.personalConsumptionData.otherData.heaterHoursUsedADay - this.state.thresholds.infraHeaterHoursUsed) * this.state.infraredHeaterConsumption
                    personalPollutions.InfraHeater = ((whSavedPerDay * this.props.personalConsumptionData.otherData.heaterDaysUsedAYear) / 1000) * this.state.co2PollutionForOneKwhElectricity
                    break;
                case "MONITOR_WITHDARKMODE":
                    whSavedPerDay = (this.props.pcConsumptionData.hardwareDailyUseInHours) * (this.props.personalConsumptionData.otherData.monitorConsumption * (this.state.energyPercentageSavedWithDarkMode / 100))
                    personalPollutions.MonitorWithDarkMode = ((whSavedPerDay) * 365 / 1000) * this.state.co2PollutionForOneKwhElectricity
                    break;
                case "DISTANCE_TRAVELLED":
                    let distanceSaved = (this.props.personalConsumptionData.otherData.yearlyDistanceTravelledWithCar - this.state.thresholds.yearlyDistanceTravelledWithCar)
                    personalPollutions.Car = distanceSaved * 1000 * this.state.co2PollutionForOneKmOfDistanceTravelledWithCar
                    break;
                default:
                    break;
            }
        }
        this.setState({ saveablePollutionValues: personalPollutions })
    }



    getCO2PollutionForChicken(numberOfKgs) {
        return numberOfKgs * this.state.foodPollutions.find(obj => { return obj.foodName === "Chicken" }).co2Pollution
    }

    calculateTotalSaveablePollution() {
        let pollutionsObject = { ...this.state.saveablePollutionValues }
        let totalCO2Pollutions = 0;
        totalCO2Pollutions += this.addToTotalPollution(pollutionsObject.Eggs)
        totalCO2Pollutions += this.addToTotalPollution(pollutionsObject.Chocolate)
        totalCO2Pollutions += this.addToTotalPollution(pollutionsObject.Coffee)
        totalCO2Pollutions += this.addToTotalPollution(pollutionsObject.TV)
        totalCO2Pollutions += this.addToTotalPollution(pollutionsObject.PC)
        totalCO2Pollutions += this.addToTotalPollution(pollutionsObject.Console)
        totalCO2Pollutions += this.addToTotalPollution(pollutionsObject.AirConditioner)
        totalCO2Pollutions += this.addToTotalPollution(pollutionsObject.NormalHeater)
        totalCO2Pollutions += this.addToTotalPollution(pollutionsObject.InfraHeater)
        totalCO2Pollutions += this.addToTotalPollution(pollutionsObject.MonitorWithDarkMode)
        totalCO2Pollutions += this.addToTotalPollution(pollutionsObject.Car)

        totalCO2Pollutions += this.addToTotalPollution(pollutionsObject.Beef.co2Pollution)
        totalCO2Pollutions += this.addToTotalPollution(pollutionsObject.Lamb.co2Pollution)
        totalCO2Pollutions += this.addToTotalPollution(pollutionsObject.Pork.co2Pollution)

        let totalMethanePollution = 0;
        totalMethanePollution += this.addToTotalPollution(pollutionsObject.Beef.methanePollution)
        totalMethanePollution += this.addToTotalPollution(pollutionsObject.Lamb.methanePollution)
        totalMethanePollution += this.addToTotalPollution(pollutionsObject.Pork.methanePollution)

        pollutionsObject.totalCO2Pollution = parseFloat(totalCO2Pollutions).toFixed(2),
            pollutionsObject.totalMethanePollution = parseFloat(totalMethanePollution).toFixed(2)

        this.setState({ saveablePollutionValues: pollutionsObject })
    }

    addToTotalPollution(value) {
        return value > 0 ? value : 0
    }

    //igazából itt is betölthetném már külön-külön az egyes típushoz tartozó CO2 csökkentést
    //calculateSaveablePollutionForType(type), csak úgy lehet nem annyira egyértelmű a kód
    setMessageRenderingBooleanValues(booleanValue) {
        let data = { ...this.state.messageRenderingBooleans }
        switch (booleanValue) {
            case "EGGS":
                data.Eggs = true
                break;
            case "COFFEE":
                data.Coffee = true
                break;
            case "CHOCOLATE":
                data.Chocolate = true
                break;
            case "TOTALMEATCONSUMPTION":
                data.WeeklyTotalMeatConsumpion = true
                break;
            case "OTHERMEAT_CONSUMPTION":
                data.OtherMeatConsumption = true
                break;
            case "BEEF":
                data.Beef = true
                break;
            case "LAMB":
                data.Lamb = true
                break;
            case "PORK_GENERAL":
                data.PorkGeneral = true
                break;
            case "PORK_OVERCONSUMPTION":
                data.PorkOverconsumption = true
                break;
            case "BOTTLEDDRINKS":
                data.BottledDrinks = true
                break;
            case "FASTFOOD_GENERAL":
                data.FastFoodGeneral = true
                break;
            case "FASTFOOD_OVERCONSUMPTION":
                data.FastFoodOverconsumpiton = true
                break;
            case "TV":
                data.TV = true
                break;
            case "PC":
                data.PC = true
                break;
            case "CONSOLE":
                data.Console = true
                break;
            case "AIRCONDITIONER":
                data.AirConditioner = true
                break;
            case "HEATER_NORMAL":
                data.HeaterNormal = true
                break;
            case "HEATER_INFRA":
                data.HeaterInfra = true
                break;
            case "HEATER_INFRA_GENERAL":
                data.HeaterInfraGeneral = true
                break;
            case "CINEMA_FOOD":
                data.CinemaFood = true
                break;
            case "DISTANCE_TRAVELLED":
                data.YearlyCarConsumption = true
                break;
            case "WORKGOING":
                data.WorkGoing = true
                break;
            case "DARKMODE_NOTUSED":
                data.DarkModeNotUsed = true
                break;
            default:
                break;
        }

        this.setState({ messageRenderingBooleans: data })
    }

    calculateSaveablePollutions() {
        this.calculateSaveablePollutionForType("EGGS", this.state.messageRenderingBooleans.Eggs)
        this.calculateSaveablePollutionForType("COFFEE", this.state.messageRenderingBooleans.Coffee)
        this.calculateSaveablePollutionForType("CHOCOLATE", this.state.messageRenderingBooleans.Chocolate)
        this.calculateSaveablePollutionForType("BEEF", this.state.messageRenderingBooleans.Beef)
        this.calculateSaveablePollutionForType("LAMB", this.state.messageRenderingBooleans.Lamb)
        this.calculateSaveablePollutionForType("PORK_GENERAL", this.state.messageRenderingBooleans.PorkGeneral)

        this.calculateSaveablePollutionForType("TV", this.state.messageRenderingBooleans.TV)
        this.calculateSaveablePollutionForType("PC", this.state.messageRenderingBooleans.PC)
        this.calculateSaveablePollutionForType("CONSOLE", this.state.messageRenderingBooleans.Console)
        this.calculateSaveablePollutionForType("AIRCONDITIONER", this.state.messageRenderingBooleans.AirConditioner)
        this.calculateSaveablePollutionForType("HEATER_NORMAL", this.state.messageRenderingBooleans.HeaterNormal)
        this.calculateSaveablePollutionForType("HEATER_INFRA", this.state.messageRenderingBooleans.HeaterInfra)

        this.calculateSaveablePollutionForType("MONITOR_WITHDARKMODE", this.state.messageRenderingBooleans.DarkModeNotUsed)

        this.calculateSaveablePollutionForType("DISTANCE_TRAVELLED", this.state.messageRenderingBooleans.YearlyCarConsumption)
    }


    loadDataForFoodType() {
        this.loadFoodTableDataForFoodType("EGGS", this.state.messageRenderingBooleans.Eggs)
        this.loadFoodTableDataForFoodType("COFFEE", this.state.messageRenderingBooleans.Coffee)
        this.loadFoodTableDataForFoodType("CHOCOLATE", this.state.messageRenderingBooleans.Chocolate)
        this.loadFoodTableDataForFoodType("BEEF", this.state.messageRenderingBooleans.Beef)
        this.loadFoodTableDataForFoodType("LAMB", this.state.messageRenderingBooleans.Lamb)
        this.loadFoodTableDataForFoodType("PORK_GENERAL", this.state.messageRenderingBooleans.PorkGeneral)
    }


    loadDataForElectricityTable() {
        this.loadElectricityTableDataForConsumptionType("TV", this.state.messageRenderingBooleans.TV)
        this.loadElectricityTableDataForConsumptionType("PC", this.state.messageRenderingBooleans.PC)
        this.loadElectricityTableDataForConsumptionType("CONSOLE", this.state.messageRenderingBooleans.Console)
        this.loadElectricityTableDataForConsumptionType("AIRCONDITIONER", this.state.messageRenderingBooleans.AirConditioner)
        this.loadElectricityTableDataForConsumptionType("HEATER_NORMAL", this.state.messageRenderingBooleans.HeaterNormal)
        this.loadElectricityTableDataForConsumptionType("HEATER_INFRA", this.state.messageRenderingBooleans.HeaterInfra)
    }

    populatePieChartData() {
        let style = { color: "rgba(131, 167, 234, 1)", }
        let saveablePollution = this.state.saveablePollutionValues.Beef.co2Pollution + this.state.saveablePollutionValues.Beef.methanePollution
        this.addDataToPieChartData("Marha", saveablePollution, style)
        style = { color: "blue", }
        saveablePollution = this.state.saveablePollutionValues.Lamb.co2Pollution + this.state.saveablePollutionValues.Lamb.methanePollution
        this.addDataToPieChartData("Bárány", saveablePollution, style)
        style = { color: "red", }
        saveablePollution = this.state.saveablePollutionValues.Pork.co2Pollution + this.state.saveablePollutionValues.Pork.methanePollution
        this.addDataToPieChartData("Sertés", saveablePollution, style)
        style = { color: "green", }
        this.addDataToPieChartData("Tojás", this.state.saveablePollutionValues.Eggs, style)
        style = { color: "brown", }
        this.addDataToPieChartData("Kávé", this.state.saveablePollutionValues.Coffee, style)
        style = { color: "rgb(245, 182, 66)", }
        this.addDataToPieChartData("Csokoládé", this.state.saveablePollutionValues.Chocolate, style)
        style = { color: "rgb(66, 245, 227)", }
        this.addDataToPieChartData("TV", this.state.saveablePollutionValues.TV, style)
        style = { color: "rgb(203, 66, 245)", }
        this.addDataToPieChartData("PC", this.state.saveablePollutionValues.PC, style)
        style = { color: "rgb(209, 245, 66)", }
        this.addDataToPieChartData("Konzol", this.state.saveablePollutionValues.Console, style)
        style = { color: "rgb(255, 230, 184)", }
        this.addDataToPieChartData("Légkondi", this.state.saveablePollutionValues.AirConditioner, style)
        style = { color: "rgb(237, 111, 124)", }
        this.addDataToPieChartData("Fűtőtest", this.state.saveablePollutionValues.NormalHeater, style)
        style = { color: "rgb(237, 111, 124)", }
        this.addDataToPieChartData("Infrás fűtőtest", this.state.saveablePollutionValues.InfraHeater, style)
        style = { color: "rgb(153, 122, 126)", }
        this.addDataToPieChartData("Dark Mode", this.state.saveablePollutionValues.MonitorWithDarkMode, style)
        style = { color: "rgb(121, 109, 171)", }
        this.addDataToPieChartData("Autó", this.state.saveablePollutionValues.Car, style)
    }

    addDataToPieChartData(labelName, pollution, style) {
        if (pollution > 0) {
            let pieData = {
                name: labelName,
                pollution: parseInt(pollution),
                color: style.color,
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            }
            let joined = this.state.pieChartData.concat([pieData]);
            this.setState({ pieChartData: joined })
        }
    }


    //General tippek: Ecosia használata. Olajat vissza a dobozába és úgy ki a kukába és ne a wc-be
    renderTippsForType(type, booleanValue) {
        let tippText;

        if (booleanValue) {
            switch (String(type).toUpperCase()) {
                case "TOTALMEATCONSUMPTION":
                    let totalWeeklyMeatConsumption = parseFloat(this.props.personalConsumptionData.foodConsumptions.Beef) + parseFloat(this.props.personalConsumptionData.foodConsumptions.Lamb)
                        + parseFloat(this.props.personalConsumptionData.foodConsumptions.Chicken) + parseFloat(this.props.personalConsumptionData.foodConsumptions.Pork)
                    tippText = <Text style={styles.generalTippText}>Hetente {this.renderTippHighlitedText(totalWeeklyMeatConsumption - this.state.thresholds.weeklyTotalMeatConsumption, 'kg')}-al kevesebb húsfogyasztás lenne az optimális</Text>
                    break;
                case "PORK_OVERCONSUMPTION":
                    tippText = <Text style={styles.generalTippText}>Heti {this.renderTippHighlitedText(this.props.personalConsumptionData.foodConsumptions.Pork - this.state.thresholds.Pork, 'kg')}-al kevesebb sertésfogyasztás egészésgesebb lenne az Ön számára</Text>
                    break;
                //Ez a szöveg akkor jelenne meg, ha csirkén kívül más húst is fogyaszt az illető
                case "OTHERMEAT_CONSUMPTION":
                    tippText = <Text>* A megjelölt húsok helyett a csirkehús fogyasztása sokkal környezetkímélőbb. (Tizede a kibocsájtása a marháénak)</Text>
                    break;
                case "BOTTLEDDRINKS":
                    //itt megemlíteni hogy a régi visszaválthatós üvegeket vissza lehetne hozni
                    let savedPlasticPollutionMass = (parseInt(this.props.personalConsumptionData.plasticConsumptions.BottledWater) + parseInt(this.props.personalConsumptionData.plasticConsumptions.BottledCola)) * 48 * this.state.plasticPollutions.BottledBeverage / 1000
                    tippText = <Text style={styles.generalTippText}>Ha teheti, inkább igyon papírdobozos gyümölcsleveket, ezzel pedig évente {this.renderTippHighlitedText(savedPlasticPollutionMass, 'kg')} műanyaggal kevesebbet szennyez</Text>
                    break;
                case "FASTFOOD_GENERAL":
                    tippText = <Text style={styles.generalTippText}>Ha bármilyen poharas üdítőt vesz, akkor ne kérje el a szívószálat és a műanyag tetőt</Text>
                    break;
                case "FASTFOOD_OVERCONSUMPTION":
                    tippText = <Text style={styles.generalTippText}>Ennyivel kevesebb havi gyorsétterem látogatás egészségesebb lenne az ön számára: {this.renderTippHighlitedText(this.props.personalConsumptionData.otherData.monthlyFastFoodVisitCount - this.state.thresholds.monthlyFastFoodVisit)}</Text>
                    break;
                case "HEATER_INFRA_GENERAL":
                    let savedHour = ((this.props.personalConsumptionData.otherData.heaterHoursUsedADay) * this.state.normalHeaterConsumption) - ((this.props.personalConsumptionData.otherData.heaterHoursUsedADay) * this.state.infraredHeaterConsumption)
                    let savedKwh = ((savedHour * this.props.personalConsumptionData.otherData.heaterDaysUsedAYear) / 1000)
                    let savedPollution = savedKwh * this.state.co2PollutionForOneKwhElectricity
                    tippText = <Text style={styles.generalTippText}>Ha normál fűtőtest helyett infrásat használ, akkor évente {this.renderTippHighlitedText(savedPollution, 'kg')} CO2-vel csökkenti a kibocsájtását és évi {this.renderTippHighlitedText(savedKwh, 'kwH')} energiát spórolhat meg ({this.renderTippHighlitedText(savedKwh * this.state.kwhElectricityPriceInHuf, 'Ft')})</Text>
                    break;
                case "CINEMA_FOOD":
                    //ha kaját vesz moziban akkor linkelek egy szívószálat, hogy ne műanyagot használjon
                    tippText = <><Text style={styles.generalTippText}>Moziban a kólához használhat újrahasznosítható szívószálat is és nem kell műanyaggal szennyezni</Text><TouchableOpacity onPress={() => Linking.openURL('https://www.csomagpostas.hu/haztartas/3-db-rozsdamentes-acelbol-keszult-szivoszal-ingyenes-szallitas/')}><Text style={styles.linkText}>LINK</Text></TouchableOpacity></>
                    break;
                case "DISTANCE_TRAVELLED":
                    let distanceSaved = (this.props.personalConsumptionData.otherData.yearlyDistanceTravelledWithCar - this.state.thresholds.yearlyDistanceTravelledWithCar)
                    tippText = <Text style={styles.generalTippText}>Ha évente {this.renderTippHighlitedText(distanceSaved, 'ezer km')}-el kevesebbet közlekedik, akkor {this.renderTippHighlitedText(this.state.saveablePollutionValues.Car, 'kg')} CO2-vel csökkenti a kibocsájtását</Text>
                    break;
                case "WORKGOING":
                    //itt nem számoljhuk azt hogy mennyi pénzt spórolhatna meg, hiszen minden hónapban bérletet kellene vennie, ami lehet hogy drágább mint a megspórolt pénz
                    //220 nap kb amit az ember munkával tölt egy évben
                    let kmSavedPerYear = this.props.personalConsumptionData.otherData.workPlaceDistanceFromHome * 220
                    tippText = <Text style={styles.generalTippText}>Ha tömegközlekedéssel járna dolgozni, évente {this.renderTippHighlitedText(kmSavedPerYear * this.state.co2PollutionForOneKmOfDistanceTravelledWithCar, 'kg')} CO2-vel csökkentheti a kibocsájtását</Text>
                    break;
                case "DARKMODE_NOTUSED":
                    tippText = <Text style={styles.generalTippText}>Pusztán azzal, hogy Dark Mode-ot használ a számítógépén, úgy évi {this.renderTippHighlitedText(this.state.saveablePollutionValues.MonitorWithDarkMode, 'kg')} CO2-vel csökkentheti a kibocsájtását</Text>
                    break;
                default:
                    break;
            }
        }
        //itt ez a mégegy if fölösleges, viszont így szerintem olvashatóbb a kód
        if (booleanValue) {
            return (<>
                {tippText}
                <View style={styles.divisionLine}></View>
            </>)
        }
    }

    loadFoodTableDataForFoodType(type, booleanValue) {
        let consumptionNumberForType;
        let foodData = []
        let joined;
        if (booleanValue) {
            switch (String(type).toUpperCase()) {
                case "EGGS":
                    consumptionNumberForType = this.props.personalConsumptionData.foodConsumptions.Eggs - this.state.thresholds.Eggs
                    foodData.push("Tojás")
                    foodData.push("Naponta " + consumptionNumberForType + " db")
                    foodData.push(parseFloat(this.state.saveablePollutionValues.Eggs).toFixed(2))
                    foodData.push("-")
                    joined = this.state.foodTableData.concat([foodData]);
                    this.setState({ foodTableData: joined })
                    break;
                case "COFFEE":
                    consumptionNumberForType = this.props.personalConsumptionData.foodConsumptions.Coffee - this.state.thresholds.Coffee
                    foodData.push("Kávé")
                    foodData.push("Naponta " + consumptionNumberForType + " pohár")
                    foodData.push(parseFloat(this.state.saveablePollutionValues.Coffee).toFixed(2))
                    foodData.push("-")
                    joined = this.state.foodTableData.concat([foodData]);
                    this.setState({ foodTableData: joined })
                    break;
                case "CHOCOLATE":
                    consumptionNumberForType = this.props.personalConsumptionData.foodConsumptions.Chocolate - this.state.thresholds.weeklyChocolate
                    foodData.push("Csokoládé")
                    foodData.push("Hetente " + consumptionNumberForType + " tábla")
                    foodData.push(parseFloat(this.state.saveablePollutionValues.Chocolate).toFixed(2))
                    foodData.push("-")
                    joined = this.state.foodTableData.concat([foodData]);
                    this.setState({ foodTableData: joined })
                    break;
                case "BEEF":
                    //itt azért hozzárakhatom, hogy bár sokat szennyez, azért ne érezze magát szarul valaki ha megeszik havonta-két havonta egy hamburgert
                    foodData.push("Marhahús*")
                    foodData.push("Hetente " + this.props.personalConsumptionData.foodConsumptions.Beef + " kg")
                    foodData.push(parseFloat(this.state.saveablePollutionValues.Beef.co2Pollution).toFixed(2))
                    foodData.push(parseFloat(this.state.saveablePollutionValues.Beef.methanePollution).toFixed(2))
                    joined = this.state.foodTableData.concat([foodData]);
                    this.setState({ foodTableData: joined })
                    break;
                case "LAMB":
                    foodData.push("Bárányhús*")
                    foodData.push("Hetente " + this.props.personalConsumptionData.foodConsumptions.Lamb + " kg")
                    foodData.push(parseFloat(this.state.saveablePollutionValues.Lamb.co2Pollution).toFixed(2))
                    foodData.push(parseFloat(this.state.saveablePollutionValues.Lamb.methanePollution).toFixed(2))
                    joined = this.state.foodTableData.concat([foodData]);
                    this.setState({ foodTableData: joined })
                    break;
                case "PORK_GENERAL":
                    foodData.push("Sertéshús*")
                    foodData.push("Hetente " + this.props.personalConsumptionData.foodConsumptions.Pork + " kg")
                    foodData.push(parseFloat(this.state.saveablePollutionValues.Pork.co2Pollution).toFixed(2))
                    foodData.push(parseFloat(this.state.saveablePollutionValues.Pork.methanePollution).toFixed(2))
                    joined = this.state.foodTableData.concat([foodData]);
                    this.setState({ foodTableData: joined })
                    break;
                default:
                    break;
            }
        }
    }

    renderFoodTable() {
        if (this.determineIfFoodTableShouldBeRendered()) {
            return (<>
                <Text style={styles.tableTitleText}>Az alábbi táblázat adja meg, hogy az egyes ételfajtákból ha bizonyos mennyiséggel kevesebbet fogyasztunk, akkor mennyivel kímélhetjük évente környezetünket</Text>
                <View style={styles.container}>
                    <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                        <Row data={this.state.foodTableHead} style={styles.foodTableHead} textStyle={styles.foodTableText} />
                        <Rows data={this.state.foodTableData} textStyle={styles.foodTableText} />
                    </Table>
                </View>
            </>)
        }
    }

    //TODO - itt még nem jó valami
    determineIfFoodTableShouldBeRendered() {
        return (this.state.saveablePollutionValues.Eggs !== "" || this.state.saveablePollutionValues.Lamb !== "" || this.state.saveablePollutionValues.Pork !== ""
            || this.state.saveablePollutionValues.Beef !== "" || this.state.saveablePollutionValues.Coffee !== "" || this.state.saveablePollutionValues.Chocolate !== "")
    }

    loadElectricityTableDataForConsumptionType(type, booleanValue) {
        let electricityData = []
        let joined;
        let consumptionNumberForType;
        let yearlyKwhSave;
        if (booleanValue) {
            switch (String(type).toUpperCase()) {
                case "TV":
                    consumptionNumberForType = parseInt(this.props.personalConsumptionData.otherData.averageDailyTvHoursWatched - this.state.thresholds.tvHoursWatched)
                    yearlyKwhSave = (consumptionNumberForType * this.props.personalConsumptionData.otherData.tvConsumption / this.props.personalConsumptionData.otherData.averageDailyTvHoursWatched) * 365 / 1000
                    electricityData.push("TV")
                    electricityData.push("Naponta " + consumptionNumberForType + " óra")
                    electricityData.push("Évi " + yearlyKwhSave + " kwh")
                    electricityData.push(parseFloat(this.state.saveablePollutionValues.TV).toFixed(2))
                    electricityData.push(parseInt(yearlyKwhSave * this.state.kwhElectricityPriceInHuf))
                    joined = this.state.electricityTableData.concat([electricityData]);
                    this.setState({ electricityTableData: joined })
                    break;
                case "PC":
                    consumptionNumberForType = parseInt(this.props.pcConsumptionData.hardwareDailyUseInHours - this.state.thresholds.pcHoursUsed)
                    yearlyKwhSave = (consumptionNumberForType * this.props.pcConsumptionData.hardwareConsumptionInWatts) * 365 / 1000
                    electricityData.push("PC")
                    electricityData.push("Naponta " + consumptionNumberForType + " óra")
                    electricityData.push("Évi " + yearlyKwhSave + " kwh")
                    electricityData.push(parseFloat(this.state.saveablePollutionValues.PC).toFixed(2))
                    electricityData.push(parseInt(yearlyKwhSave * this.state.kwhElectricityPriceInHuf))
                    joined = this.state.electricityTableData.concat([electricityData]);
                    this.setState({ electricityTableData: joined })
                    break;
                case "CONSOLE":
                    consumptionNumberForType = parseInt(this.props.consoleConsumptionData.hardwareDailyUseInHours - this.state.thresholds.consoleHoursUsed)
                    yearlyKwhSave = (consumptionNumberForType * this.props.consoleConsumptionData.hardwareConsumptionInWatts) * 365 / 1000
                    electricityData.push("Konzol")
                    electricityData.push("Naponta " + consumptionNumberForType + " óra")
                    electricityData.push("Évi " + yearlyKwhSave + " kwh")
                    electricityData.push(parseFloat(this.state.saveablePollutionValues.Console).toFixed(2))
                    electricityData.push(parseInt(yearlyKwhSave * this.state.kwhElectricityPriceInHuf))
                    joined = this.state.electricityTableData.concat([electricityData]);
                    this.setState({ electricityTableData: joined })
                    break;
                case "AIRCONDITIONER":
                    consumptionNumberForType = parseInt(this.props.personalConsumptionData.otherData.airConditionerHoursUsedADay - this.state.thresholds.airConditionerHoursUsed)
                    yearlyKwhSave = (consumptionNumberForType * this.state.airConditionerConsumption) * this.props.personalConsumptionData.otherData.airConditionersDaysUsedAYear / 1000
                    electricityData.push("Légkondi")
                    electricityData.push("Naponta " + consumptionNumberForType + " óra")
                    electricityData.push("Évi " + yearlyKwhSave + " kwh")
                    electricityData.push(parseFloat(this.state.saveablePollutionValues.AirConditioner).toFixed(2))
                    electricityData.push(parseInt(yearlyKwhSave * this.state.kwhElectricityPriceInHuf))
                    joined = this.state.electricityTableData.concat([electricityData]);
                    this.setState({ electricityTableData: joined })
                    break;
                case "HEATER_NORMAL":
                    consumptionNumberForType = parseInt(this.props.personalConsumptionData.otherData.heaterHoursUsedADay - this.state.thresholds.normalHeaterHoursUsed)
                    yearlyKwhSave = (consumptionNumberForType * this.state.normalHeaterConsumption) * this.props.personalConsumptionData.otherData.heaterDaysUsedAYear / 1000
                    electricityData.push("Fűtőtest")
                    electricityData.push("Naponta " + consumptionNumberForType + " óra")
                    electricityData.push("Évi " + yearlyKwhSave + " kwh")
                    electricityData.push(parseFloat(this.state.saveablePollutionValues.NormalHeater).toFixed(2))
                    electricityData.push(parseInt(yearlyKwhSave * this.state.kwhElectricityPriceInHuf))
                    joined = this.state.electricityTableData.concat([electricityData]);
                    this.setState({ electricityTableData: joined })
                    break;
                case "HEATER_INFRA":
                    consumptionNumberForType = parseInt(this.props.personalConsumptionData.otherData.heaterHoursUsedADay - this.state.thresholds.infraHeaterHoursUsed)
                    yearlyKwhSave = (consumptionNumberForType * this.state.infraredHeaterConsumption) * this.props.personalConsumptionData.otherData.heaterDaysUsedAYear / 1000
                    electricityData.push("Infra Fűtőtest")
                    electricityData.push("Naponta " + consumptionNumberForType + " óra")
                    electricityData.push("Évi " + yearlyKwhSave + " kwh")
                    electricityData.push(parseFloat(this.state.saveablePollutionValues.InfraHeater).toFixed(2))
                    electricityData.push(parseInt(yearlyKwhSave * this.state.kwhElectricityPriceInHuf))
                    joined = this.state.electricityTableData.concat([electricityData]);
                    this.setState({ electricityTableData: joined })
                    break;
                default:
                    break;
            }
        }
    }

    renderElectricityTable() {
        if (this.determineIfElectricityTableShouldBeRendered()) {
            return (<>
                <Text></Text>
                <View style={styles.container}>
                    <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                        <Row data={this.state.electricityTableHead} style={styles.foodTableHead} textStyle={styles.foodTableText} />
                        <Rows data={this.state.electricityTableData} textStyle={styles.foodTableText} />
                    </Table>
                </View>

            </>)

        }
    }

    //TODO
    determineIfElectricityTableShouldBeRendered() {
        return (this.state.saveablePollutionValues.TV !== "" || this.state.saveablePollutionValues.PC !== "" || this.state.saveablePollutionValues.Console !== ""
            || this.state.saveablePollutionValues.AirConditioner !== "" || this.state.saveablePollutionValues.NormalHeater !== "" || this.state.saveablePollutionValues.InfraHeater !== "")
    }



    renderTippHighlitedText(text, unit) {
        return (<>
            <Text style={styles.highlitedText}>{parseFloat(text).toFixed(2)} {unit}</Text>
        </>)
    }

    determineRenderableMessages() {
        if (this.props.personalConsumptionData.foodConsumptions !== "") {
            //ide jönnek a jó szép és hosszú eldöntések
            if (parseInt(this.props.personalConsumptionData.foodConsumptions.Eggs) > this.state.thresholds.Eggs) {
                this.setMessageRenderingBooleanValues("EGGS")
            }
            if (parseInt(this.props.personalConsumptionData.foodConsumptions.Coffee) > this.state.thresholds.Coffee) {
                this.setMessageRenderingBooleanValues("COFFEE")
            }
            if (parseInt(this.props.personalConsumptionData.foodConsumptions.Chocolate) > this.state.thresholds.weeklyChocolate) {
                this.setMessageRenderingBooleanValues("CHOCOLATE")
            }

            let totalWeeklyMeatConsumption = parseFloat(this.props.personalConsumptionData.foodConsumptions.Beef) + parseFloat(this.props.personalConsumptionData.foodConsumptions.Lamb)
                + parseFloat(this.props.personalConsumptionData.foodConsumptions.Chicken) + parseFloat(this.props.personalConsumptionData.foodConsumptions.Pork)


            if (totalWeeklyMeatConsumption > this.state.thresholds.weeklyTotalMeatConsumption) {
                this.setMessageRenderingBooleanValues("TOTALMEATCONSUMPTION")
            }

            if (this.props.personalConsumptionData.foodConsumptions.Beef > 0) {
                this.setMessageRenderingBooleanValues("BEEF")
            }
            if (this.props.personalConsumptionData.foodConsumptions.Lamb > 0) {
                this.setMessageRenderingBooleanValues("LAMB")
            }

            if (this.props.personalConsumptionData.foodConsumptions.Pork > 0 && this.props.personalConsumptionData.foodConsumptions.Pork <= this.state.thresholds.Pork) {
                this.setMessageRenderingBooleanValues("PORK_GENERAL")
            }

            if (this.props.personalConsumptionData.foodConsumptions.Pork > this.state.thresholds.Pork) {
                this.setMessageRenderingBooleanValues("PORK_OVERCONSUMPTION")
            }
            if (this.state.messageRenderingBooleans.Beef || this.state.messageRenderingBooleans.Lamb || this.state.messageRenderingBooleans.PorkGeneral) {
                this.setMessageRenderingBooleanValues("OTHERMEAT_CONSUMPTION")
            }

            let totalBottledBeveragesConsumption = this.props.personalConsumptionData.plasticConsumptions.BottledCola + this.props.personalConsumptionData.plasticConsumptions.BottledWater

            if (totalBottledBeveragesConsumption > this.state.thresholds.bottledDrinks) {
                this.setMessageRenderingBooleanValues("BOTTLEDDRINKS")
            }

            if (this.props.personalConsumptionData.otherData.monthlyFastFoodVisitCount > 0 && this.props.personalConsumptionData.otherData.monthlyFastFoodVisitCount <= this.state.thresholds.monthlyFastFoodVisit) {
                this.setMessageRenderingBooleanValues("FASTFOOD_GENERAL")
            }

            if (this.props.personalConsumptionData.otherData.monthlyFastFoodVisitCount > this.state.thresholds.monthlyFastFoodVisit) {
                this.setMessageRenderingBooleanValues("FASTFOOD_OVERCONSUMPTION")
            }
            if (this.props.personalConsumptionData.otherData.averageDailyTvHoursWatched > this.state.thresholds.tvHoursWatched) {
                this.setMessageRenderingBooleanValues("TV")
            }

            if (this.props.pcConsumptionData.hardwareDailyUseInHours > this.state.thresholds.pcHoursUsed) {
                this.setMessageRenderingBooleanValues("PC")
            }

            if ((this.props.pcConsumptionData.hardwareDailyUseInHours > 0) && !this.props.personalConsumptionData.booleanData.isDarkModeUsed) {
                this.setMessageRenderingBooleanValues("DARKMODE_NOTUSED")
            }

            if (this.props.consoleConsumptionData.hardwareDailyUseInHours > this.state.thresholds.consoleHoursUsed) {
                this.setMessageRenderingBooleanValues("CONSOLE")
            }

            if (this.props.personalConsumptionData.otherData.airConditionerHoursUsedADay > this.state.thresholds.airConditionerHoursUsed) {
                this.setMessageRenderingBooleanValues("AIRCONDITIONER")
            }

            if (!this.props.personalConsumptionData.booleanData.doesHouseholdHaveInfraredHeater && (this.props.personalConsumptionData.otherData.heaterHoursUsedADay > this.state.thresholds.normalHeaterHoursUsed)) {
                this.setMessageRenderingBooleanValues("HEATER_NORMAL")
            }

            if (this.props.personalConsumptionData.booleanData.doesHouseholdHaveInfraredHeater && (this.props.personalConsumptionData.otherData.heaterHoursUsedADay > this.state.thresholds.infraHeaterHoursUsed)) {
                this.setMessageRenderingBooleanValues("HEATER_INFRA")
            }

            if (!this.props.personalConsumptionData.booleanData.doesHouseholdHaveInfraredHeater && (this.props.personalConsumptionData.otherData.heaterHoursUsedADay > 0)) {
                this.setMessageRenderingBooleanValues("HEATER_INFRA_GENERAL")
            }

            if (parseInt(this.props.personalConsumptionData.otherData.yearlyCinemaVisitCount) > 0 && this.props.personalConsumptionData.booleanData.doesPersonBuyFoodForMovie) {
                this.setMessageRenderingBooleanValues("CINEMA_FOOD")
            }

            if (parseInt(this.props.personalConsumptionData.otherData.yearlyDistanceTravelledWithCar) > this.state.thresholds.yearlyDistanceTravelledWithCar && !this.props.personalConsumptionData.booleanData.doesPersonHaveElectricCar) {
                this.setMessageRenderingBooleanValues("DISTANCE_TRAVELLED")
            }

            if (parseInt(this.props.personalConsumptionData.otherData.yearlyDistanceTravelledWithCar) > 0 && !this.props.personalConsumptionData.booleanData.doesPersonHaveElectricCar
                && this.props.personalConsumptionData.booleanData.doesPersonGoToWorkWithCar && this.props.personalConsumptionData.booleanData.isGoingToWorkPossibleWithPublicTransport) {
                this.setMessageRenderingBooleanValues("WORKGOING")
            }
        }
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    renderModal() {
        if (this.determineIfFoodTableShouldBeRendered() || this.determineIfElectricityTableShouldBeRendered() || this.state.messageRenderingBooleans.DarkModeNotUsed) {
            return (<>
                <View style={styles.summaryView}>
                    <TouchableHighlight
                        onPress={() => {
                            this.setModalVisible(!this.state.modalVisible);
                        }}
                        style={styles.summaryButton}
                    >
                        <Text style={styles.summaryText}>ÖSSZEGZÉS</Text>
                    </TouchableHighlight>
                </View>

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
                        <View>


                            <PieChart
                                data={this.state.pieChartData}
                                // data={pieData}
                                width={400}
                                height={220}
                                chartConfig={chartConfig}
                                accessor="pollution"
                                backgroundColor="transparent"
                                paddingLeft="15"
                                absolute
                            />

                            <View style={styles.summaryModalView}>
                                <Text style={styles.summaryModalText}>Összesen {this.renderTippHighlitedText(parseFloat(this.state.saveablePollutionValues.totalCO2Pollution) + parseFloat(this.state.saveablePollutionValues.totalMethanePollution), 'kg')}-al lehetne csökkenteni
                            évente a károsanyag kibocsájtását.</Text>
                                <Text style={styles.co2Text}>Ebből {this.renderTippHighlitedText(this.state.saveablePollutionValues.totalCO2Pollution, 'kg')}-ot tesz ki a CO2.</Text>
                                <Text style={{ fontWeight: 'bold' }}>Ez a fogyasztás évente:</Text>
                                <View style={styles.co2Table}>
                                    <View >
                                        <Image source={require('../assets/icons/tree.png')} style={styles.icon} />
                                        <Text> <Text style={styles.co2TableText}>{parseInt(this.state.saveablePollutionValues.totalCO2Pollution / this.state.averageCO2AbsorptionOfATreePerYear)} fát</Text></Text>
                                    </View>
                                    <View >
                                        <Image source={require('../assets/icons/car.png')} style={styles.icon} />
                                        <Text> <Text style={styles.co2TableText}>{parseInt(this.state.saveablePollutionValues.totalCO2Pollution / this.state.co2PollutionForOneKmOfDistanceTravelledWithCar)} megtett km-t</Text></Text>
                                    </View>
                                </View>
                                <Text style={{ fontWeight: 'bold' }}>jelent.</Text>
                            </View>


                        </View>
                    </View>
                </Modal>
            </>)
        }

    }



    render() {
        if (this.state.allDataLoaded) {
            return (<>

                {this.renderFoodTable()}

                {this.renderTippsForType("OTHERMEAT_CONSUMPTION", this.state.messageRenderingBooleans.OtherMeatConsumption)}

                {this.renderTippsForType("TOTALMEATCONSUMPTION", this.state.messageRenderingBooleans.WeeklyTotalMeatConsumpion)}

                {this.renderTippsForType("PORK_OVERCONSUMPTION", this.state.messageRenderingBooleans.PorkOverconsumption)}

                {this.renderTippsForType("BOTTLEDDRINKS", this.state.messageRenderingBooleans.BottledDrinks)}

                {this.renderTippsForType("FASTFOOD_GENERAL", this.state.messageRenderingBooleans.FastFoodGeneral)}

                {this.renderTippsForType("FASTFOOD_OVERCONSUMPTION", this.state.messageRenderingBooleans.FastFoodOverconsumpiton)}

                {this.renderElectricityTable()}

                {this.renderTippsForType("DARKMODE_NOTUSED", this.state.messageRenderingBooleans.DarkModeNotUsed)}

                {this.renderTippsForType("HEATER_INFRA_GENERAL", this.state.messageRenderingBooleans.HeaterInfraGeneral)}

                {this.renderTippsForType("CINEMA_FOOD", this.state.messageRenderingBooleans.CinemaFood)}

                {this.renderTippsForType("DISTANCE_TRAVELLED", this.state.messageRenderingBooleans.YearlyCarConsumption)}

                {this.renderTippsForType("WORKGOING", this.state.messageRenderingBooleans.WorkGoing)}

                {this.renderModal()}



            </>)
        } else if(this.props.personalConsumptionData.booleanData===""){
            return(<>
                <Text style={styles.emptyAdviceText}>KÉREM TÖLTSE KI A "PC ÉS KONZOL FOGYASZTÁS" ÉS "SZEMÉLYES FOGYASZTÁS" OLDALAKAT!</Text>
            </>)
        }
        return (<>
            <View style={styles.gifImage}>
                <Image source={require('../assets/spinner.gif')} />
            </View>
        </>)
    }


}

const styles = StyleSheet.create({
    highlitedText: {
        color: "red"
    },
    container: { flex: 1, padding: 16, paddingTop: 10, backgroundColor: '#fff' },
    foodTableHead: { height: 100, backgroundColor: '#f1f8ff', justifyContent: 'center' },
    foodTableText: { margin: 1 },
    gifContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    gifImage: {
        alignSelf: 'center'
    },
    divisionLine: {
        borderBottomWidth: 1
    },
    tableTitleText: {
        textAlign: 'center',
        fontWeight: 'bold'
    },
    generalTippText: {
        fontWeight: 'bold',
        padding: 10
    },
    linkText: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#2096f3',
        backgroundColor: '#b8d1cf'
    },
    summaryView: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    summaryButton: {
        backgroundColor: '#ffc108',
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
    summaryModalView: {
        padding: 10,
    },
    summaryModalText: {
        textAlign: 'center',
        fontWeight: 'bold'
    },
    co2Text: {
        marginTop: 10
    },
    co2Table: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        fontWeight: 'bold'
    },
    co2TableText: {
        fontWeight: 'bold',
        color: 'red',
    },
    icon: {
        width: 30,
        height: 30,
        alignSelf: 'center'
    },
    backModalButton: {
        width: '100%',
        backgroundColor: '#0a83a8'
    },
    backModalButtonText: {
        padding: 25,
        marginLeft: '10%',
        color: 'white'
    },
    emptyAdviceText:{
        fontWeight:'bold',
        textAlign:'center'
    }
});

const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5
};


export default TheKey
