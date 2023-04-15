import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeadText } from '../../components/Texts';
import { WatchListIcon } from '../../components/Icons';
import { ButtonZero } from '../../components/Button';
import { useNavigation } from '@react-navigation/native';


const Zero = () => {
    const navigation = useNavigation()
    
    return  (
        <SafeAreaView style={{backgroundColor: 'black', flex: 1,}}>
            <HeadText value1={'Welcome to HMD?'} value2={'Sign in to find out the best'} value3={' places to visit for your'} value4={'longevity'}/>
            <WatchListIcon name={'list-ul'} text={'Plan Your Travels'}/>
            <WatchListIcon name={'thumbs-o-up'} text={'Get Suggestions'}/>
            <WatchListIcon name={'star-o'} text={'Rate Your Travels'}/>
            <ButtonZero text={'Continue'} onPress={() => {navigation.navigate('One')}}/>
        </SafeAreaView>
)}


export default Zero;
