export default function ScheduleWorkout({ route, navigation }) {
  const { workout } = route.params;
  const { user } = useAuth();

  const days = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];

  async function scheduleFor(day) {
    const date = getNextDayOfWeek(day);

    await marthaPostSimple("update-start-date", {
      workout_id: workout.id,
      user_id: user.id,
      new_date: date
    });

    alert("Prévu pour " + day + " (" + date + ")");
    navigation.goBack();
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        Prévoir : {workout.nom}
      </Text>

      {days.map(d => (
        <TouchableOpacity
          key={d}
          onPress={() => scheduleFor(d)}
          style={{ marginTop: 15 }}
        >
          <Text style={{ fontSize: 18 }}>📅 {d}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
