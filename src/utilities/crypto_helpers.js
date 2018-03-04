import { FileSystem } from 'expo';
import symmetricEncryption from './symmetric_enc';
import { encryptPKI, decryptPKI } from './pki';
import forge from 'node-forge';
import ipfs from './expo-ipfs';

const getFileType = (uri) => {
  let uriParts = uri.split('.');
  let fileType = uriParts[uriParts.length - 1];

  return fileType;
}

const encryptFile = async (data, metadata) => {
  let symKeyInfo = await symmetricEncryption.generateKey();

  let encryptedOutput = await symmetricEncryption.encrypt(data, symKeyInfo.key, symKeyInfo.iv);
  
  let encryptedUri = `${FileSystem.documentDirectory}${ipfs.tempRandomName()}.encrypted`;

  await FileSystem.writeAsStringAsync(encryptedUri, forge.util.encode64(encryptedOutput.bytes()));

  let encryptedMetaOutput = await symmetricEncryption.encrypt(JSON.stringify(metadata), symKeyInfo.key, symKeyInfo.iv);

  let encryptedKey = await encryptPKI(symKeyInfo.key);
  let encryptedIv = await encryptPKI(symKeyInfo.iv);

  return { 
    uri: encryptedUri, 
    encryptedMetadata: forge.util.encode64(encryptedMetaOutput.bytes()),
    encryptedKey: forge.util.encode64(encryptedKey), 
    encryptedIv: forge.util.encode64(encryptedIv) };
}

const decryptMetadata = async (encryptedMetadata, encryptedKey, encryptedIv) => {
  let key = await decryptPKI(forge.util.decode64(encryptedKey));
  let iv = await decryptPKI(forge.util.decode64(encryptedIv));

  let metadataOutput = await symmetricEncryption.decrypt(forge.util.decode64(encryptedMetadata), key, iv);
  let metadata = JSON.parse(metadataOutput.bytes());

  return { metadata };
}

const decryptFile = async (uri, encryptedKey, encryptedIv) => {
  let key = await decryptPKI(forge.util.decode64(encryptedKey));
  let iv = await decryptPKI(forge.util.decode64(encryptedIv));

  let encryptedData = await FileSystem.readAsStringAsync(uri);

  let data = await symmetricEncryption.decrypt(forge.util.decode64(encryptedData), key, iv);

  let decryptedUri = uri + '.decrypted';

  await FileSystem.writeAsStringAsync(decryptedUri, data.toString());

  return { decryptedUri };
}

module.exports = {
  encryptFile,
  decryptFile,
  decryptMetadata
}