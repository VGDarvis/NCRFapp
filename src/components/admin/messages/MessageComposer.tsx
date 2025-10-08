import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Clock } from "lucide-react";
import { useState } from "react";

export function MessageComposer() {
  const [messageType, setMessageType] = useState("email");
  const [body, setBody] = useState("");

  const charCount = body.length;
  const smsLimit = 160;
  const showCharCount = messageType === "sms" || messageType === "whatsapp";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compose Message</CardTitle>
        <CardDescription>Send a quick message to your contacts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="message-type">Message Type</Label>
            <Select value={messageType} onValueChange={setMessageType}>
              <SelectTrigger id="message-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipients">Recipients</Label>
            <Input id="recipients" placeholder="Select contacts or enter manually" />
          </div>
        </div>

        {messageType === "email" && (
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="Enter email subject" />
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="body">Message Body</Label>
            {showCharCount && (
              <span className={`text-sm ${charCount > smsLimit ? "text-destructive" : "text-muted-foreground"}`}>
                {charCount} / {smsLimit}
              </span>
            )}
          </div>
          <Textarea
            id="body"
            placeholder="Enter your message..."
            className="min-h-[200px]"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <Button className="flex-1">
            <Send className="mr-2 h-4 w-4" />
            Send Now
          </Button>
          <Button variant="outline" className="flex-1">
            <Clock className="mr-2 h-4 w-4" />
            Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
