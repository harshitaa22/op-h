// Customizable Area Start
import React from "react";
import {
    View,
    Text,
    SafeAreaView,
    Image,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Keyboard,
    Platform,
    TouchableWithoutFeedback,
    Dimensions,
} from "react-native";
import ChannelCardController, { Props, configJSON } from "./ChannelCardController";
import { upArrow } from "../../../../categoriessubcategories/src/assets";
//library
import Icon from "react-native-vector-icons/MaterialIcons";
import RBSheet from "react-native-raw-bottom-sheet";
import Entypo from "react-native-vector-icons/Entypo";
import { CheckBox } from "react-native-elements";
import { MentionInput } from "react-native-controlled-mentions";
import {
    FlatList,
} from "react-native-gesture-handler";
//components
import HeaderComponent from "../../../../../components/src/HeaderComponent";
import { Fonts } from "../../../../../components/src/Utils/Fonts";
import CustomSwitch from "../../../../../components/src/CustomSwitch";
import { isValidPercentage } from "../../../../../components/src/utilitisFunction";
import { downArrow } from "../../../../../components/src/assets";
//colors
import colors from "../../../../CustomisableUserProfiles/src/colors";
//framework
import {
    scaledSize,
    widthFromPercentage,
} from "../../../../../framework/src/Utilities";
//assets
import { icons, rightArrow } from "../../assets";
// Customizable Area End

export default class ChannelCard extends ChannelCardController {
    constructor(props: Props) {
        super(props);
    }
    // Customizable Area Start
    _renderItem = ({ item, index }: { item: any; index: number }) => {
        return (
            <TouchableOpacity
                style={styles.expanded_list}
                onPress={() => {
                    this.setState({ selectedCategory: index, isExpandMore: false });
                }}
            >
                <Text style={styles.fontFamilyRegular}>{item}</Text>
            </TouchableOpacity>
        );
    };

    renderChannelItem = ({ item, index }: { item: any; index: number }) => {
        return (
            <TouchableOpacity
                activeOpacity={1}
                key={index}
                style={[styles.expanded_list,
                { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: "rgb(247,248,250)", width: Dimensions.get("screen").width - scaledSize(40), },
                index == 0 && { paddingTop: scaledSize(25) },
                this.state.channelData.length - 1 == index && { borderBottomLeftRadius: scaledSize(15), borderBottomRightRadius: scaledSize(15) },
                this.state.heighLightedInvestment == index && { backgroundColor: colors.blue }
                ]}
                onLongPress={() => { this.setState({ heighLightedInvestment: index }) }}
                onPress={() => {
                    this.setState({ selectedChannel: item.title, showChannelType: false, dropdownCategoryStatus: false, channelItem: item, channelId: item.id })
                }}
            >
                <Text
                    style={[
                        styles.fontFamilyRegular,
                        {
                            fontSize: scaledSize(12),
                            alignSelf: "center",
                            flex: 1,

                        },
                    ]}
                >{`${item.title}`}</Text>
            </TouchableOpacity>
        )
    }

    _renderItemForStock = ({
        item,
        index,
        type,
    }: {
        item: any;
        index: number;
        type: any;
    }) => {
        return (
            <>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                        styles.expanded_list,
                        {
                            backgroundColor: "rgb(247,248,250)",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingHorizontal: scaledSize(20),
                        },
                        index == 0 && { paddingTop: scaledSize(25) },
                        type == "category" && {
                            backgroundColor:
                                this.state.heighLightIndex == index
                                    ? colors.blue
                                    : "rgb(247,248,250)",
                        },
                        type == "category"
                            ? this.state.marketCategory.length - 1 == index && {
                                borderBottomLeftRadius: scaledSize(15),
                                borderBottomRightRadius: scaledSize(15),
                            }
                            : this.state.searchStockList.length - 1 == index && {
                                borderBottomLeftRadius: scaledSize(15),
                                borderBottomRightRadius: scaledSize(15),
                            },
                    ]}
                    onLongPress={() => {
                        this.setState({ heighLightIndex: index });
                    }}
                    onPress={() => {
                        this.getLivePrice(item.stock_company_id);
                        if (type == "category") {
                            if (this.state.selectedCategory !== index) {
                                this.setState({
                                    searchStockPrice: null,
                                    selectedStock: -1,
                                    searchStockText: "",
                                    searchedStock: [],
                                });
                            }
                            this.setState({
                                selectedCategory: index,
                                isExpandMore: false,
                                heighLightIndex: -1,
                            });
                        } else {
                            this.setState({
                                selectedStock: index,
                                searchedStock: item,
                                searchStockText: item?.name,
                                isExpandMoreStock: false,
                                searchStockPrice: item.market_cap,
                                isError: false,
                            });
                        }
                    }}
                >
                    {type == "category" ? (
                        <View style={{ flexDirection: "row" }}>
                            <Text
                                style={[
                                    styles.fontFamilyRegular,
                                    {
                                        fontSize: scaledSize(12),
                                        alignSelf: "center",
                                        textTransform: "capitalize",
                                        color:
                                            this.state.heighLightIndex == index
                                                ? colors.white
                                                : colors.black,
                                    },
                                ]}
                            >
                                {`${item.name}`}
                                {item.type && (
                                    <Text style={{ textTransform: "uppercase" }}>{` (${item.type
                                        })`}</Text>
                                )}
                            </Text>
                        </View>
                    ) : (
                        <View
                            style={{
                                flexDirection: "row",
                                flex: 1,
                                justifyContent: "space-between",
                            }}
                        >
                            <Text
                                numberOfLines={2}
                                style={[
                                    styles.fontFamilyRegular,
                                    {
                                        fontSize: scaledSize(12),
                                        alignSelf: "center",
                                        flex: 1,
                                        marginRight: 10,
                                    },
                                ]}
                            >{`${item.name} (${item.symbol})`}</Text>
                            {
                                <Text
                                    style={{
                                        alignSelf: "center",
                                        fontSize: 12,
                                        fontFamily: Fonts.LIGHT_BOLD,
                                    }}
                                >
                                    {item.exchange}
                                </Text>
                            }
                        </View>
                    )}
                </TouchableOpacity >
            </>
        );
    };
    // Customizable Area End

    renderAutoClose = () => {
        return (
            <>
                <View style={{ zIndex: -10 }}>
                    <View style={[styles.viewRowCenter, { marginTop: scaledSize(15) }]}>
                        <Text
                            style={[
                                styles.fontFamilyMedium,
                                {
                                    marginLeft: 5,
                                    marginEnd: Platform.select({ android: -10, ios: 0 }),
                                },
                            ]}
                        >
                            Auto Close
                        </Text>
                        <CheckBox
                            checkedIcon="check-square"
                            uncheckedIcon="square"
                            checkedColor={colors.blue}
                            uncheckedColor={colors.white}
                            containerStyle={{ marginStart: 0 }}
                            checked={this.state.isAutoClose}
                            size={widthFromPercentage(4)}
                            onPress={() => {
                                this.setState({ isAutoClose: !this.state.isAutoClose });
                            }}
                        />
                    </View>
                    <View
                        style={[
                            styles.viewRowCenter,
                            {
                                marginTop: scaledSize(15),
                                display: this.state.isAutoClose ? "flex" : "none",
                            },
                        ]}
                    >
                        <TouchableOpacity
                            disabled
                            activeOpacity={0.8}
                            onPress={() => { }}
                            style={[styles.card, { flex: 0.5, marginTop: 0 }]}
                        >
                            <View style={styles.viewRowCenter}>
                                <Text
                                    style={[
                                        styles.fontFamilyRegular,
                                        { textAlign: "left", flex: 1 },
                                    ]}
                                >
                                    Set Target
                                </Text>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        this.setState(
                                            {
                                                isSetTarget: !this.state.isSetTarget,
                                                isErrorTarget: false,
                                            },
                                            () => {
                                                this.setState({
                                                    inputTargetPercentage: this.state.isSetTarget
                                                        ? this.state.inputTargetPercentage
                                                        : "",
                                                });
                                            }
                                        );
                                    }}
                                >
                                    <CustomSwitch
                                        isActive={this.state.isSetTarget}
                                        activeBackgroundColor={colors.input_container}
                                        inActiveBackgroundColor={colors.input_container}
                                        inActiveThumbColor={colors.white}
                                    />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                        {this.state.isSetTarget ? (
                            <View
                                style={[
                                    styles.viewRowCenter,
                                    styles.card,
                                    {
                                        flex: 0.2,
                                        marginTop: 0,
                                        justifyContent: "center",
                                        marginStart: 10,
                                        borderColor: this.state.isErrorTarget
                                            ? "red"
                                            : colors.white,
                                        borderWidth: 1,
                                        height: scaledSize(49),
                                    },
                                ]}
                            >
                                <TextInput
                                    editable={this.state.isSetTarget}
                                    placeholder="___"
                                    style={[
                                        styles.fontFamilyRegular,
                                        { flex: 1, textAlign: "center", padding: 0 },
                                    ]}
                                    value={this.state.inputTargetPercentage}
                                    onChangeText={(text) => {
                                        this.setState({
                                            inputTargetPercentage: isValidPercentage(text)
                                                ? text
                                                : "",
                                            isErrorTarget: false,
                                        });
                                    }}
                                    keyboardType="numeric"
                                    maxLength={3}
                                />
                                <TextInput
                                    editable={false}
                                    placeholder="%"
                                    style={[
                                        styles.fontFamilyRegular,
                                        { textAlign: "center", padding: 0 },
                                    ]}
                                    value={"%"}
                                    maxLength={1}
                                />
                            </View>
                        ) : null}
                        <View style={{ flex: this.state.isSetTarget ? 0.3 : 0.67 }} />
                    </View>
                    <View
                        style={[
                            styles.viewRowCenter,
                            {
                                marginTop: scaledSize(15),
                                display: this.state.isAutoClose ? "flex" : "none",
                            },
                        ]}
                    >
                        <TouchableOpacity
                            disabled
                            activeOpacity={0.8}
                            onPress={() => { }}
                            style={[styles.card, { flex: 0.5, marginTop: 0 }]}
                        >
                            <View style={styles.viewRowCenter}>
                                <Text
                                    style={[
                                        styles.fontFamilyRegular,
                                        { textAlign: "left", flex: 1 },
                                    ]}
                                >
                                    Set Stoploss
                                </Text>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        this.setState(
                                            {
                                                isStopLoss: !this.state.isStopLoss,
                                                isErrorStopLoss: false,
                                            },
                                            () => {
                                                this.setState({
                                                    inputStopLossPercentage: this.state.isStopLoss
                                                        ? this.state.inputStopLossPercentage
                                                        : "",
                                                });
                                            }
                                        );
                                    }}
                                >
                                    <CustomSwitch
                                        isActive={this.state.isStopLoss}
                                        activeBackgroundColor={colors.input_container}
                                        inActiveBackgroundColor={colors.input_container}
                                        inActiveThumbColor={colors.white}
                                    />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                        {this.state.isStopLoss ? (
                            <View
                                style={[
                                    styles.viewRowCenter,
                                    styles.card,
                                    {
                                        flex: 0.2,
                                        marginTop: 0,
                                        justifyContent: "center",
                                        marginStart: 10,
                                        borderColor: this.state.isErrorStopLoss
                                            ? "red"
                                            : colors.white,
                                        borderWidth: 1,
                                        height: scaledSize(49),
                                    },
                                ]}
                            >
                                <TextInput
                                    editable={this.state.isStopLoss}
                                    placeholder="___"
                                    style={[
                                        styles.fontFamilyRegular,
                                        { flex: 1, textAlign: "center", padding: 0 },
                                    ]}
                                    value={this.state.inputStopLossPercentage}
                                    onChangeText={(text) => {
                                        this.setState({
                                            inputStopLossPercentage: isValidPercentage(text)
                                                ? text
                                                : "",
                                            isErrorStopLoss: false,
                                        });
                                    }}
                                    keyboardType="numeric"
                                    maxLength={3}
                                />
                                <TextInput
                                    editable={false}
                                    placeholder="%"
                                    style={[
                                        styles.fontFamilyRegular,
                                        { textAlign: "center", padding: 0 },
                                    ]}
                                    value={"%"}
                                    maxLength={1}
                                />
                            </View>
                        ) : null}
                        <View style={{ flex: this.state.isStopLoss ? 0.3 : 0.67 }} />
                    </View>
                </View>
            </>
        );
    };
    render() {
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={{ flex: 1 }}
                onPress={() => { Keyboard.dismiss(), this.setState({ showChannelType: false, dropdownCategoryStatus: false, isChannelError: false }) }}
            >
                <View style={{ zIndex: 100, flex: 1 }}>
                    <SafeAreaView />
                    <View style={{ flex: 1 }}>
                        <HeaderComponent
                            isBack={false}
                            showRightIcon={false}
                            onPressRightIcon={() => {
                                this.setState({ selectedInfoIndex: 0 }, () => {
                                    this.RBSheet.open();
                                });
                            }}
                            title={configJSON.headerCreateYourCard}
                            onClose={() => {
                                this.goBack();
                                this.changeDisc("");
                                this.changeStockText("");
                                this.setState({
                                    selectedPrice: null,
                                    isExpandMore: false,
                                    selectedCategory: 0,
                                    selectedChannel: ""
                                });
                            }}
                        />
                        {this.state.isLoading || this.state.isLoadingCatogary || this.state.isLoaderVisible ? (
                            <ActivityIndicator
                                style={{ flex: 1 }}
                                color={colors.blue}
                                size="large"
                            />
                        ) : (
                            <View style={styles.container}>
                                <View style={{ zIndex: 20 }}>
                                    <Text style={[styles.fontFamilyMedium]}>
                                        {configJSON.enterStockName}
                                    </Text>
                                    <View
                                        pointerEvents={this.state.isExpandMore ? "none" : "auto"}
                                    >
                                        <View
                                            style={[
                                                styles.catogary,
                                                {
                                                    flexDirection: "row",
                                                    borderColor: this.state.isError
                                                        ? "red"
                                                        : colors.white,
                                                    borderWidth: 1,
                                                    zIndex: 11,
                                                    elevation: 1,
                                                },
                                            ]}
                                        >
                                            <TextInput
                                                placeholder="Search..."
                                                value={this.state.searchStockText}
                                                style={[
                                                    styles.textInput,
                                                    styles.fontFamilyRegular,
                                                    { marginLeft: scaledSize(-2), zIndex: -1 },
                                                ]}
                                                placeholderTextColor={colors.lightGray}
                                                onFocus={() => {
                                                    this.setState({ showPrice: true, isError: false, visible: true });
                                                }}
                                                onBlur={() => {
                                                    this.setState({ showPrice: false });

                                                }}
                                                onChangeText={(text: any) => {
                                                    this.setState({ searchStockText: text })
                                                    this.changeStockText(text);
                                                }}
                                            />
                                            <Text
                                                style={[
                                                    {
                                                        alignSelf: "center",
                                                        marginHorizontal: scaledSize(4),
                                                        fontSize: scaledSize(12),
                                                    },
                                                    styles.fontFamilyMedium,
                                                ]}
                                            >
                                                {this.state.searchStockPrice != null &&
                                                    Number(this.state.searchStockPrice).toFixed(2)}
                                            </Text>
                                            <TouchableOpacity
                                                style={[styles.searchicon, { paddingRight: 0 }]}
                                            >
                                                <Icon
                                                    name={icons.search}
                                                    size={25}
                                                    color={colors.gray}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        {(this.state.isExpandMoreStock && this.state.searchStockList?.length > 0) && (
                                            <View
                                                style={{
                                                    top: scaledSize(50),
                                                    zIndex: 10,
                                                    maxHeight: scaledSize(300),
                                                    position: "absolute",
                                                    width: "100%",
                                                    overflow: "hidden",
                                                    borderBottomLeftRadius: scaledSize(15),
                                                    borderBottomRightRadius: scaledSize(15),
                                                }}
                                            >
                                                <FlatList
                                                    keyboardShouldPersistTaps="handled"
                                                    bounces={false}
                                                    data={this.state.searchStockList}
                                                    nestedScrollEnabled
                                                    ListEmptyComponent={() => {
                                                        return this.state.isStockLoading ? (
                                                            <View
                                                                style={{
                                                                    paddingTop: scaledSize(25),
                                                                    paddingBottom: scaledSize(20),
                                                                    backgroundColor: "rgb(247,248,250)",
                                                                }}
                                                            >
                                                                <ActivityIndicator color={colors.blue} />
                                                            </View>
                                                        ) : null;
                                                    }}
                                                    renderItem={({ item, index }) =>
                                                        this._renderItemForStock({
                                                            item: item,
                                                            index: index,
                                                            type: "Stock",
                                                        })
                                                    }
                                                    keyExtractor={(item, index) => index.toString()}
                                                />
                                            </View>
                                        )}
                                    </View>
                                    <View
                                        style={[
                                            styles.investor_container,
                                            { justifyContent: "space-between", zIndex: -10 },
                                        ]}
                                    >
                                        {this.state.priceMovement.map(
                                            (item: any, index: number) => {
                                                return (
                                                    <>
                                                        {
                                                            item.name !== "Bearish" &&
                                                            <>
                                                                <TouchableOpacity
                                                                    activeOpacity={0.8}
                                                                    onPress={() => {
                                                                        Keyboard.dismiss()
                                                                        item.name == "Bullish" && this.setState({ selectedPrice: item })

                                                                    }}
                                                                    style={[
                                                                        styles.card,
                                                                        { marginLeft: index != 0 ? 10 : 0, },
                                                                    ]}
                                                                    key={index}
                                                                >
                                                                    <View style={styles.radio_container}>
                                                                        <View
                                                                            style={
                                                                                this.state.selectedPrice != null &&
                                                                                    this.state.selectedPrice.key == item.key
                                                                                    ? styles.selected_radio
                                                                                    : styles.unselected_radio
                                                                            }
                                                                        />
                                                                    </View>
                                                                    <Text
                                                                        style={[
                                                                            styles.investor_name,
                                                                            styles.fontFamilyRegular,
                                                                        ]}
                                                                    >
                                                                        {item.name}
                                                                        {(item.name == "Bullish" ||
                                                                            item.name == "Bearish") && (
                                                                                <Entypo
                                                                                    name={
                                                                                        item.name == "Bullish"
                                                                                            ? "arrow-long-up"
                                                                                            : "arrow-long-down"
                                                                                    }
                                                                                    size={12}
                                                                                    color={
                                                                                        item.name == "Bullish"
                                                                                            ? colors.lightGreen
                                                                                            : colors.red
                                                                                    }
                                                                                />
                                                                            )}
                                                                    </Text>
                                                                </TouchableOpacity>
                                                                <View style={{ flex: 1.5 }} />
                                                            </>
                                                        }
                                                    </>

                                                );
                                            }
                                        )}
                                    </View>
                                    <View style={{
                                        zIndex: -10
                                    }}>
                                        <View style={styles.caption_Text}>
                                            <Text
                                                style={styles.fontFamilyMedium}
                                            >
                                                Enter caption
                                            </Text>
                                        </View>
                                        <MentionInput
                                            allowFontScaling={false}
                                            editable={true}
                                            value={this.state.caption}
                                            style={[styles.mentionTextInput, {
                                                width: this.state.width,
                                                borderRadius: scaledSize(10),
                                                borderWidth: 1, borderColor: this.state.isCaptionError ? colors.red : colors.white
                                            }]}
                                            onChange={(text: any) => {
                                                this.setState({ caption: text.trim(), isCaptionError: false })
                                            }}
                                            placeholderTextColor={colors.lightGray}
                                            placeholder={"Share your thoughts"}
                                            maxLength={500}
                                            multiline={true}
                                            containerStyle={styles.mentionContainer}

                                        />
                                        <View style={styles.caption_Container}>
                                            <Text
                                                style={[
                                                    styles.note,
                                                    styles.fontFamilyRegular,
                                                ]}
                                            >
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.note,
                                                    styles.fontFamilyRegular,
                                                ]}
                                            >
                                                {this.state.caption.length}/500
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        marginTop: scaledSize(10),
                                        zIndex: -10
                                    }}>
                                        <Text
                                            style={styles.fontFamilyMedium}
                                        >
                                            Select deck
                                        </Text>
                                        <View
                                            style={{ zIndex: -10 }}
                                        >
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={() => {
                                                    this.setState({ channelType: this.state.channelData, showChannelType: !this.state.showChannelType, dropdownCategoryStatus: !this.state.showChannelType, isChannelError: false })
                                                }
                                                }
                                                style={[
                                                    styles.catogary,
                                                    {
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        borderColor: this.state.isChannelError ? colors.red : colors.white,
                                                        borderWidth: 1,
                                                        borderRadius: scaledSize(10),
                                                        elevation: 1,
                                                    },
                                                ]}
                                            >
                                                <Text style={[
                                                    this.state.selectedChannel == "Choose from drop-down" ? { color: colors.lightGray } : { color: colors.black },
                                                    styles.textInput,
                                                    styles.fontFamilyRegular,
                                                    { marginLeft: scaledSize(-2), zIndex: -1 }
                                                ]}>{this.state.selectedChannel}</Text>
                                                <TouchableOpacity style={[styles.searchicon, { paddingRight: 0 }]}>
                                                    <Image
                                                        style={styles.arrow}
                                                        source={
                                                            this.state.dropdownCategoryStatus ? upArrow :
                                                                downArrow
                                                        }
                                                    />
                                                </TouchableOpacity>
                                            </TouchableOpacity>
                                            {(this.state.showChannelType && this.state.channelData?.length > 0) && (
                                                <View
                                                    style={{
                                                        bottom: 10,
                                                        width: "100%",
                                                        borderBottomLeftRadius: scaledSize(15),
                                                        borderBottomRightRadius: scaledSize(15),
                                                    }}
                                                >
                                                    <FlatList
                                                        bounces={false}
                                                        keyboardShouldPersistTaps="handled"
                                                        alwaysBounceVertical={false}
                                                        nestedScrollEnabled={true}
                                                        showsVerticalScrollIndicator={false}
                                                        showsHorizontalScrollIndicator={false}

                                                        data={this.state.channelData}
                                                        renderItem={this.renderChannelItem}
                                                        keyExtractor={(item, index) => index.toString()}
                                                    />

                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                    <View style={styles.button_row}>
                        <TouchableOpacity onPress={() => this.goToFinalCard()}>
                            <Image source={rightArrow} style={{ height: 50, width: 50 }} />
                        </TouchableOpacity>
                    </View>
                    <RBSheet
                        ref={(ref) => {
                            this.RBSheet = ref;
                        }}
                        height={this.state.selectedInfoIndex === 0 ? 180 : 180}
                        openDuration={250}
                        customStyles={{
                            container: {
                                borderTopLeftRadius: scaledSize(20),
                                borderTopRightRadius: scaledSize(20),
                                paddingHorizontal: scaledSize(10),
                                paddingVertical: scaledSize(10),
                            },
                        }}
                    >
                        <View
                            style={{
                                marginTop: scaledSize(10),
                                paddingHorizontal: scaledSize(10),
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Text
                                adjustsFontSizeToFit
                                numberOfLines={1}
                                style={[styles.fontFamilyBold, { textAlign: "left", flex: 1 }]}
                            >
                                {this.state.selectedInfoIndex === 0
                                    ? configJSON.iModalHeader
                                    : "Reward Cards"}
                            </Text>
                            <TouchableOpacity
                                onPress={() => this.RBSheet.close()}
                                style={[styles.close_container]}
                            >
                                <Icon
                                    name={icons.close}
                                    size={scaledSize(15)}
                                    color={colors.gray}
                                />
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                marginTop: scaledSize(0),
                                paddingHorizontal: scaledSize(5),
                            }}
                        >
                            <View style={{ marginTop: scaledSize(10) }}>
                                {this.state.selectedInfoIndex === 0 &&
                                    this.details.map((item: any, index: number) => {
                                        return (
                                            <View style={[styles.text, { marginTop: 3 }]} key={index}>
                                                <Text style={{ fontSize: 12 }}>{index + 1}.</Text>
                                                <Text style={styles.bottomText}>{item}</Text>
                                            </View>
                                        );
                                    })}

                            </View>
                        </View>
                        <View
                            style={{
                                marginTop: scaledSize(0),
                                paddingHorizontal: scaledSize(5),
                            }}
                        >
                            <View style={{ marginTop: scaledSize(10) }}>
                                {this.state.selectedInfoIndex === 1 &&
                                    this.rewardCards.map((item: any, index: number) => {
                                        return (
                                            <View style={[styles.text, { marginTop: 3 }]} key={index}>
                                                <Text style={{ fontSize: 12 }}>{index + 1}.</Text>
                                                <Text style={styles.bottomText}>{item}</Text>
                                            </View>
                                        );
                                    })}
                            </View>
                        </View>
                    </RBSheet>
                </View>
            </TouchableOpacity >
        );
    }
}

// Customizable Area Start
const styles = StyleSheet.create({
    fontFamilyRegular: {
        fontFamily: Fonts.REGULAR,
    },
    fontFamilyBold: {
        fontFamily: Fonts.LIGHT_BOLD,
    },
    fontFamilyMedium: {
        fontFamily: Fonts.MEDIUM,
    },
    container: {
        paddingHorizontal: scaledSize(20),
        marginTop: scaledSize(20),
    },
    catogary: {
        backgroundColor: colors.white,
        height: scaledSize(55),
        marginTop: scaledSize(10),
        borderRadius: scaledSize(15),
        justifyContent: "center",
        paddingHorizontal: scaledSize(20),
        elevation: 2,
        zIndex: 10,
    },
    investor_container: {
        flexDirection: "row",
        marginTop: scaledSize(10),
    },
    radio_container: {
        width: widthFromPercentage(5),
        height: widthFromPercentage(5),
        backgroundColor: colors.input_container,
        borderRadius: scaledSize(360),
        justifyContent: "center",
        alignItems: "center",
    },
    investor_name: {
        marginLeft: scaledSize(15),
        textAlign: "center",
        color: colors.black
    },
    card: {
        padding: scaledSize(15),
        borderRadius: scaledSize(15),
        backgroundColor: colors.white,
        flexDirection: "row",
        flex: 1,
        marginTop: scaledSize(10),
    },
    selected_radio: {
        width: widthFromPercentage(3),
        height: widthFromPercentage(3),
        borderRadius: scaledSize(360),
        backgroundColor: colors.blue,
    },
    gray_selected_radio: {
        width: widthFromPercentage(3),
        height: widthFromPercentage(3),
        borderRadius: scaledSize(360),
        backgroundColor: colors.lightGray,
    },
    unselected_radio: {
        width: widthFromPercentage(3),
        height: widthFromPercentage(3),
        borderRadius: scaledSize(360),
        backgroundColor: colors.input_container,
    },
    expanded_list: {
        backgroundColor: colors.white,
        paddingHorizontal: scaledSize(20),
        paddingVertical: scaledSize(10),
    },
    button_row: {
        marginTop: scaledSize(10),
        marginBottom: scaledSize(20),
        justifyContent: "flex-end",
        flexDirection: "row",
        paddingHorizontal: scaledSize(20),
    },
    textInput: {
        flex: 6,
    },
    searchicon: {
        textAlign: "right",
        paddingRight: 10,
        alignSelf: "center",
    },
    close_container: {
        justifyContent: "flex-end",
        alignItems: "flex-end",
        right: 10,
    },
    text: {
        flexDirection: "row",
        marginTop: scaledSize(5),
    },
    bottomText: {
        marginLeft: scaledSize(5),
        fontSize: 12,
        fontFamily: Fonts.REGULAR,
    },
    viewRowCenter: {
        flexDirection: "row",
        alignItems: "center",
    },
    viewRow: {
        flexDirection: "row",
    },
    note: {
        fontSize: scaledSize(12),
        color: colors.gray,
    },
    mentionContainer: {
        minHeight: 100,
        backgroundColor: colors.white,
        borderRadius: scaledSize(10),
        marginBottom: scaledSize(5),
    },
    mentionTextInput: {
        flex: 1,
        padding: scaledSize(10),
        textAlignVertical: "top",
    },
    caption_Text: {
        marginTop: scaledSize(20),
        marginBottom: scaledSize(10),
    },
    caption_Container: {
        elevation: -1,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    arrow: {
        height: scaledSize(12),
        width: scaledSize(12),
        resizeMode: "contain",
        tintColor: colors.gray
    },
});
// Customizable Area End


//comment code
// pointerEvents={this.state.isExpandMore ? "none" : "auto"}

// pointerEvents={
//   this.state.isExpandMore || this.state.isExpandMoreStock
//     ? "none"
//     : "auto"
// }

{/* (${item.market_cap != null && Number(item.market_cap).toFixed(2)}) */ }

// this.searchTimeOut = setTimeout(() => {
//   // this.getStockList(text);
//   Keyboard.dismiss()
// }, 800);