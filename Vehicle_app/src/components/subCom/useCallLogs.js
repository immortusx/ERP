import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLogs, setPermissionStatus } from '../../redux/slice/callLogsSlice';
import { PermissionsAndroid } from 'react-native';
import CallLogs from 'react-native-call-log'
const useCallLogs = () => {
    const dispatch = useDispatch();

    const loadCallLogs = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
                {
                    title: 'Call Log Example',
                    message: 'Access your call logs',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            console.log('Permission status:', granted);

            dispatch(setPermissionStatus(granted)); // Update permission status in Redux state

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                CallLogs.load(1)
                    .then((callLogs) => {
                        dispatch(setLogs(callLogs)); // Update the call logs in the Redux state
                    })
                    .catch((error) => {
                        console.log('Error loading call logs:', error);
                    });
            } else {
                // Permission denied, handle accordingly
                console.log('Call Log permission denied');
            }
        } catch (e) {
            console.log(e);
        }
    };

    return { loadCallLogs };
};

export default useCallLogs;
