import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../context/themeContext';

const ResultsScreen = ({ route }) => {
  const { condition, description, treatment, videos, restaurants } =
    route.params;
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <ScrollView style={[styles.container, isDarkMode && styles.darkBackground]}>
      <TouchableOpacity onPress={toggleDarkMode} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.title, isDarkMode && styles.darkText]}>
        {condition}
      </Text>
      <Text style={[styles.description, isDarkMode && styles.darkText]}>
        {description}
      </Text>

      <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>
        Treatment:
      </Text>
      <Text style={[styles.text, isDarkMode && styles.darkText]}>
        {treatment}
      </Text>

      <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>
        Recipe Videos:
      </Text>
      {videos.map((video, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => Linking.openURL(video.url)}
        >
          <Text style={[styles.link, isDarkMode && styles.darkLink]}>
            {video.title}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>
        Nearby Restaurants:
      </Text>
      {restaurants.map((place, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => Linking.openURL(place.url)}
        >
          <Text style={[styles.link, isDarkMode && styles.darkLink]}>
            {place.name} - {place.address}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  darkBackground: { backgroundColor: '#121212' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  darkText: { color: '#fff' },
  description: { fontSize: 16, marginBottom: 15 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  text: { fontSize: 16 },
  link: { color: 'blue', textDecorationLine: 'underline', marginTop: 5 },
  darkLink: { color: '#66ccff' },
  toggleButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 10,
  },
  toggleButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default ResultsScreen;
