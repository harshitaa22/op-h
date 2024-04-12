import React from 'react'
import { icons } from '../../assets';
import ReferralController from './ReferralController';
import colors from '../../colors';
import { Keyboard, Platform, StyleSheet, Text, View } from 'react-native'
//framework
import { scaledSize } from '../../../../../framework/src/Utilities';
//components
import { Fonts } from '../../../../../components/src/Utils/Fonts';
//library
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from 'react-native-safe-area-context';

export class Referral extends ReferralController {
    render() {
        return (
            <>
                <SafeAreaView
                    forceInset={{
                        top: Platform.OS == "android" ? "always" : "never",
                        bottom: "never",
                    }}
                    style={styles.container}
                >
                    <View
                        style={{
                            paddingTop: scaledSize(10),
                            backgroundColor: colors.white,
                        }}
                    >
                        <View
                            style={{
                                alignItems: "center",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginHorizontal: scaledSize(5),

                            }}
                        >
                            <Text
                                style={[
                                    styles.fontFamilyBold,
                                    {
                                        color: colors.black,
                                        flex: 1,
                                        textAlign: 'center',
                                        fontSize: scaledSize(20),
                                    },
                                ]}
                            >
                                {"My Referrals"}
                            </Text>
                            <Icon
                                testID={"goBack"}
                                name={icons.chevron_left}
                                size={scaledSize(35)}
                                color={colors.black}
                                style={{ padding: 0, margin: 0, left: 0, position: 'absolute' }}
                                onPress={() => [this.goToBack(), Keyboard.dismiss()]}
                            />
                        </View>
                    </View>
                    <View>{this.renderReferrals()}</View>
                </SafeAreaView>
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    fontFamilyRegular: {
        fontFamily: Fonts.REGULAR,
    },
    fontFamilyBold: {
        fontFamily: Fonts.LIGHT_BOLD,
    },
    commonFlex: {
        flex: 1
    },
    flex: {
        flex: 2
    }
});

export default Referral
