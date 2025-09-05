// import React, { useEffect } from 'react'
// import useEmblaCarousel from 'embla-carousel-react'
// import Image from 'next/image'

// export function EmblaCarousel() {
//   const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 2 })

//   useEffect(() => {
//     if (emblaApi) {
//       console.log(emblaApi.slideNodes())
//     }
//   }, [emblaApi])

//   return (
//     <div className="embla" ref={emblaRef}>
//       <div className="embla__container">
//           <Image
//                 src="/affinity.svg"
//                 alt="Affinity Seguros"
//                 width={400}
//                 height={250}
//                 className="w-full h-48 object-cover"
//             />
//               <Image
//                 src="/affinity.svg"
//                 alt="Affinity Seguros"
//                 width={400}
//                 height={250}
//                 className="w-full h-48 object-cover"
//             />
//               <Image
//                 src="/affinity.svg"
//                 alt="Affinity Seguros"
//                 width={400}
//                 height={250}
//                 className="w-full h-48 object-cover"
//             />
//               <Image
//                 src="/affinity.svg"
//                 alt="Affinity Seguros"
//                 width={400}
//                 height={250}
//                 className="w-full h-48 object-cover"
//             />
//               <Image
//                 src="/affinity.svg"
//                 alt="Affinity Seguros"
//                 width={400}
//                 height={250}
//                 className="w-full h-48 object-cover"
//             />

       
//       </div>
//     </div>
//   )
// }
import { EmblaCarouselType } from 'embla-carousel'

export const addPlayBtnListeners = (
  emblaApi: EmblaCarouselType,
  playBtn: HTMLElement
): (() => void) => {
  const togglePlayBtnState = (emblaApi: EmblaCarouselType): void => {
    const autoScroll = emblaApi?.plugins()?.autoScroll
    if (!autoScroll) return

    const buttonText = autoScroll.isPlaying() ? 'Start' : 'Stop'
    playBtn.innerHTML = buttonText
  }

  const onPlayBtnClick = (): void => {
    const autoScroll = emblaApi?.plugins()?.autoScroll
    if (!autoScroll) return

    const playOrStop = autoScroll.isPlaying()
      ? autoScroll.stop
      : autoScroll.play
    playOrStop()
  }

  playBtn.addEventListener('click', onPlayBtnClick)
  emblaApi
    .on('autoScroll:play', togglePlayBtnState)
    .on('autoScroll:stop', togglePlayBtnState)
    .on('reInit', togglePlayBtnState)

  return () => {
    playBtn.removeEventListener('click', onPlayBtnClick)
    emblaApi
      .off('autoScroll:play', togglePlayBtnState)
      .off('autoScroll:stop', togglePlayBtnState)
      .off('reInit', togglePlayBtnState)
  }
}

export const addNavBtnListeners = (
  emblaApi: EmblaCarouselType,
  ...navButtons: HTMLElement[]
): (() => void) => {
  const onNavClick = () => {
    const autoScroll = emblaApi?.plugins()?.autoScroll
    if (!autoScroll) return

    const resetOrStop =
      autoScroll.options.stopOnInteraction === false
        ? autoScroll.reset
        : autoScroll.stop

    resetOrStop()
  }

  navButtons.forEach((navButton) =>
    navButton.addEventListener('click', onNavClick, true)
  )

  return () => {
    navButtons.forEach((navButton) =>
      navButton.removeEventListener('click', onNavClick, true)
    )
  }
}
