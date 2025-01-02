// ModeSelector.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ChipIcon from '../../components/ChipIcon';

const ModeSelector = ({ selectedMode, handleModeChange, allEta }) => {
    return (
        <View style={styles.modeContainer}>
            <ChipIcon
                onPress={() => handleModeChange('driving')}
                iconName="car-outline"
                label={allEta.driving}
                iconSize={18}
                active={selectedMode === 'driving'}
            />
            <ChipIcon
                onPress={() => handleModeChange('transit')}
                iconName="train"
                label={allEta.transit}
                iconSize={17}
                active={selectedMode === 'transit'}
            />
            <ChipIcon
                onPress={() => handleModeChange('walking')}
                iconName="walk"
                label={allEta.walking}
                iconSize={18}
                active={selectedMode === 'walking'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    modeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
    },
});

export default ModeSelector;