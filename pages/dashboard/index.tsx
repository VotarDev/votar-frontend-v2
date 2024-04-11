// import withAuth from "@/hoc/withAuth";
import React, { useEffect } from "react";
import { logout } from "@/redux/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { useCurrentUser } from "@/utils/hooks";
import DashboardLayout from "@/src/components/DashboardLayout";
import { elections } from "@/utils/util";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/controller";
import line from "../../public/assets/icons/card-line.svg";
import vote from "../../public/assets/icons/vote.svg";
import calendar from "../../public/assets/icons/calendar.svg";
import Tables from "@/src/components/TableComponent";
import cardBg from "../../public/assets/images/card-bg.png";
import Link from "next/link";
import Chat from "@/src/components/Chat";
import ProtectedRoutes from "@/src/components/ProtectedRoutes";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import url from "url";

const Dashboard = ({ token }: { token?: string }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const users = useCurrentUser();
  const { data } = useSession();
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
    dispatch(logout());
    signOut();
    router.push("/signin");
  };
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);
  console.log(token);
  return (
    <ProtectedRoutes>
      <DashboardLayout>
        <div className="w-full flex">
          <Swiper
            modules={[A11y]}
            spaceBetween={10}
            breakpoints={{
              240: { slidesPerView: 1, spaceBetween: 10 },
              624: { slidesPerView: 1.5, spaceBetween: 10 },
              1280: { slidesPerView: 1.8, spaceBetween: 10 },
            }}
            centeredSlides={true}
            centeredSlidesBounds
            className="w-full"
          >
            {elections.map((election) => (
              <SwiperSlide
                key={election.id}
                className="lg:min-w-[483px] w-full text-center rounded-xl lg:px-7 font-semibold relative px-3"
                style={{
                  backgroundColor: `${election.style}`,
                  borderLeft: `3px solid ${election.border}`,
                }}
              >
                <div>
                  <Link href="/access">
                    <div className="lg:text-xl text-base text-white pt-6">
                      {election.title}
                    </div>
                    <div className="flex pt-8 items-center text-white md:gap-6 justify-center text-xs lg:text-base gap-2">
                      <div className="pb-4">{election.start}</div>
                      <div>
                        <img
                          src={line.src}
                          alt="line"
                          className="w-[20px] object-contain"
                        />
                      </div>
                      <div className="pb-4">{election.end}</div>
                    </div>
                    <div className="absolute top-0 left-0 bottom-0 right-0 -z-10 opacity-30">
                      <img
                        src={cardBg.src}
                        alt="card-bg"
                        className="lg:min-w-[483px] w-full h-full"
                      />
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex mt-9 justify-center items-center gap-2 bg-[rgba(204_,222_,251_,0.50)] max-w-[643px] mx-auto sm:py-5 py-3 rounded-lg text-[#015CE9] font-bold flex-wrap text-center px-2 text-xs sm:text-base">
          <span>
            <img src={vote.src} alt="vote" className="w-4 h-4 object-contain" />
          </span>
          You have participated in 05 Votar Elections
        </div>

        <div className="mt-9">
          <div className="flex gap-2 text-xl font-semibold">
            Past Elections
            <span>
              <img src={calendar.src} alt="calendar" />
            </span>
          </div>
          <div className="mt-1">
            <Tables />
          </div>
        </div>
        <Chat />
      </DashboardLayout>
    </ProtectedRoutes>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const parsedUrl = url.parse(context.req.url || "", true);

  let token: string | null = null;

  if (typeof parsedUrl.query.token === "string") {
    token = parsedUrl.query.token;
  } else if (Array.isArray(parsedUrl.query.token)) {
    token = parsedUrl.query.token[0];
  }

  if (token === undefined) {
    // Set a default value or handle the case as needed
    token = null;
  }
  return {
    props: { token },
  };
};

export default Dashboard;
