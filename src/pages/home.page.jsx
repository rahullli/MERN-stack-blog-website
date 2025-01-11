import { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigationComponent from "../components/inpage-navigation.component";
import axios from "axios";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import {activeTabRef} from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";

const HomePage = () => {
  const [blogs, setBlog] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);
  let [pageState, setPageState] = useState("home");

  let cateogaries = [
    "programming",
    "hollywood",
    "film making",
    "social media",
    "cooking",
    "tech",
    "finances",
    "travel",
  ];
  const fetchLatestBlogs = ( page = 1 ) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", { page })
      .then(({ data }) => {
        setBlog(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchTrendingBlogs = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
      .then(({ data }) => {
        setTrendingBlogs(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadBlogByCateogary = (e) =>{
      let cateogary = e.target.innerText.toLowerCase();
      setBlog(null);
      if(pageState == cateogary){
         setPageState("home");  
      }
      setPageState(cateogary);  
  }

  useEffect(() => {

    activeTabRef.current.click();
    if(pageState == "home"){
      fetchLatestBlogs();
    }
    if(!trendingBlogs){
      fetchTrendingBlogs();
    }
  }, [pageState]);
  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        <div className="w-full">
          <InPageNavigationComponent
            routes={[pageState, "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            {/* <h1>Latest Blogs Here</h1> */}
            <>
              {blogs === null ? (
                <Loader />
              ) : (

                blogs.length ? 
                  blogs.map((blog, i) => {
                    return (
                      <AnimationWrapper
                        transition={{ duration: 1, delay: i * 0.1 }}
                        key={i}
                      >
                        <BlogPostCard
                          content={blog}
                          author={blog.author.personal_info}
                        />
                      </AnimationWrapper>
                    );
                  })
                  : 
                  <NoDataMessage message= "No blogs published."/>
              )}
            </>
            {trendingBlogs === null ? (
              <Loader />
            ) : (
              trendingBlogs.length ? 
                trendingBlogs.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <MinimalBlogPost blog={blog} index={i} />
                    </AnimationWrapper>
                  );
                })
                :
                <NoDataMessage message= "No Trending Blogs."/>
            )}

            <h1>Trending Blogs Here</h1>
          </InPageNavigationComponent>
        </div>

        {/* Filters and Trending Blogs */}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">
                Stories from all interest
              </h1>
              <div className="flex gap-3 flex-wrap">
                {cateogaries.map((cateogary, i) => {
                  return (
                    <button onClick={loadBlogByCateogary} key={i} className={"tag " + (pageState == cateogary ? "bg-black text-white " : "")}>
                      {cateogary}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h1 className="font-medium text-xl mb-8">
                Trending <i className="fi fi-rr-arrow-trend-up"></i>
              </h1>
              {trendingBlogs === null ? (
                <Loader />
              ) : (
                trendingBlogs.length ? 
                  trendingBlogs.map((blog, i) => {
                    return (
                      <AnimationWrapper
                        transition={{ duration: 1, delay: i * 0.1 }}
                        key={i}
                      >
                        <MinimalBlogPost blog={blog} index={i} />
                      </AnimationWrapper>
                    );
                  })
                  :
                <NoDataMessage message= "No Trending Blogs."/>
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
