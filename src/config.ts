

const config = {
    API_KEY: process.env.REACT_APP_ENV == "dev" ? "https://localhost:7298/api" : "https://maptrackerdemo.netlify.app/"


};

export default config;