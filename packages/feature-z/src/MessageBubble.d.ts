import type { Message } from "@taskflow/db";
export interface MessageBubbleProps {
    message: Message;
    isOwnMessage: boolean;
    authorName: string;
}
export declare function MessageBubble({ message, isOwnMessage, authorName, }: MessageBubbleProps): import("react").JSX.Element;
//# sourceMappingURL=MessageBubble.d.ts.map