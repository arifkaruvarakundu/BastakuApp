import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const SuccessModal = ({ visible, onClose, onDetails }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <LottieView
            source={require('../assets/favicon.png')} // use your own animation file here
            autoPlay
            loop={false}
            style={{ width: 150, height: 150 }}
          />
          <Text style={styles.title}>🎉 Congratulations!</Text>
          <Text style={styles.subtitle}>You've started a new campaign!</Text>
          <Text style={styles.details}>You’re now eligible for discounted pricing while achieving your sales goal!</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDetails} style={[styles.button, styles.detailsButton]}>
              <Text style={styles.buttonText}>More Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white', padding: 20, borderRadius: 20, alignItems: 'center', width: '85%',
  },
  title: {
    fontSize: 22, fontWeight: 'bold', marginTop: 10,
  },
  subtitle: {
    fontSize: 16, marginTop: 5, color: '#333',
  },
  details: {
    fontSize: 14, textAlign: 'center', marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 20,
  },
  button: {
    backgroundColor: '#007AFF', padding: 10, borderRadius: 10, marginHorizontal: 10,
  },
  detailsButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white', fontWeight: '600',
  },
});

export default SuccessModal;
