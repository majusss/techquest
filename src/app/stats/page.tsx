import { countStreak, getUserStats } from "@/app/actions/stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BarChart3, Activity, Award, History, Flame } from "lucide-react";

interface TopicProgress {
  name: string;
  progress: number;
  lastActivity: string;
  icon: string;
  color: string;
}

const mockProgress: TopicProgress[] = [
  {
    name: "Algebra",
    progress: 75,
    lastActivity: "2 dni temu",
    icon: "📐",
    color: "blue",
  },
  {
    name: "Geometria",
    progress: 45,
    lastActivity: "5 dni temu",
    icon: "📏",
    color: "green",
  },
  {
    name: "Trygonometria",
    progress: 30,
    lastActivity: "1 tydzień temu",
    icon: "📐",
    color: "purple",
  },
  {
    name: "Funkcje",
    progress: 60,
    lastActivity: "3 dni temu",
    icon: "📈",
    color: "amber",
  },
];

// Mapowanie kolorów na klasy Tailwind
const colorMap: Record<
  string,
  { bg: string; text: string; border: string; bgLight: string }
> = {
  blue: {
    bg: "bg-blue-500",
    text: "text-blue-500",
    border: "border-blue-100",
    bgLight: "bg-blue-50",
  },
  green: {
    bg: "bg-green-500",
    text: "text-green-500",
    border: "border-green-100",
    bgLight: "bg-green-50",
  },
  purple: {
    bg: "bg-purple-500",
    text: "text-purple-500",
    border: "border-purple-100",
    bgLight: "bg-purple-50",
  },
  amber: {
    bg: "bg-amber-500",
    text: "text-amber-500",
    border: "border-amber-100",
    bgLight: "bg-amber-50",
  },
  red: {
    bg: "bg-red-500",
    text: "text-red-500",
    border: "border-red-100",
    bgLight: "bg-red-50",
  },
  gray: {
    bg: "bg-gray-500",
    text: "text-gray-500",
    border: "border-gray-100",
    bgLight: "bg-gray-50",
  },
  indigo: {
    bg: "bg-indigo-500",
    text: "text-indigo-500",
    border: "border-indigo-100",
    bgLight: "bg-indigo-50",
  },
};

export default async function StatsPage() {
  let stats = null;
  let error = null;
  const streak = await countStreak();

  try {
    const userStats = await getUserStats();
    stats = userStats || null;
  } catch (err) {
    console.error("Błąd podczas ładowania statystyk:", err);
    error = "Nie udało się załadować statystyk. Spróbuj ponownie później.";
  }

  if (error || !stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Nie znaleziono statystyk</h2>
          <p className="text-slate-500">
            {error || "Wystąpił problem podczas ładowania Twoich statystyk."}
          </p>
        </div>
      </div>
    );
  }

  // Przygotuj dane statystyk na podstawie danych z bazy
  const statsCards = [
    {
      name: "Rozwiązane zadania",
      value: stats.solved.toString(),
      icon: <Award className="h-6 w-6 text-blue-500" />,
      color: "blue",
    },
    {
      name: "Przerobione tematy",
      value: stats.learned.length.toString(),
      icon: <BarChart3 className="h-6 w-6 text-green-500" />,
      color: "green",
    },
    {
      name: "Dni nauki",
      value: `${streak}`,
      icon: <Flame className="h-6 w-6 text-red-500" />,
      color: "red",
    },
  ];

  const activities =
    stats.lastActivity && stats.lastActivity.length > 0
      ? stats.lastActivity.slice(0, 3).map((activity: any) => ({
          title: activity.text || "Aktywność",
          time: formatTimeAgo(new Date(activity.time)),
          icon: activity.emoji || "📝",
          color: getColorForActivity(activity),
        }))
      : [
          {
            title: "Brak ostatnich aktywności",
            time: "",
            icon: "📝",
            color: "gray",
          },
        ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-md border-t-4 border-t-blue-500">
            <CardHeader className="rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                Twój postęp
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-6">
                {mockProgress.map((topic) => (
                  <div key={topic.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span
                          className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-full",
                            colorMap[topic.color]?.bgLight,
                            colorMap[topic.color]?.text
                          )}
                        >
                          <span className="text-xl">{topic.icon}</span>
                        </span>
                        <span className="font-medium">{topic.name}</span>
                      </div>
                      <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                        {topic.lastActivity}
                      </span>
                    </div>
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span
                            className={cn(
                              "text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full",
                              `text-${topic.color}-600`,
                              `bg-${topic.color}-200`
                            )}
                          >
                            {topic.progress}%
                          </span>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "overflow-hidden h-2 text-xs flex rounded",
                          `bg-${topic.color}-200`
                        )}
                      >
                        <div
                          style={{ width: `${topic.progress}%` }}
                          className={cn(
                            "shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center",
                            colorMap[topic.color]?.bg
                          )}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-t-4 border-t-purple-500">
            <CardHeader className="rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-purple-500" />
                Ostatnie aktywności
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0",
                        colorMap[activity.color]?.bgLight,
                        colorMap[activity.color]?.text
                      )}
                    >
                      <span className="text-xl">{activity.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{activity.title}</div>
                      {activity.time && (
                        <div className="text-sm text-slate-500">
                          {activity.time}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-md border-t-4 border-t-green-500">
            <CardHeader className="rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                Statystyki
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                {statsCards.map((stat, i) => (
                  <div
                    key={stat.name}
                    className={cn(
                      "p-4 rounded-lg text-center hover:shadow-md transition-shadow",
                      colorMap[stat.color]?.bgLight,
                      colorMap[stat.color]?.border,
                      i === 2 && "col-span-2 flex justify-around"
                    )}
                  >
                    <div className="flex justify-center mb-2">{stat.icon}</div>
                    <div
                      className={cn(
                        "text-2xl font-bold",
                        `text-${stat.color}-700`
                      )}
                    >
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-600 mt-1">
                      {stat.name}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-t-4 border-t-amber-500">
            <CardHeader className="rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                Twoje osiągnięcia
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {stats.achievements && stats.achievements.length > 0 ? (
                  stats.achievements.map((achievement: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center p-3 rounded-lg bg-amber-50 border border-amber-100"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-600 mr-3">
                        {achievement.emoji || "🏆"}
                      </div>
                      <div>
                        <div className="font-medium">
                          {achievement.title || "Osiągnięcie"}
                        </div>
                        <div className="text-sm text-slate-600">
                          {achievement.description || ""}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-500">
                    Brak osiągnięć. Rozpocznij naukę, aby je zdobyć!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) {
    return "przed chwilą";
  } else if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} ${minutes === 1 ? "minutę" : "minut"} temu`;
  } else if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} ${hours === 1 ? "godzinę" : "godzin"} temu`;
  } else {
    const days = Math.floor(diff / 86400000);
    return `${days} ${days === 1 ? "dzień" : "dni"} temu`;
  }
}

function getColorForActivity(activity: any): string {
  if (!activity || !activity.type) return "gray";

  switch (activity.type) {
    case "topic_completed":
      return "green";
    case "topic_started":
      return "blue";
    case "study_time":
      return "purple";
    case "task_solved":
      return "amber";
    default:
      return "indigo";
  }
}
