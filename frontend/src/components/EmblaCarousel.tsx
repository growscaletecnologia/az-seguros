  import React, { useCallback, useEffect, useState } from 'react'
  import { EmblaOptionsType } from 'embla-carousel'
  import useEmblaCarousel from 'embla-carousel-react'
  import Autoplay from 'embla-carousel-autoplay'
  import {
    usePrevNextButtons
  } from './EmblaCarouselArrowButtons'
  import Image from 'next/image'

  type PropType = {
    
    options?: EmblaOptionsType
  }

  const EmblaCarousel: React.FC<PropType> = (props) => {
    const {  options } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [
      Autoplay({
        
        playOnInit: true,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
        delay: 2000
    }),
    ])
    const [isPlaying, setIsPlaying] = useState(false)

    const {
      prevBtnDisabled,
      nextBtnDisabled,
      onPrevButtonClick,
      onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    const onButtonAutoplayClick = useCallback(
      (callback: () => void) => {
        const autoScroll = emblaApi?.plugins()?.autoScroll
        if (!autoScroll) return

        const resetOrStop =
          autoScroll.options.stopOnInteraction === false
            ? autoScroll.reset
            : autoScroll.stop

        resetOrStop()
        callback()
      },
      [emblaApi]
    )

    const toggleAutoplay = useCallback(() => {
      const autoScroll = emblaApi?.plugins()?.autoScroll
      if (!autoScroll) return

      const playOrStop = autoScroll.isPlaying()
        ? autoScroll.stop
        : autoScroll.play
      playOrStop()
    }, [emblaApi])

    useEffect(() => {
      const autoScroll = emblaApi?.plugins()?.autoScroll
      if (!autoScroll) return

      setIsPlaying(autoScroll.isPlaying())
      emblaApi
        .on('autoScroll:play', () => setIsPlaying(true))
        .on('autoScroll:stop', () => setIsPlaying(false))
        .on('reInit', () => setIsPlaying(autoScroll.isPlaying()))
    }, [emblaApi])
    const images = [
      {alt: 'Image 1', src: '/affinity.svg'},
      {alt: 'Image 2', src: 'assistcard.svg'},
      {alt: 'Image 3', src: 'coris.svg'},
      {alt: 'Image 4', src: 'gta.svg'},
      {alt: 'Image 5', src: 'intermac.svg'},
        {alt: 'Image 1', src: '/affinity.svg'},
      {alt: 'Image 2', src: 'assistcard.svg'},
      {alt: 'Image 3', src: 'coris.svg'},
      {alt: 'Image 4', src: 'gta.svg'},
      {alt: 'Image 5', src: 'intermac.svg'},
        {alt: 'Image 1', src: '/affinity.svg'},
      {alt: 'Image 2', src: 'assistcard.svg'},
      {alt: 'Image 3', src: 'coris.svg'},
      {alt: 'Image 4', src: 'gta.svg'},
      {alt: 'Image 5', src: 'intermac.svg'}
    ]
    return (
      <div className="w-[80%] p-1">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex items-center">
          {images.map((image, index) => (
            <div
              key={index}
              className="flex items-center justify-center flex-none w-40 mx-6"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={60}
                height={40}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
    )
  }

  export default EmblaCarousel
