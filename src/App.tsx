import { Fragment } from "react/jsx-runtime";
import AppRouter from "./AppRouter";
import AuthContextProvider from "./context/AuthContextProvider";
import { Toaster } from "./components/ui/sonner";
import { StepProvider } from "./context/StepContextProvider";

function App() {
  return (
    <Fragment>
      <AuthContextProvider>
        <StepProvider>
          <AppRouter />
        </StepProvider>
      </AuthContextProvider>
      <Toaster />
    </Fragment>
  );
}

export default App;
