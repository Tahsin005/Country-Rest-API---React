import { useState } from "react";
import CountryList from "../CountryList/CountryList";
import FilterBox from "../FilterBox/FilterBox";
import SearchBox from "../SearchBox/SearchBox";

const Home = () => {
    const [query, setQuery] = useState('');
    return (
        <div className="max-w-screen-xl mx-auto px-8 md:px-16 lg:px-24 py-5">
            <div className="flex justify-between">
                <SearchBox setQuery={setQuery}></SearchBox>
                <FilterBox setQuery={setQuery}></FilterBox>
            </div>
            <div>
                <CountryList query={query}></CountryList>
            </div>
        </div>
    );
};

export default Home;