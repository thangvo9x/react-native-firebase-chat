/** @format */
// @flow
import React from "react";
import { Images } from "@common";
import { FlatList } from "react-native";
import { List, ListItem, Avatar } from "react-native-elements";
import firebaseApp from "./Firebase";
import { connect } from "react-redux";

class ChatList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
  }

  componentDidMount() {
    const { user, onLogin } = this.props;
    if (user != null) {
      const newItems = [];
      firebaseApp.fetch(user.id, snapshot => {
        if (snapshot != null) {
          Object.keys(snapshot).forEach(key => {
            newItems.push(snapshot[key]);
          });
          this.setState({ list: newItems });
        }
      });
    } else {
      onLogin();
    }
  }

  keyExtractor = item => item.name;

  renderItem = ({ item }) => {
    // console.log('item', item)
    const { onChat } = this.props;
    return (
      <ListItem
        key={item.name}
        roundAvatar
        title={item.name}
        avatar={
          <Avatar
            rounded
            source={{
              uri: item.avatar ? item.avatar : Images.defaultUserChat
            }}
            title={item.name}
          />
        }
        onPress={() => onChat(item)}
      />
    );
  };

  render() {
    return (
      <List>
        <FlatList
          keyExtractor={this.keyExtractor}
          data={this.state.list}
          renderItem={this.renderItem}
        />
      </List>
    );
  }
}

const mapStateToProps = ({ user }) => ({ user: user.data });

export default connect(mapStateToProps)(ChatList);
