import { useEffect, useRef, useState } from "react"

const InPageNavigationComponent = ({routes, defaultActiveIndex = 0, defaultHidden = [], children}) => {
    let activeTabLineRef = useRef();
    let activeTabRef = useRef();
    const [inPageNavIndex, setInPageNavIndex] = useState(0);

    const changePageState = (btn,i) =>{
        let { offsetWidth, offsetLeft} = btn;
            activeTabLineRef.current.style.width = offsetWidth + "px";
            activeTabLineRef.current.style.left = offsetLeft + "px";

            setInPageNavIndex(i);
    }

    useEffect(()=>{
        changePageState( activeTabRef.current, defaultActiveIndex); 
    },[])
  return (
    <>
        <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
            {
                routes.map((route,i)=>{
                    return (
                        <button ref={i === defaultActiveIndex ? activeTabRef : null} onClick ={ (e)=>{
                            changePageState(e.target, i)
                        }} key={i} className={"p-4 px-5 capitalize " + (inPageNavIndex == i ? "text-black" : "text-dark-grey ") + ( defaultHidden.includes(route) ? "hidden" : "")}>
                            {route}
                        </button>   
                    )
                })
            }

            <hr ref={activeTabLineRef}  className="absolute bottom-0 duration-300"></hr>
        </div>
        { Array.isArray(children) ? children[inPageNavIndex] : children }
    </>
  )
}

export default InPageNavigationComponent