import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface SubmitButtonProps {
  onPress: () => void;
  label: string;
}

const SubmitButton = ({ onPress, label }: SubmitButtonProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    borderRadius: 20,
    height: 50,
    backgroundColor: '#2A9D8F',
    width: '100%',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'AndadaPro',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default SubmitButton;
