import forge from 'node-forge';

export const generateKey = async () => {
  return new Promise(function(resolve) {
    const key = forge.random.getBytesSync(16);
    const iv = forge.random.getBytesSync(8);

    resolve({ key, iv });
  });
}

export const encrypt = async (data, key, iv) => {
  return new Promise(function(resolve) {
    const cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({ iv });
    cipher.update(forge.util.createBuffer(data, 'binary'));
    cipher.finish();

    const encrypted = cipher.output;

    resolve(encrypted);
  });
}

export const decrypt = async (data, key, iv) => {
  return new Promise(function(resolve) {
    var decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({ iv });
    decipher.update(forge.util.createBuffer(data));
    decipher.finish();

    const decrypted = decipher.output;

    resolve(decrypted);
  });
}

module.exports = {
  generateKey,
  encrypt,
  decrypt
};