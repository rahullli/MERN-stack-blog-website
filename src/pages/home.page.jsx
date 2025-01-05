import AnimationWrapper from "../common/page-animation"
import InPageNavigationComponent from "../components/inpage-navigation.component"

const HomePage = () => {
  return (
    <AnimationWrapper>
        <section className="h-cover flex justify-center gap-10">
            <div className="w-full">
                <InPageNavigationComponent routes = {["Home", "Trending blogs"]}>

                </InPageNavigationComponent>
            </div>
        </section>
    </AnimationWrapper>
  )
}

export default HomePage