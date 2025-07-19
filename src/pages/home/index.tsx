import Container from "@/components/Container";
import HeroSection from "./HeroSection";
import ServicesSection from "./ServicesSection";
import bannerLeft from "@/assets/images/banner-left.png";
import meeting from "@/assets/images/meeting.png";
import check from "@/assets/images/fi_check.png";

const Home = () => {
  const BannerLeftStyle = {
    backgroundImage: `url(${bannerLeft})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "800px",
  };

  return (
    <Container className='bg-primary-background pt-6 pb-16 flex flex-col md:flex-row gap-5 ] '>
      <div className=' md:flex-[7] flex items-end p-[44px]' style={BannerLeftStyle}>
        <div>
          <h2>New Packages For Winter</h2>
          <h5>
            Ut posuere felis arcu tellus tempus in in ultricies. Gravida id nibh ornare viverra. Ultrices faucibus neque
            velit risus ac id lorem.
          </h5>
        </div>
      </div>
      <div className=' md:flex-[5] bg-card-background h-[800px] px-12 pt-8 pb-10'>
        <div className='pb-12'>
          <h4 className='pb-6 text-center border-[#344E71] border-b  '>Our most popular services</h4>
        </div>
        <div className='flex flex-col  '>
          <img src={meeting} className='h-[190px]' alt='' />
          <div className='pt-6 pb-3'>
            <h3>Corporate event</h3>
            <div className='flex flex-col gap-4 pt-3 pb-8'>
              <div className='flex items-center gap-3'>
                <div className='bg-[rgba(255,255,255,0.12)] w-5 h-5 rounded-full flex items-center justify-center p-1'>
                  <img src={check} alt='' />
                </div>
                <p>One day pas access all lecture</p>
              </div>
              <div className='flex items-center gap-3'>
                <div className='bg-[rgba(255,255,255,0.12)] w-5 h-5 rounded-full flex items-center justify-center p-1'>
                  <img src={check} alt='' />
                </div>
                <p>One day pas access all lecture</p>
              </div>
              <div className='flex items-center gap-3'>
                <div className='bg-[rgba(255,255,255,0.12)] w-5 h-5 rounded-full flex items-center justify-center p-1'>
                  <img src={check} alt='' />
                </div>
                <p>One day pas access all lecture</p>
              </div>
              <div className='flex items-center gap-3'>
                <div className='bg-[rgba(255,255,255,0.12)] w-5 h-5 rounded-full flex items-center justify-center p-1'>
                  <img src={check} alt='' />
                </div>
                <p>One day pas access all lecture</p>
              </div>
            </div>
          </div>
          <button className='button-gradient'>View Details</button>
        </div>
      </div>
      {/* <HeroSection />
      <ServicesSection /> */}
    </Container>
  );
};

export default Home;
