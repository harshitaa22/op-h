import React, { FC } from "react";
import { StyleSheet, StatusBar, TouchableWithoutFeedback, Text, TextInput, View, Platform, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import colors from "../../colors";
import Icon from 'react-native-vector-icons/MaterialIcons'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CustomPollController, { Props, configJSON } from "./customPollcontroller";
import { icons } from "../../assets";
import { scaledSize } from "../../../../../framework/src/Utilities";
import HeaderComponent from "../../../../../components/src/HeaderComponent";
import { Fonts } from "../../../../../components/src/Utils/Fonts";
import { MentionInput, MentionSuggestionsProps } from "react-native-controlled-mentions";



export default class CustomPoll extends CustomPollController {
  renderSuggestionsData: FC<MentionSuggestionsProps> = ({
    keyword,
    onSuggestionPress,
  }) => {
    if (keyword == null) {
      return null;
    }
    return (
      <>
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          data={this.state.suggestions}
          keyExtractor={(item, index) => index.toString()}
          keyboardShouldPersistTaps="always"
          style={{ flexGrow: 0, maxHeight: scaledSize(200) }}
          renderItem={({ item, index }: { item: any; index: number }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  this.manageMention(item);
                  onSuggestionPress({
                    id: item.id,
                    name:
                      item.tagged_type == this.stockCompany
                        ? item.company_name
                        : item.full_name,
                  });
                }}
                style={{ padding: 12 }}
              >
                <Text style={styles.fontFamilyRegular}>
                  {item.tagged_type == this.stockCompany
                    ? item.company_name
                    : item.full_name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
        {this.state.suggestions.length >= 1 && (
          <View style={{ height: 1, backgroundColor: "rgb(246,246,246)" }} />
        )}
      </>
    );
  };



  render() {
    let activeButton = this.state.question.length < 5 && this.state.activeButton
    return (
      <View style={{ flex: 1, }} >

        <SafeAreaView
          style={styles.mainContainer}>
          {/* Customizable Area Start */}
          <TouchableWithoutFeedback
            testID="Background"
            onPress={() => {
              this.hideKeyboard();
            }}
          >
            <>
              <HeaderComponent isBack={true} title={configJSON.headerCreateYourCustomPoll} onClose={() => { this.goBack(), this.setState({ errorIndexes: [], activeButton: false }) }} />
              <KeyboardAwareScrollView
                keyboardShouldPersistTaps='handled'
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={{ flex: 1 }}>
                <View
                  style={styles.marginContent}>
                  {/* <View
                    style={[{
                      height: 150, alignItems: 'flex-start',
                      backgroundColor: colors.white,
                      // marginHorizontal: scaledSize(15),
                      borderRadius: scaledSize(10),
                      marginBottom: scaledSize(5),
                    }, activeButton && { borderWidth: 1, borderColor: 'red' }]}> */}
                  <MentionInput
                    allowFontScaling={false}
                    editable={true}
                    value={this.state.question}
                    containerStyle={[{
                      minHeight: 130,
                      padding: Platform.OS == "ios" ? scaledSize(15) : scaledSize(5),
                      marginLeft: Platform.OS == "ios" ? scaledSize(12) : scaledSize(10),
                      marginRight: Platform.OS == "ios" ? scaledSize(12) : scaledSize(10),
                      marginBottom: scaledSize(5),
                      borderRadius: scaledSize(15),
                      backgroundColor: colors.white,
                    }, activeButton && { borderWidth: 1, borderColor: 'red' }]}
                    style={[styles.textInput, styles.fontFamilyRegular, { width: this.state.width, textAlignVertical: 'top' }]}
                    onChange={(question: any) => {
                      this.hendleTag(question);
                    }}
                    autoCorrect={false}
                    placeholderTextColor={colors.lightGray}
                    placeholder={configJSON.placeholderText}
                    maxLength={140}
                    multiline={true}
                    partTypes={[
                      {
                        trigger: "@", // Should be a single character like '@' or '#'
                        renderSuggestions: this.renderSuggestionsData,
                        isInsertSpaceAfterMention: true,
                        textStyle: { color: "rgb(0,114,211)" }, // The mention style in the input
                      },
                    ]}
                  />
                  {/* </View> */}
                  {/* <View
                    style={[styles.textInput_container, { height: 150, alignItems: 'flex-start' }, activeButton && { borderWidth: 1, borderColor: 'red' }]}>
                    <TextInput
                      placeholder={configJSON.placeholderText}
                      style={[styles.textInput, styles.fontFamilyRegular, { width: this.state.width, height: 130, textAlignVertical: 'top' }]}
                      placeholderTextColor={colors.lightGray}
                      value={this.state.question}
                      multiline={true}
                      maxLength={140}
                      onChangeText={(data: any) => { this.setState({ question: data }) }}
                    />

                  </View> */}
                  {this.state.stocks.map((item: any, index: number) => {
                    return (
                      <View style={{ marginHorizontal: scaledSize(8) }} key={index}>
                        {/* <View style={[styles.catogary, { zIndex: -1, elevation: -1, }, this.state.errorIndexes.includes(index) && { borderWidth: 1, borderColor: 'red' }]}>
                          <TextInput
                            ref={(ref: any) => this.refs = ref}
                            style={[styles.fontFamilyRegular, { width: this.state.textInputWidth, }]}
                            value={item?.input}
                            onChangeText={text => { this.onChangeText(text, this.state.selectedIndex), this.setState({ errorIndexes: [] }) }}
                            placeholder={`${configJSON.option} ${String.fromCharCode("A".charCodeAt() + index)}`}
                            onFocus={() => {
                              this.setState({ searchedInstrument: [], selectedIndex: index, isFocused: true })
                            }}
                            maxLength={60}
                            onBlur={() => { this.setState({ isFocused: false, selectedIndex: -1 }) }}
                          />

                          {index >= 2 ?
                            <TouchableOpacity
                              onPress={() => { this.removeFromList(index) }}>
                              <Icon name={"close"}
                                size={scaledSize(20)} style={{ opacity: 0.5 }} />
                            </TouchableOpacity>
                            : null}
                        </View> */}
                        <MentionInput
                          containerStyle={[{
                            backgroundColor: colors.white,
                            minHeight: scaledSize(55),
                            marginTop: scaledSize(10),
                            borderRadius: scaledSize(15),
                            paddingHorizontal: scaledSize(20),
                            shadowColor: colors.black,
                            shadowOffset: { height: 0, width: 0 },
                            shadowRadius: 5,
                            shadowOpacity: 0.1,
                            justifyContent: "center",
                          }, { zIndex: -1, elevation: -1, }, this.state.errorIndexes.includes(index) && { borderWidth: 1, borderColor: 'red' }]}
                          ref={(ref: any) => this.refs = ref}
                          allowFontScaling={false}
                          editable={true}
                          value={item?.input}

                          style={[styles.fontFamilyRegular, { width: this.state.textInputWidth, }]}
                          onChange={(option: any) => {
                            this.hendleOptionTag(option, index)
                              , this.setState({ errorIndexes: [] })
                          }}
                          // onChangeText={text => { this.onChangeText(text, this.state.selectedIndex), this.setState({ errorIndexes: [] }) }}
                          // onFocus={() => {
                          //   this.setState({ searchedInstrument: [], selectedIndex: index, isFocused: true })
                          // }}
                          maxLength={60}
                          onBlur={() => { this.setState({ isFocused: false, selectedIndex: -1 }) }}
                          autoCorrect={false}
                          placeholderTextColor={colors.lightGray}
                          placeholder={`${configJSON.option} ${String.fromCharCode("A".charCodeAt() + index)}`}

                          // multiline={true}
                          partTypes={[
                            {
                              trigger: "@", // Should be a single character like '@' or '#'
                              renderSuggestions: this.renderSuggestionsData,
                              isInsertSpaceAfterMention: true,
                              textStyle: { color: "rgb(0,114,211)" }, // The mention style in the input
                            },
                          ]}
                        />
                        {index >= 2 ?
                          <TouchableOpacity
                            onPress={() => { this.removeFromList(index) }}>
                            <Icon name={"close"}
                              size={scaledSize(20)} style={{ opacity: 0.5 }} />
                          </TouchableOpacity>
                          : null}
                      </View>
                    )
                  })}
                  {this.state.stocks.length < 5 && <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => { this.addToList() }}
                    style={styles.addmore_container}>
                    <Icon name={icons.add} size={scaledSize(30)} color={colors.white} />
                  </TouchableOpacity>}
                </View>
              </KeyboardAwareScrollView>
              <View style={{ flexDirection: 'row', }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => { this.postPoll('nav') }}
                  style={[styles.button_container, { backgroundColor: colors.white }]}
                >
                  <Text style={[styles.button_txt, styles.fontFamilyRegular, { color: colors.blue }]}>{configJSON.preview}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={this.state.isPosting}
                  onPress={() => { this.postPoll('poll') }}
                  style={[styles.button_container, { marginLeft: scaledSize(10), marginRight: scaledSize(20) }]}
                >
                  {this.state.isPosting ? <ActivityIndicator color={"#FFF"} /> :
                    <Text style={[styles.button_txt, styles.fontFamilyBold]}>{configJSON.post}</Text>
                  }
                </TouchableOpacity>
              </View>
            </>
          </TouchableWithoutFeedback>
          {/* Customizable Area End */}
        </SafeAreaView>
      </View>
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.bgColor
  },
  fontFamilyRegular: {
    fontFamily: Fonts.REGULAR
  },
  fontFamilyBold: {
    fontFamily: Fonts.LIGHT_BOLD
  },
  textInput_container: {

    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    marginTop: Platform.OS == "ios" ? scaledSize(5) : scaledSize(10),
    borderRadius: scaledSize(15),
    backgroundColor: colors.white,
    padding: Platform.OS == "ios" ? scaledSize(15) : scaledSize(5),
    marginLeft: Platform.OS == "ios" ? scaledSize(12) : scaledSize(10),
    marginRight: Platform.OS == "ios" ? scaledSize(12) : scaledSize(10),
    marginBottom: scaledSize(10),
  },
  textInput: {
    fontSize: scaledSize(15),
    marginHorizontal: Platform.OS == "ios" ? scaledSize(10) : 0,
  },
  marginContent: {
    marginLeft: scaledSize(10),
    marginRight: scaledSize(10)
  },
  addmore_container: {
    backgroundColor: colors.mediumLightBlue,
    zIndex: -1,
    justifyContent: 'center',
    alignItems: 'center',
    width: scaledSize(50),
    height: scaledSize(50),
    borderRadius: scaledSize(25),
    marginLeft: Platform.OS == "ios" ? scaledSize(12) : scaledSize(10),
    marginTop: Platform.OS == "ios" ? scaledSize(5) : scaledSize(10),
    marginBottom: scaledSize(50)
  },
  button_container: {
    padding: scaledSize(17),
    flex: 1,
    marginLeft: scaledSize(20),
    backgroundColor: colors.blue,
    borderRadius: scaledSize(10),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: 'center',
    marginBottom: scaledSize(20)
  },
  button_txt: {
    color: colors.white,
    fontSize: scaledSize(15),
  },
  catogary: {
    backgroundColor: colors.white,
    height: scaledSize(55),
    marginTop: scaledSize(10),
    borderRadius: scaledSize(15),
    paddingHorizontal: scaledSize(20),
    shadowColor: colors.black,
    shadowOffset: { height: 0, width: 0 },
    shadowRadius: 5,
    shadowOpacity: 0.1,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  mentionContainer: {
    minHeight: 100,
    // backgroundColor: colors.white,
    marginHorizontal: scaledSize(10),
    // borderRadius: scaledSize(10),
    marginBottom: scaledSize(5),
    borderRadius: scaledSize(15),
    backgroundColor: colors.white,

    // flexDirection: "row",
    // alignContent: "center",
    // alignItems: "center",
    // marginTop: Platform.OS == "ios" ? scaledSize(5) : scaledSize(10),

    // padding: Platform.OS == "ios" ? scaledSize(15) : scaledSize(5),
    // marginLeft: Platform.OS == "ios" ? scaledSize(12) : scaledSize(10),
    // marginRight: Platform.OS == "ios" ? scaledSize(12) : scaledSize(10),
    // marginBottom: scaledSize(10),
  },
});
// Customizable Area End
