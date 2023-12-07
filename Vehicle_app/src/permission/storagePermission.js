import { Platform } from 'react-native';
import * as Permissions from 'react-native-permissions';

const requestStoragePermission = async () => {
  const storagePermission = Platform.OS === 'android'
    ? [
        Permissions.READ_EXTERNAL_STORAGE,
        Permissions.WRITE_EXTERNAL_STORAGE,
      ]
    : [Permissions.PHOTO_LIBRARY];

  const permissionStatus = await Permissions.requestMultiple(storagePermission);

  const isPermissionGranted = Platform.OS === 'android'
    ? (
        permissionStatus.android &&
        permissionStatus.android[Permissions.READ_EXTERNAL_STORAGE] === 'granted' &&
        permissionStatus.android[Permissions.WRITE_EXTERNAL_STORAGE] === 'granted'
      )
    : (
        permissionStatus && permissionStatus[Permissions.PHOTO_LIBRARY] === 'granted'
      );

  if (isPermissionGranted) {
    console.log('Storage permission granted');
    // Add your logic here after the permission is granted
    return true;
  } else {
    console.log('Storage permission denied');
    // Handle the case where permission is denied
    return false;
  }
};

export { requestStoragePermission };
