import { useRef, useState } from "react"

const InPageNavigationComponent = ({routes}) => {
    const [inPageNavIndex, setInPageNavIndex] = useState(0);
    let activeTabLineRef = useRef();
    const changePageState = () =>{
        
    }
  return (
    <>
        <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
            {
                routes.map((route,i)=>{
                    return (
                        <button onClick ={ ()=>{
                            changePageState()
                        }} key={i} className={"p-4 px-5 capitalize" + (inPageNavIndex === i ? "text-black" : "text-dark-grey")}>
                            {route}
                        </button>
                    )
                })
            }

            <hr></hr>
        </div>

    </>
  )
}

export default InPageNavigationComponent