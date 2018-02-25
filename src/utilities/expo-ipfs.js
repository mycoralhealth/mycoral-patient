import forge from 'node-forge';
import { FileSystem } from 'expo';
import { getIPFSProvider } from './store';

const ROOT_API_URL='/api/v0/';
const ADD_API='add';
const CAT_API='cat';

const ipfsRootURL = () => {
  let ipfsConfig = getIPFSProvider();
  return `${ipfsConfig.protocol}://${ipfsConfig.address}:${ipfsConfig.port}${ROOT_API_URL}`;
}

const isURI = (data) => {
  return data && data.startsWith('file://');
}

const tempRandomName = () => {
  let md = forge.md.sha256.create();      
  md.update(new Date());

  return md.digest().toHex();
}

const add = (data) => {
  if (typeof data !== 'string')
    return null;

  let p = new Promise(function(resolve, reject) {
    if (isURI(data)) {
      uploadFileAsync(uri)
        .then((response) => response.json())
          .then((responseJson) => {
            resolve(responseJson.Hash);
        }).catch((e) => reject(`Error saving URI to IPFS (${e})`)); 
    } else {
      let uri = `${FileSystem.documentDirectory}${tempRandomName()}.txt`;

      Expo.FileSystem.writeAsStringAsync(uri, data)
        .then(() => {
          console.log('Finished saving to file:', uri);
          uploadFileAsync(uri)
            .then((response) => response.json())
              .then((responseJson) => {
                Expo.FileSystem.deleteAsync(uri, { idempotent: true });
                resolve(responseJson.Hash);
            }).catch((e) => reject(`Error saving data to IPFS (${e})`)); 
        }).catch((e) => reject(`Error saving temporary file (${e})`));
    }
  });

  return p;
}

function uploadFileAsync(uri) {
  let apiUrl = `${ipfsRootURL()}${ADD_API}`;

  let uriParts = uri.split('/');
  let name = uriParts[uriParts.length - 1];

  let formData = new FormData();
  formData.append('file', { uri, name });

  console.log(formData);

  let options = {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
    },
  };

  return fetch(apiUrl, options);
}

const cat = (hash) => {
  if (typeof hash !== 'string')
    return null;

  let p = new Promise(function(resolve, reject) {
    FileSystem.downloadAsync(
      `${ipfsRootURL()}${CAT_API}/${hash}`,
      `${FileSystem.documentDirectory}${tempRandomName()}`
    )
    .then(({ uri }) => {
      resolve(uri);
    })
    .catch((e) => reject(`Error downloading file from IPFS (${e})`));
  });

  return p;
}


module.exports = {
  add,
  cat
};