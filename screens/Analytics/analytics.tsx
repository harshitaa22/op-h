// Customizable Area Start
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AnalyticsController, { Props } from "./analyticsController";
//framework
import {
  scaledSize,
  widthFromPercentage,
} from "../../../../../framework/src/Utilities";
//components
import { Fonts } from "../../../../../components/src/Utils/Fonts";
import HeaderComponent from "../../../../../components/src/HeaderComponent";
import { nFormatter } from "../../../../../components/src/Utils/service";
//library
import SafeAreaView from "react-native-safe-area-view";
//colors
import colors from "../../colors";
// Customizable Area End

const { height, width } = Dimensions.get("screen");
export default class Analytics extends AnalyticsController {
  constructor(props: Props) {
    super(props);
  }
  // Customizable Area Start
  displayData = () => {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={this.state.pollData.attributes.poll_stocks.data}
        renderItem={({ item }: { item: any }) => {
          return (
            <View style={styles.progressCard}>
              <View
                style={[
                  styles.progressview,
                  {
                    backgroundColor:
                      (this.state.isSelectAll
                        ? item.attributes.stock.total_opigo_experts
                        : item.attributes.stock.verified_opigo_experts) == 0
                        ? colors.input_container
                        : colors.lightBlue,
                    width: `${this.state.isSelectAll
                      ? item.attributes.stock.total_opigo_experts
                      : item.attributes.stock.verified_opigo_experts
                      }%`,
                  },
                ]}
              />
              <Text style={[styles.datatxt, styles.fontFamilyRegular]}>{`${item.attributes.stock.name
                } (${this.state.isSelectAll
                  ? Number(item.attributes.stock.total_opigo_experts).toFixed(2)
                  : Number(
                    item.attributes.stock.verified_opigo_experts
                  ).toFixed(2)
                }%)`}</Text>
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  displaySinglePollData = () => {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={
          this.state.isSelectAll
            ? this.state.singlePoll_keyData
            : this.state.response_by_opigo_percentage_key
        }
        renderItem={({ item }: { item: any }) => {
          return (
            <View style={styles.progressCard}>
              <View
                style={[
                  styles.progressview,
                  {
                    backgroundColor:
                      (this.state.isSelectAll
                        ? this.getAllData(item, "bg")
                        : this.getopigo_percentage(item, "bg")) == 0
                        ? colors.input_container
                        : colors.lightBlue,
                    width: `${this.state.isSelectAll
                      ? this.getAllData(item, "width")
                      : this.getopigo_percentage(item, "width")
                      }%`,
                  },
                ]}
              />
              <Text
                style={[
                  styles.datatxt,
                  styles.fontFamilyRegular,
                  { textTransform: "capitalize" },
                ]}
              >{`${item} (${this.state.isSelectAll
                ? this.getAllData(item, "width")
                : this.getopigo_percentage(item, "width")
                }%)`}</Text>
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };
  render() {
    return (
      // Customizable Area Start
      <>
        <SafeAreaView
          forceInset={{ top: Platform.OS == "android" ? "always" : "always" }}
          style={styles.container}
        >
          <HeaderComponent
            title="Analytics"
            onClose={() => {
              this.goToBack();
            }}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps={"handled"}
            contentContainerStyle={{ flexGrow: 1 }}
          >
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
            ) : this.state.iserror ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Text>{this.state.iserror}</Text>
              </View>
            ) : (
              <View style={styles.marginContent}>
                <View style={styles.button_row}>
                  <View style={{ flex: 5 }}>
                    <View style={styles.box_button_container}>
                      <Text style={[styles.total, styles.fontFamilyMedium]}>
                        {this.state.analytical_data.attributes.total_votes}
                      </Text>
                      <Text style={[styles.desc, styles.fontFamilyMedium]}>
                        {"Total Votes"}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 0.2 }} />
                  <View style={{ flex: 5 }}>
                    <View style={styles.box_button_container}>
                      <Text style={[styles.total, styles.fontFamilyMedium]}>
                        {
                          this.state.analytical_data.attributes
                            .verified_expert_voters
                        }
                      </Text>
                      <Text style={[styles.desc, styles.fontFamilyMedium]}>
                        {"OpiGo Expert Votes"}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.button_row}>
                  <View style={{ flex: 5 }}>
                    <View style={styles.box_button_container}>
                      <Text style={[styles.total, styles.fontFamilyMedium]}>
                        {
                          this.state.analytical_data.attributes
                            .city_count_of_voters
                        }
                      </Text>
                      <Text style={[styles.desc, styles.fontFamilyMedium]}>
                        {"City Count Of Voters"}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 0.2 }} />
                  <View style={{ flex: 5 }}>
                    <View style={styles.box_button_container}>
                      <Text style={[styles.total, styles.fontFamilyMedium]}>
                        {nFormatter(
                          this.state.analytical_data.attributes
                            .avg_score_of_voters,
                          2
                        )}
                      </Text>
                      <Text style={[styles.desc, styles.fontFamilyMedium]}>
                        {"Avg. Score Of Voters"}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.boxContainer}>
                  <View>
                    <Text
                      style={[styles.discriptionText, styles.fontFamilyMedium]}
                    >
                      {this.state.pollData.attributes.description}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.button_row,
                      {
                        marginLeft: scaledSize(15),
                        marginRight: scaledSize(15),
                      },
                    ]}
                  >
                    <View style={{ flex: 5 }}>
                      <TouchableOpacity
                        onPress={() => this.setState({ isSelectAll: true })}
                        style={
                          this.state.isSelectAll
                            ? styles.selected_button_container
                            : styles.unselected_button_container
                        }
                      >
                        <Text
                          style={
                            this.state.isSelectAll
                              ? [
                                styles.selected_button_txt,
                                styles.fontFamilyMedium,
                              ]
                              : [
                                styles.unselected_button_txt,
                                styles.fontFamilyMedium,
                              ]
                          }
                        >
                          {"All"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 0.5 }} />
                    <View style={{ flex: 5 }}>
                      <TouchableOpacity
                        onPress={() => this.setState({ isSelectAll: false })}
                        style={
                          !this.state.isSelectAll
                            ? styles.selected_button_container
                            : styles.unselected_button_container
                        }
                      >
                        <Text
                          style={
                            !this.state.isSelectAll
                              ? [
                                styles.selected_button_txt,
                                styles.fontFamilyMedium,
                              ]
                              : [
                                styles.unselected_button_txt,
                                styles.fontFamilyMedium,
                              ]
                          }
                        >
                          {"OpiGo Experts"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.horizontalLine} />
                  {this.state.poll_type == "single_investment"
                    ? this.displaySinglePollData()
                    : this.state.poll_type == "custom_poll"
                      ? this.displaySinglePollData()
                      : this.displayData()}
                </View>
                <View
                  style={[
                    styles.boxContainer,
                    { padding: 10, marginTop: 15, marginBottom: 10 },
                  ]}
                >
                  <Text style={[styles.title, styles.fontFamilyBold]}>
                    {"Voters Split"}
                  </Text>
                  <View
                    style={[
                      styles.progressCard,
                      { marginLeft: scaledSize(5), marginRight: scaledSize(5) },
                    ]}
                  >
                    {this.state.analytical_data.attributes.voters_split
                      .verified_opigo_experts !== 0 ? (
                      <View
                        style={[
                          styles.progressview,
                          {
                            width: `${this.state.analytical_data.attributes.voters_split
                              .verified_opigo_experts
                              }%`,
                          },
                        ]}
                      />
                    ) : (
                      <View
                        style={[
                          styles.progressview,
                          { backgroundColor: colors.input_container },
                        ]}
                      />
                    )}
                    <Text style={[styles.datatxt, styles.fontFamilyRegular]}>
                      {`OpiGo Expert (${Number(
                        this.state.analytical_data.attributes.voters_split
                          .verified_opigo_experts
                      ).toFixed(2)}%)`}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.progressCard,
                      { marginLeft: scaledSize(5), marginRight: scaledSize(5) },
                    ]}
                  >
                    {this.state.analytical_data.attributes.voters_split
                      .other_users !== 0 ? (
                      <View
                        style={[
                          styles.progressview,
                          {
                            width: `${this.state.analytical_data.attributes.voters_split
                              .other_users
                              }%`,
                          },
                        ]}
                      />
                    ) : (
                      <View
                        style={[
                          styles.progressview,
                          { backgroundColor: colors.input_container },
                        ]}
                      />
                    )}
                    <Text
                      style={[styles.datatxt, styles.fontFamilyRegular]}
                    >{`Other Users (${Number(
                      this.state.analytical_data.attributes.voters_split
                        .other_users
                    ).toFixed(2)}%)`}</Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </>
      // Customizable Area End
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  fontFamilyRegular: {
    fontFamily: Fonts.REGULAR,
  },
  fontFamilyBold: {
    fontFamily: Fonts.LIGHT_BOLD,
  },
  fontFamilyMedium: {
    fontFamily: Fonts.MEDIUM,
  },
  marginContent: {
    marginLeft: scaledSize(15),
    marginRight: scaledSize(15),
  },
  text: {
    fontSize: scaledSize(15),
  },
  boxContainer: {
    backgroundColor: colors.white,
    borderRadius: scaledSize(20),
    justifyContent: "space-between",
    paddingBottom: scaledSize(10),
    marginTop: scaledSize(10),
  },
  discriptionText: {
    fontSize: scaledSize(14),
    paddingHorizontal: scaledSize(10),
  },
  button_row: {
    flexDirection: "row",
    marginTop: scaledSize(5),
  },
  selected_button_container: {
    padding: scaledSize(10),
    borderRadius: scaledSize(25),
    borderColor: colors.blue,
    borderWidth: scaledSize(1),
    backgroundColor: colors.lightBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  unselected_button_container: {
    padding: scaledSize(10),
    borderRadius: scaledSize(25),
    borderWidth: scaledSize(1),
    borderColor: colors.input_container,
    backgroundColor: colors.input_container,
    justifyContent: "center",
    alignItems: "center",
  },
  selected_button_txt: {
    fontSize: scaledSize(12),
    color: colors.blue,
  },
  unselected_button_txt: {
    fontSize: scaledSize(12),
    color: colors.gray,
  },
  horizontalLine: {
    borderWidth: 1,
    width: "100%",
    borderColor: colors.lightBlue,
    marginTop: scaledSize(10),
    marginBottom: scaledSize(10),
  },
  progressCard: {
    marginLeft: scaledSize(15),
    marginRight: scaledSize(15),
    borderRadius: scaledSize(10),
    backgroundColor: colors.input_container,
    justifyContent: "center",
    marginTop: scaledSize(5),
    borderColor: colors.blue,
    borderWidth: 1,
  },
  datatxt: {
    position: "absolute",
    textAlignVertical: "center",
    textAlign: "center",
    alignSelf: "center",
  },
  progressview: {
    width: "65%",
    backgroundColor: colors.lightBlue,
    padding: scaledSize(20),
    borderRadius: scaledSize(10),
  },
  marginTop: {
    marginTop: scaledSize(15),
  },
  title: {
    fontSize: scaledSize(14),
    marginLeft: scaledSize(5),
  },
  box_button_container: {
    paddingLeft: scaledSize(10),
    paddingRight: scaledSize(10),
    paddingTop: scaledSize(15),
    paddingBottom: scaledSize(15),
    borderRadius: scaledSize(10),
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    height: widthFromPercentage(25),
  },
  total: {
    fontSize: scaledSize(15),
  },
  desc: {
    fontSize: scaledSize(13),
    color: colors.gray,
    marginTop: scaledSize(10),
    textAlign: "center",
  },
});
// Customizable Area End


//comment code

{/* <PollsCardHeader
                        isCity={false}
                        dot={false}
                        onPressDot={() => { }}
                        profile={this.state.pollData.attributes.user_detail.data.attributes.profile}
                        createdAt={''}
                        userName={this.state.pollData.attributes.user_detail.data.attributes.user_name}
                        fullName={this.state.pollData.attributes.user_detail.data.attributes.first_name + this.state.pollData.attributes.user_detail.data.attributes.last_name}
                        account_id={this.state.pollData.attributes.user_detail.data.id}
                        opigo_score={this.state.pollData.attributes.user_detail.data.attributes.opigo_score}
                        onPressFriendPage={() => { }}
                        isVerified={this.state.pollData.attributes.user_detail.data.attributes.opigo_verified}
                      /> */}