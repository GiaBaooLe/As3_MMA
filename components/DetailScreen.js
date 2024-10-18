import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
  Button,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { FavoritesContext } from "../components/FavoritesContext"; 
import { useNavigation } from '@react-navigation/native'; 

const DetailScreen = ({ route }) => {
  const { item } = route.params; 
  const { addFavorite, removeFavorite, isFavorite } = useContext(FavoritesContext); 
  const [isItemFavorite, setIsItemFavorite] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [menuVisible, setMenuVisible] = useState(false); 
  const navigation = useNavigation();

  useEffect(() => {
    setIsItemFavorite(isFavorite(item.id)); 
    fetchRatings();
  }, [isFavorite, item.id]);

  const fetchRatings = async () => {
    const ratingsData = [
      { user: "Thắng", rating: 5, comment: "Màu chất lượng" },
      { user: "Việt", rating: 4, comment: "Sản phẩm đa dạng màu sắc" },
    ];
    setRatings(ratingsData);
    calculateAverageRating(ratingsData);
    countRatings(ratingsData);
  };

  const countRatings = (ratingsData) => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingsData.forEach(({ rating }) => {
      if (counts[rating] !== undefined) {
        counts[rating]++;
      }
    });
    setRatingCounts(counts);
  };

  const calculateAverageRating = (ratingsData) => {
    if (ratingsData.length === 0) return;
    const totalRating = ratingsData.reduce((acc, { rating }) => acc + rating, 0);
    const average = totalRating / ratingsData.length;
    setAverageRating(average.toFixed(1));
  };

  const toggleFavorite = () => {
    if (isItemFavorite) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
    setIsItemFavorite(!isItemFavorite);
  };

  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Pressable key={i} onPress={() => setSelectedRating(i)}>
          <Icon name={i <= rating ? "star" : "star-o"} size={20} color="gold" />
        </Pressable>
      );
    }
    return <View style={styles.starContainer}>{stars}</View>;
  };

  const handleAddComment = () => {
    if (commentText.trim() === "" || selectedRating === 0) {
      Alert.alert("Error", "Please provide a comment and select a rating.");
      return;
    }

    const newRating = {
      user: "Bao",
      rating: selectedRating,
      comment: commentText,
    };

    const updatedRatings = [...ratings, newRating];
    setRatings(updatedRatings);
    calculateAverageRating(updatedRatings);
    countRatings(updatedRatings);

    setCommentText("");
    setSelectedRating(0);

    Alert.alert("Thank for your feedback");
  };

  const renderHeader = () => (
    <View style={styles.infoContainer}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Pressable onPress={toggleFavorite} style={styles.heartIcon}>
          <Icon name={isItemFavorite ? "heart" : "heart-o"} size={28} color="red" />
        </Pressable>
      </View>
      <Text style={styles.title}>{item.artName}</Text>
      <Text>Brand: {item.brand}</Text>
      <Text>GlassSurface: {item.glassSurface ? "Yes" : "No"}</Text>

      <View style={styles.priceContainer}>
        <Text>Price: </Text>
        <Text style={styles.originalPrice}>{item.price}$</Text>
        <Text style={styles.discountedPrice}>
          {(item.price - item.price * item.limitedTimeDeal).toFixed(2)}$
        </Text>
      </View>
    
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.feedback}>
        <Text style={styles.sectionTitle}>Feedback</Text>
        <View style={styles.averagerate}>
          <Text style={styles.sectionTitle}>({averageRating} / 5 )</Text>
          <Icon name={"star"} size={20} color="gold" style={styles.startIcon} />
        </View>
        
       
       
      </View>
      <View style={styles.ratingCounts}>
          {Object.keys(ratingCounts).map((rating) => (
            <Text key={rating}>
              {rating} <Icon name={"star"} size={20} color="gold" />: {ratingCounts[rating]} đánh giá
            </Text>
          ))}
        </View>
    </View>
  );

  const navigateToScreen = (screen) => {
    setMenuVisible(false);
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setMenuVisible(!menuVisible)} style={styles.menuIcon}>
        <Icon name="bars" size={30} color="black" />
      </Pressable>

      {menuVisible && (
        <View style={styles.dropdownMenu}>
          <Pressable onPress={() => navigateToScreen('Home')} style={styles.menuItem}>
            <Text style={styles.menuText}>Home</Text>
          </Pressable>
          <Pressable onPress={() => navigateToScreen('Favorites')} style={styles.menuItem}>
            <Text style={styles.menuText}>Favorites</Text>
          </Pressable>
        </View>
      )}

      <FlatList
        data={ratings}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.ratingItem}>
            <Text style={styles.ratingUser}>{item.user}</Text>
            {renderStars(item.rating)}
            <Text style={styles.ratingComment}>{item.comment}</Text>
          </View>
        )}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={
          <View>
            <Text style={styles.feedbackTitle}>Leave a Comment</Text>
            <Text style={styles.rating}>Select Rating:</Text>
            <View style={styles.rating}>{renderStars(selectedRating)}</View>
            <View style={styles.rating}>
              <TextInput
                style={styles.commentInput}
                placeholder="Send your feedback..."
                value={commentText}
                onChangeText={setCommentText}
              />
              <Button title="Submit Comment" onPress={handleAddComment} style={styles.button} />
            </View>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    position: "relative",
  },
  menuIcon: {
    position: "absolute",
    top: 5,
    right: 25, 
    zIndex: 200, 
  },
  dropdownMenu: {
    position: "absolute",
    top: 35, 
    right: 25, 
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
    width: 150, 
  },
  menuItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  menuText: {
    fontSize: 18,
    color: "black",
  },
  rating: { paddingHorizontal: 20 },
  startIcon: {
    transform: [{ translateY: 5 }],
  },
  feedbackTitle: {
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  averagerate: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  feedback: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  ratingCounts: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    position: "relative",
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
  },
  heartIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  infoContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  originalPrice: {
    textDecorationLine: "line-through",
    color: "gray",
    marginRight: 10,
    fontSize: 16,
  },
  discountedPrice: {
    color: "red",
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    color: "#777",
    textAlign: "left",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  starContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  ratingItem: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  ratingUser: {
    fontWeight: "bold",
  },
  ratingComment: {
    fontStyle: "italic",
    marginTop: 5,
    color: "#555",
  },
  commentInput: {
    paddingHorizontal: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
  },
});

export default DetailScreen;
