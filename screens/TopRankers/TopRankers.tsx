import React from 'react'
import { StyleSheet } from 'react-native'
import { ActivityIndicator, Dimensions, FlatList, Image, Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import TopRankersController from './TopRankersController'
//colors
import colors from '../../colors'
//framework
import { scaledSize, widthFromPercentage } from '../../../../../framework/src/Utilities'
// components
import { Fonts } from '../../../../../components/src/Utils/Fonts'
import HeaderComponent from '../../../../../components/src/HeaderComponent'
import { nFormatter } from '../../../../../components/src/Utils/service'
import { getVerifedColor, getVerifedIcon } from '../../../../../components/src/utilitisFunction'
//assets
import { profile } from '../../assets'
const { width } = Dimensions.get('screen')

export class TopRankers extends TopRankersController {
    _renderWatchListItem = ({ item, index }: { item: any, index: number }) => {
        let userData = item?.attributes
        return (
            <View style={{ width: width, flex: 1, marginBottom: scaledSize(15) }
            }>
                <View style={[styles.cardContainer]}>
                    <View style={styles.row}>
                        <TouchableOpacity onPress={() => {
                            this.goToFriendProfilePage(item?.id)
                        }}
                            style={
                                // item?.attributes?.opigo_verified ?
                                //     styles.verifiedProfileView : styles.profile_view
                                styles.verifiedProfileView
                                //     {
                                //     justifyContent: "center",
                                //     marginRight: scaledSize(10),
                                // }
                            }
                        >
                            <Image
                                source={
                                    userData.profile != null
                                        ? { uri: userData.profile }
                                        : profile
                                }
                                style={[
                                    styles.profile,
                                    {
                                        borderColor: getVerifedColor(userData.opigo_verified_type),
                                    },
                                ]}
                            />
                            <View
                                style={[
                                    styles.blueBackgrondForText,
                                    {
                                        backgroundColor: getVerifedColor(
                                            userData.opigo_verified_type
                                        ),
                                    },
                                ]}
                            >
                                {userData.opigo_score != undefined ? (
                                    <Text style={[styles.textForImage, styles.fontFamilyRegular]}>
                                        {nFormatter(userData.opigo_score)}
                                    </Text>
                                ) : (
                                    <Text style={[styles.textForImage, styles.fontFamilyRegular]}>
                                        {"0"}
                                    </Text>
                                )}
                            </View>
                            {
                                item?.attributes?.opigo_verified &&
                                <View style={styles.verified_view}>
                                    <Image
                                        source={getVerifedIcon(userData.opigo_verified_type)}
                                        style={styles.veified}
                                    />
                                </View>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.goToFriendProfilePage(item?.id)
                        }} style={{ flex: 1, marginLeft: scaledSize(10), flexDirection: "row", alignItems: "center" }}>
                            {userData.fullName ? (
                                <Text
                                    numberOfLines={2}
                                    style={[styles.fontFamilyBold, { textTransform: "none" }]}
                                >
                                    {userData.fullName}
                                </Text>
                            ) : (
                                <Text
                                    numberOfLines={2}
                                    style={[styles.fontFamilyBold, { textTransform: "none" }]}
                                >
                                    {`${userData?.first_name} ${userData?.last_name}`}
                                </Text>
                            )}
                            <View style={{ flexDirection: "row", alignItems: "center", marginLeft: scaledSize(5) }}>
                                <Text numberOfLines={1} style={styles.lightText}>
                                    #{index + 1}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ alignItems: "flex-end" }}>
                            <Text style={[styles.fontFamilyBold]}>₹{userData?.amount ? userData?.amount.toFixed() : 0}</Text>
                            {/* <PriceText
                                from="overview"

                                currentPrice={
                                    "50"
                                }

                            /> */}
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: "rgb(239,241,243)", flex: 1 }}>
                <HeaderComponent
                    title={"Leaderboard"}
                    onClose={() => {
                        this.props.navigation.goBack()
                    }
                    }
                    isBack={true}
                    title_container={{ justifyContent: "flex-start" }}
                    header_txt_style={{
                        textAlign: "center",
                        textAlignVertical: "center",

                    }}
                />
                <Text style={{
                    marginTop: scaledSize(5),
                    marginHorizontal: scaledSize(15), fontFamily: Fonts.REGULAR, marginBottom: scaledSize(13)
                }}>Users with highest payout in last 30 days</Text>
                {
                    this.state.topscoreLoaderVisible ?
                        <View style={styles.activityIndicator}>
                            <ActivityIndicator size={"large"} color={colors.blue} />
                        </View> :
                        <View style={{ flex: 1 }}>
                            <FlatList
                                contentContainerStyle={{ paddingBottom: 30 }}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                initialNumToRender={10}
                                maxToRenderPerBatch={10}
                                data={this.state.topScoreList}
                                onEndReachedThreshold={0.8}
                                // ListFooterComponent={() => {
                                //     return (
                                //         this.state.cardLoading && <ActivityIndicator color={colors.blue} />
                                //     )
                                // }}
                                // ListEmptyComponent={() => {
                                //     return <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                //         <Text style={styles.fontFamilyBold}>You have not tracked any stocks!</Text>
                                //     </View>
                                // }}
                                // onRefresh={() => { this.refreshCard() }}
                                // refreshing={this.state.cardRefresh}

                                // onEndReached={this.LoadMoreCardRandomData}
                                renderItem={this._renderWatchListItem}
                                keyExtractor={(item, index) => index.toString()} />
                        </View>
                }

            </SafeAreaView>
        )
    }
}

export default TopRankers

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: scaledSize(5),
        width: Platform.OS === "web" ? "75%" : "100%",
    },
    fontFamilyBold: {
        fontFamily: Fonts.LIGHT_BOLD
    },
    name: {
        fontSize: scaledSize(15),
        fontWeight: "bold",
    },
    socialImange: {
        borderRadius: scaledSize(15),
    },
    activeTab: {
        borderRadius: scaledSize(360),
        shadowColor: colors.white,
        shadowOffset: { height: 0, width: 0 },
        shadowRadius: 10,
        width: widthFromPercentage(10),
        alignItems: 'center',
        marginBottom: scaledSize(8)
    },
    unActivTab: {
        borderRadius: scaledSize(360),
        shadowColor: colors.white,
        shadowOffset: { height: 0, width: 0 },
        shadowRadius: 10,
        width: widthFromPercentage(10),
        marginBottom: scaledSize(8)
    },
    textForImage: {
        fontSize: scaledSize(8),
        color: colors.white,
    },
    tabs_txt: {
        marginHorizontal: scaledSize(15),
        fontSize: scaledSize(15),
        fontFamily: Fonts.LIGHT_BOLD
    },
    unselected_tab_txt: {
        marginHorizontal: scaledSize(15),
        fontSize: scaledSize(15),
        fontFamily: Fonts.REGULAR,
        color: colors.gray,
    },
    blueBackgrondForText: {

        borderRadius: scaledSize(6),
        width: widthFromPercentage(7),
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginTop: scaledSize(-12),
        padding: scaledSize(1),
    },
    verified_view: {
        width: widthFromPercentage(6),
        height: widthFromPercentage(6),
        backgroundColor: colors.white,
        borderRadius: scaledSize(360),
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: -10,
        right: -9,
        elevation: 5,
    },
    veified: {
        width: widthFromPercentage(3),
        height: widthFromPercentage(3),
    },
    fontFamilyRegular: {
        fontFamily: Fonts.REGULAR,
    },
    gird_row: {
        flexDirection: 'row',
        marginBottom: scaledSize(10),
        marginLeft: scaledSize(15),
        marginRight: scaledSize(15),
    },
    grid_flex: {
        flex: 1,
        borderBottomColor: colors.black,
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    unselectd_grid_flex: {
        flex: 1,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.bgColor,
        alignItems: 'center'
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: scaledSize(20),
        // flex: 1,
        alignItems: "center",
        // overflow: "hidden",
    },
    boldText: {
        fontFamily: Fonts.LIGHT_BOLD,
    },
    lightText: {
        fontSize: scaledSize(12),
        color: colors.gray,
    },
    cardContainer: {
        backgroundColor: colors.white,
        paddingVertical: scaledSize(15),
        borderRadius: scaledSize(20),
        marginHorizontal: scaledSize(14),
    },
    profile: {
        width: widthFromPercentage(11),
        height: widthFromPercentage(11),
        borderRadius: scaledSize(360),
        borderWidth: 2,
        borderColor: colors.blue,
        backgroundColor: colors.lightGray,
        // width: widthFromPercentage(11),
        // height: widthFromPercentage(11),
        // borderRadius: widthFromPercentage(5.5),
        // backgroundColor: colors.lightGray
    },
    verifiedProfileView: {
        borderColor: colors.blue,
        // borderWidth: 3,
        justifyContent: "center",
        alignItems: "center",
        width: widthFromPercentage(10),
        height: widthFromPercentage(10),
        borderRadius: widthFromPercentage(6),
        marginTop: 0
    },
    verifiedProfile: {
        width: widthFromPercentage(11),
        height: widthFromPercentage(11),
        borderRadius: widthFromPercentage(5.5),
    },
    profile_view: {
        justifyContent: "center",
        alignItems: "center",
        width: widthFromPercentage(12),
        height: widthFromPercentage(12),
        borderRadius: widthFromPercentage(6),
        marginTop: 0
    },
    activityIndicator: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
});