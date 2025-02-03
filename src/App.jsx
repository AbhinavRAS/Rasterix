import React, {useEffect, useState} from 'react'
import Search from "./components/Search.jsx";
import Spinner from "./components/spinner.jsx";
import Moviecard from "./components/Moviecard.jsx";
import {useDebounce} from "react-use";
import {getTrendingMovies, updateSearchCount} from "./appwrite.jsx";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        authorization: `Bearer ${API_KEY}`,
    }
}

const App = () => {
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [searchTerm,setSearchTerm] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [errorMessage,setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false);
    const [trendingMovies,setTrendingMovies] = useState([]);
    ;

    useDebounce(() => {setDebouncedSearch(searchTerm)},500,[searchTerm]);

    const fetchMovies = async (query='') => {
        setLoading(true);
        setErrorMessage('');
        try{
            const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`: `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint,API_OPTIONS);
            if (!response.ok){
                throw new Error(response.statusText);
            }
            const data = await response.json();
            if (data.results === 'False'){
                setErrorMessage(data.Error || 'Something went wrong! Failed to fetch movies!');
                setMovieList([]);
                return;
            }
            setMovieList(data.results);
            if (query && data.results.length > 0){
                await updateSearchCount(query, data.results[0]);
            }
        }
        catch(err){
            console.error(`Error in fetching: ${err}`);
            setErrorMessage('Something went wrong... Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const loadTrendingMovies = async () => {
        try{
            const movies = await getTrendingMovies();
            setTrendingMovies(movies);
        }catch(e){
            console.error(`Error in fetching trendingMovies ${e}`);
        }
    }

    useEffect(() => {
        fetchMovies(debouncedSearch);
    }, [debouncedSearch]);

    useEffect(() => {
        loadTrendingMovies();
    },[]);

    return (
        <main>
            <div className="pattern"/>
            <div className="wrapper">
                <header>
                    <img src={"RAS1.png"} className={"w-50 h-50"} alt={"logo"}/>
                    <img src={"./hero-img.png"} className={"w-auto h-auto mt-auto"} alt="hero-banner" />
                    <h1>
                        Find <spam className="text-gradient">Movies</spam> that can catch your interest.
                    </h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>
                {trendingMovies.length > 0 && (
                    <section className={"trending"}>
                        <h2>Trending Movies</h2>
                        <ul>
                            {trendingMovies.map((movie,index) => (
                                <li key={movie.$id}>
                                    <p>{index+1}</p>
                                    <img src={movie.poster_url} alt={movie.title} />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
                <section className="all-movies">
                    <h2>All Movies</h2>
                    {loading ?(
                        <Spinner />
                    ): errorMessage ?(
                        <p className={"text-red-500"}>{errorMessage}</p>
                    ): (
                        <ul>
                            {movieList.map((movie) => (
                                <Moviecard key={movie.id} movie={movie}/>
                            ))}
                        </ul>
                        )}
                </section>
            </div>
        </main>
    )
}
export default App
