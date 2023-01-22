import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Text, View, ScrollView, Alert } from "react-native";
import { HabitDay, daySize } from "../components/HabitDay";
import { Header } from "../components/Header";
import { generateRangeDatesFromYearStart } from "../utils/generate-range-between-dates";
import { api } from "../lib/axios";
import { useCallback, useState } from "react";
import { Loading } from "../components/Loading";
import dayjs from "dayjs";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const datesFromYearStart = generateRangeDatesFromYearStart();
const minimumSummaryDatesSizes = 18 * 7;
const amountOfDaysToFill = minimumSummaryDatesSizes - datesFromYearStart.length;

type SummaryType = {
  id: string;
  date: string;
  amount: number;
  completed: number;
}[];

export function Home() {
  const { navigate } = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryType | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/summary");
      setSummary(response.data);
    } catch (error) {
      Alert.alert("Ops", "Não foi possível carregar o sumário de hábitos");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <View className="flex-row mt-6 mb-2">
        {weekDays.map((weekDay, i) => (
          <Text
            key={`${weekDay}-${i}`}
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            style={{ width: daySize }}
          >
            {weekDay}
          </Text>
        ))}
      </View>

      {!isLoading ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {summary && (
            <View className="flex-row flex-wrap">
              {datesFromYearStart.map((date) => {
                const dayWithHabits = summary.find((day) => {
                  return dayjs(date).isSame(day.date, "day");
                });

                return (
                  <HabitDay
                    key={date.toISOString()}
                    date={date}
                    amountOfHabits={dayWithHabits?.amount}
                    amountCompleted={dayWithHabits?.completed}
                    onPress={() =>
                      navigate("habit", { date: date.toISOString() })
                    }
                  />
                );
              })}

              {amountOfDaysToFill > 0 &&
                Array.from({ length: amountOfDaysToFill }).map((_, i) => (
                  <View
                    key={i}
                    className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                    style={{ width: daySize, height: daySize }}
                  />
                ))}
            </View>
          )}
        </ScrollView>
      ) : (
        <Loading />
      )}
    </View>
  );
}
