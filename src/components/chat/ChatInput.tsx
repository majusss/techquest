import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from "lucide-react";
import { ChangeEvent } from "react";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  placeholder = "Wpisz wiadomość...",
  disabled = false,
}: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="relative">
      <Textarea
        value={input}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="min-h-[60px] w-full resize-none rounded-xl bg-background px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
      />
      <div className="absolute bottom-2 right-2">
        <Button
          type="submit"
          size="icon"
          disabled={input.length === 0 || disabled}
          className="h-8 w-8"
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
