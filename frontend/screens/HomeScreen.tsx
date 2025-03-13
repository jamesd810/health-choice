import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigation.navigate('Results', { condition: searchTerm });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search a Health Condition</Text>
      <TextInput
        style={styles.input}
        placeholder="Type a condition (e.g., Diabetes)"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
