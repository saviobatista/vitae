import { getRequestConfig } from "next-intl/server";
import en from "@/i18n/messages/en.json";

export default getRequestConfig(async () => {
  return {
    locale: "en",
    messages: en,
  };
});
