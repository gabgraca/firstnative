import React, { useEffect, useState } from 'react';
// import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';
import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author
} from './styles';

export default function User({ navigation }) {
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [fullFavorites, setFullFavorites] = useState(false);

  async function loadUserFavoriteRepos() {
    if (!loading) {
      const user = navigation.getParam('user');
      setLoading(true);
      const response = await api.get(
        `/users/${user.login}/starred?page=${page}`
      );

      if (response.data.length > 0) {
        if (page === 1) {
          setStars(response.data);
        } else {
          setStars([...stars, ...response.data]);
        }
      } else {
        setFullFavorites(true);
      }

      setLoading(false);
    }
  }

  async function loadMore() {
    if (!loading) {
      if (stars.length >= 30) {
        if (!fullFavorites) {
          setPage(page + 1);
        }
      }
    }
  }

  async function puxouPraBaixo() {
    if (!loading) {
      setFullFavorites(false);
      setPage(1);
    }
  }

  useEffect(() => {
    loadUserFavoriteRepos();
  }, [page]);

  const user = navigation.getParam('user');
  return (
    <Container>
      <Header>
        <Avatar source={{ uri: user.avatar }} />
        <Name>{user.name}</Name>
        <Bio>{user.bio}</Bio>
      </Header>
      {/* loading ? <ActivityIndicator color="#7159c1" size="large" /> : null */}
      <Stars
        onEndReachedThreshold={0.2}
        onEndReached={loadMore}
        onRefresh={puxouPraBaixo}
        refreshing={loading}
        data={stars}
        keyExtractor={star => String(star.id)}
        renderItem={({ item }) => (
          <Starred>
            <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
            <Info>
              <Title>{item.name}</Title>
              <Author>{item.owner.login}</Author>
            </Info>
          </Starred>
        )}
      />
    </Container>
  );
}

User.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('user').name
});

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func
  }).isRequired
};
