"use client";
import Header from "@/app/thebusinesshub/_components/layout/header/Header";
import SidebarMenu from "@/app/thebusinesshub/_components/layout/header/SidebarMenu";
import MobileMenu from "@/components/common/header/MobileMenu";
import CopyRight from "@/components/common/footer/CopyRight";
import TableData from "./TableData";
import { useState, useEffect } from "react";
import { getSubscribersAPI } from "@/api/newsletter";

const index = () => {
    const [subscriberList, setSubscriberList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                setLoading(true);
                const userStr = sessionStorage.getItem("user");
                const token = userStr ? JSON.parse(userStr)?.token : null;

                if (!token) {
                    console.error("User not authenticated");
                    return;
                }

                const response = await getSubscribersAPI(token);
                if (response.status === "success") {
                    setSubscriberList(response.data || []);
                }
            } catch (error) {
                console.error("Error fetching subscribers:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubscribers();
    }, []);

    return (
        <>
            <Header />
            <MobileMenu />

            <div className="dashboard_sidebar_menu">
                <div
                    className="offcanvas offcanvas-dashboard offcanvas-start"
                    tabIndex="-1"
                    id="DashboardOffcanvasMenu"
                    data-bs-scroll="true"
                >
                    <SidebarMenu />
                </div>
            </div>

            <section className="our-dashbord dashbord bgc-f7 pb50">
                <div className="container-fluid ovh">
                    <div className="row">
                        <div className="col-lg-12 maxw100flex-992">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="dashboard_navigationbar dn db-1024">
                                        <div className="dropdown">
                                            <button
                                                className="dropbtn"
                                                data-bs-toggle="offcanvas"
                                                data-bs-target="#DashboardOffcanvasMenu"
                                                aria-controls="DashboardOffcanvasMenu"
                                            >
                                                <i className="fa fa-bars pr10"></i> Dashboard Navigation
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="row align-items-center">
                                    <div className="col-lg-8 col-xl-9 mb20">
                                        <div className="breadcrumb_content style2 mb30-991">
                                            <h2 className="breadcrumb_title">Newsletter Subscribers</h2>
                                            <p>View and manage all users who subscribed to the Akoode newsletter.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-12">
                                        <div id="client_myreview" className="my_dashboard_review mt30">
                                            <div className="review_content client-review">
                                                <h4>Subscribers List ({subscriberList.length})</h4>
                                                {loading ? (
                                                    <p>Loading...</p>
                                                ) : (
                                                    <TableData subscribers={subscriberList} setSubscriberList={setSubscriberList} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <CopyRight />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default index;
