import { useEffect, useState } from "react"
import AnimationWrapper from "../common/page-animation"
import InPageNavigationComponent from "../components/inpage-navigation.component"
import axios from "axios";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";

const HomePage = () => {

  const [blogs, setBlog] = useState(null);
  const fetchLatestBlogs = () => {
    axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs")
    .then(({ data })=>{
      setBlog(data.blogs);
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  useEffect(()=>{
    fetchLatestBlogs();
  },[])
  return (
    <AnimationWrapper>
        <section className="h-cover flex justify-center gap-10">
            <div className="w-full">
                <InPageNavigationComponent routes = {["home", "trending blogs"]} defaultHidden = {["trending blogs"]}>
                  {/* <h1>Latest Blogs Here</h1> */}
                  <>
                    {
                      blogs === null ? <Loader/> : 
                      blogs.map((blog, i)=>{
                          return (
                            <AnimationWrapper transition={{ duration : 1, delay : i*.1}} key={i}>
                              <BlogPostCard content = {blog} author = {blog.author.personal_info}/>
                            </AnimationWrapper>
                          )
                      })
                    }
                  </>
                  <h1>Trending Blogs Here</h1>
                </InPageNavigationComponent>
            </div>
        </section>
    </AnimationWrapper>
  )
}

export default HomePage