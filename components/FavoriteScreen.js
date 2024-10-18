import React, { useContext } from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FavoritesContext } from '../components/FavoritesContext'; 

const FavoritesScreen = ({ navigation }) => {
  const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext); 

  const toggleFavorite = (item) => {
    if (favorites.some(fav => fav.id === item.id)) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  };

  const renderItem = ({ item }) => {
    const isFavorite = favorites.some(fav => fav.id === item.id);

    return (
      <View style={styles.itemContainer}>
      
        <Pressable onPress={() => navigation.navigate('Detail', { item })}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.title}>{item.artName.slice(0, 9)}</Text>
          <Text>Brand: {item.brand}</Text>
          {item.limitedTimeDeal > 0 ? (
            <View style={styles.priceContainer}>
            <Text>Price: </Text>
              <Text style={styles.originalPrice}>{item.price}$</Text>
              <Text style={styles.discountedPrice}>
                {(item.price - item.price * item.limitedTimeDeal).toFixed(2)}$
              </Text>
            </View>
          ) : (
            
            <Text>Price: {item.price}$</Text>
          )}

          {item.limitedTimeDeal > 0 && (
            <Text style={styles.deal}>Sale off: {item.limitedTimeDeal * 100}%</Text>
          )}
        </Pressable>

     
        <Pressable onPress={() => toggleFavorite(item)} style={styles.heartIcon}>
          <Icon name={isFavorite ? 'heart' : 'heart-o'} size={24} color="red" />
        </Pressable>
      </View>
      
    );
  };

  return (
    <FlatList
      data={favorites}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
    />
  );
};

const styles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemContainer: {
    width:"48%",
    margin: 5,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    marginRight: 5,
  },
  discountedPrice: {
    color: 'red',
    fontWeight: 'bold',
  },
  deal: {
    color: 'red',
    marginTop: 5,
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default FavoritesScreen;
