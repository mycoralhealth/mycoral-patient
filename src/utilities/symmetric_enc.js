import forge from 'node-forge';

export const generateSymmetricKey = () => {
  const key = forge.random.getBytesSync(16);
  const iv = forge.random.getBytesSync(8);

  return { key, iv };
}

export const encryptSymmetric = (data, key, iv) => {
  const cipher = forge.cipher.createCipher('AES-CBC', key);
  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(data, 'binary'));
  cipher.finish();

  const encrypted = cipher.output;

  console.log(encrypted.toHex());

  return encrypted;
}

export const decryptSymmetric = (data, key, iv) => {
  var decipher = forge.cipher.createDecipher('AES-CBC', key);
  decipher.start({ iv });
  decipher.update(data);
  decipher.finish();

  const decrypted = decrypted.output;

  console.log(decrypted.toHex());

  return decrypted;
}