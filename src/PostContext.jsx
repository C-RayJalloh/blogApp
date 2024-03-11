/* eslint-disable react/prop-types */
import { createContext, useContext, useMemo, useState, useCallback } from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}
 

// 1. CREATE THE CONTEXT
const PostContext = createContext();


function  PostProvider({ children}) {
 const [posts, setPosts] = useState(() =>
    Array.from({ length: 100 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  const handleAddPost = useCallback(
    function handleAddPost(post) {
      setPosts((posts) => [post, ...posts]);
    }
    ,[])

  function handleClearPosts() {
    setPosts([]);
    setSearchQuery('');
  }

  // used memo inother to optimize the performance and prevent wasted re-renders
const value = useMemo(() => {
   return {posts: searchedPosts,
   onAddPost: handleAddPost,
   onClearPosts: handleClearPosts,
   searchQuery,
   setSearchQuery,
 }
}, [searchQuery, searchedPosts, handleAddPost])

	return (
 <PostContext.Provider
      value={value}
    > {children }</PostContext.Provider>


	);
}
 
// custom usePost Hook
function usePosts() {
    const context = useContext(PostContext);
    if( context === undefined) 
    throw new Error ( "PostContext was used outside the provider");
   return context
}

// eslint-disable-next-line react-refresh/only-export-components
export { PostProvider, usePosts };