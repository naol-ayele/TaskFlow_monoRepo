import type { Message, User } from "@taskflow/db";
export interface ChatWindowProps {
    currentUserId: string;
    messages: Message[];
    members: User[];
    onSendMessage: (body: string, relatedItem?: {
        id: string;
        type: "task" | "note";
    }) => Promise<void>;
    isLoading: boolean;
}
export declare function ChatWindow({ currentUserId, messages, members, onSendMessage, isLoading, }: ChatWindowProps): import("react").JSX.Element;
//# sourceMappingURL=ChatWindow.d.ts.map