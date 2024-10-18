import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, Image, Pressable, StyleSheet, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";
import { FavoritesContext } from "./FavoritesContext";

const HomeScreen = () => {
  const [artTools, setArtTools] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredArtTools, setFilteredArtTools] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("All");

  const navigation = useNavigation();
  const { addFavorite, removeFavorite, isFavorite } = useContext(FavoritesContext);

  useEffect(() => {
    fetch("https://6545921dfe036a2fa954718f.mockapi.io/api/v1/artTools")
      .then((response) => response.json())
      .then((data) => {
        setArtTools(data);
        setFilteredArtTools(data);
      });
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    filterArtTools(text, selectedBrand);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
    filterArtTools(searchText, brand);
  };

  const filterArtTools = (searchText, brand) => {
    let filtered = artTools;

    if (searchText.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.artName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (brand !== "All") {
      filtered = filtered.filter((item) => item.brand === brand);
    }

    setFilteredArtTools(filtered);
  };

  const renderItem = ({ item }) => {
    const favorite = isFavorite(item.id);

    return (
      <View style={styles.itemContainer}>
        <Pressable onPress={() => navigation.navigate("Detail", { item })}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.title}>{item.artName.slice(0, 9)}</Text>
          <Text>Brand: {item.brand}</Text>

          {item.limitedTimeDeal > 0 ? (
            <View style={styles.priceContainer}>
              <Text>Price :</Text>
              <Text style={styles.originalPrice}>{item.price}$</Text>
              <Text style={styles.discountedPrice}>
                {(item.price - item.price * item.limitedTimeDeal).toFixed(2)}$
              </Text>
            </View>
          ) : (
            <Text>Price: {item.price}$</Text>
          )}

          {item.limitedTimeDeal > 0 && <Text style={styles.deal}>Sale off: {item.limitedTimeDeal * 100}%</Text>}

          <View style={styles.ratingContainer}>
            
            <Text style={styles.ratingCount}>
              (2 lượt đánh giá <Icon name={"star"} size={20} color="gold" /> )
            </Text>
          </View>
        </Pressable>

        <Pressable onPress={() => (favorite ? removeFavorite(item.id) : addFavorite(item))} style={styles.heartIcon}>
          <Icon name={favorite ? "heart" : "heart-o"} size={24} color="red" />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.searchInput} placeholder="Search products..." value={searchText} onChangeText={handleSearch} />

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Filter by Brand:</Text>
        <Picker selectedValue={selectedBrand} style={styles.picker} onValueChange={(itemValue) => handleBrandChange(itemValue)}>
          <Picker.Item label="All" value="All" />
          {Array.from(new Set(artTools.map((item) => item.brand))).map((brand) => (
            <Picker.Item label={brand} value={brand} key={brand} />
          ))}
        </Picker>
      </View>

      <FlatList data={filteredArtTools} renderItem={renderItem} keyExtractor={(item) => item.id} numColumns={2} columnWrapperStyle={styles.row} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  pickerLabel: {
    fontSize: 16,
  },
  picker: {
    width: 150,
    height: 44,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemContainer: {
    width: "48%",
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  averageRating: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  ratingCount: {
    color: '#555',
  },
});

export default HomeScreen;
