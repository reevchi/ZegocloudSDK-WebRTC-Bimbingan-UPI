import { EuiGlobalToastList, EuiProvider, EuiThemeColorMode, EuiThemeProvider } from "@elastic/eui";
import "@elastic/eui/dist/eui_theme_amsterdam_light.json"
import "@elastic/eui/dist/eui_theme_amsterdam_dark.json"
import React, { useEffect, useState } from "react"
import { Routes, Route } from "react-router-dom";
import Dashboard from "./app/pages/Dashboard";
import Login from "./app/pages/Login";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import CreateMeeting from "./app/pages/CreateMeeting";
import OneOnOneMeeting from "./app/pages/OneOnOneMeeting";
import { setToasts } from "./app/slices/MeetingSlice";
import VideoConference from "./app/pages/VideoConference";
import MyMeetings from "./app/pages/MyMeetings";
import Meeting from "./app/pages/Meeting";
import JoinMeeting from "./app/pages/JoinMeeting";


function App() {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector(zoom=>zoom.meetings.toasts);
  const [theme, setTheme] = useState <EuiThemeColorMode>("light");

  useEffect(() => {
    const theme = localStorage.getItem("zoom-theme");
    if (theme) {
      setTheme (theme as EuiThemeColorMode);
    } else {
      localStorage.setItem("zoom-theme", "light");
    }
  }, []);


  const overrides = {
    colors:{
      LIGHT: {primary: "#0b5cff"},
      DARK: {primary: "#0b5cff"},
    },
  };

  const removeToast = (removeToast: { id:string }) => {
    dispatch(setToasts(
      toasts.filter((toasts:{id:string})=> toasts.id !== removeToast.id)
    ))
  };
  
  return (
    <EuiProvider colorMode={theme}>
      <EuiThemeProvider modify={overrides}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<CreateMeeting />} />
          <Route path="/create1on1" element={<OneOnOneMeeting />} />
          <Route path="/videoconference" element={<VideoConference />} />
          <Route path="/mymeetings" element={<MyMeetings />} />
          <Route path="/meetings" element={<Meeting />} />
          <Route path="/Join/:id" element={<JoinMeeting />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
        <EuiGlobalToastList 
        toasts={toasts}
        dismissToast={removeToast}
        toastLifeTimeMs={5000}
        />
        </EuiThemeProvider>
    </EuiProvider>

  );

}

export default App;

export {};