import { Link, useNavigate } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import { uploadImage } from "../common/aws";
import { useContext, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
import { EditorContext } from "../pages/editor.pages";
import axios from "axios";
import { UserContext } from "../App";

const BlogEditor = () => {
  let navigate = useNavigate();

  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  let {
    blog,
    blog: { title, banner, content, tags, des },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = useContext(EditorContext);

  let blogBannerRef = useRef();

  useEffect(() => {
    if (!textEditor.isReady) {
      setTextEditor(
        new EditorJS({
          holderId: "textEditor",
          data: content,
          tools: tools,
          placeholder: "Lets write an awesome blog",
        })
      );
    }
  }, []);

  const handlePublishEvent = () => {
    // if (!banner.length) {
    //   return toast.error("Upload a blog banner to publish it.");
    // }
    // if (!title.length) {
    //   return toast.error("Write blog title to publish it.");
    // }
    if (textEditor.isReady) {
      textEditor
        .save()
        .then((data) => {
          if (data.blocks.length) {
            setBlog({ ...blog, content: data });
            setEditorState("publish");
          } else {
            return toast.error("Write something to publish it.");
          }
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
  };

  const handleBannerUpload = (e) => {
    let img = e.target.files[0];
    console.log(img);
    console.log(blogBannerRef.current);
    console.log(blogBannerRef.current.src);
    console.log(e);
    console.log(e.target.files);

    if (img) {
      let loadingToast = toast.loading("Uploading...");
      uploadImage(img)
        .then((url) => {
          if (url) {
            toast.dismiss(loadingToast);
            toast.success("Uploaded 👍");
            blogBannerRef.current.src = url;
          }
        })
        .catch((err) => {
          toast.dismiss(loadingToast);
          return toast.error(err);
        });
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  };

  const handleTitleChange = (e) => {
    let input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setBlog({ ...blog, title: input.value });
  };

  const handleError = (e) => {
    let img = e.target;
    img.src = defaultBanner;
  };

  // const handleSaveDraft = (e) => {
  //   if (e.target.className.includes("disable")) {
  //     return;
  //   }
  //   if (!title.length) {
  //     return toast.error("Write blog title before saving it as a draft.");
  //   }
  //   // if (!des.length || des.length > 200) {
  //   //   return res.status({
  //   //     error: "Description is required and should be less than 200 characters",
  //   //   });
  //   // }

  //   // if (!tags.length) {
  //   //   return res.status({
  //   //     error: "Enter at least 1 tag to help us rank your blog",
  //   //   });
  //   // }

  //   let loadingTest = toast.loading("Saving Draft...");
  //   e.target.classList.add("disable");

   
  //   if (textEditor.isReady) {
  //     textEditor.save().then((content) => {
  //       let blogObj = {
  //         title,
  //         banner,
  //         des,
  //         content,
  //         tags,
  //         draft: true,
  //       };
    
  //       axios
  //         .post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", blogObj, {
  //           headers: {
  //             Authorization: `Bearer ${access_token}`,
  //           },
  //         })
  //         .then(() => {
  //           e.target.classList.remove("disable");

  //           toast.dismiss(loadingTest);
  //           toast.success("Saved ..");

  //           setTimeout(() => {
  //             navigate("/");
  //           }, 500);
  //         })
  //         .catch(({ response }) => {
  //           e.target.classList.remove("disable");

  //           toast.dismiss(loadingTest);
  //           return toast.error(response.data.error);
  //         });
  //     });
  //   }
  // };

  const handleSaveDraft = async (e) => {
    if (e.target.className.includes("disable")) {
      return;
    }
    if (!title.length) {
      return toast.error("Write blog title before saving it as a draft.");
    }
  
    // Display loading toast
    let loadingToast = toast.loading("Saving Draft...");
    e.target.classList.add("disable");
  
    try {
      // Ensure textEditor is ready and save content
      if (!textEditor.isReady) {
        throw new Error("Text editor is not ready");
      }
      const content = await textEditor.save();
  
      // Construct the blog object
      let blogObj = {
        title,
        banner,
        des,
        content,
        tags,
        draft: true,
      };
  
      // Save draft via API
      await axios.post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/create-blog`,
        blogObj,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
  
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success("Draft saved successfully!");
  
      // Navigate to home page
      navigate("/");
  
    } catch (error) {
      // Handle errors (API or text editor)
      console.error("Error saving draft:", error);
      toast.dismiss(loadingToast);
      toast.error(
        error.response?.data?.error || "Failed to save draft. Please try again."
      );
    } finally {
      // Remove the disable class
      e.target.classList.remove("disable");
    }
  };
  

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo} />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title?.length ? title : "New Blog"}
        </p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2" onClick={handlePublishEvent}>
            Publish
          </button>
          <button className="btn-light py-2" onClick={handleSaveDraft}>
            Save Draft
          </button>
        </div>
      </nav>

      <Toaster />

      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video bg-white border-4 hover:opacity-80 border-grey">
              <label htmlFor="uploadBanner">
                <img
                  ref={blogBannerRef}
                  src={defaultBanner}
                  onError={handleError}
                  className="z-20"
                ></img>
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <textarea
              defaultValue={title}
              placeholder="Blog Title"
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>
            <hr className="w-full opacity-4 my-5"></hr>
            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
