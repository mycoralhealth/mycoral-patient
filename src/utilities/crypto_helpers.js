import { FileSystem } from 'expo';
import symmetricEncryption from './symmetric_enc';
import { encryptPKI, decryptPKI } from './pki';
import forge from 'node-forge';

const getFileType = (uri) => {
  let uriParts = uri.split('.');
  let fileType = uriParts[uriParts.length - 1];

  return fileType;
}

const encryptFile = async (uri, data) => {
  let symKeyInfo = await symmetricEncryption.generateKey();

  let fileType = getFileType(uri);

  let encryptedOutput = await symmetricEncryption.encrypt(data, symKeyInfo.key, symKeyInfo.iv);
  
  let encryptedUri = uri + '.encrypted.' + fileType;

  await FileSystem.writeAsStringAsync(encryptedUri, forge.util.encode64(encryptedOutput.bytes()));

  let encryptedKey = await encryptPKI(symKeyInfo.key);
  let encryptedIv = await encryptPKI(symKeyInfo.iv);

  return { uri: encryptedUri, encryptedKey: encryptedKey, encryptedIv: encryptedIv };
}

const decryptFile = async (uri, encryptedKey, encryptedIv) => {
  let key = await decryptPKI(encryptedKey);
  let iv = await decryptPKI(encryptedIv);

  let encryptedData = await FileSystem.readAsStringAsync(uri);

  let data = await symmetricEncryption.decrypt(forge.util.decode64(encryptedData), key, iv);

  let fileType = getFileType(uri);

  let decryptedUri = uri + '.decrypted.' + fileType;

  await FileSystem.writeAsStringAsync(decryptedUri, data.toString());

  return { decryptedUri };
}

module.exports = {
  encryptFile,
  decryptFile
}