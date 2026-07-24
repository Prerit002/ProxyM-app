import type { Message, MessageResponse } from "@/types/message.types";

export function sendMessage<TPayload, TResponse>(
  message: Message<TPayload>
): Promise<MessageResponse<TResponse>> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response: MessageResponse<TResponse>) => {
      if (chrome.runtime.lastError) {
        resolve({ success: false, error: chrome.runtime.lastError.message });
      } else {
        resolve(response ?? { success: false, error: "No response from background." });
      }
    });
  });
}
