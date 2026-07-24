import type { AppSettings } from "@/types/settings.types";
import { DEFAULT_SETTINGS } from "@/types/settings.types";
import { STORAGE_KEY } from "@/utils/constants";

export async function loadSettings(): Promise<AppSettings> {
  return new Promise((resolve) => {
    chrome.storage.local.get(STORAGE_KEY, (result) => {
      const stored = result[STORAGE_KEY] as Partial<AppSettings> | undefined;
      resolve({ ...DEFAULT_SETTINGS, ...stored });
    });
  });
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [STORAGE_KEY]: settings }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
}
