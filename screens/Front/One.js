import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeadTextCst, TextSmall, BottomText } from '../../components/Texts';
import { CustomButton, CustomLgButton } from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { Space } from '../../components/Utilities';

const One = () => {
    
    const navigation = useNavigation()

    return  (
        <SafeAreaView style={{backgroundColor: 'black', flex: 1,}}>
            <HeadTextCst value1={'Welcome to HMD?'} />
            <CustomButton text={'Create an Account'} bck={'#f0c117'} onPress={() => {navigation.navigate('Signup')}}/>
            <TextSmall value={'or'} />
            <CustomLgButton onPress={() => {navigation.navigate('Next')}} text={'Sign in with Google'} bck={'white'} icon={'google'} />
            <Space space={10}/>
            <CustomLgButton onPress={() => {navigation.navigate('Next')}} text={'Sign in with Apple'} bck={'white'}  icon={'apple'}/>
            <Space space={10}/>
            <CustomLgButton onPress={() => {navigation.navigate('Next')}} text={'Sign in with Facebook'} bck={'white'} icon={'facebook'} />
            <Space space={10}/>
            <TextSmall value={'already signed up?'} />
            <Space space={10}/>
            <CustomButton onPress={() => {navigation.navigate('Login')}} text={'Sign in'} bck={'white'} />
            <BottomText value={'Remind  Me Later'} onPress={() => {navigation.navigate('Tabs')}}/>
        </SafeAreaView>
)}


export default One;
