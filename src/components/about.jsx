import React from "react";
import {Phone} from "lucide-react"

const About = () => {
    return (
        <>
            <div className="flex flex-col lg:flex-row bg-[#1b1b1b] p-4 lg:p-10 justify-between" id="about">
                <div className="w-full lg:w-[48vw] text-white p-3 lg:p-5 font-serif">
                    <h1 className="text-xl lg:text-2xl font-bold text-[#aa8453] tracking-wider">ABOUT US</h1>
                    <h2 className="text-2xl lg:text-4xl tracking-widest pt-3">Enjoy a Luxury <br />Experience</h2>
                    <div className="pt-4 lg:pt-6">
                        <p className="text-sm lg:text-base">
                            Welcome to UI HOTEL, where luxury meets comfort in the heart of hospitality. Our mission is to 
                            provide a unique and unforgettable experience for each guest, offering world-class service in a 
                            relaxing and elegant environment.Whether you're here for business, leisure, or a special occasion,
                            our thoughtfully designed rooms and suites cater to all your needs. With a team dedicated to exceeding 
                            your expectations, we ensure that every moment spent at our hotel is one of complete comfort and satisfaction.
                        </p><br />
                        <p className="pb-3 text-sm lg:text-base">
                            Our facilities are equipped with everything you need for a memorable stay, from state-of-the-art amenities to 
                            exceptional dining options. We believe that every guest deserves the best, and we pride ourselves on creating a warm 
                            and welcoming atmosphere.Come experience UI HOTEL—where every detail is designed with you in mind.
                        </p>
                        <div className="flex items-center space-x-2"> 
                          <Phone className="size-10 lg:size-10 text-[#aa8453]" />  
                          <div> 
                            <p className="text-sm lg:text-base">Reservation <br /><span className="text-[#aa8453]">+234 000 456 77</span> </p>
                          </div>  
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-[42vw]  flex-col sm:flex-row lg:flex-row gap-4 lg:gap-5 mt-4 lg:mt-0 hidden sm:flex">
                    <div className="w-full sm:w-1/2 lg:w-1/2">
                        <img 
                            src="https://duruthemes.com/demo/html/cappa/demo1-dark/img/rooms/8.jpg" 
                            alt="image" 
                            className="w-full h-[250px] sm:h-[300px] lg:h-[55vh] object-cover" 
                        />
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/2 lg:pt-12">
                        <img 
                            src="https://duruthemes.com/demo/html/cappa/demo1-dark/img/rooms/2.jpg" 
                            alt="image" 
                            className="w-full h-[250px] sm:h-[300px] lg:h-[60vh] object-cover" 
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default About;