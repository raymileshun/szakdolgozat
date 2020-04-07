
import React, { Component } from 'react'
import {
    View,
    Text,
    Dimensions,
    TextInput,
    StyleSheet,
    TouchableHighlight,
    Modal
} from 'react-native';

import Slider from '@react-native-community/slider';
import CheckBox from 'react-native-check-box'
import { ThemeColors } from 'react-navigation';

//REPÜLÉS KISZÁMÍTÁSA ÉS UTAZÁSOK!!! (trainnel összevetve)


//Minimum az zöld lesz
//Maximum pedig barnás fekete


//Algoritmus menete:
//  -   Megnézem tanulmányok alapján, hogy mekkora a legnagyobb terület, amit be lehetne építeni napelemekkel (persze házak tetején is lehetne)
//  -   Kiszámolni hogy pl. egy négyzetkilométeren hány napelem lehetne, és ezek mennyi megawattóra áram előállítására képesek
//  -   Ugyanez szélerőműveknél 
//  -   Kiszámolni azt is, hogy ezek mennyire kontradiktálják egymást, pl. hogy nem lehet egyszerre egy helyen napelem és szélerőmű is
//  -   Kiszámolni hogy mennyi CO2-től mentenek meg évente (itt figyelni kell, hogy csak a szénerőművekhez hasonlítsuk össze, hiszen az atom is CO2 mentes)
//  -   Kiszámolni, hogy mennyivel növeli meg az atom élettartamát
//  -   Mennyi pénz lenne a fejlesztés
//  -   Mennyire tudná fedezni a szükségleteket.
//  -   Kiszámolni, hogy hány háztartásra elég a napenergia
//  -   Hány stadionnyi terület lenne az. (illetve hány balatonnyi)
//  -   Pénzben mennyi ez
//  -   Hány Paks2-nyi energiát jelent
//  -   HÁLÓZATFEJLESZTÉSI ÖSSZEG!!!! + telepítési költségek
//  -   húsevés (olyan receptek amiben van hús de nem kell annyi pl)
//  -   Műanyag szennyezés (mennyi kóla naponta)

//  -   Biomasszát is beleveszem.

//Optimalizálás terület és összeg szerint is!!!!!!


//majd breakni képeket napelemről meg szélerőműről és annak függvényében fog nőni a mennyiségük, amennyi az érték a slidereken


//###############################  NAPELEMEK
//Területek hektárban vannak megadva
//Magyarországon a maximális beépíthető terület 4051.48 km^2 (Pálfy Miklós. „A napenergia fotovillamos hasznosítása")
//Felsőzsolcán 20 megawattos napelempark található 45 hektáron. 45/20=2.25 hektár kell egy megawatthoz (ez változó lehet ezért adtam hozzá 0.1-et)
//A felsőzsolcai naperőmű évente 20242 tonna CO2-vel csökkenti a kibocsájtást (MVM adatai) - 1kw 1 tonna CO2 évente
//Magyarországon jelenleg (2020. 03. 03) 1144 megawattnyi napelempark van. Ez durván számolva akkor 2699 hektárnyi terület
//1 megawatt egy évben kb 1.1 gigawattot termel.
//A felsőzsolcai projekt 3 143 395 450 Ft-ba került, ebből kifolyólag ezt elosztva 20-al, 1 megawatt napelemre 157169772 Ft jön ki
//Viszont a Paksi 20.2 megawattos napelempark 9 milliárd volt, enyhe túlárazással. Itt körülbelül 400milliósra jön ki 1 megawatt napenergia

//##############################  SZÉLERŐMŰVEK
//Az amerikai Shepherds Flat Wind Farm 845 MW kapacitással rendelkezik és 78 km^2-en helyezkedik el, azaz 7800 hektáron
//  7800/845 -re kijön az hogy egy megawatt napenergiához durván 9.23 hektár szükséges (persze ez a turbinák miatt változó lehet)
//A  Horse Hollow Wind Energy Center 19ezer hektáron helyezkedik el és 735.5 hektáron helyezkedik el azaz itt 25-re jön ki hogy annyi hektár szükséges
// egy mgwh energia előállításához. Ezek az adatok elnagyoltak, hiszen a szélturbinák egymástól kényelmes távolságban is helyezkedhetnek el, nem fontos
//optimálisan elhelyezni egymás mellé őket, hiszen termelőterületet nem veszélyeztetik. Viszont a repülő állatvilágot igen, úgyhogy célszerű minél
// közelebb helyezni egymáshoz őket.
//A legoptimálisabban az Alta Wind Energy Center- nél vannak elhelyezve a szélkerekek, itt 3600 hektáron helyezkedik el 800 MW, azaz körülbelül
// 4.5 hektár egy MGWH energia. Itt igazából csak arra akartam törekedni, hogy legyen egy mérőszám amely összehasonlítható a napelemekkel,
//mert a turbinák változóak lehetnek, egy-egy turbina lehet akár 500kw-os vagy akár megawattos méretű is, és itt azért egy nagyobb eltérést hoz, mint napelemeknél,
//hiszen ott nagyjából mindenhol kisebb 200-250 Wattos darabokkal dolgoznak.
// Viszont ott sivatagban történt ez, és hazánkban ez nem annyira megvalósítható, szóval körülbelül olyan 5 hektárra jön ki egy MGWh
//David Mackay számításai szerint 2.7-szer több terület kell a szélerőműveknek mint a napelemeknek, szóval valahol az 5 hektáros érték valahol olyan 5.5 körül lehet

// Viszont FONTOS megjegyezni, hogy míg a napelemparkok teljesen befedik a földet, addig a szélerőművek nem foglalnak el termelésből területet
// csak körülbelül 1 százalékot. (100 km^2-nél körülbelül 1 km^2-t)
//Viszont a szélturbinák hatásfoka jóval kisebb is mint a szoláré, körülbelül 35-40%-os, hazánk adottságai révén körülbelül 32-33% lehet ez az érték
//Az MTA Energetikai BizottságMegújuló Energia Albizottság, 2006. kiadványa szerint Magyarországon 6489 MW potenciálisan kihasználható energia van szélerőművekkel.
//Szóval 6489*5.5 = körülbelül 35689 hektár a maximális terület amit elfoglalhatnak a szélerőművek

//Sajnos árról nem nagyon találtam információt, (magyart főleg nem). USA-ban a Shepherds Flat Wind Farm 2 milliárd USD volt és 845 MW teljesítmény, így
//egy megawattra kb. 670 millió forint jön ki. A Biglow Canyon Wind Farm 800 millió USD volt és 450 MW a kapacitása, ebből következőleg itt
//egy MW 597 millió forintra jött ki. Az érték valahol ezen a tengelyen mozoghat.


//##############################  BIOMASSZA
//A biomassza jelentőssége sem elhanyagolható, főleg hogy hazánkban a megújulók 50%-át a biomassza alkotja.
//A biomassza egyszerű és jó, viszont hátránya, hogy nagyobb területen kell elhelyezkednie mint a napelemnek, illetve a biomasszára használt területeken nem
//folytatódhat tovább mezőgazdasági tevékenység, illetve bonyolultabb az elszállítás, mint a szél, illetve napenergiánál. Gázvezetékek kellenek, tárólótér,
//illetve sok emberi munka. Illetve az élelmiszerárak is megnüövekedhetnek, ha olyan területen akarunk villamosenergiát termelni, ahol egyébként élelmet termesztenek.
//Ezeket az összeget is beleveszem majd.
//Annak ellenére, hogy Megawatt/terület összegre ez jön ki a legrosszabbnak, még egyáltalán nem azt jelenti, hogy a biomasszát nem kell hasznosítani.
//Biomasszánál nem kell akksipakkokkal számolni, hiszen azt akkor égethetjük el amikor akarjuk (akkor állíthatunk elő belőle villamosenergiát),
//illetve a hatásfoka állandó, nem függ tényezőktől. Valamint a hálózatfejlesztési összegbe sem kell már belevenni, hiszen itt másképp történik
//A keletkező energia elszállítása, és ezt az összeget már belevettem az egy megawattnyi árba.
//Viszont amiatt hogy emberigényes, ezért néhány területen munkát is adna az embereknek.


//#############################  AKKUMULÁTOR
//Az ausztrál Solarcitys 100MW-os elempark 90 millió dollárba került. 1 megawatt napenergiához akkor 90/100 milliós dollárnyi akksiösszeget kell számolni
//jelenleg (2020. 03. 04) ez 271 millió forintot jelent.



//############################# AUTÓK KIBOCSÁJTÁSA
//Egy személygépjármű olyan 130-180 gramm CO2-t bocsájt ki kilométerenként
//Átlagosan egy ember körülbelül 15-25ezer km-t tesz meg évente a kocsijával, az évente körülbelül 15000*0.130= 1950 kg CO2, ami 2 tonna körüli összeg (alsóhatár)
//Felső határ: 25000*180=3600, szóval 3,6 tonna CO2 egyetlen ember kibocsájtása
//Válasszunk egy középutat mondjuk 4 tonnát szennyesz egy autó évente. az azt jelenti hogy 4 kw megújulóval lehetne ezt kiváltani. (1kw megújuló kb pont egy tonnával csökkenti)

//Tehát egy MGW-nyi megújuló az 1000/4, tehát 250 autót vált ki évente


//############################  Elektromos autók növekedése
//Az elektromos autók akksijának kapacitása 24-75 kwh óra között van. Jó dolog, hogy nem kell ezeket naponta tölteni, így eloszlik ez a teher,
//viszont ki kellene számolnom hogy egy napra mennyire jön ki a töltés mennyisége és akkor ezt mennyi megújulóval lehetne kiváltani.
//pl. Egy 24kwh-s Nissan Leafet kb 3-4 naponta kellene újratölteni, mert az autó kb 150 km-t tud megtenni egy feltöltéssel
//egy Tesla Model 3 354km-t tud megtenni elviekben 54kwh-s akksipakkal, így itt kicsivel jobbra jön ki a km/kwh érték, és később is kell tölteni.
//Egy Model 3 hatékonysága 16kwh/100km, azaz nagyjából 6.25 kilométert tud megtenni 1 kwh energiával. Ha azt vesszük, akkor mondjuk egy Nissan Leaf is hasonló
//paraméterekkel rendelkezik, hiszen hogyha a 24kwh akksijával meg tud tenni 150kmt, akkor ott is olyan 6.20 körüli értékre jön ki a km/kwh. (persze függ az, hogy mennyi
//elektronikai berendezést használunk utazás közben, illetve például egy Teslában van autópilóta, különböző szolgáltatások, így valamennyivel jobbra jön ki ez az érték)
//Ebből már nagyjbáól kiszámítható, hogy naponta mennyi plusz energiát kell termelnie a megújulóknak, hogy fedezzék ezeket a fogyasztásokat, hiszen, hogyha mondjuk valaki naponta
//30km-t autózik, akkor 30/6.2 = 4.83 kwh összeg jön ki naponta. Számoljunk mondjuk 5kwh-al, ezzel belevéve az esetleges teljesítménycsökkenéseket (egy feltöltéssel úgysem megyünk el 150km-t kényelmesen)
//Ez azt jelenti hogy 4.83*30=144.9 jön ki, amit ha elosztunk százal akkor 1.45 kw-os rendszer jön ki
//Éppen ezért jó lenne, ha minél több megújuló lenne, hiszen legalább ezt a terhet levenné az atomról, szénről.

//Lehetne azt mondani, hogy akkor kevesebb elektromos autó legyen, de még mindig az elektromos autók rendelkeznek a legkevesebb kibocsájtással, illetve az emberek alapvető
//fogyasztásából kellene visszavenni(főleg, hogy sajnos nemhogy csökkenne az energiafelhasználás a javuló technológiákkal, hanem egyre jobban nő)


//a peakSolarOutputPerformance jelenti azt a számot, hogy egy napelempark termelése ténylegesen mennyire használható fel. Pl. nincs mindig napsütés, ezért
//nem tudunk egész nap termelni, illetve az országunk környezeti adottságai ezt teszik lehetővé. (pl Szaharában ez a szám nagyobb)


// hány évig hosszabbítja meg az atom élettartamát
//#########################################
//napi fogyasztás kwh-ban (havi átlagfogyasztás az 11200forint körül van), az kb 3kw
//majd ezt az értéket is odaírni a háztartások átlagfogyasztásához, illetve elosztani a hatásfokokkal
class RenewableSimulation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            solarPanelsArea: 2700,
            solarPanelsMinimumValue: 2700,
            // solarPanelsMaximumValue: 405000,
            solarPanelsMaximumValue: 6000,
            solarPanelAreaNeededForOneMegawattHour: 2.35,
            peakSolarOutputPerformance: 65,
            priceForOneMegawattOfSolarPanelInMillions: 400,

            windMillsArea: 1815,
            windMillsMinimumValue: 1815,
            windMillsMaximumValue: 35689,
            windMillAreaNeededForOneMegawattHour: 5.5,
            peakWindOutputPerformance: 33,
            priceForOneMegawattOfWindPowerInMillions: 600,

            biomassArea: 7000,
            biomassMinimumValue: 7000,
            biomassMaximumValue: 100000,
            biomassAreaNeededForOneMegawattHour: 23,
            peakBiomassOutPutPerformance: 85,
            priceForOneMegawattOfBiomass: 930,

            averageDailyHouseholdConsumptionInKW: 3.5,
            dailyConsumptioninKwh:11,
            batteryPriceForOneMegawattOfElectricity: 271,
            numberOfDaysForBatteryStorage: 1,
            multiplierForOneDayOfBatteryStorage: 1.2,
            calculateBatteryPriceToo: false,

            averageDailyConsumptionOfAnElectricCarInKw: 1.45,
            numberOfElectricCarsInHungary: 12983,
            expectedNumberOfElectricCarsInHungary: 12983,
            electricityNeededForElectricCars: 0,
            growthPercentageOfElectricCarsPerYear: 5,
            currentYearForElectricCarGrowthCalculation: 2020,
            electricCarsYearMinimumValue: 2020,
            electricCarsYearMaximumValue: 2050,

            //Hálózatfejlesztési összegek (megawattonként számolva millió forintban)
            solarExpandPrice: 15,
            windMillsExpandPrice: 23,

            //grammban számolva
            averageCO2EmissionOfCars: 140,
            //ezer kilométerben
            averageTravelDistancePerYear: 15,


            solarPanelsMegawatt: 0,
            solarPanelsPrice: 0,
            houseHoldsPoweredBySolar: 0,
            batteryStorageForSolar: 0,

            windMillsMegawatt: 0,
            windMillsPrice: 0,
            houseHoldsPoweredByWindMill: 0,
            batteryStorageForWindMills: 0,

            biomassMegawatt: 0,
            biomassPrice: 0,
            houdeHoldsPoweredByBiomass: 0,

            decimalPlace: 4,
            //hektárban
            areaOfBalaton: 59200,
            expectedCapacityOfPaks2InMw: 1500,

            areSolarPanelOptionsVisible: true,
            areWindmillOptionsVisible: true,
            areBiomassOptionsVisible: true,
            modalVisible: false

        }
    }

    componentDidUpdate(prevProps, prevState) {
        let solarPanelsMegawatt = ((this.state.solarPanelsArea - this.state.solarPanelsMinimumValue) / this.state.solarPanelAreaNeededForOneMegawattHour).toFixed(this.state.decimalPlace)
        if (this.state.solarPanelsMegawatt !== solarPanelsMegawatt
            || this.state.priceForOneMegawattOfSolarPanelInMillions !== prevState.priceForOneMegawattOfSolarPanelInMillions
            || this.state.peakSolarOutputPerformance !== prevState.peakSolarOutputPerformance) {

            let solarPanelsPrice;
            let batteryStorageForSolar = (this.state.numberOfDaysForBatteryStorage * this.state.multiplierForOneDayOfBatteryStorage * solarPanelsMegawatt)
            if (!this.state.calculateBatteryPriceToo) {
                solarPanelsPrice = (solarPanelsMegawatt * this.state.priceForOneMegawattOfSolarPanelInMillions / 1000).toFixed(this.state.decimalPlace)
            } else {
                solarPanelsPrice = ((solarPanelsMegawatt * this.state.priceForOneMegawattOfSolarPanelInMillions + this.state.batteryPriceForOneMegawattOfElectricity * batteryStorageForSolar) / 1000).toFixed(this.state.decimalPlace)
            }
            let houseHoldsPoweredBySolar = (solarPanelsMegawatt * 1000 / this.state.averageDailyHouseholdConsumptionInKW * (this.state.peakSolarOutputPerformance / 100)).toFixed(0)

            this.setState({ solarPanelsMegawatt: solarPanelsMegawatt })
            this.setState({ solarPanelsPrice: solarPanelsPrice })
            this.setState({ houseHoldsPoweredBySolar: parseInt(houseHoldsPoweredBySolar) })
            this.setState({ batteryStorageForSolar: batteryStorageForSolar })
        }


        let windMillsMegawatt = ((this.state.windMillsArea - this.state.windMillsMinimumValue) / this.state.windMillAreaNeededForOneMegawattHour).toFixed(this.state.decimalPlace)
        if (this.state.windMillsMegawatt !== windMillsMegawatt
            || this.state.priceForOneMegawattOfWindPowerInMillions !== prevState.priceForOneMegawattOfWindPowerInMillions
            || this.state.peakWindOutputPerformance !== prevState.peakWindOutputPerformance) {
            let windMillsPrice;
            let batteryStorageForWindMills = (this.state.numberOfDaysForBatteryStorage * this.state.multiplierForOneDayOfBatteryStorage * windMillsMegawatt)
            if (!this.state.calculateBatteryPriceToo) {
                windMillsPrice = (windMillsMegawatt * this.state.priceForOneMegawattOfWindPowerInMillions / 1000).toFixed(this.state.decimalPlace)
            } else {
                windMillsPrice = ((windMillsMegawatt * this.state.priceForOneMegawattOfWindPowerInMillions + this.state.batteryPriceForOneMegawattOfElectricity * batteryStorageForWindMills) / 1000).toFixed(this.state.decimalPlace)
            }
            let houseHoldsPoweredByWindMill = (windMillsMegawatt * 1000 / this.state.averageDailyHouseholdConsumptionInKW * (this.state.peakWindOutputPerformance / 100)).toFixed(0)

            this.setState({ windMillsMegawatt: windMillsMegawatt })
            this.setState({ windMillsPrice: windMillsPrice })
            this.setState({ houseHoldsPoweredByWindMill: houseHoldsPoweredByWindMill })
            this.setState({ batteryStorageForWindMills: batteryStorageForWindMills })
        }

        let biomassMegawatt = ((this.state.biomassArea - this.state.biomassMinimumValue) / this.state.biomassAreaNeededForOneMegawattHour).toFixed(this.state.decimalPlace)
        if (this.state.biomassMegawatt !== biomassMegawatt
            || this.state.priceForOneMegawattOfBiomass !== prevState.priceForOneMegawattOfBiomass) {
            let biomassPrice;

            biomassPrice = (biomassMegawatt * this.state.priceForOneMegawattOfBiomass / 1000).toFixed(this.state.decimalPlace)

            let houseHoldsPoweredByBiomass = (biomassMegawatt * 1000 / this.state.averageDailyHouseholdConsumptionInKW * (this.state.peakBiomassOutPutPerformance / 100)).toFixed(0)
            this.setState({ biomassMegawatt: biomassMegawatt })
            this.setState({ biomassPrice: biomassPrice })
            this.setState({ houseHoldsPoweredByBiomass: houseHoldsPoweredByBiomass })
        }



        if(this.state.currentYearForElectricCarGrowthCalculation !== prevState.currentYearForElectricCarGrowthCalculation
            || this.state.growthPercentageOfElectricCarsPerYear !== prevState.growthPercentageOfElectricCarsPerYear){

                let expectedNumberOfElectricCarsInHungary = Math.floor(parseInt(this.state.numberOfElectricCarsInHungary)*Math.pow(parseFloat(1+this.state.growthPercentageOfElectricCarsPerYear/100), parseInt(this.state.currentYearForElectricCarGrowthCalculation-this.state.electricCarsYearMinimumValue))) 
                
                this.setState({electricityNeededForElectricCars: expectedNumberOfElectricCarsInHungary*this.state.averageDailyConsumptionOfAnElectricCarInKw})
                this.setState({expectedNumberOfElectricCarsInHungary:expectedNumberOfElectricCarsInHungary})
        }

        if(this.state.averageDailyHouseholdConsumptionInKW !== prevState.averageDailyHouseholdConsumptionInKW){

            this.setState({dailyConsumptioninKwh:(this.state.averageDailyHouseholdConsumptionInKW*100/30).toFixed(2)})
        }



    }

    renderMenuBar(menuType) {
        switch (menuType) {
            case "SOLAR":
                return (<>
                    <View style={{ height: 100, flexDirection: 'row' }}>
                        <View style={{ flex: 8, alignItems: 'center', justifyContent: 'center' }}>
                            <Text onPress={() => {
                                this.setState({
                                    areSolarPanelOptionsVisible: !this.state.areSolarPanelOptionsVisible
                                })
                            }}
                            >
                                Napelem menü
                        </Text></View>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            {this.state.areSolarPanelOptionsVisible ? <Text style={{ transform: [{ rotate: "-90deg" }] }}>{"<"}</Text> : <Text>{"<"} </Text>}
                        </View>
                    </View>

                </>)
                break;
            case "WIND":
                return (<>
                    <View style={{ height: 100, flexDirection: 'row' }}>
                        <View style={{ flex: 8, alignItems: 'center', justifyContent: 'center' }}>
                            <Text onPress={() => {
                                this.setState({
                                    areWindmillOptionsVisible: !this.state.areWindmillOptionsVisible
                                })
                            }}
                            >
                                Szélerőmű menü
                        </Text></View>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            {this.state.areWindmillOptionsVisible ? <Text style={{ transform: [{ rotate: "-90deg" }] }}>{"<"}</Text> : <Text>{"<"} </Text>}
                        </View>
                    </View>



                </>)
                break;
            case "BIOMASS":
                return (<>
                    <View style={{ height: 100, flexDirection: 'row' }}>
                        <View style={{ flex: 8, alignItems: 'center', justifyContent: 'center' }}>
                            <Text onPress={() => {
                                this.setState({
                                    areBiomassOptionsVisible: !this.state.areBiomassOptionsVisible
                                })
                            }}
                            >
                                Biomassza menü
                        </Text></View>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            {this.state.areBiomassOptionsVisible ? <Text style={{ transform: [{ rotate: "-90deg" }] }}>{"<"}</Text> : <Text>{"<"} </Text>}
                        </View>
                    </View>



                </>)
                break;

            default:
                break;
        }

    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }


    renderAreaTexts() {
        return (
            <>
                <View>
                    <TouchableHighlight
                        onPress={() => {
                            this.setModalVisible(!this.state.modalVisible);
                        }}>
                        <Text>Összegzés</Text>
                    </TouchableHighlight>

                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                        }}>
                        <View style={{ marginTop: 22 }}>
                            <View>
                                <Text>Placeholder</Text>

                                <TouchableHighlight
                                    onPress={() => {
                                        this.setModalVisible(!this.state.modalVisible);
                                    }}>
                                    <Text>Modal bezárása</Text>
                                </TouchableHighlight>

                            </View>
                        </View>
                    </Modal>




                    {this.renderSolarPanelInfos()}

                    {this.renderWindMillInfos()}

                    {this.renderBatteryStorageInfos()}

                    {this.renderFractionInfos()}

                    {this.renderNetworkExpandPrices()}

                </View>

            </>

        )
    }



    renderSolarPanelSliders() {
        if (this.state.areSolarPanelOptionsVisible) {
            return (<>
                <TextInput
                    placeholder="Ellátott háztartások"

                    onChangeText={(solarPanelsArea) => this.setState({ solarPanelsArea: this.state.solarPanelsMinimumValue + Math.ceil((solarPanelsArea * this.state.averageDailyHouseholdConsumptionInKW / 1000 / (this.state.peakSolarOutputPerformance / 100) * (this.state.solarPanelAreaNeededForOneMegawattHour))) })}
                    value={this.state.solarPanelsArea}
                />
                <Text>Napelemek területe:  {this.state.solarPanelsArea}  ha</Text>
                <Slider
                    style={{ width: Math.round(Dimensions.get('window').width) * 0.95, height: 40 }}
                    step={1}
                    minimumValue={this.state.solarPanelsMinimumValue}
                    maximumValue={this.state.solarPanelsMaximumValue}
                    minimumTrackTintColor="#2CE85F"
                    maximumTrackTintColor="#BB6A03"
                    value={this.state.solarPanelsArea}
                    onValueChange={solarPanelsArea => {
                        this.setState({ solarPanelsArea })
                    }}
                />
                <Text>Egy megawattnyi napelem ára: {(this.state.priceForOneMegawattOfSolarPanelInMillions).toFixed(2)} millió forint</Text>
                <Slider
                    style={{ width: Math.round(Dimensions.get('window').width) * 0.95, height: 40 }}
                    step={1}
                    minimumValue={100}
                    maximumValue={500}
                    minimumTrackTintColor="#2CE85F"
                    maximumTrackTintColor="#BB6A03"
                    value={this.state.priceForOneMegawattOfSolarPanelInMillions}
                    onValueChange={priceForOneMegawattOfSolarPanelInMillions => {
                        this.setState({ priceForOneMegawattOfSolarPanelInMillions })
                    }}

                />
                <Text>Napelemek hatékonysági foka:  {(this.state.peakSolarOutputPerformance).toFixed(0)} %</Text>
                <Slider
                    style={{ width: Math.round(Dimensions.get('window').width) * 0.95, height: 40 }}
                    step={1}
                    minimumValue={10}
                    maximumValue={100}
                    minimumTrackTintColor="#2CE85F"
                    maximumTrackTintColor="#BB6A03"
                    value={this.state.peakSolarOutputPerformance}
                    onValueChange={peakSolarOutputPerformance => {
                        this.setState({ peakSolarOutputPerformance: peakSolarOutputPerformance })
                    }}

                />
                {this.renderSolarPanelInfos()}

            </>)
        }
    }

    renderSolarPanelInfos() {
        if (this.state.areSolarPanelOptionsVisible) {
            return (<>
                <Text>Napelem Mgw: {this.state.solarPanelsMegawatt}</Text>
                <Text>Napenergia ára: {this.state.solarPanelsPrice} milliárd forint</Text>
                <Text>A napenergia {this.state.houseHoldsPoweredBySolar} háztartást lát el</Text>
            </>)
        }
    }

    renderWindMillSliders() {
        if (this.state.areWindmillOptionsVisible) {
            return (<>
                <TextInput
                    placeholder="Ellátott háztartások"

                    onChangeText={(windMillsArea) => this.setState({ windMillsArea: this.state.windMillsMinimumValue + Math.ceil((windMillsArea * this.state.averageDailyHouseholdConsumptionInKW / 1000 / (this.state.peakWindOutputPerformance / 100) * (this.state.windMillAreaNeededForOneMegawattHour))) })}
                    value={this.state.windMillsArea}
                />
                <Text>Szélerőművek területe:  {this.state.windMillsArea}  ha</Text>
                <Slider
                    style={{ width: Math.round(Dimensions.get('window').width) * 0.95, height: 40 }}
                    step={1}
                    minimumValue={this.state.windMillsMinimumValue}
                    maximumValue={this.state.windMillsMaximumValue}
                    minimumTrackTintColor="#2CE85F"
                    maximumTrackTintColor="#BB6A03"
                    value={this.state.windMillsArea}
                    onValueChange={windMillsArea => this.setState({ windMillsArea })}
                />
                <Text>Egy megawattnyi szélerőmű ára: {(this.state.priceForOneMegawattOfWindPowerInMillions).toFixed(2)} millió forint</Text>
                <Slider
                    style={{ width: Math.round(Dimensions.get('window').width) * 0.95, height: 40 }}
                    step={1}
                    minimumValue={450}
                    maximumValue={700}
                    minimumTrackTintColor="#2CE85F"
                    maximumTrackTintColor="#BB6A03"
                    value={this.state.priceForOneMegawattOfWindPowerInMillions}
                    onValueChange={priceForOneMegawattOfWindPowerInMillions => {
                        this.setState({ priceForOneMegawattOfWindPowerInMillions })
                    }}

                />
                <Text>Szélerőművek hatékonysági foka:  {(this.state.peakWindOutputPerformance).toFixed(0)} %</Text>
                <Slider
                    style={{ width: Math.round(Dimensions.get('window').width) * 0.95, height: 40 }}
                    step={1}
                    minimumValue={10}
                    maximumValue={100}
                    minimumTrackTintColor="#2CE85F"
                    maximumTrackTintColor="#BB6A03"
                    value={this.state.peakWindOutputPerformance}
                    onValueChange={peakWindOutputPerformance => {
                        this.setState({ peakWindOutputPerformance: peakWindOutputPerformance })
                    }}

                />

                {this.renderWindMillInfos()}

            </>)
        }

    }

    renderWindMillInfos() {
        if (this.state.areWindmillOptionsVisible) {
            return (<>
                <Text>Szélerőmű Mgw: {this.state.windMillsMegawatt}</Text>
                <Text>Szélerőmű ára: {this.state.windMillsPrice} milliárd forint</Text>
                <Text>A szélerőmű {this.state.houseHoldsPoweredByWindMill} háztartást lát el</Text>
            </>)
        }
    }


    renderBiomassSliders() {
        if (this.state.areBiomassOptionsVisible) {
            return (<>
                <TextInput
                    placeholder="Ellátott háztartások"

                    onChangeText={(biomassArea) => this.setState({ biomassArea: this.state.biomassMinimumValue + Math.ceil((biomassArea * this.state.averageDailyHouseholdConsumptionInKW / 1000 / (this.state.peakBiomassOutputPerformance / 100) * (this.state.biomassAreaNeededForOneMegawattHour))) })}
                    value={this.state.biomassArea}
                />
                <Text>Biomassza területe:  {this.state.biomassArea}  ha</Text>
                <Slider
                    style={{ width: Math.round(Dimensions.get('window').width) * 0.95, height: 40 }}
                    step={1}
                    minimumValue={this.state.biomassMinimumValue}
                    maximumValue={this.state.biomassMaximumValue}
                    minimumTrackTintColor="#2CE85F"
                    maximumTrackTintColor="#BB6A03"
                    value={this.state.biomassArea}
                    onValueChange={biomassArea => this.setState({ biomassArea })}
                />
                <Text>Egy megawattnyi biomassza ára: {(this.state.priceForOneMegawattOfBiomass).toFixed(2)} millió forint</Text>
                <Slider
                    style={{ width: Math.round(Dimensions.get('window').width) * 0.95, height: 40 }}
                    step={1}
                    minimumValue={850}
                    maximumValue={1000}
                    minimumTrackTintColor="#2CE85F"
                    maximumTrackTintColor="#BB6A03"
                    value={this.state.priceForOneMegawattOfBiomass}
                    onValueChange={priceForOneMegawattOfBiomass => {
                        this.setState({ priceForOneMegawattOfBiomass })
                    }}

                />

                {this.renderBiomassInfos()}

            </>)
        }

    }

    renderBiomassInfos() {
        if (this.state.areBiomassOptionsVisible) {
            return (<>
                <Text>Biomassza Mgw: {this.state.biomassMegawatt}</Text>
                <Text>Biomassza ára: {this.state.biomassPrice} milliárd forint</Text>
                <Text>A biomassza {this.state.houseHoldsPoweredByBiomass} háztartást lát el</Text>
            </>)
        }
    }

    renderBatteryStorageSlider() {
        if (this.state.calculateBatteryPriceToo) {
            return (
                <>
                    <Text>Hány napig szeretné tárolni az áramot? {this.state.numberOfDaysForBatteryStorage}</Text>
                    <Slider
                        style={{ width: Math.round(Dimensions.get('window').width) * 0.95, height: 40 }}
                        step={1}
                        minimumValue={1}
                        maximumValue={6}
                        minimumTrackTintColor="#2CE85F"
                        maximumTrackTintColor="#BB6A03"
                        value={this.state.numberOfDaysForBatteryStorage}
                        onValueChange={numberOfDaysForBatteryStorage => {
                            this.setState({ numberOfDaysForBatteryStorage })
                        }}

                    />
                </>
            )
        }
    }

    renderBatteryStorageInfos() {
        let batteryStorage = this.state.batteryStorageForSolar + this.state.batteryStorageForWindMills
        if (this.state.calculateBatteryPriceToo) {
            return (
                <>
                    <Text>Ennyi mgwh akkumulátor
                    kell a tároláshoz: {batteryStorage.toFixed(2)}</Text>
                    <Text>Ennek az ára: {(this.state.batteryPriceForOneMegawattOfElectricity * batteryStorage / 1000).toFixed(4)} milliárd forint</Text>
                </>
            )
        }

    }

    renderElectricCarsSlider() {
        return (<>
            <Text>Elektromos autók száma:  {this.state.expectedNumberOfElectricCarsInHungary}</Text>
            <Text>Autók mennyiségének növekedése évente:  {this.state.growthPercentageOfElectricCarsPerYear} %</Text>
            <Slider
                style={{ width: Math.round(Dimensions.get('window').width) * 0.95, height: 40 }}
                step={1}
                minimumValue={1}
                maximumValue={25}
                minimumTrackTintColor="#2CE85F"
                maximumTrackTintColor="#BB6A03"
                value={this.state.growthPercentageOfElectricCarsPerYear}
                onValueChange={growthPercentageOfElectricCarsPerYear => this.setState({ growthPercentageOfElectricCarsPerYear})}
            />
            <Text>Kiválasztott év:  {this.state.currentYearForElectricCarGrowthCalculation}</Text>
            <Slider
                style={{ width: Math.round(Dimensions.get('window').width) * 0.95, height: 40 }}
                step={1}
                minimumValue={this.state.electricCarsYearMinimumValue}
                maximumValue={this.state.electricCarsYearMaximumValue}
                minimumTrackTintColor="#2CE85F"
                maximumTrackTintColor="#BB6A03"
                value={this.state.currentYearForElectricCarGrowthCalculation}
                onValueChange={currentYearForElectricCarGrowthCalculation => this.setState({ currentYearForElectricCarGrowthCalculation})}
            />
            <Text>Ennyi energiára van szükség az elektromos autók kiváltásához: {this.state.electricityNeededForElectricCars/1000} MGW</Text>
        </>)

    }

    renderFractionInfos() {
        let solarOccupiedArea = this.state.solarPanelsArea - this.state.solarPanelsMinimumValue
        let windMillOccupiedArea = this.state.windMillsArea - this.state.windMillsMinimumValue
        let biomassOccupiedArea = this.state.biomassArea - this.state.biomassMinimumValue
        let totalOccupiedArea = parseInt(solarOccupiedArea) + parseInt(windMillOccupiedArea) + parseInt(biomassOccupiedArea)
        let totalMegawatt = parseInt(this.state.solarPanelsMegawatt) + parseInt(this.state.windMillsMegawatt) + parseInt(this.state.biomassMegawatt)
        let houseHoldsPoweredByPaks2 = this.state.expectedCapacityOfPaks2InMw * 1000 / parseFloat(this.state.averageDailyHouseholdConsumptionInKW * 0.9);
        let totalHouseHoldsPoweredByRenewables = parseInt(this.state.houseHoldsPoweredBySolar) + parseInt(this.state.houseHoldsPoweredByWindMill) + parseInt(this.state.houseHoldsPoweredByBiomass)
        let numberOfCarsCO2FreedWithRenewables = totalMegawatt * 1000 / parseFloat((this.state.averageCO2EmissionOfCars / 1000) * this.state.averageTravelDistancePerYear)


        return (
            <>
                <Text>A megújulók {(totalOccupiedArea / this.state.areaOfBalaton).toFixed(4)} Balatonnyi területet foglalnak el.</Text>
                <Text>A megújulók {(totalHouseHoldsPoweredByRenewables / houseHoldsPoweredByPaks2).toFixed(2)} Paks2-nyi energiát váltanak ki </Text>
                <Text>Évente {totalMegawatt * 1012} tonna CO2-vel csökkentik a kibocsájtást</Text>
                <Text>Ez {parseInt(numberOfCarsCO2FreedWithRenewables)} autó kibocsájtását fedezi</Text>
                
            </>
        )
    }

    renderNetworkExpandPrices() {
        let totalPrice = (this.state.solarExpandPrice * this.state.solarPanelsMegawatt) + (this.state.windMillsExpandPrice * this.state.windMillsMegawatt)
        return (<>
            <Text>A megújulókhoz {totalPrice / 1000} milliárdnyi hálózatfejlesztési összeget kell számolni</Text>

        </>)

    }



    render() {
        return (
            <>

                {this.renderMenuBar("SOLAR")}

                {this.renderSolarPanelSliders()}

                {this.renderMenuBar("WIND")}

                {this.renderWindMillSliders()}

                {this.renderMenuBar("BIOMASS")}

                {this.renderBiomassSliders()}


                <Text>Háztartások átlagos napi energiaigénye:  {(this.state.averageDailyHouseholdConsumptionInKW).toFixed(2)} KW ({this.state.dailyConsumptioninKwh} kwh)</Text>
                <Slider
                    style={{ width: Math.round(Dimensions.get('window').width) * 0.95, height: 40 }}
                    step={0.1}
                    minimumValue={0.1}
                    maximumValue={15}
                    minimumTrackTintColor="#2CE85F"
                    maximumTrackTintColor="#BB6A03"
                    value={this.state.averageDailyHouseholdConsumptionInKW}
                    onValueChange={averageDailyHouseholdConsumptionInKW => {
                        this.setState({ averageDailyHouseholdConsumptionInKW })
                    }}

                />

                <CheckBox
                    style={{ flex: 1, padding: 10 }}
                    onClick={() => {
                        this.setState({
                            calculateBatteryPriceToo: !this.state.calculateBatteryPriceToo
                        })
                    }}
                    isChecked={this.state.calculateBatteryPriceToo}
                    leftText={"Számoljunk-e akkumulátorpakkokkal is?"}
                />

                {this.renderBatteryStorageSlider()}

                {this.renderElectricCarsSlider()}


                {this.renderAreaTexts()}
            </>

        )
    }

}

const styles = StyleSheet.create({
    menuBar: {
        fontWeight: 'bold'
    }
})

export default RenewableSimulation