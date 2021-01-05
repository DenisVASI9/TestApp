import React, {useEffect} from 'react';
import {PermissionsAndroid, Platform, Text} from 'react-native';
// @ts-ignore
import {launchImageLibrary} from 'react-native-image-picker';

const testPermissions = async () => {
  if (Platform.OS === 'android') {
    const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    const hasPermission = await PermissionsAndroid.check(permission);
    console.log('@has', hasPermission);
    if (!hasPermission) {
      const status = await PermissionsAndroid.request(permission);
      console.log('@status', status);
    }
  }
};

interface PickerPhoto {
  uri: string;
  fileName: string;
  type: string;
}

const fetchCircles = async (photo: PickerPhoto) => {
  const data = new FormData();
  data.append('image', {
    name: photo.fileName,
    type: photo.type,
    uri:
      Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
  });
  data.append('image', 'true');

  await fetch('https://ai-tonometry.com/api/v1/circles/', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data; charset=utf-8',
    },
    body: data,
  })
    .then((res) => res.json())
    .then((res) => console.log(res));
};

const App = () => {
  useEffect(() => {
    testPermissions().then(async () => {
      launchImageLibrary(
        {
          mediaType: 'photo',
          storageOptions: {
            skipBackup: true,
          },
        },
        async (photo: PickerPhoto) => {
          await fetchCircles(photo);
        },
      );
    });
  }, []);
  return <Text> hello world</Text>;
};

export default App;
