"use client";

import React, { useState, useEffect } from "react";
import { getEmployeeTableData } from "../../../api/frontend/rating";
import TeamCarousel from "./TeamCarousel";
import SectionBadge from "../../../components/SectionBadge";
import { m } from "framer-motion";

export default function OurTeam() {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await getEmployeeTableData();
                if (Array.isArray(data)) {
                    setEmployees(data.filter((emp) => emp?.status !== false));
                }
            } catch (error) {
                console.error("[OurTeamSection] Error:", error);
            }
        };
        fetchEmployees();
    }, []);

    return (
        <div className="bg-white">
            {/* .our-process-area.sp8 */}
            <div className="relative z-[1] pt-8 sm:pt-10 md:pt-12 lg:pt-[50px] pb-0 bg-white">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[70px]">
                    <div className="flex flex-wrap justify-center">
                        <div className="w-full lg:w-2/3 text-center">
                            <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-[60px]">
                                <SectionBadge text="OUR TEAM"/>
                                <div className="h-3 sm:h-4 lg:h-[18px]"></div>
                                <m.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8 }}
                                    className="font-sans text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-medium leading-[1.5] sm:leading-[26px] text-[#555] mx-auto px-1 max-w-[90vw] sm:max-w-none min-[1200px]:max-w-[760px] min-[1400px]:max-w-[880px]"
                                >
                                    Our team brings together visionaries, engineers, and creators
                                    from around the globe, united by a shared purpose — to deliver
                                    value, innovation, and impact. We embrace curiosity, celebrate
                                    creativity, and remain grounded in the idea that great
                                    technology starts with empathy.
                                </m.p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* .our-team.sp1.pt-0 */}
            <div className="relative pt-6 sm:pt-8 md:pt-0 lg:py-[10px] pb-4 sm:pb-6 bg-white">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[70px]">

                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        <TeamCarousel employees={employees} />
                    </m.div>

                    {/* .about-us-highlight */}
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="about-us-highlight my-8 md:my-8 text-center bg-white rounded-xl sm:rounded-[15px] p-5 sm:p-6 md:p-[30px] w-full max-w-[95vw] sm:max-w-full md:max-w-[800px] mx-auto shadow-[0_4px_12px_rgba(0,0,0,0.1)] relative z-[3] leading-[1.75] text-black"
                    >
                        <h5 className="font-satisfy text-[20px] sm:text-[22px] md:text-[26px] lg:text-[28px] leading-[1.4] sm:leading-[32px] md:leading-[40px] text-[#2A2B44]">
                            Every project we undertake is driven by one timeless question:
                            <span className="block mt-1">How can this make life better?</span>
                        </h5>
                        <h5 className="font-satisfy text-[20px] sm:text-[22px] md:text-[26px] lg:text-[28px] leading-[1.4] sm:leading-[32px] md:leading-[40px] mt-6 sm:mt-8 text-[#2A2B44]">
                            At Akoode Technologies, we don’t just keep up with change —
                            <span className="block mt-1">we create it, shape it, and make it meaningful.</span>
                        </h5>
                    </m.div>
                </div>
            </div>
        </div>
    );
}
