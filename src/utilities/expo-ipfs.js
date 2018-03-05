import forge from 'node-forge';
import { FileSystem } from 'expo';
import { getIPFSProvider } from './store';

const ROOT_API_URL='/api/v0/';
const ADD_API='add';
const CAT_API='cat';

const ipfsRootURL = async () => {
  let ipfsConfig = await getIPFSProvider();
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

const add = async (data) => {
  if (typeof data !== 'string')
    return null;

  let p = new Promise(function(resolve, reject) {
    if (isURI(data)) {
      uploadFileAsync(data)
        .then((response) => response.json())
          .then((responseJson) => {
            resolve(responseJson.Hash);
        }).catch((e) => reject(`Error saving URI to IPFS (${e})`)); 
    } else {
      let uri = `${FileSystem.documentDirectory}${tempRandomName()}.txt`;

      Expo.FileSystem.writeAsStringAsync(uri, data)
        .then(() => {
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

async function uploadFileAsync(uri) {
  let apiUrl = `${await ipfsRootURL()}${ADD_API}`;
  let ipfsConfig = await getIPFSProvider();

  let uriParts = uri.split('/');
  let name = uriParts[uriParts.length - 1];

  let formData = new FormData();
  formData.append('file', { uri, name, type: 'text/plain' });

  let headers = {
    'Accept': 'application/json'
  };

  if (ipfsConfig.userName && ipfsConfig.password) {
    headers['Authorization'] = `Basic ${forge.util.encode64(ipfsConfig.userName + ':' + ipfsConfig.password)}`;
  }

  let options = {
    method: 'POST',
    body: formData,
    headers
  };

  console.log({apiUrl});
  console.log({options});

  return fetch(apiUrl, options);
}

const cat = async (hash) => {
  if (typeof hash !== 'string')
    return null;

  let ipfsConfig = await getIPFSProvider();

  let options = {};

  if (ipfsConfig.userName && ipfsConfig.password) {
    options = {
      'headers' : {
        'Authorization' : `Basic ${forge.util.encode64(ipfsConfig.userName + ':' + ipfsConfig.password)}`
      }
    }
  }

  let p = new Promise(async function(resolve, reject) {
    const downloadResumable = FileSystem.createDownloadResumable(
      `${await ipfsRootURL()}${CAT_API}/${hash}`,
      `${FileSystem.documentDirectory}${tempRandomName()}`,
      options
    );

    downloadResumable.downloadAsync()
      .then(({ uri }) => {
        resolve(uri)
      })
      .catch((e) => reject(`Error downloading file from IPFS (${e})`));
  });

  return p;
}


module.exports = {
  add,
  cat,
  tempRandomName
};