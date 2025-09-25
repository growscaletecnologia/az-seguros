"use client";

import type { EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import type React from "react";

type PropType = {
	options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = ({ options }) => {
	const [emblaRef] = useEmblaCarousel(options, [
		Autoplay({
			playOnInit: true,
			stopOnInteraction: false,
			stopOnMouseEnter: false,
			delay: 2000,
		}),
	]);

	const images = [
		{ alt: "Image 1", src: "/affinity.svg" },
		{ alt: "Image 2", src: "assistcard.svg" },
		{ alt: "Image 3", src: "coris.svg" },
		{ alt: "Image 4", src: "gta.svg" },
		{ alt: "Image 5", src: "intermac.svg" },
		{ alt: "Image 1", src: "/affinity.svg" },
		{ alt: "Image 2", src: "assistcard.svg" },
		{ alt: "Image 3", src: "coris.svg" },
		{ alt: "Image 4", src: "gta.svg" },
		{ alt: "Image 5", src: "intermac.svg" },
		{ alt: "Image 1", src: "/affinity.svg" },
		{ alt: "Image 2", src: "assistcard.svg" },
		{ alt: "Image 3", src: "coris.svg" },
		{ alt: "Image 4", src: "gta.svg" },
		{ alt: "Image 5", src: "intermac.svg" },
	];

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
	);
};

export default EmblaCarousel;
