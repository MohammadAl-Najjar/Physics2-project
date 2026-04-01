import { createRoot } from "react-dom/client"
import Main from "./src/main.jsx"

const root = createRoot(document.getElementById("root"));

root.render(
    <>
        <Main />
    </>
)