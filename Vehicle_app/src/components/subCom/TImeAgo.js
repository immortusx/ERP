import React from 'react';
import { Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    dayText: {
        top: -9,
        right: -6,
        color: '#A93226',
        fontSize: 12,
        fontWeight: 'bold',
      },
});

const TimeAgo = ({ date }) => {
  const timeDifference = new Date() - new Date(date);
  const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

  let timeAgoText = '';
  if (hoursDifference < 1) {
    timeAgoText = 'Just now';
  } else if (hoursDifference === 1) {
    timeAgoText = '1 hour ago';
  } else if (hoursDifference < 24) {
    timeAgoText = `${hoursDifference} hours ago`;
  } else {
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    timeAgoText = `${daysDifference} days ago`;
  }

  return <Text style={styles.dayText}>{timeAgoText}</Text>;
};

export default TimeAgo;
