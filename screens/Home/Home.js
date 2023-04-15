import React, {useState, useEffect, Fragment, useRef, useCallback} from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, InputHome, logOut, MyCountry, MyDialog, TextButton } from '../../components/Utilities';
import { CountryCnt, Seperator } from '../../components/Utilities';
import { DatePickerModal } from 'react-native-paper-dates';
import {useApp, useUser} from '@realm/react';
import  Realm, { BSON }  from 'realm';
import { Travel, TravelRealmContext } from '../../components/Database/MongoDB';
import getCountryISO3 from 'country-iso-2-to-3'
import { leftSwipe } from '../../components/Swipes';
import uuid from 'react-native-uuid';
import CountryFlag from 'react-native-country-flag';
import { horizontalScale, verticalScale } from '../../components/Metrics';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Dialog, Portal, Provider, Text as Text2 } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';



const Home = ({route, navigation}) => {
    const [text, setText] = React.useState('');
    const hasUnsavedChanges = Boolean(text);
    const user = useUser();
    const {email} = route.params
    const [myEmail, setMyEmail] = useState(email)
    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
      }

      useFocusEffect(
        React.useCallback(() => {
            setMsg('')
            setFilteredDataSource([])
        }, [])
      );
      React.useEffect(
        () =>
          navigation.addListener('beforeRemove', (e) => {
            if (!hasUnsavedChanges) {
              // If we don't have unsaved changes, then we don't need to do anything
              return;
            }
            // Prevent default behavior of leaving the screen
            e.preventDefault();
    
          }),
        [navigation, hasUnsavedChanges]
      );

    const [visible, setVisible] = React.useState(false); const showDialog = () => setVisible(true); const hideDialog = () => setVisible(false);
    const [myCountry, setMyCountry] = useState({name: 'United States', iso: 'US'});const [goCountry, setGoCountry] = useState(''); const [isoGoCountry, setIsoGoCountry] = useState('');const [isChangeActive, setIsChangeActive] = useState(false);const [placeHolder, setPlaceHolder] = useState(false);
    const [isClicked, setIsClicked] = useState(false); const [countries, setCountries] = useState([]);const [filteredDataSource, setFilteredDataSource] = useState([]);const [masterDataSource, setMasterDataSource] = useState([]);const [search, setSearch] = useState('')
    const [expectancyFrom, setExpectancyFrom] = useState([]);const [expectancyGo, setExpectancyGo] = useState([])
    const inputRef = useRef();const inputRefTxt = useRef();const {useRealm, useQuery, useObject} = TravelRealmContext;
    const realm = useRealm();const travels = useQuery(Travel);
    // const oneTravel = useObject(Travel, _id);

    useFocusEffect(
        React.useCallback(() => {
            hideDialog()
        }, [])
    )

    const dataFetch2 = async (iso) => {
        const isoFrom = getCountryISO3(myCountry.iso)
        const isoGo = getCountryISO3(iso)
        await fetch('https://www.jsonkeeper.com/b/L1ZD', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
})
    .then(response => response.json())
    .then(async (json) => {
        setExpectancyGo(json.filter(country => country['Country Code'] == isoGo)[0]['2020 [YR2020]'])
        setExpectancyFrom(json.filter(country => country['Country Code'] == isoFrom)[0]['2020 [YR2020]'])
    })
    .catch(error => {
    });
    }

    useEffect(() => {

        const dataFetch1 = async () => {
            await fetch('https://api.countrystatecity.in/v1/countries', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-CSCAPI-KEY': 'UG9lVktzWEswQ3lTSlJEN0tGODRNMkkxZllnTDVzcW5abTFYSm1MQg=='
            },
})
        .then(response => response.json())
        .then(json => {
            setCountries(json)
        })
        .catch(error => {
        console.error(error);
        });
        }

        dataFetch1()

    },[])

    const searchCountries = (text) => {

        function checkName(item) {
        return item.name != myCountry.name;
        }

        setFilteredDataSource(countries.filter(checkName))
        setMasterDataSource(countries.filter(checkName))
        if (text) {
          const newData = masterDataSource.filter(
          function (item, index) {
            const itemData = item.name
                ? item.name.toUpperCase()
                : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        })
          setFilteredDataSource(newData.filter(checkName));
          setSearch(text);
        } else {
            setTimeout(() => {
                // setIsDisabled(true)
            },500)
            setFilteredDataSource([]);
            setSearch(text);
        }
    };

    const chooseDate = (item) => {
        setFilteredDataSource([item])
        setOpen(true)
        setIsChangeActive(true)
    }

    const [range, setRange] = useState({ startDate: undefined, endDate: undefined });
    const [open, setOpen] = useState(false);
    const [positive, setPositive] = useState(false);
    const [adverb, setAdverb] = useState(false);
    adverb
    const onDismiss = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const onConfirm = async ({ startDate, endDate }) => {
            await dataFetch2()
            setOpen(false);
            setRange({ startDate, endDate });
            await addToTravels(startDate, endDate)
    }

    const [dayDiff, setDayDiff] = useState(0); const [dayDif, setDayDif] = useState(0)

    const addToTravels = async (x, y) => {

        try{

            const ms = y.getTime() - x.getTime()
            const daySubtract = ms / (1000 * 60 * 60 * 24)
    
            const differenceInDays = (daySubtract) * (expectancyGo/expectancyFrom - 1)
    
    
            setDayDif(Math.round(daySubtract))
    
            if(differenceInDays >= 0) {
                setAdverb('for more')
                setDayDiff(Math.round(differenceInDays))
            } else {
                setAdverb('less')
                setDayDiff(Math.round(-differenceInDays))
            }
    
    
            realm.write(() => {
                realm.create('Travel', {
                    _id: uuid.v4(),
                    useremail: email,
                    from: myCountry.name,
                    to: goCountry,
                    startdate: x,
                    enddate: y,
                    lifeexpectancy: Math.round(differenceInDays)
                });
            });
            showDialog()
        
        }
        
        catch(err) {
            Alert.alert('Information Error', 'Please make sure to choose the start and the end date for your trip.')
        }
        

        setMsg('')
        setFilteredDataSource([])
        setRange({ startDate: undefined, endDate: undefined });

    }
    
    const [msg, setMsg] = useState()
    const [Txtt, setTxtt] = useState('Change My Country')

    const app = useApp();
    
    const logOut = async () => {
      
        await app.currentUser.logOut();
        navigation.navigate('Zero')
      }

    useEffect(() => {
        if(placeHolder) {
            setTxtt('Choose Travel Country')
        } else {
            setTxtt('Change My Country')
        }
    })

    const changeCountry = (item) => {
        setMyCountry({name: item.name, iso: item.iso2});
    }

    const chooseCountry = (item) => {
        setIsClicked(true); 
        setGoCountry(item.name); 
        dataFetch2(item.iso2); 
        chooseDate(item)
    }

    const [visibleDialogAccount, setVisibleDialogAccount] = useState(false)

    const showDialogAccount = () => {setVisibleDialogAccount(true); setMsg(''); setFilteredDataSource([])}
    const hideDialogAccount = () => setVisibleDialogAccount(false)
    
    return (
        <SafeAreaView style={styles.page}>
            <Header title={'Home'} color={'black'} />
                        <View style={styles.textInputCnt}>
                            <TextInput autoCapitalize='words' value={msg} placeholder={placeHolder ? 'Select your country' : 'Where do you want to go?'} onChangeText={(text) => {searchCountries(text); setMsg(text)}} ref={input => { this.textInput = input }} style={styles.textInput}>
                            
                            </TextInput>
                        </View>
                        <View style={{opacity: isClicked ? 1 : 1, }}>
                            <ScrollView>
                        {
                            filteredDataSource.slice(0, 20).map((item, index) => (
                                <Fragment  key={index}>
                                        <CountryCnt style={{borderTopLeftRadius: index == 0 ? 10 : 0, borderTopRightRadius: index == 0 ? 10 : 0,borderBottomLeftRadius: index == (filteredDataSource.length -1) ? 10 : 0, borderBottomRightRadius: index  == (filteredDataSource.length -1) ? 10 : 0}} txt={item.name} onPress={() => {setMsg(item.name); 
                                            if(placeHolder){changeCountry(item)} 
                                            else {chooseCountry(item)}}}
                                            />
                                </Fragment>
                            ))
                        }
                            </ScrollView>
                        </View>
                        <View style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
                <DatePickerModal
                locale="en"
                type
                mode="range"
                visible={open}
                onDismiss={onDismiss}
                startDate={range.startDate}
                endDate={range.endDate}
                onConfirm={onConfirm}
                />
            </View>
            <Provider theme={{colors: {background: 'transparent', elevation: {level3: 'white'}}}} >
            <View>
                <Portal>
                <Dialog style={styles.provider} visible={visible} onDismiss={hideDialog}>
                    <View style={{flexDirection: 'column', marginHorizontal: horizontalScale(20)}}>
                    <Text style={{fontSize: 18, marginVertical: verticalScale(10), alignSelf: 'center', bottom: verticalScale(10)}}>You are travelling</Text>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 12, alignSelf: 'center'}}>from</Text> 
                        <Text style={{fontSize: 20}}> {myCountry.name}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginBottom: verticalScale(20)}}>
                        <Text style={{fontSize: 12, alignSelf: 'center'}}>to</Text> 
                        <Text style={{fontSize: 20}}> {goCountry}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginBottom: verticalScale(10)}}>
                        <Text style={{fontSize: 12, alignSelf: 'center'}}>If you stay there for <Text>
                        <Text style={{fontSize: 20}}>{dayDif}</Text>
                        </Text> days</Text> 
                    </View>
                    <View style={{flexDirection: 'row', marginBottom: verticalScale(20)}}>
                        <Text style={{fontSize: 12, alignSelf: 'center'}}>you are expected to live <Text>
                        
                        </Text>{adverb} <Text style={{fontSize: 20}}>{dayDiff} </Text>days
                        </Text> 

                    </View>
                    </View>
                    <Dialog.Title>
                        ENJOY YOUR HOLIDAY!
                    </Dialog.Title>
                    <Dialog.Actions>
                    <Button onPress={hideDialog} textColor={'blue'}>Thank You!</Button>
                    </Dialog.Actions>
                </Dialog>
                </Portal>
            </View>
            </Provider>
            <MyDialog visible={visibleDialogAccount} hideDialog={hideDialogAccount} onPressYes={logOut}/>
            <View style={{opacity: visibleDialogAccount ? 0 : 1}}>
                <View style={styles.myCountryCnt}>
                    <View>
                    <Text style={styles.myCountryText}>My Country >>> </Text>
                        <TouchableOpacity  onPress={() => {
                            placeHolder ? setPlaceHolder(false) : setPlaceHolder(true)
                        }}>
                            <Text style={[styles.myCountryTextChng, {color: placeHolder ? 'red' : '#6464EF'}]}>{Txtt}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                    <CountryFlag  style={styles.flagCnt} isoCode={myCountry.iso} size={42}/>
                    </TouchableOpacity>
                </View>
                <TextButton onPress={showDialogAccount} />
            </View>
        </SafeAreaView>
)};

const styles = StyleSheet.create({
    page: {
        backgroundColor: 'black',
        flex: 1
    },
    provider: {
        position: 'relative',
        bottom: verticalScale(150),
        marginBottom: 0,
        paddingBottom: 0,
        height: verticalScale(400)
    },
    myCountryCnt : {
        marginHorizontal: horizontalScale(50),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    myCountryText: {
      fontSize: 24,
      color: 'white'
    },
    myCountryTextChng : {
        marginVertical: verticalScale(10),
        color: '#1524CB'
    },
    flagCnt : {
        borderWidth: 3
    },
    textInputCnt : {
        marginHorizontal: verticalScale(20),
        height: 50,
        marginVertical: verticalScale(30),
        backgroundColor: '#F8F8F8',
        borderRadius: 5,
        justifyContent: 'center'
    },
    textInput: {
        fontSize: 20,
        fontWeight: '400',
        marginHorizontal: horizontalScale(10),
    },
})

export default Home;


