import { View, StyleSheet, Image, Text } from 'react-native';
import AuthForm from '@/components/AuthForm';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { AuthData, AuthMode } from '@/types/auth';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { setDoc } from '@firebase/firestore';
import { doc } from 'firebase/firestore';
import { getAuthErrorMessages } from '@/utils/getAuthErrorMessages';
import Toast from 'react-native-toast-message';
import SubmitButton from '@/components/SubmitButton';

const Index = () => {
  const [activeForm, setActiveForm] = useState<
    'login' | 'signup' | 'resetPassword' | ''
  >('');
  const [sheetIndex, setSheetIndex] = useState<number>(0);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['65%', '90%'];

  const showToast = (type: string, text1: string, text2?: string) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
    });
  };

  const handleAuth = async (
    authMode: AuthMode,
    { email, password, firstName, lastName }: AuthData,
  ) => {
    if (authMode === 'login') {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        router.replace('/(tabs)');
      } catch (err: any) {
        console.log(err.code);
        showToast('error', getAuthErrorMessages(err.code));
      }
    } else if (authMode === 'signup') {
      if (!email || !password) {
        showToast('error', 'Please enter an email and password.');
        return;
      }
      if (!firstName || !lastName) {
        showToast('error', 'Please enter your first and last name.');
        return;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
        });

        await user.reload();

        await setDoc(doc(db, 'users', user.uid), {
          firstName,
          lastName,
          email: user.email,
          createdAt: new Date(),
        });
        router.replace('/(tabs)');
      } catch (err: any) {
        console.log(err.code);
        showToast('error', getAuthErrorMessages(err.code));
      }
    } else if (authMode === 'resetPassword') {
      try {
        await sendPasswordResetEmail(auth, email);
        showToast(
          'success',
          'Password reset link has been sent.',
          'Check your email.',
        );
      } catch (err: any) {
        showToast(
          'error',
          'Something went wrong.',
          'Please check the email address you provided.',
        );
        console.error(err.message);
      }
    }
  };

  const handleSelectForm = (authMode: AuthMode) => {
    setActiveForm(authMode);
    setSheetIndex(1);
    bottomSheetRef.current?.snapToIndex(1);
  };

  const onToggleForm = (form: AuthMode) => {
    setActiveForm(form);
  };

  return (
    <GestureHandlerRootView style={styles.sheetContainer}>
      <View
        style={[
          styles.backgroundContainer,
          { opacity: sheetIndex === 1 ? 0 : 1 },
        ]}
      >
        <Text style={styles.header}>Welcome to the{'\n'}Book Journal!</Text>
        <Image
          style={styles.logo}
          source={require('../../assets/images/logo-only-book.png')}
        />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        enableContentPanningGesture={false}
        handleComponent={null}
        animateOnMount={true}
        style={styles.sheet}
      >
        <BottomSheetView style={styles.contentContainer}>
          {activeForm === '' ? (
            <View style={styles.buttonContainer}>
              <Text style={styles.text1}>Keep up with your reading!</Text>
              <SubmitButton
                onPress={() => handleSelectForm('login')}
                label="Login"
              />
              <Text style={styles.text2}>Don&#39;t have an account yet?</Text>
              <SubmitButton
                onPress={() => handleSelectForm('signup')}
                label="Sign Up"
              />
            </View>
          ) : activeForm === 'login' ? (
            <AuthForm
              onSubmit={handleAuth}
              submitLabel={'Login'}
              formLabel={'Login'}
              linkText={"Don't have an account yet?"}
              link={'Sign up'}
              onToggleForm={onToggleForm}
              activeForm={activeForm}
            />
          ) : activeForm === 'signup' ? (
            <AuthForm
              onSubmit={handleAuth}
              submitLabel={'Sign Up'}
              formLabel={'Sign up'}
              linkText={'Already have an account?'}
              link={'Login'}
              onToggleForm={onToggleForm}
              activeForm={activeForm}
            />
          ) : (
            <AuthForm
              onSubmit={handleAuth}
              submitLabel={'Reset Password'}
              formLabel={'Reset Password'}
              linkText={'Already have an account?'}
              link={'Login'}
              onToggleForm={onToggleForm}
              activeForm={activeForm}
            />
          )}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 200,
  },
  button: {
    marginTop: 15,
    padding: 15,
    borderRadius: 20,
    height: 50,
    backgroundColor: '#001427',
  },
  buttonText: {
    textAlign: 'center',
    color: '#F4D58D',
    fontFamily: 'AndadaPro',
  },
  buttonContainer: {
    width: '90%',
    margin: 'auto',
    marginBottom: '30%',
  },
  text1: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 24,
    fontFamily: 'Marcellus',
  },
  text2: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 20,
    fontFamily: 'Marcellus',
  },
  contentContainer: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    minHeight: '100%',
  },
  sheetContainer: {
    flex: 1,
    backgroundColor: '#DBEEEC',
  },
  backgroundContainer: {
    paddingTop: '30%',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  header: {
    fontFamily: 'Marcellus',
    fontSize: 32,
    textAlign: 'center',
  },
  sheet: {
    zIndex: 1,
  },
});

export default Index;
