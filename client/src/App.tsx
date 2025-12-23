import "./App.css";
import { CategorySelect } from "./components/CategorySelect";
import { QueryInput } from "./components/QueryInput";
import { NewsDisplay } from "./components/NewsDisplay";
import { FetchNewsButton } from "./components/FetchNewsButton";

function App() {
  return (
    <div className="p-12 flex flex-col gap-12">
      <header className="flex items-center gap-1.5">
        <img src="/logo.svg" alt="News Scanner Logo" className="h-4 w-[77px]" />
        <div className="text-xl font-semibold text-black leading-6">
          News Scanner
        </div>
      </header>
      <div className="flex items-end gap-6">
        <QueryInput
        // value={}
        // onChange={}
        />

        <CategorySelect
        // options={}
        // selectedOptions={}
        // onChange={}
        />

        <FetchNewsButton
        // onClick={}
        />
      </div>
      <NewsDisplay />
    </div>
  );
}

export default App;
