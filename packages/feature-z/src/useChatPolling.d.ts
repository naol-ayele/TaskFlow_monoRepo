import type { Message } from "@taskflow/db";
export interface UseChatPollingOptions {
    intervalMs?: number;
    pauseWhenHidden?: boolean;
    enabled?: boolean;
}
export interface UseChatPollingReturn {
    messages: Message[];
    isLoading: boolean;
    isPolling: boolean;
    sendMessage: (body: string, relatedId?: string, relatedType?: "task" | "note") => Promise<void>;
    refetch: () => void;
}
export declare function useChatPolling(fetchMessages: () => Promise<Message[]>, sendMessageFn: (body: string, relatedId?: string, relatedType?: "task" | "note") => Promise<Message>, options?: UseChatPollingOptions): UseChatPollingReturn;
//# sourceMappingURL=useChatPolling.d.ts.map