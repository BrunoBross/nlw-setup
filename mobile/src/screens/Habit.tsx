import { Alert, ScrollView, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { BackButton } from "../components/BackButton";
import dayjs from "dayjs";
import { ProgressBar } from "../components/ProgressBar";
import { CheckBox } from "../components/CheckBox";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";
import { HabitsEmpty } from "../components/HabitsEmpty";
import clsx from "clsx";

interface Params {
  date: string;
}

interface DayInfoInterface {
  possibleHabits: {
    id: string;
    title: string;
    created_at: Date;
  }[];
  completedHabits: string[];
}

export function Habit() {
  const route = useRoute();
  const { date } = route.params as Params;
  const [isLoading, setIsLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfoInterface | null>(null);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  const parsedDate = dayjs(date);
  const isDateInPast = parsedDate.endOf("day").isBefore(new Date());
  const daysOfWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("DD/MM");

  const habitsProgress = dayInfo?.possibleHabits.length
    ? generateProgressPercentage(
        dayInfo.possibleHabits.length,
        completedHabits.length
      )
    : 0;

  const fetchHabits = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/day", {
        params: {
          date,
        },
      });
      setDayInfo(response.data);
      setCompletedHabits(response.data.completedHabits);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Ops",
        "Não foi possível carregar as informações dos hábitos"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleHabit = async (habitId: string) => {
    try {
      await api.patch(`/habits/${habitId}/toggle`);
      if (completedHabits.includes(habitId)) {
        setCompletedHabits((prevState) =>
          prevState.filter((habit) => habit !== habitId)
        );
      } else {
        setCompletedHabits((prevState) => [...prevState, habitId]);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Ops", "Não foi possível atualizar o status do hábito");
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {daysOfWeek}
        </Text>
        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View
          className={clsx("mt-6", {
            ["opacity-50"]: isDateInPast,
          })}
        >
          {dayInfo?.possibleHabits ? (
            dayInfo.possibleHabits.map((habit) => {
              return (
                <CheckBox
                  key={habit.id}
                  title={habit.title}
                  checked={completedHabits.includes(habit.id)}
                  onPress={() => handleToggleHabit(habit.id)}
                  disabled={isDateInPast}
                />
              );
            })
          ) : (
            <HabitsEmpty />
          )}
        </View>

        {isDateInPast && (
          <Text className="text-white mt-10 text-center">
            Você não pode editar hábitos passados.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
