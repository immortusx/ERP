useEffect(() => {
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        // Do any other initialization logic here
      } else {
        console.log('Camera permission denied');
        // You may want to display a user-friendly message here
        ToastAndroid.showWithGravityAndOffset(
          'Camera permission is required to use the camera.',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      }
    } catch (err) {
      console.warn('Error while requesting camera permission:', err);
      // Handle the error in a way that makes sense for your application
    }
  };

  // Call the permission request function when the component mounts
  requestCameraPermission();
}, []);