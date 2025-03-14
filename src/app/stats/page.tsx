"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TopicProgress {
  name: string;
  progress: number;
  lastActivity: string;
  icon: string;
}

const mockProgress: TopicProgress[] = [
  { name: "Algebra", progress: 75, lastActivity: "2 dni temu", icon: "📐" },
  { name: "Geometria", progress: 45, lastActivity: "5 dni temu", icon: "📏" },
  {
    name: "Trygonometria",
    progress: 30,
    lastActivity: "1 tydzień temu",
    icon: "📐",
  },
  { name: "Funkcje", progress: 60, lastActivity: "3 dni temu", icon: "📈" },
];

const stats = [
  { name: "Rozwiązane zadania", value: "24", icon: "✅" },
  { name: "Przerobione tematy", value: "12", icon: "📚" },
  { name: "Czas nauki", value: "8h", icon: "⏱️" },
  { name: "Poprawność rozwiązań", value: "85%", icon: "🎯" },
];

const activities = [
  { title: "Rozwiązałeś zadanie z algebry", time: "2 dni temu", icon: "✏️" },
  { title: "Ukończyłeś lekcję o funkcjach", time: "3 dni temu", icon: "📖" },
  { title: "Rozpocząłeś naukę trygonometrii", time: "5 dni temu", icon: "🎯" },
];

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Twój postęp</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockProgress.map((topic) => (
                  <div key={topic.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{topic.icon}</span>
                        <span className="font-medium">{topic.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {topic.lastActivity}
                      </span>
                    </div>
                    <Progress value={topic.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ostatnie aktywności</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="text-2xl">{activity.icon}</div>
                    <div>
                      <div className="font-medium">{activity.title}</div>
                      <div className="text-sm text-muted-foreground">
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
          <Card>
            <CardHeader>
              <CardTitle>Statystyki</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.name}
                    className="p-4 rounded-lg bg-accent text-center"
                  >
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">
                      {stat.name}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
