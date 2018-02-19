import forge from 'node-forge';
import { SecureStore } from 'expo';

const STORE_KEY = 'com.mycoralhealth.mycoral-patient';
const PRIVATE_KEY_TAG = 'privateKey';
const PUBLIC_KEY_TAG = 'publicKey';
const KEYS_MARKER_TAG = 'keyPairMarker';

const testKeys = () => {
  SecureStore.getItemAsync(`${STORE_KEY}.${PUBLIC_KEY_TAG}`)
    .then((publicKeyPEM) => {
      const publicKey = forge.pki.publicKeyFromPem(publicKeyPEM);
      const encrypted = publicKey.encrypt('This is a test');
      console.log('Encrypted text: ', encrypted);

      SecureStore.getItemAsync(`${STORE_KEY}.${PRIVATE_KEY_TAG}`)
        .then((privateKeyPEM) => {
          const privateKey = forge.pki.privateKeyFromPem(privateKeyPEM);
          const decrypted = privateKey.decrypt(encrypted);

          console.log('Decrypted text: ', decrypted);
        }).catch( (e) => { console.log( `Could not get private key in store (${e})` ) });

    }).catch( (e) => { console.log( `Could not get public key in store (${e})` ) });
}

const makeKeys = (callback) => {
  forge.pki.rsa.generateKeyPair({bits: 2048, workers: -1}, function(err, keypair) {
    console.log(forge.pki.publicKeyToRSAPublicKeyPem(keypair.publicKey, 72));
    console.log(forge.pki.privateKeyToPem(keypair.privateKey, 72));
    
    SecureStore.setItemAsync(`${STORE_KEY}.${PUBLIC_KEY_TAG}`, forge.pki.publicKeyToRSAPublicKeyPem(keypair.publicKey, 72))
      .then( () => { 
        SecureStore.setItemAsync(`${STORE_KEY}.${PRIVATE_KEY_TAG}`, forge.pki.privateKeyToPem(keypair.privateKey, 72))
          .then( () => { 
              SecureStore.setItemAsync(`${STORE_KEY}.${KEYS_MARKER_TAG}`, 'true')
                .then(() => {
                  testKeys();
                  // TODO: make the callback here letting us know the keys are in the store
                  if (callback) {
                    callback();
                  }
                }).catch( (e) => { console.log( `Could not save key marker in store (${e})` ) });
          }).catch( (e) => { console.log( `Could not save private key in store (${e})` ) });
        }).catch( (e) => { console.log( `Could not save public key in store (${e})` ) });
  });
}

export const generateKeyPair = (callback) => {
  SecureStore.getItemAsync(`${STORE_KEY}.${KEYS_MARKER_TAG}`)
    .then((marker) => {
      if (marker === 'true') {
        testKeys();        
      } else {
        makeKeys(callback);
      }
    }).catch( (e) => { console.log( `Error getting marker from store (${e})` ) });
}

export const keysExist = (callback) => {
  SecureStore.getItemAsync(`${STORE_KEY}.${KEYS_MARKER_TAG}`)
    .then((marker) => {
      callback(marker);
    }).catch( (e) => { console.log( `Error getting marker from store (${e})` ) });
}
