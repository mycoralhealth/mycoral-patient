import forge from 'node-forge';
import FlakeIdGen from 'flakeid';
import { FileSystem } from 'expo';
import { getIPFSProvider, getUserInfo } from './store';
import { CORALD_API } from '../const';

const CORALD_IPFS_PROXY=CORALD_API+'/ipfs/';
const ROOT_API_URL='/api/v0/';
const ADD_API='add';
const CAT_API='cat';

const IdGenerator = new FlakeIdGen();

const ipfsRootURL = async () => {
  let ipfsConfig = await getIPFSProvider();

  if (ipfsConfig.useCustom) {
    return `${ipfsConfig.protocol}://${ipfsConfig.address}:${ipfsConfig.port}${ROOT_API_URL}`;
  }

  return CORALD_IPFS_PROXY;
}

const isURI = (data) => {
  return data && data.startsWith('file://');
}

const tempRandomName = () => {
  let md = forge.md.sha256.create();
  md.start();
  md.update(IdGenerator.gen());

  return md.digest().toHex();
}

const add = async (data) => {
  if (typeof data !== 'string')
    return null;

  let p = new Promise(function(resolve, reject) {
    if (isURI(data)) {
      uploadFileAsync(data)
        .then((response) => {
            if (response.status === 401) {
              return { unauthorized: true };
            }
            return response.json();
          })
          .then((responseJson) => {
            resolve(responseJson);
        }).catch((e) => reject(`Error saving URI to IPFS (${e})`));
    } else {
      let uri = `${FileSystem.documentDirectory}${tempRandomName()}.txt`;

      Expo.FileSystem.writeAsStringAsync(uri, data)
        .then(() => {
          uploadFileAsync(uri)
            .then((response) => {
                if (response.status === 401) {
                  return { unauthorized: true };
                }
                return response.json();
              })
              .then((responseJson) => {
                Expo.FileSystem.deleteAsync(uri, { idempotent: true });
                resolve(responseJson);
            }).catch((e) => reject(`Error saving data to IPFS (${e})`));
        }).catch((e) => reject(`Error saving temporary file (${e})`));
    }
  });

  return p;
}

async function uploadFileAsync(uri) {
  let apiUrl = `${await ipfsRootURL()}${ADD_API}`;
  let ipfsConfig = await getIPFSProvider();
  let userInfo = await getUserInfo();

  let uriParts = uri.split('/');
  let name = uriParts[uriParts.length - 1];

  let formData = new FormData();
  formData.append('file', { uri, name, type: 'text/plain' });

  let headers = {
    'Accept': 'application/json'
  };

  if (!ipfsConfig.useCustom) {
    headers['X-MyCoral-AccessToken'] = userInfo.accessToken;
  } else if (ipfsConfig.userName && ipfsConfig.password) {
    headers['Authorization'] = `Basic ${forge.util.encode64(ipfsConfig.userName + ':' + ipfsConfig.password)}`;
  }

  let options = {
    method: 'POST',
    body: formData,
    headers
  };

  return fetch(apiUrl, options);
}

const cat = async (hash) => {
  if (typeof hash !== 'string') {
    console.log("No hash given: " + hash);
    return null;
  }

  let ipfsConfig = await getIPFSProvider();
  let userInfo = await getUserInfo();

  let options = {};
  if (!ipfsConfig.useCustom) {
    options = {
      'headers' : {
        'X-MyCoral-AccessToken' : userInfo.accessToken
      }
    }
  } else if (ipfsConfig.userName && ipfsConfig.password) {
    options = {
      'headers' : {
        'Authorization' : `Basic ${forge.util.encode64(ipfsConfig.userName + ':' + ipfsConfig.password)}`
      }
    }
  }

  let apiUrl = `${await ipfsRootURL()}${CAT_API}/${hash}`;
  let p = new Promise(async function(resolve, reject) {
    const downloadResumable = FileSystem.createDownloadResumable(
      apiUrl,
      `${FileSystem.documentDirectory}${tempRandomName()}`,
      options
    );

    downloadResumable.downloadAsync()
      .then((response) => {
        if (response.status === 401) {
          resolve ({ unauthorized: true })
        }
        resolve({ uri: response.uri });
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