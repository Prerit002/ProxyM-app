import type { AppSettings } from "@/types/settings.types";
import type { MessageResponse, SaveSettingsPayload } from "@/types/message.types";
import { sendMessage } from "./messageService";

export async function getSettings(): Promise<AppSettings | null> {
  const resp = await sendMessage<undefined, AppSettings>({ type: "GET_SETTINGS" });
  return resp.success && resp.data ? resp.data : null;
}

export async function saveSettingsViaBackground(
  settings: AppSettings
): Promise<MessageResponse> {
  return sendMessage<SaveSettingsPayload, void>({
    type: "SAVE_SETTINGS",
    payload: { settings },
  });
}

export async function rotateNow(): Promise<MessageResponse> {
  return sendMessage<undefined, void>({ type: "ROTATE_NOW" });
}
