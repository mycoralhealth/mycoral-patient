import forge from 'node-forge';
import { SecureStore } from 'expo';
import { STORE_KEY } from './constants';

const PRIVATE_KEY_TAG = 'privateKey';
const PUBLIC_KEY_TAG = 'publicKey';
const KEYS_MARKER_TAG = 'keyPairMarker';

const makeKeys = () => {
  forge.pki.rsa.generateKeyPair({bits: 2048, workers: -1}, function(err, keypair) {
    //console.log(forge.pki.publicKeyToRSAPublicKeyPem(keypair.publicKey, 72));
    //console.log(forge.pki.privateKeyToPem(keypair.privateKey, 72));
    
    SecureStore.setItemAsync(`${STORE_KEY}.${PUBLIC_KEY_TAG}`, forge.pki.publicKeyToRSAPublicKeyPem(keypair.publicKey, 72))
      .then( () => { 
        SecureStore.setItemAsync(`${STORE_KEY}.${PRIVATE_KEY_TAG}`, forge.pki.privateKeyToPem(keypair.privateKey, 72))
          .then( () => { 
              SecureStore.setItemAsync(`${STORE_KEY}.${KEYS_MARKER_TAG}`, 'true');
          })
        })
      .catch((e) => { console.log( `Could not store keys in store (${e})` ) });
    });
}

export const generateKeyPair = () => {
  let p = new Promise(function(resolve, reject) {
    keysExist().then((result) => {
        if (!result) {
          makeKeys();
        }
        resolve();
      }).catch((e) => reject(`Error getting marker from store (${e})`));
  });

  return p;
}

export const invalidateKeyPair = () => {
  let p = new Promise(function(resolve, reject) {
    SecureStore.deleteItemAsync(`${STORE_KEY}.${KEYS_MARKER_TAG}`)
      .then(() => {
        SecureStore.deleteItemAsync(`${STORE_KEY}.${PRIVATE_KEY_TAG}`)
          .then(() => resolve())
          .catch((e) => reject(`Error removing key from keystore (${e})`)); 
      })
      .catch((e) => reject(`Error removing key from keystore (${e})`)); 
  });

  return p;
}

export const keysExist = () => {
  let p = new Promise(function(resolve, reject) {
    SecureStore.getItemAsync(`${STORE_KEY}.${KEYS_MARKER_TAG}`)
      .then((marker) => {
        resolve(marker && (marker === 'true'));
      }).catch((e) => reject(`Error getting marker from store (${e})`));
  });

  return p;
}

export const encryptPKI = async (data) => {
  let p = new Promise(function(resolve, reject) {
    SecureStore.getItemAsync(`${STORE_KEY}.${PUBLIC_KEY_TAG}`)
      .then((publicKeyPEM) => {
        const publicKey = forge.pki.publicKeyFromPem(publicKeyPEM);
        const encrypted = publicKey.encrypt(data);
        resolve(encrypted);
      }).catch((e) => reject(`Error getting public key from store (${e})`));
  });

  return p;
}

export const decryptPKI = async (data) => {
  let p = new Promise(function(resolve, reject) {
    SecureStore.getItemAsync(`${STORE_KEY}.${PRIVATE_KEY_TAG}`)
      .then((privateKeyPEM) => {
        const privateKey = forge.pki.privateKeyFromPem(privateKeyPEM);
        const decrypted = privateKey.decrypt(data);
        resolve(decrypted);
      }).catch((e) => reject(`Error getting private key from store (${e})`));
  });

  return p;
}