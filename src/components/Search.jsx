import React from 'react'

const Search = ({searchTerm,setSearchTerm}) => {
    return (
        <div className="search">
            <div>
                <img src = "./search.png"/>
                <input
                type="text"
                value = {searchTerm}
                placeholder = "Find your next movie.... Adventure awaits!"
                onChange={(e) => setSearchTerm(e.target.value)}/>
            </div>
        </div>
    )
}
export default Search
