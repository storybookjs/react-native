import { FC, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { ChevronIcon, SettingsIcon } from '../icons';
import { colors } from '../theme/colors';
import type { ConnectionStatus } from '../types';

interface ConnectionPanelProps {
  host: string;
  port: string;
  status: ConnectionStatus;
  statusColor: string;
  pulseAnim: Animated.Value;
  isExpanded: boolean;
  errorMessage: string | null;
  onHostChange: (value: string) => void;
  onPortChange: (value: string) => void;
  onToggleExpanded: () => void;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const ConnectionPanel: FC<ConnectionPanelProps> = ({
  host,
  port,
  status,
  statusColor,
  pulseAnim,
  isExpanded,
  errorMessage,
  onHostChange,
  onPortChange,
  onToggleExpanded,
  onConnect,
  onDisconnect,
}) => {
  const [headerHovered, setHeaderHovered] = useState(false);
  const [hostFocused, setHostFocused] = useState(false);
  const [portFocused, setPortFocused] = useState(false);
  const [connectHovered, setConnectHovered] = useState(false);
  const [disconnectHovered, setDisconnectHovered] = useState(false);

  return (
    <View style={styles.connectionSection}>
      <Pressable
        onHoverIn={() => setHeaderHovered(true)}
        onHoverOut={() => setHeaderHovered(false)}
        style={[styles.connectionHeader, headerHovered && styles.connectionHeaderHover]}
        onPress={onToggleExpanded}
      >
        <ChevronIcon isExpanded={isExpanded} />
        <SettingsIcon color={colors.textMutedColor} />
        <Text style={styles.connectionHeaderText}>Connection</Text>
        <Text style={styles.connectionStatus}>
          {status === 'connected' ? `${host}:${port}` : status}
        </Text>
      </Pressable>

      {isExpanded && (
        <View style={styles.connectionContent}>
          <View style={styles.connectionRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Host</Text>
              <View style={[styles.inputWrapper, hostFocused && styles.inputWrapperFocused]}>
                <TextInput
                  style={[styles.input, { outlineStyle: 'none' } as any]}
                  value={host}
                  onChangeText={onHostChange}
                  onFocus={() => setHostFocused(true)}
                  onBlur={() => setHostFocused(false)}
                  placeholder="localhost"
                  placeholderTextColor={colors.textMutedColor}
                  editable={status === 'disconnected'}
                />
              </View>
            </View>
            <View style={styles.inputGroupSmall}>
              <Text style={styles.inputLabel}>Port</Text>
              <View style={[styles.inputWrapper, portFocused && styles.inputWrapperFocused]}>
                <TextInput
                  style={[styles.input, { outlineStyle: 'none' } as any]}
                  value={port}
                  onChangeText={onPortChange}
                  onFocus={() => setPortFocused(true)}
                  onBlur={() => setPortFocused(false)}
                  placeholder="7007"
                  placeholderTextColor={colors.textMutedColor}
                  keyboardType="numeric"
                  editable={status === 'disconnected'}
                />
              </View>
            </View>
          </View>

          <View style={styles.statusRow}>
            <View style={styles.statusIndicator}>
              <Animated.View
                style={[styles.statusDot, { backgroundColor: statusColor, opacity: pulseAnim }]}
              />
              <Text style={styles.statusText}>
                {status === 'connected'
                  ? 'Connected'
                  : status === 'connecting'
                    ? 'Connecting...'
                    : status === 'error'
                      ? 'Error'
                      : 'Disconnected'}
              </Text>
            </View>

            {status === 'disconnected' || status === 'error' ? (
              <Pressable
                onHoverIn={() => setConnectHovered(true)}
                onHoverOut={() => setConnectHovered(false)}
                style={[styles.connectButton, connectHovered && styles.connectButtonHover]}
                onPress={onConnect}
              >
                <Text style={styles.connectButtonText}>Connect</Text>
              </Pressable>
            ) : status === 'connecting' ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Pressable
                onHoverIn={() => setDisconnectHovered(true)}
                onHoverOut={() => setDisconnectHovered(false)}
                style={[styles.disconnectButton, disconnectHovered && styles.disconnectButtonHover]}
                onPress={onDisconnect}
              >
                <Text style={styles.disconnectButtonText}>Disconnect</Text>
              </Pressable>
            )}
          </View>

          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  connectionSection: {
    backgroundColor: colors.appContentBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  connectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  connectionHeaderHover: {
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  connectionHeaderText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textColor,
    flex: 1,
  },
  connectionStatus: {
    fontSize: 12,
    color: colors.textMutedColor,
  },
  connectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 4,
  },
  connectionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputGroupSmall: {
    width: 80,
  },
  inputLabel: {
    fontSize: 11,
    color: colors.textMutedColor,
    marginBottom: 4,
    fontWeight: '500',
  },
  inputWrapper: {
    backgroundColor: colors.appBg,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  } as any,
  inputWrapperFocused: {
    borderColor: colors.secondary,
    boxShadow: `0 0 0 1px ${colors.secondary}`,
  } as any,
  input: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: colors.textColor,
    fontSize: 13,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    color: colors.textMutedColor,
  },
  connectButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  connectButtonHover: {
    backgroundColor: '#E8316E',
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  disconnectButton: {
    backgroundColor: colors.appBg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  disconnectButtonHover: {
    backgroundColor: colors.barBg,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  disconnectButtonText: {
    color: colors.textMutedColor,
    fontWeight: '600',
    fontSize: 13,
  },
  errorText: {
    color: colors.negative,
    fontSize: 12,
    marginTop: 8,
  },
});
