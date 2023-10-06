import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage'; 

const CanvasEditorApp = () => {
  const [canvasText, setCanvasText] = useState('');
  const [canvasItems, setCanvasItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const addTextToCanvas = () => {
    if (canvasText) {
      const newTextItem = {
        text: canvasText,
        fontSize: 16,
        positionX: 0, 
        positionY: 0, 
      };
      setCanvasItems([...canvasItems, newTextItem]);
      setCanvasText('');
    }
  };

  const editSelectedItem = () => {
    if (selectedItem !== null && canvasText) {
      const updatedCanvasItems = [...canvasItems];
      updatedCanvasItems[selectedItem].text = canvasText;
      setCanvasItems(updatedCanvasItems);
      setCanvasText('');
      setSelectedItem(null);
    }
  };


  const saveCanvasAsImage = () => {
    try {
      const canvasData = JSON.stringify(canvasItems);
      AsyncStorage.setItem('canvasData', canvasData);
      Alert.alert('Canvas saved successfully!');
    } catch (error) {
      console.error('Error saving canvas data:', error);
      Alert.alert('Error saving canvas. Please try again.');
    }
  };

  const loadCanvasData = async () => {
    try {
      const canvasData = await AsyncStorage.getItem('canvasData');
      if (canvasData !== null) {
        const parsedData = JSON.parse(canvasData);
        setCanvasItems(parsedData);
      }
    } catch (error) {
      console.error('Error loading canvas data:', error);
    }
  };

  const renderCanvas = () => {
    return canvasItems.map((item, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => setSelectedItem(index)}
        style={[
          styles.canvasItem,
          {
            left: item.positionX, 
            top: item.positionY, 
            fontSize: item.fontSize,
          },
        ]}
      >
        <Text>{item.text}</Text>
      </TouchableOpacity>
    ));
  };
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.canvasContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {renderCanvas()}
      </ScrollView>
      <TextInput
        placeholder="Enter text"
        value={canvasText}
        onChangeText={(text) => setCanvasText(text)}
        style={styles.textInput}
      />
      {selectedItem !== null ? (
        <Button title="Edit Text" onPress={editSelectedItem} />
      ) : (
        <Button title="Add Text" onPress={addTextToCanvas} />
      )}
      <Button title="Save Canvas" onPress={saveCanvasAsImage} />
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
    canvasContainer: {
      // flex: 1,
      // width: '100%',
      backgroundColor: 'rgb(138, 180, 248);',
      justifyContent: 'center',
      alignItems: 'center', 
    flexDirection: 'row', // Horizontal scrolling canvas
  },

  canvasItem: {
    backgroundColor: 'white',
    padding: 20,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },

});

export default CanvasEditorApp;
