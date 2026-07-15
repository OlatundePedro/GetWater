import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

const WEEKDAYS = ["S", "S", "M", "T", "W", "T", "F"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CalendarPicker({ selectedDate, onSelectDate }) {
  const { colors } = useTheme();
  const [viewDate, setViewDate] = useState(new Date(selectedDate));

  const daysGrid = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startOffset = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < startOffset; i++) {
      const prevMonthDay = new Date(year, month, 1 - (startOffset - i));
      cells.push({ date: prevMonthDay, inMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(year, month, d), inMonth: true });
    }
    while (cells.length % 7 !== 0) {
      const next = new Date(cells[cells.length - 1].date);
      next.setDate(next.getDate() + 1);
      cells.push({ date: next, inMonth: false });
    }
    return cells;
  }, [viewDate]);

  const changeMonth = (delta) => {
    setViewDate(
      new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1),
    );
  };

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  return (
    <View>
      <View style={styles.monthRow}>
        <Text style={[styles.monthLabel, { color: colors.text }]}>
          {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getDate()},{" "}
          {viewDate.getFullYear()}
        </Text>
        <View style={styles.monthArrows}>
          <TouchableOpacity onPress={() => changeMonth(-1)}>
            <Ionicons name="chevron-back" size={18} color={colors.textFaint} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => changeMonth(1)}
            style={{ marginLeft: 16 }}
          >
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textFaint}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAYS.map((day, i) => (
          <Text
            key={i}
            style={[styles.weekdayLabel, { color: colors.textFaint }]}
          >
            {day}
          </Text>
        ))}
      </View>

      {Array.from({ length: daysGrid.length / 7 }).map((_, rowIndex) => (
        <View key={rowIndex} style={styles.weekRow}>
          {daysGrid.slice(rowIndex * 7, rowIndex * 7 + 7).map((cell, i) => {
            const isSelected = isSameDay(cell.date, selectedDate);
            return (
              <TouchableOpacity
                key={i}
                style={styles.dayCell}
                onPress={() => cell.inMonth && onSelectDate(cell.date)}
                disabled={!cell.inMonth}
              >
                <View
                  style={[
                    styles.dayCircle,
                    isSelected && { backgroundColor: colors.primary },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      { color: colors.text },
                      !cell.inMonth && { color: colors.border },
                      isSelected && styles.dayTextSelected,
                    ]}
                  >
                    {cell.date.getDate()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  monthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  monthLabel: {
    fontSize: 12,
    fontFamily: "GoogleSansFlex-SemiBold",
  },
  monthArrows: {
    flexDirection: "row",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 13,
    fontFamily: "GoogleSansFlex-Regular",
  },
  dayCell: {
    flex: 1,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    fontSize: 14,
    fontFamily: "GoogleSansFlex-Regular",
  },
  dayTextSelected: {
    color: "#FFFFFF",
    fontFamily: "GoogleSansFlex-SemiBold",
  },
});
