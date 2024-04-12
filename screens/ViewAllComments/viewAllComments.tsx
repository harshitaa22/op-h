// Customizable Area Start
import React, { FC } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  Clipboard,
  KeyboardAvoidingView,
} from "react-native";
// framework
import {
  deviceHeight,
  deviceWidth,
  scaledSize,
  widthFromPercentage,
} from "../../../../../framework/src/Utilities";
//colors
import colors from "../../colors";
//controller
import ViewAllCommentsController, { Props, configJSON } from "./viewAllCommentsController";
//assets
import { icons, profile } from "../../assets";
import { verified } from "../../../../CustomisableUserProfiles/src/assets";
//components
import { timeSince } from "../../../../../components/src/utilitisFunction";
import { deleteIcon, reply } from "../../../../../components/src/assets";
import { Fonts } from "../../../../../components/src/Utils/Fonts";
import HeaderComponent from "../../../../../components/src/HeaderComponent";
import DeletePollModal from "../Components/DeletePollModal";
import { nFormatter } from "../../../../../components/src/Utils/service";
//library
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { MentionInput, MentionSuggestionsProps, replaceMentionValues } from 'react-native-controlled-mentions'
import RenderHTML from "react-native-render-html";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from 'react-native-toast-message'
//  Customizable Area End
const { width } = Dimensions.get('screen')

export default class ViewAllComments extends ViewAllCommentsController {
  constructor(props: Props) {
    super(props);
  }

  displayComments = () => {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={this.state.comments_List}
        ref={(ref: any) => this.listRef = ref}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => [this.getCardCommentsData(this.state.card_comments_api)]}
          />
        }
        onScrollToIndexFailed={(error) => {
          this.listRef.scrollToOffset({ offset: error.averageItemLength * error.index, animated: true });
          setTimeout(() => {
            if (this.listRef !== null) {
              this.listRef.scrollToIndex({ index: error.index, animated: true });
            }
          }, 100);
        }}
        ListEmptyComponent={() => {
          return (this.state.isLoading && this.state.comments_List?.length != 0 ? null : <View style={{ flex: 1, justifyContent: 'center', alignItems: "center", height: deviceHeight - scaledSize(180) }}>
            <Text style={{ fontFamily: Fonts.LIGHT_BOLD }}>{this.state.error}</Text>
          </View>)
        }}
        renderItem={({ item, index }: { item: any, index: any }) => {
          if (this.state.commentType == 'Forum') {
            const data = item.attributes
            data.comment = item?.attributes?.new_description;
            data.account.profile_url = item.attributes.profile_url
            if (item.attributes.opigo_score != null) {
              data.account.final_score = item.attributes?.opigo_score
            }
            item = data;
          }
          else {
            const data = item
            if (item.account.performance_score != null) {
              data.account.final_score = item.account.performance_score
            }
            item = data
          }
          let heighLight = this.props?.route?.params?.commentId == item.id && this.state.heighLight
          let that = this
          return (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => { Keyboard.dismiss(), this.setState({ isShow: false }) }}
              style={[styles.comments_view_row,
              {
                backgroundColor: colors.white,
                marginBottom: this.state.comments_List?.length - 1 == index ? 30 : 10,
                borderWidth: 1,
                borderColor: heighLight ? colors.blue : this.state.replyId == item.id ? colors.blue : colors.white
              }]}>
              <TouchableOpacity
                onPress={() => { this.goToFriendProfilePage(item.account.id) }}
                style={{ flex: 1, alignItems: 'center' }}>
                <View style={styles.profileView}>
                  {item?.account?.profile_url ?
                    <Image source={{ uri: item?.account?.profile_url }} style={styles.profile} />
                    : <Image source={profile} style={styles.profile} />}
                  {item?.account?.opigo_verified == true &&
                    <View style={styles.verified_view}>
                      <Image source={verified} style={styles.veified} />
                    </View>}
                </View>
                <View style={styles.id_view}>
                  <Text
                    style={[styles.id_txt, styles.fontFamilyRegular]}>
                    {item?.account?.final_score ? nFormatter(item?.account?.final_score) : 0}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={{ flex: 5, justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => { this.goToFriendProfilePage(item.account.id) }}>
                  <Text numberOfLines={1} style={[styles.userName, styles.fontFamilyBold,]}>{item?.account?.first_name} {item?.account?.last_name}  {" "}</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onLongPress={() => { Clipboard.setString(item.message), Toast.show({ text1: 'Message copied!', type: 'success' }) }}>
                  <RenderHTML
                    defaultTextProps={{ allowFontScaling: false }}
                    renderersProps={{
                      a: {
                        onPress(event, url, htmlAttribs, target) {
                          that.manageOnPress(url, htmlAttribs.href)
                        }
                      }
                    }}
                    // defaultTextProps={{ selectable: true }}
                    tagsStyles={{
                      a: {
                        textDecorationLine: 'none'
                      }
                    }}
                    baseStyle={{
                      fontSize: scaledSize(12),
                      fontFamily: Fonts.REGULAR,
                      marginTop: scaledSize(2),
                      color: colors.black,
                    }} source={{ html: item.comment }} />
                </TouchableOpacity>
                <View style={styles.bottom_card_row}>
                  <Text style={[styles.time, styles.fontFamilyRegular,]}>{timeSince(item.created_at)}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', flex: 1 }}>
                    {this.props.route.params.type != "Forum" && <TouchableOpacity
                      onPress={() => {
                        this.replyofComment(item)
                        this.commentRef.focus()
                      }}
                      style={[styles.replayDelete_view,]}>
                      <Image source={reply} style={[{ height: 20, width: 20, tintColor: this.state.replyId == item.id ? colors.blue : colors.black },]} />
                    </TouchableOpacity>}
                    {(this.state.accountid == item?.account?.id || this.state.isCreator) &&
                      <TouchableOpacity
                        onPress={() => { this.showDelete(item.id, item.account_id) }}
                        style={styles.replayDelete_view}>
                        <Image source={deleteIcon} style={{ height: 20, width: 20 }} />
                      </TouchableOpacity>}
                  </View>
                </View>
                {((item.is_replies_present === true && this.state.openViewCommentID == item.id)) ?
                  this.displayViewReplyComments()
                  : null}
                {item.is_replies_present === true ?
                  <TouchableOpacity onPress={() => this.setViewCommentId(item.id)}>
                    {(this.state.isLoadingReplyComment && this.state.openViewCommentID == item.id) ? <Text style={[styles.viewReply_txt, styles.fontFamilyRegular]}>loading...</Text>
                      : <Text style={[styles.viewReply_txt, styles.fontFamilyRegular]}>{(this.state.isHideComments == false && this.state.openViewCommentID == item.id) ? configJSON.hideReply : configJSON.viewReply}</Text>}
                  </TouchableOpacity>
                  : null}
              </View>
            </TouchableOpacity>)
        }}
      />)
  }

  displaySuggestions = (item: any) => {
    if (item.tagged_type == this.stockCompany) {
      if (item.company_name == configJSON.tataMotor) {
        return `${item.company_name} (${item.company_symbol})`
      } else {
        return item.company_name
      }
    } else {
      return item.full_name
    }
  }

  displayViewReplyComments = () => {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        ref={(ref: any) => this.innerCommentRef = ref}
        data={this.state.viewComment_List}
        renderItem={({ item }: { item: any }) => {
          let that = this
          let heighLight = this.props?.route?.params?.commentId == item.id && this.state.heighLight
          return (
            <>
              <View style={[styles.reply_container, { borderRadius: heighLight ? 10 : 0, borderColor: heighLight ? colors.blue : colors.white, borderWidth: 1 }]}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <View style={styles.profileView}>
                    {item?.attributes?.profile_url ?
                      <Image source={{ uri: item?.attributes?.profile_url }} style={styles.profile} />
                      : <Image source={profile} style={styles.profile} />}
                    {item?.attributes?.account?.opigo_verified &&
                      <View style={styles.verified_view}>
                        <Image source={verified} style={styles.veified} />
                      </View>}
                  </View>
                  <View style={styles.id_view}>
                    <Text
                      style={[styles.id_txt, styles.fontFamilyRegular]}>
                      {nFormatter(item?.attributes?.opigo_score)}
                    </Text>
                  </View>
                </View>
                <View style={{ flex: 5, justifyContent: 'center', marginLeft: 2 }}>
                  <Text style={[styles.userName, styles.fontFamilyBold, { color: colors.black }]}>{item?.attributes?.account?.first_name} {item?.attributes?.account?.last_name}  {" "}
                  </Text>
                  <RenderHTML
                    defaultTextProps={{ allowFontScaling: false }}
                    renderersProps={{
                      a: {
                        onPress(event, url, htmlAttribs, target) {
                          that.manageOnPress(url, htmlAttribs.href)
                        }
                      }
                    }}
                    defaultTextProps={{ selectable: true }}
                    tagsStyles={{
                      a: {
                        textDecorationLine: 'none'
                      }
                    }}
                    baseStyle={{ fontSize: scaledSize(12), fontFamily: Fonts.REGULAR, marginTop: scaledSize(-10), color: colors.black }} contentWidth={width} source={{ html: `<p>${item?.attributes?.comment}</p>` }} />
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginLeft: scaledSize(50), flex: 1, }}>
                <Text style={[styles.time, styles.fontFamilyRegular, { flex: 1 }]}>{timeSince(item.attributes.created_at)}</Text>
                {(this.state.accountid == item?.attributes?.account?.id || this.state.isCreator) &&
                  <TouchableOpacity
                    onPress={() => this.showDelete(item.id, item.attributes.account_id)}
                    style={[styles.replayDelete_view, { marginLeft: scaledSize(15), }]}>
                    <Image source={deleteIcon} style={{ height: 20, width: 20 }} />
                  </TouchableOpacity>}
              </View>
            </>)
        }}
        keyExtractor={(item, index) => index.toString()}
      />)
  }

  renderSuggestions: FC<MentionSuggestionsProps> = ({ keyword, onSuggestionPress }) => {
    if (keyword == null) {
      return null;
    }
    return (
      <>
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={this.state.suggestions}
          keyboardShouldPersistTaps='always'
          style={{ flexGrow: 0 }}
          renderItem={({ item, index }: { item: any, index: number }) => {
            return (
              <TouchableOpacity
                onPress={() => { this.handleClickItem(item, onSuggestionPress) }}
                style={{ padding: 12, }}>
                <Text numberOfLines={1} style={[styles.fontFamilyRegular, { fontSize: scaledSize(12) }]}>{this.displaySuggestions(item)}</Text>
              </TouchableOpacity>)
          }}
          keyExtractor={(item, index) => index.toString()}
        />
        {this.state.suggestions?.length >= 1 && <View style={{ height: 1, backgroundColor: 'rgb(246,246,246)', }} />}
      </>)
  };
  // Customizable Area End

  render() {
    let normalCaption = replaceMentionValues(this.state.comment, ({ id, name }) => {
      return `@${name}`
    })
    return (
      // Customizable Area Start
      <>
        <KeyboardAvoidingView
          behavior={this.isPlatformiOS() ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <SafeAreaView />
          <HeaderComponent isBack={true} title="Comments" onClose={() => { this.goToBack() }} />
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false} extraScrollHeight={20} extraHeight={100} scrollEnabled={false} keyboardShouldPersistTaps='handled' contentContainerStyle={{ flex: 1 }} >

            <TouchableWithoutFeedback
              testID="Background"
              onPress={() => { Keyboard.dismiss(), this.hideKeyboard() }}
              style={{ backgroundColor: 'red', flex: 1 }}>
              <>
                {this.state.isLoading ?
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator color={colors.blue} size='large' />
                  </View>
                  : <>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => {
                        Keyboard.dismiss(),
                          this.setState({ replyId: '', replyItem: {}, isShow: false })
                      }}
                      style={[styles.comment_container]}>
                      {this.displayComments()}
                    </TouchableOpacity>
                  </>}
                <TouchableOpacity
                  activeOpacity={1} style={[styles.bottom_textinput_container]}>
                  <View style={styles.bottom_row}>
                    {!this.state.isLoading &&
                      <MentionInput
                        onSubmitEditing={Keyboard.dismiss}
                        allowFontScaling={false}
                        inputRef={(ref: any) => this.commentRef = ref}
                        value={this.state.comment}
                        style={[styles.textInput, { width: this.state.width }]}
                        onChange={(caption: any) => { this.hendleTag(caption) }}
                        onFocus={() => { this.setState({ isShow: true }) }}
                        onBlur={() => { this.setState({ isShow: false }) }}
                        placeholderTextColor={colors.lightGray}
                        placeholder={configJSON.placeholderText}
                        maxLength={150}
                        multiline={true}
                        containerStyle={styles.mentionContainer}
                        partTypes={[
                          {
                            trigger: '@', // Should be a single character like '@' or '#'
                            renderSuggestions: this.renderSuggestions,
                            isInsertSpaceAfterMention: true,
                            textStyle: { color: 'rgb(0,114,211)' }, // The mention style in the input
                          },
                        ]}
                      />
                    }
                  </View>
                  <View style={[styles.bottom_row, { maxWidth: scaledSize(110) }]}>
                    {/* <View style={styles.commentCountContainer}>
                <Text style={styles.count}>{`${this.state.comment.length}/150`}</Text>
                  </View> */}
                    <View style={{ alignItems: 'flex-end', alignSelf: 'flex-end' }}>
                      {this.state.isCommentLoading ? <ActivityIndicator color={colors.blue} style={{ padding: scaledSize(7), alignSelf: 'flex-end' }} /> :
                        <TouchableOpacity
                          onPress={() => { this.handleSendComment() }}
                          style={[styles.send_view, { alignSelf: 'flex-end' }]}>
                          <FontAwesome
                            name={icons.paper_plane}
                            size={15}
                            color={colors.white}
                          />
                        </TouchableOpacity>}
                      {normalCaption?.length > 0 && <Text style={styles.count}>{`${normalCaption?.length >= 150 ? '150' : normalCaption?.length}/150`}</Text>}
                    </View>
                  </View>
                </TouchableOpacity>
              </>
            </TouchableWithoutFeedback>
          </KeyboardAwareScrollView>
          <SafeAreaView />
          <DeletePollModal
            isLoading={this.state.deleteCommentLoading}
            onDelete={() => { this.state.type == 'Forum' ? this.deleteCommentForum(this.state.deleteId) : this.deleteComment(this.state.deleteId, this.state.deleteAccountId) }}
            visible={this.state.visibleModal}
            onCancel={() => this.setState({ visibleModal: false, deleteCommentLoading: false })}
            title={configJSON.deleteModalTitle}
          />
        </KeyboardAvoidingView>
      </>
      // Customizable Area End
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  fontFamilyRegular: {
    fontFamily: Fonts.REGULAR
  },
  fontFamilyBold: {
    fontFamily: Fonts.LIGHT_BOLD
  },
  comment_container: {
    marginLeft: scaledSize(15),
    marginRight: scaledSize(15),
    marginTop: scaledSize(10),
    flex: 1
  },
  comments_view_row: {
    flexDirection: 'row',
    padding: scaledSize(10),
    marginBottom: 10,
    backgroundColor: colors.white,
    borderRadius: scaledSize(10)
  },
  profileView: {
    width: widthFromPercentage(10),
    height: widthFromPercentage(10),
    borderRadius: scaledSize(360),
    borderColor: colors.blue,
    borderWidth: scaledSize(1),
    justifyContent: "center",
    alignItems: "center",
  },
  profile: {
    width: widthFromPercentage(9),
    height: widthFromPercentage(9),
    borderRadius: scaledSize(360),
    backgroundColor: colors.lightGray
  },
  id_view: {
    backgroundColor: "#1377DF",
    borderRadius: scaledSize(10),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: scaledSize(-14),
    paddingLeft: scaledSize(5),
    paddingRight: scaledSize(5),
    paddingTop: scaledSize(2),
    paddingBottom: scaledSize(2)
  },
  id_txt: {
    color: "#fff",
    fontSize: scaledSize(8),
  },
  veified: {
    width: widthFromPercentage(3),
    height: widthFromPercentage(3),
  },
  verified_view: {
    width: widthFromPercentage(5),
    height: widthFromPercentage(5),
    backgroundColor: colors.white,
    borderRadius: scaledSize(360),
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -8,
    right: -8,
    elevation: 5,
  },
  time: {
    color: colors.gray,
    fontSize: scaledSize(10),
    marginTop: scaledSize(10)
  },
  bottom_textinput_container: {
    marginBottom: 0,
    marginLeft: scaledSize(20),
    marginRight: scaledSize(20),
    padding: scaledSize(10),
    borderRadius: scaledSize(18),
    backgroundColor: colors.white,
    flexDirection: "row",
    justifyContent: "space-between",
    bottom: scaledSize(20),
    width: '90%',
    alignSelf: 'center',
  },
  bottom_row: {
    flexDirection: "row",
    alignItems: "center",
  },
  send_view: {
    width: widthFromPercentage(9),
    height: widthFromPercentage(9),
    borderRadius: scaledSize(8),
    backgroundColor: colors.blue,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: scaledSize(10),
  },
  textInput: {
    fontSize: scaledSize(12),
    marginLeft: scaledSize(10),
    padding: 0,
    width: widthFromPercentage(50),
  },
  userName: {
    fontSize: scaledSize(13),
    textTransform: 'none'
  },
  bottom_card_row: {
    flexDirection: 'row'
  },
  replayDelete_view: {
    marginLeft: scaledSize(20)
  },
  viewReply_txt: {
    marginLeft: scaledSize(25),
    fontSize: scaledSize(10),
    color: colors.blue,
    marginTop: scaledSize(10)
  },
  reply_container: {
    paddingTop: scaledSize(10),
    flexDirection: 'row'
  },
  mentionContainer: {
    minHeight: scaledSize(20),
    maxHeight: 200,
    backgroundColor: colors.white,
    borderRadius: scaledSize(10),
    maxWidth: deviceWidth - scaledSize(110),
    marginBottom: scaledSize(5)
  },
  commentCountContainer: {
    position: 'absolute',
    zIndex: 1,
    right: 50,
    top: -20,
    backgroundColor: colors.blue,
    paddingHorizontal: scaledSize(10),
    paddingVertical: scaledSize(5),
    borderRadius: scaledSize(8),
  },
  count: {
    fontSize: scaledSize(11),
    marginTop: scaledSize(5),
  }
});
// Customizable Area End
