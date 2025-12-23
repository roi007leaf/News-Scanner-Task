import { useCallback, useState } from "react";
import "./App.css";
import { CategorySelect } from "./components/CategorySelect";
import { FetchNewsButton } from "./components/FetchNewsButton";
import { NewsDisplay } from "./components/NewsDisplay";
import { QueryInput } from "./components/QueryInput";
import { useCategoriesQuery } from "./hooks/newsHooks";

function App() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);

  // Fetch categories on mount
  const { data: categoriesData } = useCategoriesQuery();

  const handleFetchNews = useCallback(() => {
    if (query.trim() && selectedCategory) {
      setShouldFetch(true);
    }
  }, [query, selectedCategory]);

  const handleFetchComplete = useCallback(() => {
    setShouldFetch(false);
  }, []);

  return (
    <div className="p-12 flex flex-col gap-12">
      <header className="flex items-center gap-1.5">
        <img src="/logo.svg" alt="News Scanner Logo" className="h-4 w-[77px]" />
        <div className="text-xl font-semibold text-black leading-6">
          News Scanner
        </div>
      </header>
      <div className="flex items-end gap-6">
        <QueryInput value={query} onChange={setQuery} />

        <CategorySelect
          options={categoriesData?.categories ?? []}
          selectedOptions={selectedCategory}
          onChange={setSelectedCategory}
        />

        <FetchNewsButton
          onClick={handleFetchNews}
          disabled={!selectedCategory || !query.trim()}
        />
      </div>
      <NewsDisplay
        query={query}
        category={selectedCategory}
        shouldFetch={shouldFetch}
        onFetchComplete={handleFetchComplete}
      />
    </div>
  );
}

export default App;
