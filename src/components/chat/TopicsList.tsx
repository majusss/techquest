import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopicsListProps {
  topics: string[];
  onTopicSelect: (topic: string) => void;
  selectedTopic: string | null;
}

export function TopicsList({
  topics,
  onTopicSelect,
  selectedTopic,
}: TopicsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wybierz temat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {topics.map((topic, index) => (
            <Button
              key={index}
              variant={selectedTopic === topic ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onTopicSelect(topic)}
            >
              {topic}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
