import {Client, Databases, ID, Query} from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(PROJECT_ID)

const database = new Databases(client);
export const updateSearchCount = async(searchTerm, movie)=>{
    //1. to check whether the searched movie is there or not
    try{
        const r = await database.listDocuments(DATABASE_ID, COLLECTION_ID,
            [Query.equal('searchTerm', searchTerm),])
        //2. If the movie is there then increase its search count
        if (r.documents.length > 0){
            const doc = r.documents[0];
            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count: doc.count + 1,
            })}
        //3. If the movie is not there then it is searched for the first time so add it to the DB and set its count to 1
        else{
                await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(),{
                    searchTerm,
                    count: 1,
                    movie_id: movie.id,
                    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                })
            }
    }catch(e){

    }
}

export const getTrendingMovies = async()=>{
    try{
        const r = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc("count"),
        ])
        return r.documents;

    }catch(e){
        console.error(e)
    }
}
