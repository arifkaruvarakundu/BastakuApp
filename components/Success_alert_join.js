import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const SuccessModalJoin = ({ visible, onClose}) => {

    const navigation = useNavigation();
    const {t} = useTranslation('StartCampaign')

    const onDetails = () =>{
        navigation.navigate("AccountTab", {screen: "CampaignsScreen"})
    }
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <LottieView
            source={require('../assets/Success_animation.json')} // use your own animation file here
            autoPlay
            loop={true}
            style={{ width: 150, height: 150 }}
          />
          <Text style={styles.title}>🎉 {t("congratulations")}</Text>
          <Text style={styles.subtitle}>{t("joined_campaign")}</Text>
          <Text style={styles.details}>{t("eligibility_info")}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={styles.buttonText}>{t("cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDetails} style={[styles.button, styles.detailsButton]}>
              <Text style={styles.buttonText}>{t("more_details")}</Text>
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

export default SuccessModalJoin;
