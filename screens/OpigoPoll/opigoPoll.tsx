import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Keyboard,
} from "react-native";
import OpigoPollController, { Props, configJSON } from "./opigoPollController";
import { Image } from "react-native";
//components
import HeaderComponent from "../../../../../components/src/HeaderComponent";
import { Fonts } from "../../../../../components/src/Utils/Fonts";
//colors
import colors from "../../../../CustomisableUserProfiles/src/colors";
//framework
import {
  scaledSize,
  widthFromPercentage,
} from "../../../../../framework/src/Utilities";
//assets
import { rightArrow } from "../../assets";
//library
import { TouchableOpacity as Touch } from "react-native-gesture-handler";

export default class OpigoPoll extends OpigoPollController {
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
  _renderItemForStock = ({ item, index }: { item: any; index: number }) => {
    return (
      <Touch
        style={[
          styles.expanded_list,
          {
            backgroundColor: "rgb(247,248,250)",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 10,
            elevation: 1,
          },
          index == 0 && { paddingTop: scaledSize(18) },
          this.state.heighLightIndex == index && {
            backgroundColor: colors.blue,
          },
          this.state.pollCategory.length - 1 == index && {
            borderBottomLeftRadius: scaledSize(15),
            borderBottomRightRadius: scaledSize(15),
          },
        ]}
        onLongPress={() => {
          this.setState({ heighLightIndex: index });
        }}
        activeOpacity={0.9}
        onPress={() => {
          Keyboard.dismiss();
          this.setState({
            selectedCategory: index,
            isExpandMore: false,
            heighLightIndex: -1,
          });
        }}
      >
        <Text
          style={[
            this.state.heighLightIndex == index && { color: colors.white },
            {
              fontSize: scaledSize(12),
              alignSelf: "center",
              textTransform: "capitalize",
            },
            styles.fontFamilyRegular,
          ]}
        >
          {item.name}
          {item.type && (
            <Text style={{ textTransform: "uppercase" }}>{` (${item.type
              })`}</Text>
          )}
        </Text>
      </Touch>
    );
  };

  _renderPollType = (item: any, index: number) => {
    let pollType = this.state.pollCategory[this.state.selectedCategory].name;

    return (
      <Touch
        activeOpacity={0.8}
        onPress={() => {
          this.setState({ selectedType: item });
        }}
        style={styles.viewContainer}
      >
        <View style={styles.radio_container}>
          <View
            style={
              this.state.selectedType == item
                ? styles.selected_radio
                : styles.unselected_radio
            }
          />
        </View>
        {/* {item.key == 'compare_2_investment' && <Text style={styles.text}></Text>} */}
        {item.key == "single_investment" ? (
          <Text style={styles.text}>{`${item.name}${pollType == "stocks" ? configJSON.stock : pollType
            }`}</Text>
        ) : (
          <Text style={styles.text}>{`${item.name}${pollType}${pollType != "stocks" ? "s" : ""
            } ${item.name == "Rank " ? configJSON.maximum : ""}`}</Text>
        )}
      </Touch>
    );
  };
  // Customizable Area End

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ justifyContent: "space-between", flex: 1 }}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
        >
          <SafeAreaView />
          {/* Customizable Area Start */}
          {this.state.isLoading ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <ActivityIndicator size={"large"} color={colors.blue} />
            </View>
          ) : (
            <>
              <View style={{ flex: 1 }}>
                <HeaderComponent
                  style={{ zIndex: 1 }}
                  isBack={false}
                  showRightIcon={false}
                  title={configJSON.header}
                  onClose={() => {
                    this.goBack();
                  }}
                />
                <View style={styles.container}>
                  <View>
                    <View style={{}}>
                      <Text
                        style={[
                          { marginBottom: scaledSize(15) },
                          styles.fontFamilyRegular,
                        ]}
                      >
                        {configJSON.pollType}
                      </Text>
                      <FlatList
                        scrollEnabled={false}
                        bounces={false}
                        data={this.listOfPollType}
                        renderItem={({ item, index }) =>
                          this._renderPollType(item, index)
                        }
                        keyExtractor={(item, index) => index.toString()}
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  paddingHorizontal: scaledSize(20),
                  paddingBottom: scaledSize(20),
                }}
              >
                <TouchableOpacity onPress={() => this.goToFinalCard()}>
                  <Image
                    source={rightArrow}
                    style={{ height: 50, width: 50 }}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
          {/* Customizable Area End */}
        </ScrollView>
      </View>
    );
  }
}

// Customizable Area Start

const styles = StyleSheet.create({
  fontFamilyRegular: {
    fontFamily: Fonts.REGULAR,
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
    shadowColor: colors.black,
    shadowOffset: { height: 0, width: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    elevation: 2,
    zIndex: 10,
  },
  radio_container: {
    width: widthFromPercentage(5),
    height: widthFromPercentage(5),
    backgroundColor: colors.input_container,
    borderRadius: scaledSize(360),
    justifyContent: "center",
    alignItems: "center",
  },
  selected_radio: {
    width: widthFromPercentage(3),
    height: widthFromPercentage(3),
    borderRadius: scaledSize(360),
    backgroundColor: colors.blue,
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
  viewContainer: {
    backgroundColor: colors.white,
    height: scaledSize(55),
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: scaledSize(15),
    borderRadius: scaledSize(15),
    marginBottom: scaledSize(10),
  },
  close_container: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    right: 10,
  },
  text: {
    marginLeft: scaledSize(10),
    textTransform: "capitalize",
    fontFamily: Fonts.REGULAR,
  },
});
// Customizable Area End

//comment code
{/* <RBSheet
                ref={ref => {
                  this.RBSheet = ref;
                }}
                height={100}
                openDuration={250}
                customStyles={{
                  container: {
                    borderTopLeftRadius: scaledSize(20),
                    borderTopRightRadius: scaledSize(20),
                    paddingHorizontal: scaledSize(5),
                    paddingVertical: scaledSize(10)
                  }
                }}
              >
                <TouchableOpacity
                  onPress={() => this.RBSheet.close()}
                  style={[styles.close_container]}>
                  <Icon name={icons.close} size={scaledSize(15)} color={colors.gray} />
                </TouchableOpacity>
                <View style={{ paddingHorizontal: scaledSize(5) }}>
                  <View style={{ flexDirection: 'row', marginHorizontal: scaledSize(5), marginBottom: scaledSize(5), alignItems: 'center' }}>
                    <Text style={{ marginBottom: 1 }}>{`- `}</Text>
                    <Text style={[styles.fontFamilyMedium, {fontSize: 12}]}>{`Polls have a direct impact on voter's score`}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginHorizontal: scaledSize(5), marginBottom: scaledSize(5) }}>
                    <Text style={{ marginBottom: 1 }}>{`- `}</Text>
                    <Text style={[styles.fontFamilyMedium, {fontSize: 12}]}>{`Poll will stop accepting votes after 7 days`}</Text>
                  </View>
                </View>
              </RBSheet> */}

{/* <Text style={styles.fontFamilyRegular}>Select Poll Category</Text>
                    <View style={{ zIndex: 2 }}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.catogary,]}
                        onPress={() => { this.setState({ isExpandMore: !this.state.isExpandMore, heighLightIndex: -1 }) }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={{ alignSelf: 'center', textTransform: 'capitalize' }}>
                            {this.state.pollCategory[this.state.selectedCategory]?.name}
                            {this.state.pollCategory[this.state.selectedCategory]?.type && <Text style={{ textTransform: 'uppercase' }}>{` (${this.state.pollCategory[this.state.selectedCategory]?.type})`}</Text>}
                          </Text>
                          <Icon name={this.state.isExpandMore ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                            size={scaledSize(25)} style={{ opacity: 0.5 }} />
                        </View>
                      </TouchableOpacity>
                      <View style={{ zIndex: 1 }}>
                        {this.state.isExpandMore &&
                          <FlatList
                            keyboardShouldPersistTaps='handled'
                            style={{ position: 'absolute', top: scaledSize(-10), zIndex: 1, width: "100%" }}
                            data={this.state.pollCategory} renderItem={({ item, index }) => this._renderItemForStock({ item: item, index: index })} keyExtractor={(item, index) => index.toString()}/>}
                      </View>
                    </View> */}