import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';
import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText
} from './styles';

export default function Main(props) {
  const [users, setUsers] = useState([]);
  const [prevUsers, setPrevUsers] = useState([]);
  const newUserRef = useRef();
  const [newUser, setNewUser] = useState(String(''));
  const [loading, setLoading] = useState(false);

  async function loadUsers() {
    const dbUsers = await AsyncStorage.getItem('users');
    if (dbUsers) {
      setUsers(JSON.parse(dbUsers));
      setPrevUsers(JSON.parse(dbUsers));
    }
  }
  useEffect(() => {
    loadUsers();
  }, []);

  function storeUsers() {
    if (users !== prevUsers) {
      AsyncStorage.setItem('users', JSON.stringify(users));
      setPrevUsers(users);
    }
  }
  useEffect(() => {
    storeUsers();
  }, [users]);

  function handleNavigate(user) {
    const { navigation } = props;
    navigation.navigate('User', { user });
  }
  async function handleAddUser() {
    setLoading(true);
    const response = await api.get(`/users/${newUser}`);

    const data = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url
    };

    setUsers([...users, data]);
    setNewUser('');
    setLoading(false);
    Keyboard.dismiss();
  }

  return (
    <Container>
      <Form>
        <Input
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Adicionar usuário"
          ref={newUserRef}
          value={newUser}
          onChangeText={text => setNewUser(text)}
          returnKeyType="send"
          onSubmitEditing={handleAddUser}
        />
        <SubmitButton loading={loading} onPress={handleAddUser}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Icon name="add" size={20} color="#FFF" />
          )}
        </SubmitButton>
      </Form>

      <List
        data={users}
        keyExtractor={user => user.login}
        renderItem={({ item }) => (
          <User>
            <Avatar source={{ uri: item.avatar }} />
            <Name>{item.name}</Name>
            <Bio>{item.bio}</Bio>

            <ProfileButton onPress={() => handleNavigate(item)}>
              <ProfileButtonText>Ver Perfil</ProfileButtonText>
            </ProfileButton>
          </User>
        )}
      />
    </Container>
  );
}

Main.navigationOptions = {
  title: 'Usuários'
};

Main.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func
  }).isRequired
};
