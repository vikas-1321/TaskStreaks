import { View, Text, StyleSheet } from 'react-native';

export function SpiralHeader() {
  return (
    <View style={spiralStyles.container} pointerEvents="none">
      {Array.from({ length: 9 }).map((_, i) => (
        <View key={i} style={spiralStyles.ringUnit}>
          <View style={spiralStyles.wire} />
          <View style={spiralStyles.hole} />
        </View>
      ))}
    </View>
  );
}

export function WashiTape({ style, angle = -3, color = 'rgba(254, 240, 138, 0.75)', width = 65, height = 18 }) {
  return (
    <View
      style={[
        tapeStyles.tape,
        {
          width,
          height,
          backgroundColor: color,
          transform: [{ rotate: `${angle}deg` }],
        },
        style,
      ]}
      pointerEvents="none"
    >
      <View style={tapeStyles.leftEdge} />
      <View style={tapeStyles.rightEdge} />
    </View>
  );
}

export function PushPin({ color = '#ef4444' }) {
  return (
    <View style={pinStyles.container} pointerEvents="none">
      <View style={[pinStyles.pinHead, { backgroundColor: color }]}>
        <View style={pinStyles.pinGlint} />
      </View>
      <View style={pinStyles.pinNeedle} />
    </View>
  );
}

export function MobileTrendChart({ last7Days = [], targetPercent = 75 }) {
  return (
    <View style={chartStyles.container}>
      <View style={chartStyles.headerRow}>
        <View>
          <View style={chartStyles.tag}>
            <Text style={chartStyles.tagText}>WEEKLY SKETCH</Text>
          </View>
          <Text style={chartStyles.title}>7-Day Consistency</Text>
        </View>
        <Text style={chartStyles.targetLegend}>--- Target {targetPercent}%</Text>
      </View>

      {/* Target Guide Line */}
      <View style={chartStyles.chartArea}>
        <View style={[chartStyles.targetLine, { bottom: `${Math.min(95, targetPercent)}%` }]} />
        <View style={chartStyles.gridLineMiddle} />

        {/* 7 Columns / Bars representing the last 7 days */}
        <View style={chartStyles.barsRow}>
          {last7Days.map((day) => {
            const isMet = day.rate >= targetPercent;
            const barHeight = Math.max(8, (day.rate / 100) * 80);

            return (
              <View key={day.key} style={chartStyles.dayCol}>
                <View style={chartStyles.barWrapper}>
                  <View
                    style={[
                      chartStyles.bar,
                      {
                        height: barHeight,
                        backgroundColor: isMet ? '#16a34a' : day.total > 0 ? '#3b82f6' : '#e2e8f0',
                      },
                    ]}
                  >
                    {/* Sketch Point on top of bar */}
                    <View
                      style={[
                        chartStyles.barPoint,
                        {
                          backgroundColor: isMet ? '#22c55e' : day.total > 0 ? '#60a5fa' : '#cbd5e1',
                        },
                      ]}
                    />
                  </View>
                </View>
                <Text style={[chartStyles.dayName, day.isToday && chartStyles.todayDayName]}>
                  {day.dayName}
                </Text>
                <Text
                  style={[
                    chartStyles.rateBadge,
                    {
                      backgroundColor: isMet ? '#dcfce7' : day.total > 0 ? '#fef3c7' : '#f1f5f9',
                      color: isMet ? '#15803d' : day.total > 0 ? '#b45309' : '#64748b',
                    },
                  ]}
                >
                  {day.rate}%
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const spiralStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: -10,
    zIndex: 10,
  },
  ringUnit: {
    alignItems: 'center',
  },
  wire: {
    width: 10,
    height: 20,
    backgroundColor: '#64748b',
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#1e293b',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
    transform: [{ rotate: '-3deg' }],
  },
  hole: {
    width: 8,
    height: 7,
    backgroundColor: '#334155',
    borderRadius: 4,
    marginTop: -3,
  },
});

const tapeStyles = StyleSheet.create({
  tape: {
    position: 'absolute',
    borderWidth: 0.8,
    borderColor: 'rgba(0,0,0,0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 5,
  },
  leftEdge: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
    borderRightWidth: 1.5,
    borderRightColor: 'rgba(0,0,0,0.2)',
    borderStyle: 'dashed',
  },
  rightEdge: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 2,
    borderLeftWidth: 1.5,
    borderLeftColor: 'rgba(0,0,0,0.2)',
    borderStyle: 'dashed',
  },
});

const pinStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 8,
  },
  pinHead: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinGlint: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
    opacity: 0.7,
    alignSelf: 'flex-start',
    marginLeft: 2,
  },
  pinNeedle: {
    width: 2,
    height: 7,
    backgroundColor: '#1e293b',
  },
});

const chartStyles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#2b303c',
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    shadowColor: '#222733',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.85,
    shadowRadius: 0,
    elevation: 4,
    transform: [{ rotate: '0.4deg' }],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#fef08a',
    borderWidth: 1.2,
    borderColor: '#2b303c',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#713f12',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#222733',
  },
  targetLegend: {
    fontSize: 10,
    fontWeight: '700',
    color: '#d97706',
  },
  chartArea: {
    height: 110,
    position: 'relative',
    justifyContent: 'flex-end',
    paddingTop: 8,
  },
  targetLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderBottomWidth: 1.5,
    borderBottomColor: '#f59e0b',
    borderStyle: 'dashed',
    zIndex: 2,
  },
  gridLineMiddle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    borderStyle: 'dashed',
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 85,
  },
  dayCol: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    height: 80,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  bar: {
    width: 14,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#1e293b',
    alignItems: 'center',
  },
  barPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
  dayName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 4,
  },
  todayDayName: {
    color: '#2563eb',
    fontWeight: '800',
  },
  rateBadge: {
    fontSize: 8,
    fontWeight: '800',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: 2,
  },
});
