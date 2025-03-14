"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Activity, Clock, Award, History } from "lucide-react";

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

const stats = [
  {
    name: "Rozwiązane zadania",
    value: "24",
    icon: <Award className="h-6 w-6 text-blue-500" />,
    color: "blue",
  },
  {
    name: "Przerobione tematy",
    value: "12",
    icon: <BarChart3 className="h-6 w-6 text-green-500" />,
    color: "green",
  },
  {
    name: "Czas nauki",
    value: "8h",
    icon: <Clock className="h-6 w-6 text-purple-500" />,
    color: "purple",
  },
  {
    name: "Poprawność rozwiązań",
    value: "85%",
    icon: <Activity className="h-6 w-6 text-amber-500" />,
    color: "amber",
  },
];

const activities = [
  {
    title: "Rozwiązałeś zadanie z algebry",
    time: "2 dni temu",
    icon: "✏️",
    color: "blue",
  },
  {
    title: "Ukończyłeś lekcję o funkcjach",
    time: "3 dni temu",
    icon: "📖",
    color: "green",
  },
  {
    title: "Rozpocząłeś naukę trygonometrii",
    time: "5 dni temu",
    icon: "🎯",
    color: "purple",
  },
];

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-md border-t-4 border-t-blue-500">
            <CardHeader className="bg-slate-50 rounded-t-lg">
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
                          className={`flex items-center justify-center w-10 h-10 rounded-full bg-${topic.color}-50 text-${topic.color}-500`}
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
                            className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-${topic.color}-600 bg-${topic.color}-200`}
                          >
                            {topic.progress}%
                          </span>
                        </div>
                      </div>
                      <div
                        className={`overflow-hidden h-2 text-xs flex rounded bg-${topic.color}-200`}
                      >
                        <div
                          style={{ width: `${topic.progress}%` }}
                          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-${topic.color}-500`}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-t-4 border-t-purple-500">
            <CardHeader className="bg-slate-50 rounded-t-lg">
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
                      className={`flex items-center justify-center w-10 h-10 rounded-full bg-${activity.color}-50 text-${activity.color}-500 flex-shrink-0`}
                    >
                      <span className="text-xl">{activity.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{activity.title}</div>
                      <div className="text-sm text-slate-500">
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-md border-t-4 border-t-green-500">
            <CardHeader className="bg-slate-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                Statystyki
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.name}
                    className={`p-4 rounded-lg bg-${stat.color}-50 border border-${stat.color}-100 text-center hover:shadow-md transition-shadow`}
                  >
                    <div className="flex justify-center mb-2">{stat.icon}</div>
                    <div
                      className={`text-2xl font-bold text-${stat.color}-700`}
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
            <CardHeader className="bg-slate-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                Twoje osiągnięcia
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-600 mr-3">
                    🏆
                  </div>
                  <div>
                    <div className="font-medium">Mistrz algebry</div>
                    <div className="text-sm text-slate-600">
                      Rozwiązałeś 10 zadań z algebry
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mr-3">
                    🔍
                  </div>
                  <div>
                    <div className="font-medium">Odkrywca</div>
                    <div className="text-sm text-slate-600">
                      Przeglądnąłeś 5 różnych tematów
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-3 rounded-lg bg-green-50 border border-green-100">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 mr-3">
                    ⏱️
                  </div>
                  <div>
                    <div className="font-medium">Wytrwały uczeń</div>
                    <div className="text-sm text-slate-600">
                      Spędziłeś ponad 5 godzin na nauce
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
