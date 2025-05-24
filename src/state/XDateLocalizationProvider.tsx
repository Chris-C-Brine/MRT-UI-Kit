// src/config/@mui/x-date-pickers/XDateLocalizationProvider.tsx
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { FC, PropsWithChildren } from "react";

/**
 * You can use XDateLocalizationProvider in two ways for date/time localization with Material-UI X Date Pickers:
 *  1. Top-Level Provider: 
 *      Wrapping your entire application with XDateLocalizationProvider sets the default localization provider for all 
 *      MUI X Date Pickers used throughout the app. This is a good approach if you want a consistent localization format
 *      across all date pickers.
 *      - Scope: Applies localization settings to all MUI X Date Pickers in the entire application.
 *      - Pros: Consistent localization across the entire app, easier to manage.
 *      - Cons: Less flexibility if you need different localization settings in different parts of the app.
 *  2. Localized Component Provider: 
 *      Wrapping specific components that use MUI X Date Pickers with XDateLocalizationProvider applies the localization 
 *      only to those components. This can be useful if you need different localization settings for different parts of 
 *      your application.
 *      - Scope: Applies localization settings only to the specific components wrapped in the provider.
 *      - Pros: More flexibility to customize localization settings for different parts of the app.
 *      - Cons: Requires more configuration and management if you have many components that need different settings.
 */
export const XDateLocalizationProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {children}
    </LocalizationProvider>
  );
};

export default XDateLocalizationProvider;
