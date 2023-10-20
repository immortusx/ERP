import React from 'react';
import { Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    dayText: {
        color: '#A93226',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

const DayAgo = ({ date, nextFollowUpDate }) => {
    const timeDifference = new Date(nextFollowUpDate) - new Date(date);
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const hoursDifference = Math.floor(minutesDifference / 60);

    let timeAgoText = '';
    if (minutesDifference <= 5) {
        timeAgoText = 'Just now';
    } else if (minutesDifference <= 60) {
        timeAgoText = `${minutesDifference} minutes ago`;
    } else if (hoursDifference === 1) {
        timeAgoText = '1 hour ago';
    } else if (hoursDifference < 24) {
        timeAgoText = `${hoursDifference} hours ago`;
    } else {
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        timeAgoText = `${daysDifference} days  `;
    }

    return <Text style={styles.dayText}>{timeAgoText}</Text>;
};

export default DayAgo;
